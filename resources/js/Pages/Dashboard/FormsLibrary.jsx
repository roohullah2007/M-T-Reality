import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    FileText,
    Download,
    CheckCircle,
    AlertCircle,
    Shield,
    BookOpen,
    FileCheck,
    Folder,
    Clock,
} from 'lucide-react';

function FormsLibrary({ templates, acknowledgedIds, categories, filters, counts }) {
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || 'all');

    const categoryIcons = {
        government: Shield,
        listing: FileText,
        disclosure: AlertCircle,
        brochure: BookOpen,
        other: Folder,
    };

    const handleFilterCategory = (category) => {
        setSelectedCategory(category);
        const params = category === 'all' ? {} : { category };
        router.get(route('dashboard.forms'), params, { preserveState: true });
    };

    const handleAcknowledge = (templateId) => {
        router.post(route('dashboard.forms.acknowledge', templateId), {}, {
            preserveState: true,
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
        return Math.round(bytes / 1024) + ' KB';
    };

    const isAcknowledged = (id) => acknowledgedIds.includes(id);

    // Group templates by category
    const grouped = {};
    templates.forEach(t => {
        if (!grouped[t.category]) grouped[t.category] = [];
        grouped[t.category].push(t);
    });

    const categoryTabs = [
        { key: 'all', label: 'All Forms', count: counts.all },
        ...Object.entries(categories).map(([key, label]) => ({
            key,
            label,
            count: templates.filter(t => t.category === key).length,
        })).filter(t => t.count > 0),
    ];

    return (
        <>
            <Head title="Forms Library" />

            {/* Header */}
            <div className="mb-6">
                <h1
                    className="text-2xl lg:text-3xl font-bold text-[#111111]"
                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                >
                    Forms Library
                </h1>
                <p className="text-gray-500 mt-1" style={{ fontFamily: '"Poppins", sans-serif' }}>
                    Review and download required forms, brochures, and documents
                </p>
            </div>

            {/* Progress Banner */}
            {counts.required > 0 && (
                <div className={`rounded-2xl p-5 mb-6 ${
                    counts.pending === 0
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-amber-50 border border-amber-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {counts.pending === 0 ? (
                            <>
                                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-green-800">All required forms reviewed</p>
                                    <p className="text-sm text-green-600">You've acknowledged all {counts.required} required forms.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-amber-800">{counts.pending} required form{counts.pending !== 1 ? 's' : ''} pending review</p>
                                    <p className="text-sm text-amber-600">Please review and acknowledge the required forms below.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Category Tabs */}
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
                        {tab.count > 0 && (
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                                selectedCategory === tab.key
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Forms List */}
            {templates.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3
                        className="text-lg font-semibold text-gray-900 mb-2"
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        No forms available
                    </h3>
                    <p className="text-gray-500">
                        Forms and documents will appear here when your admin uploads them.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {selectedCategory === 'all' ? (
                        // Grouped by category
                        Object.entries(grouped).map(([cat, items]) => {
                            const CatIcon = categoryIcons[cat] || Folder;
                            return (
                                <div key={cat}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CatIcon className="w-5 h-5 text-gray-500" />
                                        <h2
                                            className="text-lg font-bold text-[#111111]"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            {categories[cat] || cat}
                                        </h2>
                                    </div>
                                    <div className="grid gap-3">
                                        {items.map(template => (
                                            <FormCard
                                                key={template.id}
                                                template={template}
                                                acknowledged={isAcknowledged(template.id)}
                                                onAcknowledge={handleAcknowledge}
                                                formatFileSize={formatFileSize}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // Flat list for filtered category
                        <div className="grid gap-3">
                            {templates.map(template => (
                                <FormCard
                                    key={template.id}
                                    template={template}
                                    acknowledged={isAcknowledged(template.id)}
                                    onAcknowledge={handleAcknowledge}
                                    formatFileSize={formatFileSize}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

function FormCard({ template, acknowledged, onAcknowledge, formatFileSize }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm p-5 transition-all ${
            template.is_required && !acknowledged ? 'border-l-4 border-amber-400' : ''
        }`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Icon & Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="font-semibold text-[#111111] truncate"
                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                        >
                            {template.name}
                        </h3>
                        {template.is_required && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide flex-shrink-0">
                                Required
                            </span>
                        )}
                        {acknowledged && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 uppercase tracking-wide flex items-center gap-1 flex-shrink-0">
                                <CheckCircle className="w-3 h-3" />
                                Reviewed
                            </span>
                        )}
                    </div>
                    {template.description && (
                        <p className="text-sm text-gray-500 mb-1">{template.description}</p>
                    )}
                    <p className="text-xs text-gray-400">
                        {template.file_name} &middot; {formatFileSize(template.file_size)}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                        href={route('dashboard.forms.download', template.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </a>
                    {template.is_required && !acknowledged && (
                        <button
                            onClick={() => onAcknowledge(template.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2BBBAD] text-white text-sm font-medium hover:bg-[#249E93] transition-colors"
                        >
                            <FileCheck className="w-4 h-4" />
                            I've Reviewed This
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

FormsLibrary.layout = (page) => <UserDashboardLayout children={page} title="Forms Library" />;

export default FormsLibrary;
