@extends('emails.layout')

@section('title', 'Test Email')
@section('header-title', 'Test Email')

@section('content')
    <h2>Your Email Settings Work!</h2>

    <p>This is a test email from M&T Realty.</p>

    <p>If you are reading this, your email settings are configured correctly and the site can deliver email notifications.</p>

    <div class="highlight">
        <p><strong>Sent to:</strong> {{ $adminEmail }}<br>
        <strong>Sent at:</strong> {{ $sentAt }}</p>
    </div>

    <p>No further action is required.</p>
@endsection
