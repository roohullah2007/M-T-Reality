@extends('emails.layout')

@section('title', 'Media Order Received')
@section('header-title', 'Order Received!')

@section('content')
    <h2>Your Media Order Has Been Received</h2>

    <p>Hello {{ trim($order->first_name . ' ' . $order->last_name) ?: 'there' }},</p>

    <p>Thank you for your order with {{ config('app.name') }}! We've received your media order and will contact you within 24 hours to confirm your appointment.</p>

    <div class="property-details">
        <h3>Property</h3>
        <table>
            <tr>
                <td>Address</td>
                <td>{{ $order->address }}, {{ $order->city }}, {{ $order->state }} {{ $order->zip_code }}</td>
            </tr>
            <tr>
                <td>Property Type</td>
                <td>{{ ucfirst($order->property_type) }}</td>
            </tr>
            <tr>
                <td>Square Footage</td>
                <td>{{ $order->sqft_range }}</td>
            </tr>
        </table>
    </div>

    <div class="property-details">
        <h3>Order Summary</h3>
        <table>
            <tr>
                <td>Photo Package</td>
                <td>{{ $order->photo_package === 'photosDrone' ? 'Photos + Drone' : 'Photos' }} — ${{ number_format((float) $order->photo_price, 2) }}</td>
            </tr>
            @if(!empty($order->additional_media))
            <tr>
                <td>Additional Media</td>
                <td>{{ implode(', ', array_map('ucfirst', (array) $order->additional_media)) }} — ${{ number_format((float) $order->additional_media_price, 2) }}</td>
            </tr>
            @endif
            @if($order->virtual_twilight_count > 0)
            <tr>
                <td>Virtual Twilight</td>
                <td>{{ $order->virtual_twilight_count }} photo(s) — ${{ number_format((float) $order->virtual_twilight_price, 2) }}</td>
            </tr>
            @endif
            @if($order->mls_package)
            <tr>
                <td>MLS Package</td>
                <td>{{ ucfirst($order->mls_package) }} — ${{ number_format((float) $order->mls_price, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>${{ number_format((float) $order->total_price, 2) }}</strong></td>
            </tr>
        </table>
    </div>

    @if($order->preferred_date_1)
    <div class="highlight">
        <p><strong>Preferred Appointment:</strong> {{ $order->preferred_date_1->format('F j, Y') }}@if($order->preferred_time_1) ({{ ucfirst($order->preferred_time_1) }})@endif</p>
        @if($order->preferred_date_2)
        <p><strong>Backup:</strong> {{ $order->preferred_date_2->format('F j, Y') }}@if($order->preferred_time_2) ({{ ucfirst($order->preferred_time_2) }})@endif</p>
        @endif
    </div>
    @endif

    <p>
        <a href="{{ $dashboardUrl }}" class="btn">View Your Orders</a>
    </p>

    <p>If you have any questions or need to make changes to your order, just reply to this email.</p>

    <p>
        <strong>The {{ config('app.name') }} Team</strong>
    </p>
@endsection
