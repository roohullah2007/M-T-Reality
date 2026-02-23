import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, TrendingUp, Camera, Handshake, HelpCircle, ArrowRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Contact() {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => {
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      },
    });
  };

  const consultationTopics = [
    {
      icon: TrendingUp,
      title: 'Current market conditions',
      description: 'Understand where the market stands and what it means for your property.'
    },
    {
      icon: HelpCircle,
      title: 'Pricing strategy',
      description: 'Data-driven pricing to attract strong offers and maximize your return.'
    },
    {
      icon: Camera,
      title: 'Marketing approach',
      description: 'Professional photography, MLS exposure, and digital marketing plan.'
    },
    {
      icon: Handshake,
      title: 'How our model works',
      description: 'Full-service representation with a modern, efficient structure.'
    }
  ];

  return (
    <>
      <Head title="Schedule a Consultation" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Consultation
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Let's Talk About<br />Your Goals
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl drop-shadow-lg mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Every home and every seller is different. Schedule a consultation to discuss your property, your timeline, and your goals.
              </p>

              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:918-884-7653"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Phone className="w-5 h-5" />
                  918-884-7653 (SOLD)
                </a>
                <a
                  href="mailto:info@mandtrealty.com"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Mail className="w-5 h-5" />
                  info@mandtrealty.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We'll Discuss Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  What to Expect
                </span>
              </div>
              <h2
                className="text-[32px] md:text-[44px] font-medium text-[#111] leading-[1.15] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Schedule a consultation<br />to discuss:
              </h2>
              <p
                className="text-[15px] text-[#666] font-medium leading-relaxed mb-4"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                No pressure. Just clear information and professional guidance.
              </p>
            </div>

            {/* Right - Topics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {consultationTopics.map((topic, index) => {
                const IconComponent = topic.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-[#2BBBAD]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2BBBAD]/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-[#2BBBAD]" />
                    </div>
                    <h3
                      className="text-[16px] font-semibold text-[#111] mb-2"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {topic.title}
                    </h3>
                    <p
                      className="text-[13px] text-[#666] font-medium leading-relaxed"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {topic.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team + Contact Form */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Team & Contact Info */}
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Your Team
                </span>
              </div>

              <h2
                className="text-[32px] md:text-[44px] font-medium text-[#111] leading-[1.15] mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Meet Terry & Michele
              </h2>

              {/* Team Cards */}
              <div className="space-y-4 mb-10">
                <div className="bg-[#EEEDEA] rounded-2xl p-6 flex items-center gap-5">
                  <img
                    src="/images/men-img.jpg"
                    alt="Terry"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3
                      className="text-[18px] font-semibold text-[#111] mb-1"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Terry
                    </h3>
                    <p
                      className="text-[14px] text-[#666] font-medium"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Broker / Owner
                    </p>
                  </div>
                </div>
                <div className="bg-[#EEEDEA] rounded-2xl p-6 flex items-center gap-5">
                  <img
                    src="/images/women-img.jpg"
                    alt="Michele"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div>
                    <h3
                      className="text-[18px] font-semibold text-[#111] mb-1"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Michele
                    </h3>
                    <p
                      className="text-[14px] text-[#666] font-medium"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      Associate Broker
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <a
                  href="tel:918-884-7653"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#2BBBAD]/10 rounded-xl flex items-center justify-center group-hover:bg-[#2BBBAD]/20 transition-colors">
                    <Phone className="w-5 h-5 text-[#2BBBAD]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Phone</p>
                    <p className="text-[16px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>918-884-7653 (SOLD)</p>
                  </div>
                </a>
                <a
                  href="mailto:info@mandtrealty.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-[#2BBBAD]/10 rounded-xl flex items-center justify-center group-hover:bg-[#2BBBAD]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#2BBBAD]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Email</p>
                    <p className="text-[16px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>info@mandtrealty.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2BBBAD]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#2BBBAD]" />
                  </div>
                  <div>
                    <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Mailing Address</p>
                    <p className="text-[16px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>3701-A South Harvard Ave #320, Tulsa, OK 74135</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="bg-[#EEEDEA] rounded-2xl p-8 md:p-10">
              <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <MessageSquare className="w-4 h-4 text-[#666]" />
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Send a Message
                </span>
              </div>

              <h3
                className="text-[24px] md:text-[28px] font-medium text-[#111] mb-2"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Schedule Your Consultation
              </h3>
              <p
                className="text-[14px] text-[#666] font-medium mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Fill out the form below and we'll be in touch within 24 hours.
              </p>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Thank you! We'll get back to you within 24 hours.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#2BBBAD] transition-colors bg-white ${errors.name ? 'border-red-500' : 'border-[#D0CCC7]'}`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    placeholder="Your name"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#2BBBAD] transition-colors bg-white ${errors.email ? 'border-red-500' : 'border-[#D0CCC7]'}`}
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      placeholder="you@email.com"
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#2BBBAD] transition-colors bg-white"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      placeholder="(918) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    I'm interested in:
                  </label>
                  <select
                    name="subject"
                    value={data.subject}
                    onChange={e => setData('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:outline-none focus:ring-0 focus:border-[#2BBBAD] transition-colors bg-white ${errors.subject ? 'border-red-500' : 'border-[#D0CCC7]'}`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="selling">Selling my home</option>
                    <option value="buying">Buying a home</option>
                    <option value="pricing">Pricing strategy consultation</option>
                    <option value="marketing">Marketing my property</option>
                    <option value="general">General inquiry</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={data.message}
                    onChange={e => setData('message', e.target.value)}
                    rows="5"
                    className={`w-full px-4 py-3 border rounded-xl text-sm outline-none focus:border-[#2BBBAD] transition-colors resize-none bg-white ${errors.message ? 'border-red-500' : 'border-[#D0CCC7]'}`}
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    placeholder="Tell us about your property and goals..."
                    required
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Send className="w-5 h-5" />
                  {processing ? 'Sending...' : 'Schedule Consultation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16 text-center">
            <h2
              className="text-white text-[28px] md:text-[36px] font-medium mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              No pressure. Just clear information<br className="hidden md:block" /> and professional guidance.
            </h2>
            <p
              className="text-white/70 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Whether you're ready to list or just exploring your options, we're here to help you make an informed decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:918-884-7653"
                className="inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <Phone className="w-5 h-5" />
                Call 918-884-SOLD
              </a>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-white/20"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Contact.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Contact;
