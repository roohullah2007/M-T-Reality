import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    FileEdit, Clock, CheckCircle, XCircle, Search, MapPin,
    User, StickyNote, ChevronDown, Loader2, Home, AlertCircle
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Index({ changeRequests, counts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
    const [noteModal, setNoteModal] = useState(null);
    const noteForm = useForm({ admin_notes: '' });

    const applyFilters = (overrides = {}) => {
        const params = { search: searchTerm, status: selectedStatus, ...overrides };
        Object.keys(params).forEach(key => {
            if (params[key] === 'all' || params[key] === '') delete params[key];
        });
        router.get(route('admin.mls-change-requests.index'), params, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        applyFilters({ status });
    };

    const handleStatusUpdate = (requestId, newStatus) => {
        router.put(route('admin.mls-change-requests.update-status', requestId), { status: newStatus }, {
            preserveState: true,
        });
    };

    const openNoteModal = (request) => {
        setNoteModal(request);
        noteForm.setData('admin_notes', request.admin_notes || '');
    };

    const submitNote = (e) => {
        e.preventDefault();
        noteForm.put(route('admin.mls-change-requests.add-note', noteModal.id), {
            onSuccess: () => setNoteModal(null),
            preserveState: true,
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' };
            case 'in_progress': return { color: 'bg-blue-100 text-blue-700', label: 'In Progress' };
            case 'completed': return { color: 'bg-green-100 text-green-700', label: 'Completed' };
            case 'denied': return { color: 'bg-red-100 text-red-700', label: 'Denied' };
            default: return { color: 'bg-gray-100 text-gray-700', label: status };
        }
    };

    const getTypeLabel = (type) => {
        const map = {
            listing_change: 'Listing Change',
            new_listing: 'New MLS Listing',
            open_house: 'Open House',
            price_change: 'Price Change',
            status_change: 'Status Change',
        };
        return map[type] || type;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
        });
    };

    const statusTabs = [
        { key: 'all', label: 'All', count: counts.all },
        { key: 'pending', label: 'Pending', count: counts.pending },
        { key: 'in_progress', label: 'In Progress', count: counts.in_progress },
        { key: 'completed', label: 'Completed', count: counts.completed },
        { key: 'denied', label: 'Denied', count: counts.denied },
    ];

    return (
        <>
            <Head title="MLS Change Requests" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">MLS Change Requests</h1>
                <p className="text-gray-500 mt-1">Review and process seller MLS change requests</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by seller, property, MLS#..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                    />
                </div>
            </form>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {statusTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleStatusFilter(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedStatus === tab.key
                                ? 'bg-[#2BBBAD] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                                selectedStatus === tab.key ? 'bg-white/20' : 'bg-gray-100'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {changeRequests.data.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileEdit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No change requests</h3>
                        <p className="text-gray-500">No MLS change requests match your current filters.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {changeRequests.data.map(req => {
                            const badge = getStatusBadge(req.status);
                            return (
                                <div key={req.id} className="p-5 hover:bg-gray-50">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                                                    {badge.label}
                                                </span>
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                                    {getTypeLabel(req.request_type)}
                                                </span>
                                                <span className="text-xs text-gray-400">#{req.id}</span>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {req.property?.property_title || 'Unknown Property'}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                                                {req.property && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {req.property.address}, {req.property.city}
                                                        {req.property.mls_number && (
                                                            <span className="ml-1 text-[#2BBBAD] font-medium">MLS# {req.property.mls_number}</span>
                                                        )}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    {req.user?.name || 'Unknown'} ({req.user?.email})
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 whitespace-pre-line">{req.description}</p>

                                            {/* Structured changes */}
                                            {req.changes && Object.keys(req.changes).length > 0 && (
                                                <div className="mt-2 p-3 bg-amber-50 rounded-lg text-sm">
                                                    <p className="font-medium text-amber-800 text-xs mb-1">Requested Changes:</p>
                                                    {req.changes.new_price && (
                                                        <p className="text-amber-700">Price: <strong>${Number(req.changes.new_price).toLocaleString()}</strong></p>
                                                    )}
                                                    {req.changes.new_status && (
                                                        <p className="text-amber-700">Status: <strong className="capitalize">{req.changes.new_status}</strong></p>
                                                    )}
                                                    {req.changes.open_house_date && (
                                                        <p className="text-amber-700">
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
                                                    <p className="text-blue-800 font-medium text-xs mb-1">Your Notes:</p>
                                                    <p className="text-blue-700">{req.admin_notes}</p>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 mt-2">
                                                Submitted {formatDate(req.created_at)}
                                                {req.handled_at && ` · Handled ${formatDate(req.handled_at)}`}
                                                {req.handler && ` by ${req.handler.name}`}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'in_progress')}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                                    >
                                                        Start Working
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'completed')}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'denied')}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                                    >
                                                        Deny
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'in_progress' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'completed')}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'denied')}
                                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                                    >
                                                        Deny
                                                    </button>
                                                </>
                                            )}
                                            {(req.status === 'completed' || req.status === 'denied') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(req.id, 'pending')}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                >
                                                    Reopen
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openNoteModal(req)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-1"
                                            >
                                                <StickyNote className="w-3.5 h-3.5" />
                                                {req.admin_notes ? 'Edit Note' : 'Add Note'}
                                            </button>
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

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Admin Notes</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            For: {noteModal.property?.property_title} — {getTypeLabel(noteModal.request_type)}
                        </p>
                        <form onSubmit={submitNote}>
                            <textarea
                                value={noteForm.data.admin_notes}
                                onChange={e => noteForm.setData('admin_notes', e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent resize-none"
                                placeholder="Add notes about this request (visible to seller)..."
                            />
                            {noteForm.errors.admin_notes && (
                                <p className="text-red-500 text-sm mt-1">{noteForm.errors.admin_notes}</p>
                            )}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setNoteModal(null)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={noteForm.processing}
                                    className="px-4 py-2 bg-[#2BBBAD] text-white rounded-lg font-medium hover:bg-[#249E93] disabled:opacity-50"
                                >
                                    {noteForm.processing ? 'Saving...' : 'Save Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} title="MLS Change Requests" />;

export default Index;
