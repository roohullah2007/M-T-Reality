import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    FolderOpen,
    Download,
    FileText,
    Eye,
    MapPin,
    Clock,
    Bell,
} from 'lucide-react';

function Documents({ documents, categories, filters, counts }) {
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');

    const handleFilterCategory = (category) => {
        setSelectedCategory(category);
        const params = category === 'all' ? {} : { category };
        router.get(route('dashboard.documents'), params, { preserveState: true });
    };

    const formatFileSize = (bytes) => {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
        return Math.round(bytes / 1024) + ' KB';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    // Group by category
    const grouped = {};
    documents.forEach(d => {
        if (!grouped[d.category]) grouped[d.category] = [];
        grouped[d.category].push(d);
    });

    const categoryTabs = [
        { key: 'all', label: 'All', count: counts.all },
        ...Object.entries(categories)
            .map(([key, label]) => ({
                key,
                label,
                count: documents.filter(d => d.category === key).length,
            }))
            .filter(t => t.count > 0),
    ];

    return (
        <>
            <Head title="My Documents" />

            {/* Header */}
            <div className="mb-6">
                <h1
                    className="text-2xl lg:text-3xl font-bold text-[#111111]"
                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                >
                    My Documents
                </h1>
                <p className="text-gray-500 mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    View and download your completed listing documents
                </p>
            </div>

            {/* New Documents Banner */}
            {counts.new > 0 && (
                <div className="rounded-2xl p-5 mb-6 bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <Bell className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-blue-800">
                                {counts.new} new document{counts.new !== 1 ? 's' : ''} available
                            </p>
                            <p className="text-sm text-blue-600">
                                Download to view your completed forms.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Tabs */}
            {categoryTabs.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {categoryTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => handleFilterCategory(tab.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === tab.key
                                    ? 'bg-[#1a1a1a] text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                        >
                            {tab.label}
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                selectedCategory === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Documents List */}
            {documents.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3
                        className="text-lg font-semibold text-gray-900 mb-2"
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        No documents yet
                    </h3>
                    <p className="text-gray-500">
                        Completed listing documents will appear here once your admin uploads them.
                    </p>
                </div>
            ) : selectedCategory === 'all' ? (
                // Grouped view
                <div className="space-y-6">
                    {Object.entries(grouped).map(([cat, docs]) => (
                        <div key={cat}>
                            <h2
                                className="text-lg font-bold text-[#111111] mb-3"
                                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                            >
                                {categories[cat] || cat}
                            </h2>
                            <div className="grid gap-3">
                                {docs.map(doc => (
                                    <DocumentCard key={doc.id} doc={doc} formatFileSize={formatFileSize} formatDate={formatDate} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Flat view for filtered
                <div className="grid gap-3">
                    {documents.map(doc => (
                        <DocumentCard key={doc.id} doc={doc} formatFileSize={formatFileSize} formatDate={formatDate} />
                    ))}
                </div>
            )}
        </>
    );
}

function DocumentCard({ doc, formatFileSize, formatDate }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm p-5 transition-all ${
            !doc.viewed_at ? 'border-l-4 border-blue-400' : ''
        }`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        !doc.viewed_at ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                        <FileText className={`w-5 h-5 ${!doc.viewed_at ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3
                                className="font-semibold text-[#111111] truncate"
                                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                            >
                                {doc.name}
                            </h3>
                            {!doc.viewed_at && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide flex-shrink-0">
                                    New
                                </span>
                            )}
                        </div>
                        {doc.description && (
                            <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                            <span>{doc.file_name} &middot; {formatFileSize(doc.file_size)}</span>
                            {doc.property && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {doc.property.property_title}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(doc.created_at)}
                            </span>
                            {doc.viewed_at && (
                                <span className="flex items-center gap-1 text-green-500">
                                    <Eye className="w-3 h-3" />
                                    Viewed {formatDate(doc.viewed_at)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <a
                    href={route('dashboard.documents.download', doc.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2BBBAD] text-white text-sm font-medium hover:bg-[#249E93] transition-colors flex-shrink-0"
                >
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </div>
        </div>
    );
}

Documents.layout = (page) => <UserDashboardLayout children={page} title="My Documents" />;

export default Documents;
