import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Home, CheckCircle, ChevronRight, AlertCircle, Loader2, Phone, Mail, Clock, TrendingUp, Megaphone } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function ListProperty() {
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Oklahoma',
    zipCode: '',
    propertyType: '',
    estimatedValue: '',
    timeframe: '',
    message: '',
    subject: 'Seller Consultation Request',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the message body with structured property info
    const messageBody = [
      `Property Address: ${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
      `Property Type: ${data.propertyType || 'Not specified'}`,
      `Estimated Value: ${data.estimatedValue || 'Not specified'}`,
      `Selling Timeframe: ${data.timeframe || 'Not specified'}`,
      data.message ? `\nAdditional Notes:\n${data.message}` : '',
    ].filter(Boolean).join('\n');

    post('/contact', {
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: 'Seller Consultation Request',
        message: messageBody,
      },
      preserveScroll: true,
      onSuccess: () => {
        setShowSuccess(true);
        reset();
      },
    });
  };

  const steps = [
    { icon: Mail, title: 'Submit Your Info', description: 'Fill out the form with your property details and contact information.' },
    { icon: Phone, title: 'Consultation Within 24hrs', description: 'An M&T agent will reach out to schedule your free consultation.' },
    { icon: TrendingUp, title: 'Market Analysis', description: 'We prepare a comprehensive market analysis to determine your optimal listing price.' },
    { icon: Clock, title: 'Selling Strategy', description: 'Together we develop a customized selling strategy for your property.' },
    { icon: Megaphone, title: 'Marketing Launch', description: 'Professional photos, MLS listing, and digital marketing go live.' },
  ];

  if (showSuccess) {
    return (
      <>
        <Head title="Consultation Request Submitted" />
        <div className="relative pt-0 md:pt-[77px]">
          <div className="min-h-[80vh] flex items-center justify-center bg-[#EEEDEA] py-20">
            <div className="max-w-lg mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-[#2BBBAD]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#2BBBAD]" />
              </div>
              <h1
                className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Consultation Request Submitted!
              </h1>
              <p
                className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Thank you for your interest in selling with M&T Realty Group. One of our agents will contact you within 24 hours to schedule your free consultation.
              </p>
              <a
                href="/sellers"
                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#249E93]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Learn More About Selling
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Sell With Us" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2 mb-6">
                <Home className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Sell With Us
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Ready to Sell<br />Your Home?
              </h1>

              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Tell us about your property and an M&T agent will reach out to schedule a free, no-obligation consultation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form - 2 columns wide */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
                <h2
                  className="text-[24px] md:text-[28px] font-medium text-[#111] mb-2"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Request a Consultation
                </h2>
                <p
                  className="text-[14px] text-[#666] font-medium mb-8"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Fill out the form below and we'll be in touch within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                        placeholder="John Doe"
                        required
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                        placeholder="john@example.com"
                        required
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                      placeholder="(405) 555-0123"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    />
                  </div>

                  {/* Property Information */}
                  <div className="pt-4 border-t border-[#EEEDEA]">
                    <h3
                      className="text-[16px] font-semibold text-[#111] mb-4"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Property Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Property Address *
                        </label>
                        <input
                          type="text"
                          value={data.address}
                          onChange={(e) => setData('address', e.target.value)}
                          className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                          placeholder="123 Main Street"
                          required
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            City *
                          </label>
                          <input
                            type="text"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                            placeholder="Oklahoma City"
                            required
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            State
                          </label>
                          <input
                            type="text"
                            value={data.state}
                            disabled
                            className="w-full px-4 py-3 bg-[#E5E1DC] border-0 rounded-xl text-[#666] cursor-not-allowed"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            value={data.zipCode}
                            onChange={(e) => setData('zipCode', e.target.value)}
                            className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                            placeholder="73101"
                            required
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Property Type
                          </label>
                          <select
                            value={data.propertyType}
                            onChange={(e) => setData('propertyType', e.target.value)}
                            className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            <option value="">Select Type</option>
                            <option value="Single Family">Single Family</option>
                            <option value="Condo/Townhouse">Condo / Townhouse</option>
                            <option value="Multi-Family">Multi-Family</option>
                            <option value="Land">Land</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            Estimated Value (optional)
                          </label>
                          <input
                            type="text"
                            value={data.estimatedValue}
                            onChange={(e) => setData('estimatedValue', e.target.value)}
                            className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                            placeholder="$300,000"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Selling Timeframe
                        </label>
                        <select
                          value={data.timeframe}
                          onChange={(e) => setData('timeframe', e.target.value)}
                          className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] focus:ring-2 focus:ring-[#2BBBAD] transition-all"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <option value="">Select Timeframe</option>
                          <option value="ASAP">As soon as possible</option>
                          <option value="1-3 months">1-3 months</option>
                          <option value="3-6 months">3-6 months</option>
                          <option value="6+ months">6+ months</option>
                          <option value="Just exploring">Just exploring my options</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#333] mb-1.5" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          Additional Notes
                        </label>
                        <textarea
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-[#EEEDEA] border-0 rounded-xl text-[#111] placeholder-[#999] focus:ring-2 focus:ring-[#2BBBAD] transition-all resize-none"
                          placeholder="Tell us anything else about your property or selling goals..."
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-4 font-medium transition-all duration-300 hover:bg-[#249E93] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Consultation
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - What to Expect */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-[100px]">
                <h3
                  className="text-[20px] font-semibold text-[#111] mb-6"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  What to Expect
                </h3>

                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-[#EEEDEA] rounded-xl flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-[#2BBBAD]" />
                          </div>
                        </div>
                        <div>
                          <h4
                            className="text-[15px] font-semibold text-[#111] mb-1"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {step.title}
                          </h4>
                          <p
                            className="text-[13px] text-[#666] leading-relaxed"
                            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-[#EEEDEA]">
                  <p
                    className="text-[13px] text-[#666] leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    Have questions? Call us at{' '}
                    <a href="tel:4055551234" className="text-[#2BBBAD] font-medium hover:underline">
                      (405) 964-8485
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:info@mandtrealtygroup.com" className="text-[#2BBBAD] font-medium hover:underline">
                      info@mandtrealtygroup.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

ListProperty.layout = (page) => <MainLayout>{page}</MainLayout>;

export default ListProperty;
