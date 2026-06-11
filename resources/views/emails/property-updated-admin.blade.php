@extends('emails.layout')

@section('title', 'Property Listing Updated')
@section('header-title', 'Listing Updated')

@section('content')
    <h2>A Property Listing Has Been Updated</h2>

    <p>The owner of the listing below has updated their property details.</p>

    <div class="property-details">
        <h3>{{ $property->property_title }}</h3>
        <table>
            <tr>
                <td>Last Updated</td>
                <td>{{ $updateDate }}</td>
            </tr>
            <tr>
                <td>Owner</td>
                <td>{{ $property->contact_name ?? 'N/A' }}@if($property->contact_email) (<a href="mailto:{{ $property->contact_email }}">{{ $property->contact_email }}</a>)@endif</td>
            </tr>
            <tr>
                <td>Property Type</td>
                <td>{{ ucfirst($property->property_type) }}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>${{ number_format($property->price) }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{{ $property->is_active ? 'Active' : 'Inactive' }}</td>
            </tr>
        </table>
    </div>

    <p>
        <a href="{{ $adminUrl }}" class="btn">Review Listing in Admin</a>
    </p>

    <p>
        <strong>{{ config('app.name') }} Admin System</strong>
    </p>
@endsection
