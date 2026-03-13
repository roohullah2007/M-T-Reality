import React, { useState, useRef } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import {
    FileText, Plus, Upload, Trash2, Edit2, Download, Search,
    CheckCircle, Users, Shield, BookOpen, AlertCircle, Folder,
    Eye, X, Loader2
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

function Index({ templates, categories, filters, counts }) {
    const [showUpload, setShowUpload] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const fileInputRef = useRef(null);

    const uploadForm = useForm({
        name: '',
        category: 'government',
        description: '',
        file: null,
        is_required: false,
    });

    const editForm = useForm({
        name: '',
        category: '',
        description: '',
        is_required: false,
        is_active: true,
    });

    const categoryIcons = {
        government: Shield,
        listing: FileText,
        disclosure: AlertCircle,
        brochure: BookOpen,
        other: Folder,
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        router.get(route('admin.form-templates.index'), params, { preserveState: true });
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (category !== 'all') params.category = category;
        router.get(route('admin.form-templates.index'), params, { preserveState: true });
    };

    const handleUpload = (e) => {
        e.preventDefault();
        uploadForm.post(route('admin.form-templates.store'), {
            onSuccess: () => {
                setShowUpload(false);
                uploadForm.reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            forceFormData: true,
        });
    };

    const openEditModal = (template) => {
        setEditModal(template);
        editForm.setData({
            name: template.name,
            category: template.category,
            description: template.description || '',
            is_required: template.is_required,
            is_active: template.is_active,
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(route('admin.form-templates.update', editModal.id), {
            onSuccess: () => setEditModal(null),
            preserveState: true,
        });
    };

    const handleDelete = (template) => {
        if (confirm(`Delete "${template.name}"? This will also remove all seller acknowledgments.`)) {
            router.delete(route('admin.form-templates.destroy', template.id));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
        return Math.round(bytes / 1024) + ' KB';
    };

    const categoryTabs = [
        { key: 'all', label: 'All', count: counts.all },
        ...Object.entries(categories).map(([key, label]) => ({
            key, label, count: counts[key] || 0,
        })).filter(t => t.count > 0 || t.key === selectedCategory),
    ];

    return (
        <>
            <Head title="Forms Library" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forms Library</h1>
                    <p className="text-gray-500 mt-1">Manage forms, brochures, and documents for sellers</p>
                </div>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#249E93] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Upload Form
                </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Upload New Form</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Form Name *</label>
                                <input
                                    type="text"
                                    value={uploadForm.data.name}
                                    onChange={e => uploadForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                    placeholder="e.g. Lead-Based Paint Disclosure"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={uploadForm.data.description}
                                onChange={e => uploadForm.setData('description', e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent resize-none"
                                placeholder="Brief description of this form..."
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
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_required"
                                checked={uploadForm.data.is_required}
                                onChange={e => uploadForm.setData('is_required', e.target.checked)}
                                className="w-4 h-4 text-[#2BBBAD] border-gray-300 rounded focus:ring-[#2BBBAD]"
                            />
                            <label htmlFor="is_required" className="text-sm text-gray-700">
                                Required — sellers must acknowledge they've reviewed this form
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={uploadForm.processing}
                                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#249E93] disabled:opacity-50"
                            >
                                {uploadForm.processing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                Upload
                            </button>
                            <button type="button" onClick={() => { setShowUpload(false); uploadForm.reset(); }} className="text-gray-600 hover:text-gray-900">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search forms..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                    />
                </form>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categoryTabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleCategoryFilter(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedCategory === tab.key
                                ? 'bg-[#2BBBAD] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        {tab.label}
                        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                            selectedCategory === tab.key ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Templates List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {templates.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms uploaded yet</h3>
                        <p className="text-gray-500">Upload forms, brochures, and documents for your sellers.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {templates.map(template => {
                            const CatIcon = categoryIcons[template.category] || Folder;
                            return (
                                <div key={template.id} className={`p-5 hover:bg-gray-50 ${!template.is_active ? 'opacity-50' : ''}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <CatIcon className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                                                    {template.is_required && (
                                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 uppercase flex-shrink-0">Required</span>
                                                    )}
                                                    {!template.is_active && (
                                                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gray-200 text-gray-500 uppercase flex-shrink-0">Inactive</span>
                                                    )}
                                                </div>
                                                {template.description && (
                                                    <p className="text-sm text-gray-500 truncate">{template.description}</p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {template.file_name} &middot; {formatFileSize(template.file_size)}
                                                    &middot; {template.acknowledgments_count || 0} acknowledgment{template.acknowledgments_count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <a
                                                href={route('admin.form-templates.download', template.id)}
                                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => openEditModal(template)}
                                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(template)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit Form</h3>
                            <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={editForm.data.category}
                                    onChange={e => editForm.setData('category', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent"
                                >
                                    {Object.entries(categories).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.data.description}
                                    onChange={e => editForm.setData('description', e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#2BBBAD] focus:border-transparent resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_required}
                                        onChange={e => editForm.setData('is_required', e.target.checked)}
                                        className="w-4 h-4 text-[#2BBBAD] border-gray-300 rounded focus:ring-[#2BBBAD]"
                                    />
                                    <span className="text-sm text-gray-700">Required</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={editForm.data.is_active}
                                        onChange={e => editForm.setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-[#2BBBAD] border-gray-300 rounded focus:ring-[#2BBBAD]"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setEditModal(null)} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-[#2BBBAD] text-white rounded-lg font-medium hover:bg-[#249E93] disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

Index.layout = (page) => <AdminLayout children={page} title="Forms Library" />;

export default Index;
