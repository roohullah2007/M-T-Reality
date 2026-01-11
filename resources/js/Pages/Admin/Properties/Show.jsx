import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    MapPin,
    Bed,
    Bath,
    Square,
    Calendar,
    Home,
    User,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Clock,
    Star,
    StarOff,
    Eye,
    ChevronLeft,
    ChevronRight,
    Building,
    DollarSign,
    FileText,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function PropertiesShow({ property }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const photos = property.photos && property.photos.length > 0
        ? property.photos
        : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'];

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    };

    const handleApprove = () => {
        setProcessing(true);
        router.post(route('admin.properties.approve', property.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowApproveModal(false);
            }
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setProcessing(true);
        router.post(route('admin.properties.reject', property.id), {
            rejection_reason: rejectionReason
        }, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setShowRejectModal(false);
            }
        });
    };

    const handleToggleFeatured = () => {
        router.post(route('admin.properties.toggle-featured', property.id), {}, {
            preserveScroll: true,
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const styles = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getPropertyTypeName = (type) => {
        const types = {
            'single-family-home': 'Single Family Home',
            'condos-townhomes-co-ops': 'Condo / Townhome',
            'multi-family': 'Multi-Family',
            'land': 'Land',
            'commercial': 'Commercial',
            'farms-ranches': 'Farm / Ranch',
            'mfd-mobile-homes': 'Mobile Home',
        };
        return types[type] || type;
    };

    return (
        <AdminLayout title="Review Property">
            <Head title={`Review: ${property.property_title} - Admin`} />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.properties.index')}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            Review Property
                        </h1>
                        <p className="text-gray-500">#{property.id} - {property.property_title}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleToggleFeatured}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            property.is_featured
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {property.is_featured ? (
                            <>
                                <Star className="w-4 h-4 fill-yellow-500" />
                                Featured
                            </>
                        ) : (
                            <>
                                <StarOff className="w-4 h-4" />
                                Make Featured
                            </>
                        )}
                    </button>

                    {property.approval_status === 'pending' && (
                        <>
                            <button
                                onClick={() => setShowApproveModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                            </button>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </button>
                        </>
                    )}

                    {property.approval_status === 'rejected' && (
                        <button
                            onClick={() => setShowApproveModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Approve Now
                        </button>
                    )}

                    <a
                        href={`/properties/${property.slug || property.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </a>
                </div>
            </div>

            {/* Status Banner */}
            {property.approval_status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                        <p className="font-medium text-yellow-800">Pending Review</p>
                        <p className="text-sm text-yellow-700">This property is awaiting your approval before it goes live.</p>
                    </div>
                </div>
            )}

            {property.approval_status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                            <p className="font-medium text-red-800">Rejected</p>
                            {property.rejection_reason && (
                                <p className="text-sm text-red-700">Reason: {property.rejection_reason}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {property.approval_status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="font-medium text-green-800">Approved</p>
                        <p className="text-sm text-green-700">This property is live and visible to the public.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="relative">
                            <img
                                src={photos[currentImageIndex]}
                                alt={property.property_title}
                                className="w-full h-[400px] object-cover"
                                onError={(e) => e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
                            />

                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-all"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {photos.length}
                                    </div>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(property.approval_status)}`}>
                                    {property.approval_status?.toUpperCase()}
                                </span>
                                {property.is_featured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        FEATURED
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {photos.length > 1 && (
                            <div className="p-4 flex gap-2 overflow-x-auto">
                                {photos.map((photo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            index === currentImageIndex ? 'border-[#A41E34]' : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={photo}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Property Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5 text-gray-400" />
                            Property Details
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Bed className="w-5 h-5 text-[#A41E34] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                                <p className="text-sm text-gray-500">Bedrooms</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Bath className="w-5 h-5 text-[#A41E34] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                                <p className="text-sm text-gray-500">Bathrooms</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Square className="w-5 h-5 text-[#A41E34] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.sqft?.toLocaleString() || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Sq Ft</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Calendar className="w-5 h-5 text-[#A41E34] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{property.year_built || 'N/A'}</p>
                                <p className="text-sm text-gray-500">Year Built</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Property Type:</span>
                                <span className="ml-2 font-medium text-gray-900">{getPropertyTypeName(property.property_type)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className="ml-2 font-medium text-gray-900 capitalize">{property.status?.replace('-', ' ')}</span>
                            </div>
                            {property.lot_size && (
                                <div>
                                    <span className="text-gray-500">Lot Size:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.lot_size?.toLocaleString()} sqft</span>
                                </div>
                            )}
                            {property.subdivision && (
                                <div>
                                    <span className="text-gray-500">Subdivision:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.subdivision}</span>
                                </div>
                            )}
                            {property.developer && (
                                <div>
                                    <span className="text-gray-500">Developer:</span>
                                    <span className="ml-2 font-medium text-gray-900">{property.developer}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Description
                        </h2>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {property.description}
                        </p>
                    </div>

                    {/* Features */}
                    {property.features && property.features.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-gray-400" />
                                Features & Amenities
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {property.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-[#A41E34]" />
                            <span className="text-gray-500 text-sm">Listing Price</span>
                        </div>
                        <p className="text-3xl font-bold text-[#A41E34]" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            {formatPrice(property.price)}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            Location
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-gray-900">{property.address}</p>
                            <p className="text-gray-600">{property.city}, {property.state} {property.zip_code}</p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            Seller Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{property.contact_name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <a href={`mailto:${property.contact_email}`} className="font-medium text-[#A41E34] hover:underline">
                                        {property.contact_email}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Phone className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <a href={`tel:${property.contact_phone}`} className="font-medium text-[#A41E34] hover:underline">
                                        {property.contact_phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Listing Owner */}
                    {property.user && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-gray-400" />
                                Listed By
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">{property.user.name}</p>
                                <p className="text-gray-600">{property.user.email}</p>
                                <p className="text-gray-500">
                                    Listed on {new Date(property.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Stats</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Views</span>
                                <span className="font-medium text-gray-900">{property.views || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Listing Tier</span>
                                <span className="font-medium text-gray-900 capitalize">{property.listing_tier || 'Free'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Active</span>
                                <span className={`font-medium ${property.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {property.is_active ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Approve Property</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to approve this property listing? Once approved, it will be visible to the public on the website.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="font-medium text-gray-900">{property.property_title}</p>
                            <p className="text-sm text-gray-500">{property.address}, {property.city}</p>
                            <p className="text-sm font-semibold text-[#A41E34] mt-1">{formatPrice(property.price)}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Approving...' : 'Approve Property'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Reject Property</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Please provide a reason for rejecting this property listing. This will be shared with the seller.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing || !rejectionReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Rejecting...' : 'Reject Property'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

PropertiesShow.layout = (page) => page;
