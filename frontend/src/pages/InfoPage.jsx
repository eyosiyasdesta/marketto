import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const PAGE_DEFINITIONS = {
  '/contact': {
    badge: 'Customer Care',
    title: 'Contact Us',
    subtitle: 'We are here to assist with any questions regarding products, orders, or partnerships.',
    icon: '💬',
    sections: [
      {
        heading: 'Customer Support',
        text: 'Our dedicated team responds within 24 hours on business days.',
        detail: 'Email: support@marketto.com | Hotline: +1 (800) 555-0199',
      },
      {
        heading: 'Operating Hours',
        text: 'Monday through Friday: 9:00 AM – 8:00 PM EST. Saturday: 10:00 AM – 6:00 PM EST.',
        detail: 'Closed on major national holidays.',
      },
      {
        heading: 'Global Headquarters',
        text: 'Marketto Retail Corp., 450 Lexington Avenue, Suite 1200, New York, NY 10017, USA',
        detail: 'Showroom open to public by appointment.',
      },
    ],
    showForm: true,
  },
  '/store-locations': {
    badge: 'Retail Experience',
    title: 'Store Locations',
    subtitle: 'Visit our flagship retail showrooms to experience our products in person.',
    icon: '📍',
    sections: [
      {
        heading: 'New York — Midtown Flagship',
        text: '450 Lexington Ave, New York, NY 10017',
        detail: 'Hours: Mon–Sat 10:00 AM – 8:00 PM, Sun 11:00 AM – 6:00 PM | Tel: (212) 555-0144',
      },
      {
        heading: 'San Francisco — Union Square',
        text: '220 Post Street, San Francisco, CA 94108',
        detail: 'Hours: Mon–Sat 10:00 AM – 7:00 PM, Sun 11:00 AM – 5:00 PM | Tel: (415) 555-0182',
      },
      {
        heading: 'Chicago — Magnificent Mile',
        text: '700 N Michigan Avenue, Chicago, IL 60611',
        detail: 'Hours: Mon–Sat 10:00 AM – 8:00 PM, Sun 11:00 AM – 6:00 PM | Tel: (312) 555-0193',
      },
    ],
  },
  '/careers': {
    badge: 'Work With Us',
    title: 'Careers at Marketto',
    subtitle: 'Help shape the future of modern e-commerce and retail technology.',
    icon: '🚀',
    sections: [
      {
        heading: 'Senior Full-Stack Engineer (React + Java)',
        text: 'Engineering — Remote / New York, NY',
        detail: 'Design high-throughput APIs in Spring Boot and fluid web clients in modern React.',
      },
      {
        heading: 'Product Designer (UI / UX)',
        text: 'Design — Remote / San Francisco, CA',
        detail: 'Lead customer journey research, visual component libraries, and interactive shopping workflows.',
      },
      {
        heading: 'Supply Chain & Logistics Specialist',
        text: 'Operations — Chicago, IL',
        detail: 'Coordinate fulfillment network hubs, delivery carrier SLAs, and warehouse inventory systems.',
      },
      {
        heading: 'How to Apply',
        text: 'Send your resume and portfolio to careers@marketto.com with the position title in the subject.',
        detail: 'We offer competitive compensation, comprehensive health benefits, and flexible remote work options.',
      },
    ],
  },
  '/faqs': {
    badge: 'Help Center',
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to everything you need to know about shopping with Marketto.',
    icon: '❓',
    accordion: true,
    faqs: [
      {
        q: 'How long does delivery take?',
        a: 'Standard ground shipping typically delivers within 3 to 5 business days. Expedited priority options (1–2 business days) are available during checkout.',
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day hassle-free money-back guarantee. Any unused item in original packaging can be returned for a full refund.',
      },
      {
        q: 'How can I track my active order?',
        a: 'Simply click "Track Order" in the top bar or footer and input your Order ID to view real-time shipping milestones.',
      },
      {
        q: 'Can I cancel or modify an order after placing it?',
        a: 'Orders can be modified or cancelled within 60 minutes of submission before our fulfillment center initiates packaging.',
      },
      {
        q: 'Do you ship to international destinations?',
        a: 'Yes, Marketto currently ships to over 40 countries worldwide. International shipping times range from 7 to 14 business days.',
      },
    ],
  },
  '/returns-policy': {
    badge: 'Guarantee',
    title: 'Returns & Refund Policy',
    subtitle: 'Simple, transparent, and worry-free returns on every purchase.',
    icon: '🔄',
    sections: [
      {
        heading: '30-Day Risk-Free Guarantee',
        text: 'If you are not 100% satisfied with your purchase, you may return it within 30 days of the delivery date.',
        detail: 'Items must be in original condition with tags and packaging intact.',
      },
      {
        heading: 'Free Prepaid Return Labels',
        text: 'We provide complimentary prepaid return shipping labels for all domestic US returns.',
        detail: 'Generate your return shipping label directly from your order dashboard.',
      },
      {
        heading: 'Fast Refund Processing',
        text: 'Once received at our warehouse, your return is inspected and refunded within 3–5 business days.',
        detail: 'Refunds are automatically credited to your original payment method.',
      },
    ],
  },
  '/shipping-info': {
    badge: 'Delivery Information',
    title: 'Shipping & Delivery',
    subtitle: 'Fast, secure delivery options designed to get your order to you seamlessly.',
    icon: '📦',
    sections: [
      {
        heading: 'Free Standard Shipping Over $75',
        text: 'All orders containing $75 or more of eligible merchandise receive free standard shipping automatically.',
        detail: 'Delivery time: 3–5 business days across the continental US.',
      },
      {
        heading: 'Flat Rate Standard Delivery',
        text: 'For orders under $75, a low flat rate of $4.99 applies nationwide.',
        detail: 'Tracked with FedEx, UPS, or USPS tracking numbers provided upon dispatch.',
      },
      {
        heading: 'Expedited & Overnight Delivery',
        text: 'Need your items urgently? Select Expedited (2 business days for $9.99) or Overnight Express ($19.99).',
        detail: 'Orders placed before 2:00 PM EST ship the same business day.',
      },
    ],
  },
  '/terms': {
    badge: 'Legal Agreement',
    title: 'Terms of Service',
    subtitle: 'Please review the terms and conditions that govern your use of the Marketto platform.',
    icon: '📜',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By visiting, registering, or making purchases on Marketto, you agree to be bound by these Terms of Service and all related company policies.',
      },
      {
        heading: '2. User Accounts & Security',
        text: 'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
      },
      {
        heading: '3. Pricing & Product Descriptions',
        text: 'We strive for accurate representations of all product details, stock, and pricing. Marketto reserves the right to correct any inadvertent inaccuracies prior to order fulfillment.',
      },
    ],
  },
  '/privacy': {
    badge: 'Data Security',
    title: 'Privacy Policy',
    subtitle: 'How we collect, protect, and respect your personal information.',
    icon: '🔒',
    sections: [
      {
        heading: '1. Information We Collect',
        text: 'We only collect essential information required to process your orders, ship merchandise, and provide customer support (e.g. name, email, shipping address).',
      },
      {
        heading: '2. Encryption & Security Standards',
        text: 'All authentication is secured with cryptographic hashing and stateless JWT tokens. We never store raw payment card data on our servers.',
      },
      {
        heading: '3. No Third-Party Data Selling',
        text: 'We never sell, rent, or trade your personal information to third-party advertisers or data brokers under any circumstances.',
      },
    ],
  },
};

export default function InfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [openFaq, setOpenFaq] = useState(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const page = PAGE_DEFINITIONS[location.pathname] || PAGE_DEFINITIONS['/contact'];

  const handleBackToMarketto = (e) => {
    e.preventDefault();
    // If opened in a new tab/window by target="_blank", close cleanly
    if (window.opener && !window.opener.closed) {
      window.close();
    } else {
      navigate('/');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast('Please fill out all fields.', 'error');
      return;
    }
    showToast('Your message has been sent! Our support team will reply within 24 hours.');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <div className="target-page-container" style={{ minHeight: '85vh', backgroundColor: '#f8fafc', padding: '32px 16px' }}>
      {/* Target Page Top Navigation Bar */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#0b1a2e',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7CBA3F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
          </svg>
          <span>Marketto</span>
        </Link>

        <button
          onClick={handleBackToMarketto}
          className="btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            padding: '8px 16px',
          }}
        >
          ← Back to Marketto
        </button>
      </div>

      {/* Main Target Page Card */}
      <div
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>{page.icon}</span>
          <span
            style={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {page.badge}
          </span>
        </div>

        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', margin: '4px 0 8px' }}>
          {page.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>{page.subtitle}</p>

        {/* FAQ Accordion Mode */}
        {page.accordion && page.faqs && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {page.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: isOpen ? '#f8fafc' : '#fff',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#0f172a',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '18px', color: '#64748b', marginLeft: '12px' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Structured Sections Mode */}
        {page.sections && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {page.sections.map((sec, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  backgroundColor: '#f8fafc',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                  {sec.heading}
                </h3>
                <p style={{ color: '#334155', fontSize: '14px', margin: '0 0 6px', lineHeight: 1.6 }}>
                  {sec.text}
                </p>
                {sec.detail && (
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                    {sec.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Form if on /contact */}
        {page.showForm && (
          <div style={{ marginTop: '36px', borderTop: '1px solid #e2e8f0', paddingTop: '28px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Send Us a Message</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Fill in your details and an agent will reach out shortly.
            </p>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="i.e. Alex Smith"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'inherit' }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '14px' }}
              >
                Send Message
              </button>
            </form>
          </div>
        )}

        {/* Bottom Call to Action */}
        <div
          style={{
            marginTop: '36px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#64748b' }}>Ready to explore our store collection?</span>
          <button
            onClick={handleBackToMarketto}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '14px' }}
          >
            Shop Now at Marketto →
          </button>
        </div>
      </div>
    </div>
  );
}
