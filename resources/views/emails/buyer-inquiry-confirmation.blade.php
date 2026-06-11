@extends('emails.layout')

@section('title', 'Inquiry Received')
@section('header-title', 'Thank You!')

@section('content')
    <h2>We've Received Your Buyer Inquiry</h2>

    <p>Hello {{ $inquiry->name }},</p>

    <p>Thank you for your interest in finding a home with {{ config('app.name') }}! We've received your inquiry and our team will be in touch soon with property alerts matching your criteria.</p>

    <div class="highlight">
        <p><strong>We typically respond within 24 hours during business days.</strong></p>
    </div>

    <div class="property-details">
        <h3>Your Preferences</h3>
        <table>
            <tr>
                <td>Preferred Area</td>
                <td>{{ $inquiry->preferred_area }}</td>
            </tr>
            <tr>
                <td>Price Range</td>
                <td>${{ $inquiry->price_min }} - ${{ $inquiry->price_max }}</td>
            </tr>
            <tr>
                <td>MLS Alerts</td>
                <td>{{ $inquiry->mls_setup === 'yes' ? 'Yes, please set me up' : 'Not right now' }}</td>
            </tr>
            <tr>
                <td>Pre-approved</td>
                <td>{{ $inquiry->preapproved === 'yes' ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
                <td>Submitted On</td>
                <td>{{ $inquiry->created_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
        </table>
    </div>

    <h3>While You Wait</h3>
    <ul>
        <li>Browse our latest property listings</li>
        <li>Save your favorite homes to compare later</li>
    </ul>

    <p>
        <a href="{{ $propertiesUrl }}" class="btn">Browse Properties</a>
    </p>

    <p>Thank you for choosing {{ config('app.name') }}!</p>

    <p>
        <strong>The {{ config('app.name') }} Team</strong>
    </p>
@endsection
