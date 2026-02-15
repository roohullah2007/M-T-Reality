<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12pt;
            color: #333;
            line-height: 1.6;
        }
        .page {
            padding: 40px 60px;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #A41E34;
        }
        .logo-text {
            font-size: 28pt;
            font-weight: bold;
            color: #A41E34;
            letter-spacing: 1px;
        }
        .tagline {
            font-size: 10pt;
            color: #666;
            margin-top: 4px;
        }
        .date {
            text-align: right;
            margin-bottom: 20px;
            color: #666;
        }
        .recipient {
            margin-bottom: 25px;
            line-height: 1.4;
        }
        .greeting {
            margin-bottom: 15px;
        }
        .body-text {
            margin-bottom: 15px;
        }
        .highlight-box {
            background: #FFF5F5;
            border: 2px solid #A41E34;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .property-address {
            font-size: 14pt;
            font-weight: bold;
            color: #A41E34;
            margin-bottom: 5px;
        }
        .benefits {
            margin: 20px 0;
            padding-left: 0;
        }
        .benefits li {
            list-style: none;
            padding: 6px 0 6px 25px;
            position: relative;
        }
        .benefits li::before {
            content: "\2713";
            position: absolute;
            left: 0;
            color: #A41E34;
            font-weight: bold;
            font-size: 14pt;
        }
        .claim-section {
            background: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .claim-section h3 {
            color: #A41E34;
            font-size: 14pt;
            margin-bottom: 15px;
        }
        .qr-code {
            margin: 15px 0;
        }
        .qr-code img {
            width: 150px;
            height: 150px;
        }
        .claim-url {
            font-family: monospace;
            font-size: 9pt;
            color: #666;
            word-break: break-all;
            margin-top: 10px;
        }
        .expiration-warning {
            background: #FFF3CD;
            border: 1px solid #FFEAA7;
            border-radius: 6px;
            padding: 12px;
            text-align: center;
            margin: 20px 0;
            font-size: 11pt;
        }
        .expiration-warning strong {
            color: #856404;
        }
        .signature {
            margin-top: 30px;
        }
        .contact-info {
            text-align: center;
            margin-top: 15px;
            font-size: 10pt;
            color: #888;
        }
    </style>
</head>
<body>
@foreach($letters as $letter)
    <div class="page">
        <div class="header">
            <div class="logo-text">OKByOwner</div>
            <div class="tagline">Oklahoma's #1 For Sale By Owner Platform</div>
        </div>

        <div class="date">{{ $letter['date'] }}</div>

        @if($letter['property']->owner_name)
        <div class="recipient">
            <strong>{{ $letter['property']->owner_name }}</strong><br>
            @if($letter['property']->owner_mailing_address)
            {{ $letter['property']->owner_mailing_address }}<br>
            @endif
        </div>
        @endif

        <div class="greeting">
            Dear {{ $letter['property']->owner_name ?? 'Homeowner' }},
        </div>

        <div class="body-text">
            We noticed your property is currently listed for sale by owner, and we'd love to help you
            reach more buyers &mdash; completely <strong>FREE</strong>.
        </div>

        <div class="highlight-box">
            <div class="property-address">{{ $letter['property']->address }}</div>
            <div>{{ $letter['property']->city }}, {{ $letter['property']->state }} {{ $letter['property']->zip_code }}</div>
            @if($letter['property']->price > 0)
            <div style="font-size: 16pt; font-weight: bold; margin-top: 8px;">${{ number_format($letter['property']->price, 0) }}</div>
            @endif
        </div>

        <div class="body-text">
            <strong>OKByOwner.com</strong> is Oklahoma's premier For Sale By Owner platform.
            By claiming your listing, you'll get:
        </div>

        <ul class="benefits">
            <li><strong>FREE property listing</strong> on OKByOwner.com visible to Oklahoma buyers</li>
            <li><strong>FREE QR code stickers</strong> &mdash; buyers scan to see your listing instantly</li>
            <li><strong>Oklahoma-focused buyers</strong> actively searching for homes like yours</li>
            <li><strong>No agent fees or commissions</strong> &mdash; keep more of your home's value</li>
            <li><strong>Direct buyer inquiries</strong> sent straight to your email and phone</li>
        </ul>

        <div class="claim-section">
            <h3>Claim Your FREE Listing</h3>
            <p>Scan the QR code below or visit the link to claim your property listing:</p>
            <div class="qr-code">
                <img src="{{ $letter['qrCodeBase64'] }}" alt="QR Code">
            </div>
            <div class="claim-url">{{ $letter['claimUrl'] }}</div>
        </div>

        @if($letter['expiresAt'])
        <div class="expiration-warning">
            <strong>Claim by {{ $letter['expiresAt'] }}</strong> &mdash; this offer expires soon!
        </div>
        @endif

        <div class="body-text">
            It only takes 60 seconds to claim your listing. Once claimed, your property will be
            live on OKByOwner.com and visible to hundreds of Oklahoma home buyers.
        </div>

        <div class="signature">
            <p>Warm regards,</p>
            <p style="margin-top: 10px;"><strong>The OKByOwner Team</strong></p>
        </div>

        <div class="contact-info">
            hello@okbyowner.com &bull; okbyowner.com
        </div>
    </div>
@endforeach
</body>
</html>
