@extends('emails.layout')

@section('title', 'New Media Order')
@section('header-title', 'New Media Order')

@section('content')
    <h2>New Media Order Received</h2>

    <p>A new media order has been submitted and requires confirmation within 24 hours.</p>

    <div class="highlight">
        <p><strong>Order Total: ${{ number_format((float) $order->total_price, 2) }}</strong></p>
    </div>

    <div class="property-details">
        <h3>Customer Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ trim($order->first_name . ' ' . $order->last_name) ?: 'N/A' }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $order->email }}">{{ $order->email }}</a></td>
            </tr>
            @if($order->phone)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $order->phone }}">{{ $order->phone }}</a></td>
            </tr>
            @endif
        </table>
    </div>

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
            <tr>
                <td>Vacant</td>
                <td>{{ $order->vacant ? 'Yes' : 'No' }}</td>
            </tr>
            @if($order->lockbox_code)
            <tr>
                <td>Lockbox Code</td>
                <td>{{ $order->lockbox_code }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="property-details">
        <h3>Order Details</h3>
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
            @if($order->broker_assisted)
            <tr>
                <td>Broker Assisted</td>
                <td>Yes{{ $order->broker_package ? ' (' . ucfirst($order->broker_package) . ')' : '' }}</td>
            </tr>
            @endif
            @if($order->preferred_date_1)
            <tr>
                <td>Preferred Date 1</td>
                <td>{{ $order->preferred_date_1->format('F j, Y') }}@if($order->preferred_time_1) ({{ ucfirst($order->preferred_time_1) }})@endif</td>
            </tr>
            @endif
            @if($order->preferred_date_2)
            <tr>
                <td>Preferred Date 2</td>
                <td>{{ $order->preferred_date_2->format('F j, Y') }}@if($order->preferred_time_2) ({{ ucfirst($order->preferred_time_2) }})@endif</td>
            </tr>
            @endif
        </table>
    </div>

    @if($order->special_instructions)
    <div class="user-info">
        <h4>Special Instructions</h4>
        <p style="white-space: pre-wrap;">{{ $order->special_instructions }}</p>
    </div>
    @endif

    <p>
        <a href="{{ $adminUrl }}" class="btn">View Order in Admin</a>
        <a href="mailto:{{ $order->email }}?subject={{ rawurlencode('Your Media Order at ' . config('app.name')) }}" class="btn btn-secondary">Reply via Email</a>
    </p>

    <p>
        <strong>{{ config('app.name') }} Admin System</strong>
    </p>
@endsection
