import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    FileEdit,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    Home,
    ChevronDown,
    MapPin,
    AlertCircle,
} from 'lucide-react';

function MlsChangeRequests({ changeRequests, properties, filters, counts }) {
    const [showForm, setShowForm] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');

    const form = useForm({
        property_id: '',
        request_type: 'listing_change',
        description: '',
        changes: {},
    });

    const requestTypes = [
        { value: 'listing_change', label: 'Listing Change', desc: 'Update listing details (description, features, photos, etc.)' },
        { value: 'price_change', label: 'Price Change', desc: 'Change the listing price' },
        { value: 'status_change', label: 'Status Change', desc: 'Change listing status (active, pending, sold, etc.)' },
        { value: 'open_house', label: 'Open House Request', desc: 'Schedule or update an open house' },
        { value: 'new_listing', label: 'New MLS Listing', desc: 'Request a new listing to be added to the MLS' },
    ];

    const statusTabs = [
        { key: 'all', label: 'All', count: counts.all },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
        { key: 'completed', label: 'Completed', count: counts.completed },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' };
            case 'in_progress': return { icon: Loader2, color: 'bg-blue-100 text-blue-700', label: 'In Progress' };
            case 'completed': return { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completed' };
            case 'denied': return { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Denied' };
            default: return { icon: Clock, color: 'bg-gray-100 text-gray-700', label: status };
        }
    };

    const getTypeLabel = (type) => {
        const found = requestTypes.find(rt => rt.value === type);
        return found ? found.label : type;
    };

    const handleFilterStatus = (status) => {
        setSelectedStatus(status);
        const params = status === 'all' ? {} : { status };
        router.get(route('dashboard.mls-changes'), params, { preserveState: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('dashboard.mls-changes.store'), {
            onSuccess: () => {
                setShowForm(false);
                form.reset();
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="MLS Change Requests" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1
                        className="text-2xl lg:text-3xl font-bold text-[#111111]"
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        MLS Change Requests
                    </h1>
                    <p className="text-gray-500 mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                        Request changes to your MLS listings
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#249E93] transition-colors"
                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                >
                    <Plus className="w-5 h-5" />
                    New Request
                </button>
            </div>

            {/* New Request Form */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2
                        className="text-lg font-bold text-[#111111] mb-4"
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        Submit a Change Request
                    </h2>

                    {properties.length === 0 ? (
                        <div className="text-center py-8">
                            <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500">You don't have any listings yet.</p>
                            <Link
                                href="/list-property"
                                className="inline-flex items-center gap-2 mt-4 text-[#2BBBAD] font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Add a listing first
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Select Property */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Property *
                                </label>
                                <select
                                    value={form.data.property_id}
                                    onChange={e => form.setData('property_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                >
                                    <option value="">Choose a property...</option>
                                    {properties.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.property_title} — {p.address}, {p.city}, {p.state}
                                            {p.mls_number ? ` (MLS# ${p.mls_number})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.property_id && (
                                    <p className="text-red-500 text-sm mt-1">{form.errors.property_id}</p>
                                )}
                            </div>

                            {/* Request Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type of Request *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {requestTypes.map(rt => (
                                        <button
                                            key={rt.value}
                                            type="button"
                                            onClick={() => form.setData('request_type', rt.value)}
                                            className={`text-left p-4 rounded-xl border-2 transition-all ${
                                                form.data.request_type === rt.value
                                                    ? 'border-[#2BBBAD] bg-[#2BBBAD]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="font-semibold text-sm text-[#111111] block">{rt.label}</span>
                                            <span className="text-xs text-gray-500 mt-1 block">{rt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Change Fields */}
                            {form.data.request_type === 'price_change' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={form.data.changes.new_price || ''}
                                            onChange={e => form.setData('changes', { ...form.data.changes, new_price: e.target.value })}
                                            className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                            placeholder="Enter new price"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Status Change Fields */}
                            {form.data.request_type === 'status_change' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Status
                                    </label>
                                    <select
                                        value={form.data.changes.new_status || ''}
                                        onChange={e => form.setData('changes', { ...form.data.changes, new_status: e.target.value })}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                    >
                                        <option value="">Select new status...</option>
                                        <option value="active">Active</option>
                                        <option value="pending">Pending (Under Contract)</option>
                                        <option value="sold">Sold</option>
                                        <option value="withdrawn">Withdrawn</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            )}

                            {/* Open House Fields */}
                            {form.data.request_type === 'open_house' && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={form.data.changes.open_house_date || ''}
                                            onChange={e => form.setData('changes', { ...form.data.changes, open_house_date: e.target.value })}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={form.data.changes.open_house_start || ''}
                                            onChange={e => form.setData('changes', { ...form.data.changes, open_house_start: e.target.value })}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            value={form.data.changes.open_house_end || ''}
                                            onChange={e => form.setData('changes', { ...form.data.changes, open_house_end: e.target.value })}
                                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description / Details *
                                </label>
                                <textarea
                                    value={form.data.description}
                                    onChange={e => form.setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent resize-none"
                                    placeholder="Describe what you'd like changed on your MLS listing..."
                                />
                                {form.errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{form.errors.description}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#249E93] transition-colors disabled:opacity-50"
                                >
                                    {form.processing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileEdit className="w-5 h-5" />
                                    )}
                                    Submit Request
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); form.reset(); }}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {statusTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleFilterStatus(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedStatus === tab.key
                                ? 'bg-[#1a1a1a] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                selectedStatus === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {changeRequests.data.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileEdit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3
                            className="text-lg font-semibold text-gray-900 mb-2"
                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                        >
                            No change requests yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Submit a request when you need changes made to your MLS listing.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#249E93] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            New Request
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {changeRequests.data.map(req => {
                            const badge = getStatusBadge(req.status);
                            const BadgeIcon = badge.icon;
                            return (
                                <div key={req.id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                                                    <BadgeIcon className="w-3.5 h-3.5" />
                                                    {badge.label}
                                                </span>
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                                    {getTypeLabel(req.request_type)}
                                                </span>
                                            </div>
                                            <h3
                                                className="font-semibold text-[#111111] mb-1"
                                                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                            >
                                                {req.property?.property_title}
                                            </h3>
                                            {req.property && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {req.property.address}, {req.property.city}, {req.property.state}
                                                    {req.property.mls_number && (
                                                        <span className="ml-2 text-[#2BBBAD]">MLS# {req.property.mls_number}</span>
                                                    )}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600 whitespace-pre-line">{req.description}</p>

                                            {/* Show structured changes */}
                                            {req.changes && Object.keys(req.changes).length > 0 && (
                                                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                                    {req.changes.new_price && (
                                                        <p className="text-gray-700">New Price: <strong>${Number(req.changes.new_price).toLocaleString()}</strong></p>
                                                    )}
                                                    {req.changes.new_status && (
                                                        <p className="text-gray-700">New Status: <strong className="capitalize">{req.changes.new_status}</strong></p>
                                                    )}
                                                    {req.changes.open_house_date && (
                                                        <p className="text-gray-700">
                                                            Open House: <strong>{req.changes.open_house_date}</strong>
                                                            {req.changes.open_house_start && ` ${req.changes.open_house_start}`}
                                                            {req.changes.open_house_end && ` - ${req.changes.open_house_end}`}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Admin notes */}
                                            {req.admin_notes && (
                                                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                                                    <p className="text-blue-800 font-medium text-xs mb-1">Admin Response:</p>
                                                    <p className="text-blue-700">{req.admin_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-400 whitespace-nowrap">
                                            {formatDate(req.created_at)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {changeRequests.links && changeRequests.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-1">
                        {changeRequests.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    link.active
                                        ? 'bg-[#2BBBAD] text-white'
                                        : link.url
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-default'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveState
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MlsChangeRequests.layout = (page) => <UserDashboardLayout children={page} title="MLS Change Requests" />;

export default MlsChangeRequests;
