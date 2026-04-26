import { Head } from '@inertiajs/react';
import { Download, ExternalLink, FileText } from 'lucide-react';

function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    return Math.round(bytes / 1024) + ' KB';
}

export default function Pamphlets({ forms = [] }) {
    return (
        <div className="min-h-screen bg-[#F8F7F5] py-10 px-4">
            <Head title="Receipt of Pamphlets / Booklets" />

            <div className="max-w-6xl mx-auto">
                {/* Letterhead */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 mb-6">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-baseline gap-1 mb-1">
                            <span className="text-[28px] font-bold text-[#2BBBAD]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>M</span>
                            <span className="text-[20px] font-semibold text-[#111]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>&</span>
                            <span className="text-[28px] font-bold text-[#2BBBAD]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>T</span>
                        </div>
                        <p className="text-[11px] tracking-[0.3em] text-[#111] font-semibold" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            REALTY GROUP
                        </p>
                    </div>

                    <h1
                        className="text-center text-[22px] sm:text-[28px] font-semibold text-[#111] mb-4"
                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    >
                        Receipt of Pamphlets / Booklets
                    </h1>

                    <p className="text-center text-sm sm:text-[15px] text-[#444] leading-relaxed max-w-3xl mx-auto">
                        The following pamphlets and booklets are available to be printed, saved, and viewed using the
                        links below. The Oklahoma Real Estate Commission requires we make each of these documents
                        available to our clients.
                    </p>
                </div>

                {/* Document Grid */}
                {forms.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No documents available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {forms.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block relative bg-gray-100 aspect-[3/4] overflow-hidden group"
                                >
                                    <iframe
                                        src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                        title={doc.name}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-[#111] shadow-lg">
                                            <ExternalLink className="w-4 h-4" />
                                            View Full PDF
                                        </div>
                                    </div>
                                </a>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3
                                        className="text-[15px] font-semibold text-[#111] text-center mb-2 leading-snug"
                                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                    >
                                        {doc.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 text-center mb-3">
                                        {doc.file_name} · {formatFileSize(doc.file_size)}
                                    </p>
                                    <a
                                        href={doc.url}
                                        download
                                        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#2BBBAD] text-white text-sm font-medium hover:bg-[#249E93] transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
