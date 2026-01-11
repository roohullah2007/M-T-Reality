import { Head, Link, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import {
    ArrowLeft,
    Save,
    Home,
    MapPin,
    DollarSign,
    Bed,
    Bath,
    Square,
    Calendar,
    FileText,
    User,
    Mail,
    Phone,
    Image,
    AlertCircle
} from 'lucide-react';

export default function EditListing({ property }) {
    const { data, setData, put, processing, errors } = useForm({
        property_title: property.property_title || '',
        property_type: property.property_type || 'single_family',
        status: property.status || 'for_sale',
        price: property.price || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        sqft: property.sqft || '',
        lot_size: property.lot_size || '',
        year_built: property.year_built || '',
        description: property.description || '',
        features: property.features || [],
        contact_name: property.contact_name || '',
        contact_email: property.contact_email || '',
        contact_phone: property.contact_phone || '',
    });

    const propertyTypes = [
        { value: 'single_family', label: 'Single Family Home' },
        { value: 'condo', label: 'Condo/Townhouse' },
        { value: 'multi_family', label: 'Multi-Family' },
        { value: 'land', label: 'Land/Lot' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'other', label: 'Other' },
    ];

    const statusOptions = [
        { value: 'for_sale', label: 'For Sale' },
        { value: 'for_rent', label: 'For Rent' },
        { value: 'pending', label: 'Pending' },
        { value: 'sold', label: 'Sold' },
    ];

    const featureOptions = [
        'Central Air',
        'Heating',
        'Garage',
        'Pool',
        'Fireplace',
        'Hardwood Floors',
        'Washer/Dryer',
        'Dishwasher',
        'Fenced Yard',
        'Basement',
        'Attic',
        'Patio/Deck',
        'Smart Home',
        'Security System',
        'Solar Panels',
        'Water Heater',
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('dashboard.listings.update', property.id));
    };

    const toggleFeature = (feature) => {
        const currentFeatures = data.features || [];
        if (currentFeatures.includes(feature)) {
            setData('features', currentFeatures.filter(f => f !== feature));
        } else {
            setData('features', [...currentFeatures, feature]);
        }
    };

    return (
        <UserDashboardLayout title="Edit Listing">
            <Head title={`Edit - ${property.property_title}`} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href={route('dashboard.listings')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        Edit Listing
                    </h1>
                    <p className="text-gray-500">Update your property details</p>
                </div>
            </div>

            {/* Approval Status Alert */}
            {property.approval_status === 'rejected' && property.rejection_reason && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-red-800">Your listing was rejected</p>
                        <p className="text-sm text-red-700 mt-1">{property.rejection_reason}</p>
                        <p className="text-sm text-red-600 mt-2">Please update your listing and it will be reviewed again.</p>
                    </div>
                </div>
            )}

            {property.approval_status === 'pending' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-yellow-800">Pending Approval</p>
                        <p className="text-sm text-yellow-700 mt-1">Your listing is currently being reviewed. You can still make changes.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        <Home className="w-5 h-5 text-[#A41E34]" />
                        Basic Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Title *
                            </label>
                            <input
                                type="text"
                                value={data.property_title}
                                onChange={(e) => setData('property_title', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.property_title ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Beautiful 3 Bedroom Family Home"
                            />
                            {errors.property_title && (
                                <p className="text-red-500 text-sm mt-1">{errors.property_title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Type *
                            </label>
                            <select
                                value={data.property_type}
                                onChange={(e) => setData('property_type', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.property_type ? 'border-red-500' : 'border-gray-200'
                                }`}
                            >
                                {propertyTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            {errors.property_type && (
                                <p className="text-red-500 text-sm mt-1">{errors.property_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Listing Status *
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.status ? 'border-red-500' : 'border-gray-200'
                                }`}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <DollarSign className="w-4 h-4 inline-block mr-1" />
                                Price *
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.price ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 350000"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        <MapPin className="w-5 h-5 text-[#A41E34]" />
                        Location
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.address ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 123 Main Street"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.city ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., Oklahoma City"
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                value={data.state}
                                onChange={(e) => setData('state', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.state ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., OK"
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP Code *
                            </label>
                            <input
                                type="text"
                                value={data.zip_code}
                                onChange={(e) => setData('zip_code', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.zip_code ? 'border-red-500' : 'border-gray-200'
                                }`}
                                placeholder="e.g., 73102"
                            />
                            {errors.zip_code && (
                                <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        <FileText className="w-5 h-5 text-[#A41E34]" />
                        Property Details
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Bed className="w-4 h-4 inline-block mr-1" />
                                Bedrooms *
                            </label>
                            <input
                                type="number"
                                value={data.bedrooms}
                                onChange={(e) => setData('bedrooms', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.bedrooms ? 'border-red-500' : 'border-gray-200'
                                }`}
                                min="0"
                            />
                            {errors.bedrooms && (
                                <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Bath className="w-4 h-4 inline-block mr-1" />
                                Bathrooms *
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                value={data.bathrooms}
                                onChange={(e) => setData('bathrooms', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.bathrooms ? 'border-red-500' : 'border-gray-200'
                                }`}
                                min="0"
                            />
                            {errors.bathrooms && (
                                <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Square className="w-4 h-4 inline-block mr-1" />
                                Sq. Ft.
                            </label>
                            <input
                                type="number"
                                value={data.sqft}
                                onChange={(e) => setData('sqft', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.sqft ? 'border-red-500' : 'border-gray-200'
                                }`}
                                min="0"
                            />
                            {errors.sqft && (
                                <p className="text-red-500 text-sm mt-1">{errors.sqft}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline-block mr-1" />
                                Year Built
                            </label>
                            <input
                                type="number"
                                value={data.year_built}
                                onChange={(e) => setData('year_built', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.year_built ? 'border-red-500' : 'border-gray-200'
                                }`}
                                min="1800"
                                max={new Date().getFullYear() + 1}
                            />
                            {errors.year_built && (
                                <p className="text-red-500 text-sm mt-1">{errors.year_built}</p>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lot Size
                            </label>
                            <input
                                type="text"
                                value={data.lot_size}
                                onChange={(e) => setData('lot_size', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34]"
                                placeholder="e.g., 0.25 acres"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={5}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34]"
                            placeholder="Describe your property..."
                        />
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        Features & Amenities
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {featureOptions.map((feature) => (
                            <label
                                key={feature}
                                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${
                                    (data.features || []).includes(feature)
                                        ? 'border-[#A41E34] bg-[#A41E34]/5 text-[#A41E34]'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={(data.features || []).includes(feature)}
                                    onChange={() => toggleFeature(feature)}
                                    className="sr-only"
                                />
                                <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    (data.features || []).includes(feature)
                                        ? 'bg-[#A41E34] border-[#A41E34]'
                                        : 'border-gray-300'
                                }`}>
                                    {(data.features || []).includes(feature) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-sm">{feature}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                        <User className="w-5 h-5 text-[#A41E34]" />
                        Contact Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="w-4 h-4 inline-block mr-1" />
                                Contact Name *
                            </label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.contact_name ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_name && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Mail className="w-4 h-4 inline-block mr-1" />
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.contact_email ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_email && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Phone className="w-4 h-4 inline-block mr-1" />
                                Contact Phone *
                            </label>
                            <input
                                type="tel"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] ${
                                    errors.contact_phone ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {errors.contact_phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Current Images */}
                {property.images && property.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                            <Image className="w-5 h-5 text-[#A41E34]" />
                            Current Images
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {property.images.map((image, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={image.url || image}
                                        alt={`Property image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/images/property-placeholder.jpg'}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            To update images, please contact support.
                        </p>
                    </div>
                )}

                {/* Submit */}
                <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-6">
                    <Link
                        href={route('dashboard.listings')}
                        className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#A41E34] text-white rounded-xl font-medium hover:bg-[#8B1A2C] transition-colors disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </UserDashboardLayout>
    );
}

EditListing.layout = (page) => page;
