import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Shared anti-spam fields for every public form.
 *
 * Three layers, all enforced again server-side by App\Services\SpamGuard:
 *  - a honeypot input that is invisible to people but attractive to bots,
 *  - an encrypted "when was this form rendered" token (blocks instant posts),
 *  - Google reCAPTCHA v2, active as soon as RECAPTCHA_SITE_KEY is configured.
 *
 * Usage:
 *
 *   const form = useForm({ ...spamGuardDefaults, name: '' });
 *   const guard = useSpamGuard(form.setData);
 *   ...
 *   <SpamGuardFields guard={guard} data={form.data} setData={form.setData} errors={form.errors} />
 *   <button disabled={form.processing || !guard.solved(form.data)}>Send</button>
 *
 * and call guard.reset() from the submit's onError so a failed attempt can be
 * retried (reCAPTCHA tokens are single-use).
 */

const RECAPTCHA_SCRIPT_ID = 'recaptcha-api-script';
const RECAPTCHA_ONLOAD_CALLBACK = 'onMtRecaptchaLoad';
const RECAPTCHA_LOAD_TIMEOUT = 15000;

export const HONEYPOT_FIELD = 'website';
export const TOKEN_FIELD = 'form_token';
export const RECAPTCHA_FIELD = 'g-recaptcha-response';

/** Spread into useForm() so the guard fields are part of the submitted data. */
export const spamGuardDefaults = {
    [HONEYPOT_FIELD]: '',
    [TOKEN_FIELD]: '',
    [RECAPTCHA_FIELD]: '',
};

/**
 * Load Google's API exactly once per page, no matter how many forms mount.
 * Resolves when window.grecaptcha is ready, rejects if it never arrives.
 */
let recaptchaLoader = null;

function loadRecaptcha() {
    if (recaptchaLoader) return recaptchaLoader;

    recaptchaLoader = new Promise((resolve, reject) => {
        if (window.grecaptcha?.render) {
            resolve();
            return;
        }

        window[RECAPTCHA_ONLOAD_CALLBACK] = () => resolve();

        if (!document.getElementById(RECAPTCHA_SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = RECAPTCHA_SCRIPT_ID;
            script.src = `https://www.google.com/recaptcha/api.js?onload=${RECAPTCHA_ONLOAD_CALLBACK}&render=explicit`;
            script.async = true;
            script.defer = true;
            script.onerror = () => reject(new Error('reCAPTCHA script failed to load'));
            document.head.appendChild(script);
        }

        // Ad/script blockers can swallow the request silently.
        window.setTimeout(() => reject(new Error('reCAPTCHA timed out')), RECAPTCHA_LOAD_TIMEOUT);
    });

    return recaptchaLoader;
}

export function useSpamGuard(setData) {
    const { spamGuard } = usePage().props;
    const siteKey = spamGuard?.recaptchaSiteKey || null;
    const token = spamGuard?.token || '';

    // 'disabled' when no site key is configured (local dev / tests),
    // otherwise 'loading' -> 'ready' | 'failed'.
    const [state, setState] = useState(siteKey ? 'loading' : 'disabled');
    const widgetIdRef = useRef(null);

    // A callback ref rather than a plain one: forms that mount conditionally
    // (a "Contact agent" panel, a modal) attach their container long after the
    // hook first runs, and a useRef would leave the widget unrendered - which
    // would in turn leave the submit button disabled forever.
    const [container, setContainer] = useState(null);
    const captchaRef = useCallback((node) => {
        setContainer(node);

        if (!node) {
            // The container went away with its widget; allow a fresh render
            // the next time the form is shown.
            widgetIdRef.current = null;
        }
    }, []);

    // useForm's setData is a fresh closure on every render; keep it in a ref so
    // the effects below do not re-run (and re-render the widget) endlessly.
    const setDataRef = useRef(setData);
    setDataRef.current = setData;

    useEffect(() => {
        if (token) setDataRef.current(TOKEN_FIELD, token);
    }, [token]);

    useEffect(() => {
        if (!siteKey || !container) return undefined;

        let cancelled = false;

        loadRecaptcha()
            .then(() => {
                if (cancelled || widgetIdRef.current !== null) return;

                widgetIdRef.current = window.grecaptcha.render(container, {
                    sitekey: siteKey,
                    callback: (value) => setDataRef.current(RECAPTCHA_FIELD, value || ''),
                    'expired-callback': () => setDataRef.current(RECAPTCHA_FIELD, ''),
                    'error-callback': () => setDataRef.current(RECAPTCHA_FIELD, ''),
                });
                setState('ready');
            })
            .catch(() => {
                if (!cancelled) setState('failed');
            });

        return () => {
            cancelled = true;
        };
    }, [siteKey, container]);

    const reset = useCallback(() => {
        setDataRef.current(RECAPTCHA_FIELD, '');
        if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
            try {
                window.grecaptcha.reset(widgetIdRef.current);
            } catch {
                /* widget already gone - nothing to reset */
            }
        }
    }, []);

    /** Whether the form may be submitted (always true when unconfigured). */
    const solved = useCallback(
        (data) => state === 'disabled' || Boolean(data?.[RECAPTCHA_FIELD]),
        [state]
    );

    return { siteKey, state, captchaRef, reset, solved, enabled: Boolean(siteKey) };
}

export default function SpamGuardFields({ guard, data, setData, errors = {}, idPrefix = 'form' }) {
    const honeypotId = `${idPrefix}_${HONEYPOT_FIELD}`;

    return (
        <>
            {/* Honeypot: off-screen for sighted users, ignored by screen readers,
                skipped by keyboard tabbing - only bots fill it in. */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0 0 0 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }}
            >
                <label htmlFor={honeypotId}>Website</label>
                <input
                    id={honeypotId}
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    value={data[HONEYPOT_FIELD] ?? ''}
                    onChange={(e) => setData(HONEYPOT_FIELD, e.target.value)}
                />
            </div>

            {guard.state !== 'disabled' && (
                <div>
                    <div ref={guard.captchaRef} className="flex justify-center" />

                    {guard.state === 'loading' && (
                        <p className="mt-2 text-sm text-gray-500 text-center">Loading verification&hellip;</p>
                    )}

                    {guard.state === 'failed' && (
                        <p className="mt-2 text-sm text-red-600 text-center">
                            The verification checkbox could not be loaded. Please disable any ad/script
                            blocker for this page and{' '}
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="underline font-medium"
                            >
                                reload
                            </button>
                            .
                        </p>
                    )}

                    {errors[RECAPTCHA_FIELD] && (
                        <p className="mt-2 text-sm text-red-600 text-center">{errors[RECAPTCHA_FIELD]}</p>
                    )}
                </div>
            )}
        </>
    );
}
