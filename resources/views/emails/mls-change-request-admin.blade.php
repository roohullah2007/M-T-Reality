@extends('emails.layout')

@section('title', 'New MLS Change Request')
@section('header-title', 'New MLS Change Request')

@section('content')
    <h2>New MLS Change Request</h2>

    <p>A seller has submitted a new MLS change request from their dashboard.</p>

    <div class="highlight">
        <p><strong>Request Type: {{ $typeLabel }}</strong></p>
    </div>

    <div class="property-details">
        <h3>Seller Information</h3>
        <table>
            <tr>
                <td>Name</td>
                <td>{{ $user->name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td><a href="mailto:{{ $user->email ?? '' }}">{{ $user->email ?? 'N/A' }}</a></td>
            </tr>
            @if($user->phone ?? null)
            <tr>
                <td>Phone</td>
                <td><a href="tel:{{ $user->phone }}">{{ $user->phone }}</a></td>
            </tr>
            @endif
        </table>
    </div>

    <div class="property-details">
        <h3>Property</h3>
        <table>
            <tr>
                <td>Property</td>
                <td>{{ $property->property_title }}</td>
            </tr>
            <tr>
                <td>Address</td>
                <td>{{ $property->address }}, {{ $property->city }}, {{ $property->state }} {{ $property->zip_code }}</td>
            </tr>
            @if($property->mls_number)
            <tr>
                <td>MLS Number</td>
                <td>{{ $property->mls_number }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="user-info">
        <h4>Request Description</h4>
        <p style="white-space: pre-wrap;">{{ $changeRequest->description }}</p>
    </div>

    @if(!empty($changeRequest->changes))
    <div class="property-details">
        <h3>Requested Changes</h3>
        <table>
            @foreach($changeRequest->changes as $key => $value)
            @if($value !== null && $value !== '')
            <tr>
                <td>{{ ucwords(str_replace('_', ' ', $key)) }}</td>
                <td>{{ $value }}</td>
            </tr>
            @endif
            @endforeach
        </table>
    </div>
    @endif

    <p>
        <a href="{{ $adminUrl }}" class="btn">View MLS Change Requests</a>
    </p>

    <p>
        <strong>{{ config('app.name') }} Admin System</strong>
    </p>
@endsection
