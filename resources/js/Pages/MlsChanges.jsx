import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, FileEdit, Send } from 'lucide-react';

const REQUEST_TYPES = [
    'Listing Change',
    'Price Change',
    'Status Change',
    'Open House Request',
    'New MLS Listing',
    'Other',
];

export default function MlsChanges() {
    const { flash } = usePage().props;
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        property_address: '',
        request_type: 'Listing Change',
        details: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('mlschanges.store'), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F7F5] py-10 px-4">
            <Head title="MLS Change Request" />

            <div className="max-w-2xl mx-auto">
                {/* Letterhead */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 mb-6">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-baseline gap-1 mb-1">
                            <span className="text-[28px] font-bold text-[#2BBBAD]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>M</span>
                            <span className="text-[20px] font-semibold text-[#111]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>&</span>
                            <span className="text-[28px] font-bold text-[#2BBBAD]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>T</span>
                        </div>
                        <p className="text-[11px] tracking-[0.3em] text-[#111] font-semibold" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            REALTY GROUP
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FileEdit className="w-5 h-5 text-[#2BBBAD]" />
                        <h1
                            className="text-[22px] sm:text-[28px] font-semibold text-[#111]"
                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                        >
                            MLS Change Request
                        </h1>
                    </div>
                    <p className="text-center text-sm sm:text-[15px] text-[#444] leading-relaxed max-w-xl mx-auto">
                        Use this form to submit a change to your MLS listing — price, status, photos, description,
                        open house, or any other update. We'll process your request and follow up within one business day.
                    </p>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-800">Request Submitted</p>
                            <p className="text-sm text-green-700">{flash.success}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Your Name" error={form.errors.name} required>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                required
                            />
                        </Field>
                        <Field label="Email" error={form.errors.email} required>
                            <input
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                required
                            />
                        </Field>
                    </div>

                    <Field label="Phone" error={form.errors.phone}>
                        <input
                            type="tel"
                            value={form.data.phone}
                            onChange={(e) => form.setData('phone', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                        />
                    </Field>

                    <Field label="Property Address" error={form.errors.property_address} required>
                        <input
                            type="text"
                            placeholder="123 Main St, Tulsa, OK 74135"
                            value={form.data.property_address}
                            onChange={(e) => form.setData('property_address', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                            required
                        />
                    </Field>

                    <Field label="Request Type" error={form.errors.request_type} required>
                        <select
                            value={form.data.request_type}
                            onChange={(e) => form.setData('request_type', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent bg-white"
                            required
                        >
                            {REQUEST_TYPES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Change Details" error={form.errors.details} required>
                        <textarea
                            rows={6}
                            placeholder="Describe what you'd like changed (e.g., reduce price to $325,000, change status to pending, add new photos, etc.)"
                            value={form.data.details}
                            onChange={(e) => form.setData('details', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                            required
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2BBBAD] text-white font-medium hover:bg-[#249E93] transition-colors disabled:opacity-60"
                    >
                        <Send className="w-4 h-4" />
                        {form.processing ? 'Submitting…' : 'Submit Change Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function Field({ label, error, required, children }) {
    return (
        <label className="block">
            <span className="block text-sm font-medium text-[#111] mb-1.5" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                {label}{required && <span className="text-red-500"> *</span>}
            </span>
            {children}
            {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
        </label>
    );
}
