<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            color: #333;
            line-height: 1.5;
        }
        .page {
            padding: 35px 55px;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
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
        .headline {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            color: #A41E34;
            margin: 15px 0;
            line-height: 1.3;
        }
        .date {
            text-align: right;
            margin-bottom: 15px;
            color: #666;
            font-size: 10pt;
        }
        .recipient {
            margin-bottom: 15px;
            line-height: 1.4;
        }
        .greeting {
            margin-bottom: 12px;
        }
        .body-text {
            margin-bottom: 12px;
        }
        .highlight-box {
            background: #FFF5F5;
            border: 2px solid #A41E34;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
        }
        .property-address {
            font-size: 13pt;
            font-weight: bold;
            color: #A41E34;
            margin-bottom: 3px;
        }
        .benefits {
            margin: 15px 0;
            padding-left: 0;
        }
        .benefits li {
            list-style: none;
            padding: 4px 0 4px 25px;
            position: relative;
            font-size: 11pt;
        }
        .benefits li::before {
            content: "\2713";
            position: absolute;
            left: 0;
            color: #A41E34;
            font-weight: bold;
            font-size: 13pt;
        }
        .why-section {
            background: #F0F7FF;
            border: 1px solid #B8D4F0;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        .why-section h3 {
            color: #1a5276;
            font-size: 12pt;
            margin-bottom: 8px;
        }
        .why-section p {
            font-size: 10pt;
            color: #2c3e50;
            line-height: 1.5;
        }
        .claim-section {
            background: #f8f8f8;
            border: 2px solid #A41E34;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .claim-section h3 {
            color: #A41E34;
            font-size: 14pt;
            margin-bottom: 10px;
        }
        .claim-section p {
            font-size: 11pt;
            margin-bottom: 8px;
        }
        .qr-code {
            margin: 10px 0;
        }
        .qr-code img {
            width: 140px;
            height: 140px;
        }
        .claim-url {
            font-family: monospace;
            font-size: 9pt;
            color: #666;
            word-break: break-all;
            margin-top: 8px;
        }
        .expiration-warning {
            background: #FFF3CD;
            border: 1px solid #FFEAA7;
            border-radius: 6px;
            padding: 10px;
            text-align: center;
            margin: 15px 0;
            font-size: 11pt;
        }
        .expiration-warning strong {
            color: #856404;
        }
        .sixty-seconds {
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            color: #A41E34;
            margin: 15px 0;
        }
        .signature {
            margin-top: 20px;
        }
        .contact-info {
            text-align: center;
            margin-top: 12px;
            font-size: 9pt;
            color: #888;
        }
    </style>
</head>
<body>
@foreach($letters as $letter)
    <div class="page">
        <div class="header">
            <div class="logo-text">M&T Realty Group</div>
            <div class="tagline">Oklahoma's #1 For Sale By Owner Platform</div>
        </div>

        <div class="headline">
            Selling on Zillow? Get Your FREE M&T Realty Group.com<br>Listing + More Exposure in Oklahoma!
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
            Congratulations on taking control of your home sale! We saw your For Sale By Owner listing
            on Zillow &mdash; smart move. Zillow is great for visibility, but most serious buyers browse
            multiple listing sites. That's where <strong>M&T Realty Group.com</strong> can help.
        </div>

        <div class="highlight-box">
            <div class="property-address">{{ $letter['property']->address }}</div>
            <div>{{ $letter['property']->city }}, {{ $letter['property']->state }} {{ $letter['property']->zip_code }}</div>
            @if($letter['property']->price > 0)
            <div style="font-size: 16pt; font-weight: bold; margin-top: 6px;">${{ number_format($letter['property']->price, 0) }}</div>
            @endif
        </div>

        <div class="body-text">
            We've already created a listing for your property. All you have to do is <strong>claim it</strong>
            to make it live &mdash; it takes about 60 seconds. Here's what you get, completely <strong>FREE</strong>:
        </div>

        <ul class="benefits">
            <li><strong>FREE listing</strong> on Oklahoma's local FSBO platform where buyers search first</li>
            <li><strong>FREE QR code stickers</strong> mailed to you &mdash; perfect for yard signs and flyers</li>
            <li><strong>More buyer exposure</strong> beyond Zillow, reaching Oklahoma-focused home shoppers</li>
            <li><strong>Zero fees or commissions</strong> &mdash; you keep the full sale price</li>
            <li><strong>Direct buyer inquiries</strong> sent straight to your email and phone</li>
            <li><strong>Full control</strong> &mdash; set your price, manage showings, negotiate directly</li>
        </ul>

        <div class="why-section">
            <h3>Why Add M&T Realty Group to Your Marketing?</h3>
            <p>
                Most Zillow FSBO listings aren't shown on MLS-fed sites, and that's where serious buyers
                and their agents find homes. M&T Realty Group gives you a free additional touchpoint for buyers
                searching in Oklahoma &mdash; boosting visibility without changing your Zillow listing.
                More eyes = better chance of a quicker, profitable sale.
            </p>
        </div>

        <div class="claim-section">
            <h3>Claim Your FREE Listing Now</h3>
            <p>Scan the QR code or visit the link below:</p>
            <div class="qr-code">
                <img src="{{ $letter['qrCodeBase64'] }}" alt="QR Code">
            </div>
            <div class="claim-url">{{ $letter['claimUrl'] }}</div>
        </div>

        @if($letter['expiresAt'])
        <div class="expiration-warning">
            <strong>Claim by {{ $letter['expiresAt'] }}</strong> &mdash; this free listing offer expires soon!
        </div>
        @endif

        <div class="sixty-seconds">
            It takes about 60 seconds &mdash; just add your email and create a password!
        </div>

        <div class="signature">
            <p>Good luck on your sale &mdash; and welcome to M&T Realty Group!</p>
            <p style="margin-top: 8px;"><strong>The M&T Realty Group Team</strong></p>
        </div>

        <div class="contact-info">
            hello@mandtrealty.com &bull; M&T Realty Group.com
        </div>
    </div>
@endforeach
</body>
</html>
