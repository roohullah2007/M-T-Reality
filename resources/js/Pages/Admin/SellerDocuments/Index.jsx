import React, { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    FolderOpen, Plus, Upload, Trash2, Download, Search,
    User, MapPin, Eye, EyeOff, FileText, X, Loader2, Clock
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Index({ documents, sellers, properties, categories, filters, counts }) {
    const [showUpload, setShowUpload] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');
    const [selectedSeller, setSelectedSeller] = useState(filters?.user_id || '');
    const fileInputRef = useRef(null);

    const uploadForm = useForm({
        user_id: '',
        property_id: '',
        name: '',
        category: 'listing_agreement',
        description: '',
        file: null,
    });

    // Filter properties based on selected seller in upload form
    const filteredProperties = uploadForm.data.user_id
        ? properties.filter(p => p.user_id == uploadForm.data.user_id)
        : properties;

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const applyFilters = (overrides = {}) => {
        const params = {
            search: searchTerm,
            category: selectedCategory,
            user_id: selectedSeller,
            ...overrides,
        };
        Object.keys(params).forEach(key => {
            if (params[key] === 'all' || params[key] === '') delete params[key];
        });
        router.get(route('admin.seller-documents.index'), params, { preserveState: true });
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        applyFilters({ category });
    };

    const handleSellerFilter = (e) => {
        const userId = e.target.value;
        setSelectedSeller(userId);
        applyFilters({ user_id: userId });
    };

    const handleUpload = (e) => {
        e.preventDefault();
        uploadForm.post(route('admin.seller-documents.store'), {
            onSuccess: () => {
                setShowUpload(false);
                uploadForm.reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            forceFormData: true,
        });
    };

    const handleDelete = (doc) => {
        if (confirm(`Delete "${doc.name}"? The seller will no longer be able to access this document.`)) {
            router.delete(route('admin.seller-documents.destroy', doc.id));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
        return Math.round(bytes / 1024) + ' KB';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Seller Documents" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Seller Documents</h1>
                    <p className="text-gray-500 mt-1">
                        Upload completed forms for sellers to view and download
                        {counts.unviewed > 0 && (
                            <span className="ml-2 text-amber-600 font-medium">({counts.unviewed} not yet viewed)</span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#249E93] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Upload Document
                </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Document for Seller</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seller *</label>
                                <select
                                    value={uploadForm.data.user_id}
                                    onChange={e => {
                                        uploadForm.setData({ ...uploadForm.data, user_id: e.target.value, property_id: '' });
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                >
                                    <option value="">Select a seller...</option>
                                    {sellers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                    ))}
                                </select>
                                {uploadForm.errors.user_id && <p className="text-red-500 text-sm mt-1">{uploadForm.errors.user_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property (optional)</label>
                                <select
                                    value={uploadForm.data.property_id}
                                    onChange={e => uploadForm.setData('property_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                >
                                    <option value="">Not tied to a specific property</option>
                                    {filteredProperties.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.property_title} — {p.address}, {p.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name *</label>
                                <input
                                    type="text"
                                    value={uploadForm.data.name}
                                    onChange={e => uploadForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                    placeholder="e.g. Listing Agreement - 123 Main St"
                                />
                                {uploadForm.errors.name && <p className="text-red-500 text-sm mt-1">{uploadForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={uploadForm.data.category}
                                    onChange={e => uploadForm.setData('category', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                >
                                    {Object.entries(categories).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                            <input
                                type="text"
                                value={uploadForm.data.description}
                                onChange={e => uploadForm.setData('description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                placeholder="Brief note about this document..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, DOC, DOCX — max 20MB) *</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={e => uploadForm.setData('file', e.target.files[0])}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
                            />
                            {uploadForm.errors.file && <p className="text-red-500 text-sm mt-1">{uploadForm.errors.file}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={uploadForm.processing}
                                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#249E93] disabled:opacity-50"
                            >
                                {uploadForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                Upload
                            </button>
                            <button type="button" onClick={() => { setShowUpload(false); uploadForm.reset(); }} className="text-gray-600 hover:text-gray-900">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                    />
                </form>
                <select
                    value={selectedSeller}
                    onChange={handleSellerFilter}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                >
                    <option value="">All Sellers</option>
                    {sellers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {documents.data.length === 0 ? (
                    <div className="p-12 text-center">
                        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents yet</h3>
                        <p className="text-gray-500">Upload completed forms from DocuSign for your sellers.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {documents.data.map(doc => (
                            <div key={doc.id} className="p-5 hover:bg-gray-50">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                            doc.viewed_at ? 'bg-green-100' : 'bg-amber-100'
                                        }`}>
                                            {doc.viewed_at ? (
                                                <Eye className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <EyeOff className="w-5 h-5 text-amber-600" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5" />
                                                    {doc.user?.name}
                                                </span>
                                                {doc.property && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {doc.property.address}, {doc.property.city}
                                                    </span>
                                                )}
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                                    {categories[doc.category] || doc.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {doc.file_name} &middot; {formatFileSize(doc.file_size)}
                                                &middot; Uploaded {formatDate(doc.created_at)}
                                                {doc.viewed_at ? (
                                                    <span className="text-green-500"> &middot; Viewed {formatDate(doc.viewed_at)}</span>
                                                ) : (
                                                    <span className="text-amber-500"> &middot; Not yet viewed</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <a
                                            href={route('admin.seller-documents.download', doc.id)}
                                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {documents.links && documents.last_page > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-1">
                        {documents.links.map((link, i) => (
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

Index.layout = (page) => <AdminLayout children={page} title="Seller Documents" />;

export default Index;
