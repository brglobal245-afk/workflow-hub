import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, Users, CheckSquare, MessageSquare, 
  Clock, Calendar, FileText, Star, BarChart3, 
  Shield, Send, ArrowRight, Check, StarOff, Globe, Mail, MessageCircle, Phone
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you! Your message has been sent to our sales team.');
      setContactForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: Users, title: 'Workforce & Directory', desc: 'Secure profile databases, team mapping, and customizable organizational charts.' },
    { icon: CheckSquare, title: 'Kanban Task Boards', desc: 'Manage workflows with customizable task columns, assignee tags, and submissions.' },
    { icon: MessageSquare, title: 'Real-time Messaging', desc: 'Direct secure chats, group conversations, and leadership feedback inbox channels.' },
    { icon: Clock, title: 'Smart Attendance', desc: 'Live check-in/out records, location checking, and custom work-mode tracking.' },
    { icon: Calendar, title: 'Leave Approvals', desc: 'Dynamic balance cards, automated workflows, and leave-request timelines.' },
    { icon: FileText, title: 'Document Center', desc: 'Share policies, upload guidelines, and control access permissions company-wide.' },
    { icon: Star, title: 'Performance Tracking', desc: 'Configure KPIs, track progress goals, and write reviews in a single hub.' },
    { icon: BarChart3, title: 'Reports & Insights', desc: 'Analyze headcount, task completion trends, and attendance averages dynamically.' }
  ];

  return (
    <div className="landing-page-wrapper">
      <Toaster position="top-right" />
      <style>{`
        .landing-page-wrapper {
          font-family: var(--font-sans);
          background: #090d16;
          color: #f8fafc;
          min-height: 100vh;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        /* Nav Bar */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: rgba(9, 13, 22, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4rem;
          z-index: 1000;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .nav-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        }
        .nav-logo-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(to right, #ffffff, #c7d2fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .nav-link {
          color: #94a3b8;
          font-size: 0.9375rem;
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .nav-link:hover {
          color: #ffffff;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .btn-nav-outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .btn-nav-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #ffffff;
        }
        .btn-nav-primary {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: #ffffff;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
          transition: var(--transition-fast);
        }
        .btn-nav-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(99, 102, 241, 0.4);
        }

        /* Hero Section */
        .hero-section {
          padding: 10rem 4rem 6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          background-image: radial-gradient(circle at top, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
        }
        .hero-badge {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #818cf8;
          padding: 0.375rem 1rem;
          border-radius: 100px;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          max-width: 900px;
          margin-bottom: 1.5rem;
          background: linear-gradient(to bottom, #ffffff 60%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          color: #94a3b8;
          font-size: 1.25rem;
          line-height: 1.7;
          max-width: 680px;
          margin-bottom: 2.5rem;
        }
        .hero-cta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 5rem;
        }
        .btn-cta-primary {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: #ffffff;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
        }
        .btn-cta-secondary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Mockup Frame */
        .mockup-container {
          width: 100%;
          max-width: 1100px;
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 0.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .mockup-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .mockup-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }
        .mockup-content {
          background: #0b111e;
          border-radius: 0 0 12px 12px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .mockup-preview-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          width: 100%;
          height: 100%;
        }
        .mockup-sidebar {
          background: #080c14;
          border-right: 1px solid rgba(255,255,255,0.03);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mockup-sidebar-item {
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          width: 100%;
        }
        .mockup-sidebar-item.active {
          background: rgba(99, 102, 241, 0.15);
        }
        .mockup-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }
        .mockup-body-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mockup-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.25rem;
        }
        .mockup-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Features Section */
        .section-features {
          padding: 8rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .section-subtitle {
          color: #94a3b8;
          max-width: 580px;
          margin: 0 auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .feature-card {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 2rem 1.5rem;
          border-radius: 14px;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
          background: rgba(15, 23, 42, 0.5);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }
        .feature-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-card:hover .feature-icon-wrapper {
          background: var(--primary-500);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }
        .feature-title {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 700;
        }
        .feature-desc {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        /* Pricing Section */
        .section-pricing {
          padding: 8rem 4rem;
          background: #060910;
          position: relative;
        }
        .billing-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 4rem;
        }
        .billing-label {
          font-weight: 500;
          font-size: 0.9375rem;
          color: #94a3b8;
        }
        .billing-label.active {
          color: #ffffff;
          font-weight: 600;
        }
        .toggle-switch {
          width: 48px;
          height: 26px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-switch.yearly {
          background: var(--primary-600);
        }
        .toggle-knob {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .toggle-switch.yearly .toggle-knob {
          left: 25px;
        }
        .yearly-badge {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          padding: 0.25rem 0.5rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1050px;
          margin: 0 auto;
        }
        .pricing-card {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 3rem 2.25rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.25s;
        }
        .pricing-card.popular {
          border-color: var(--primary-500);
          background: rgba(15, 23, 42, 0.6);
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.08);
        }
        .pricing-popular-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: var(--primary-500);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .pricing-card.popular:hover {
          border-color: var(--primary-400);
        }
        .pricing-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .pricing-desc {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 2rem;
          min-height: 40px;
        }
        .pricing-price-box {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 2rem;
        }
        .pricing-currency {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .pricing-price {
          font-size: 3rem;
          font-weight: 800;
        }
        .pricing-period {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .pricing-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 2.5rem;
        }
        .btn-pricing-outline {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .btn-pricing-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #ffffff;
        }
        .btn-pricing-solid {
          background: var(--primary-600);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
        }
        .btn-pricing-solid:hover {
          background: var(--primary-500);
        }
        .pricing-features-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .pricing-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: #cbd5e1;
        }
        .pricing-check-icon {
          color: #22c55e;
          flex-shrink: 0;
        }

        /* About Section */
        .section-about {
          padding: 8rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .about-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .about-desc {
          color: #94a3b8;
          font-size: 1.0625rem;
          line-height: 1.7;
        }
        .about-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }
        .about-stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .about-stat-num {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary-400);
        }
        .about-stat-label {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .about-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .about-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(99, 102, 241, 0.15);
          filter: blur(80px);
          border-radius: 50%;
          z-index: 1;
        }
        .about-visual-card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 2;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* Contact Section */
        .section-contact {
          padding: 8rem 4rem;
          background: #060910;
        }
        .contact-container {
          max-width: 950px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 4rem;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px;
          padding: 3.5rem;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .contact-info-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .contact-info-desc {
          color: #94a3b8;
          font-size: 0.9375rem;
          line-height: 1.6;
        }
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .contact-method {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
          color: #cbd5e1;
        }
        .contact-method-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .contact-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .contact-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .contact-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .contact-input:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
        }
        .btn-submit {
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: #ffffff;
          border: none;
          padding: 0.875rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(99,102,241,0.25);
          transition: all 0.2s;
          margin-top: 0.5rem;
        }
        .btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(99,102,241,0.35);
        }

        /* Footer */
        .landing-footer {
          padding: 5rem 4rem 3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .footer-logo-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 320px;
        }
        .footer-tagline {
          color: #94a3b8;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 4rem;
        }
        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-links-title {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #cbd5e1;
        }
        .footer-link {
          color: #94a3b8;
          font-size: 0.875rem;
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-link:hover {
          color: #ffffff;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #64748b;
          font-size: 0.8125rem;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 450px;
          }
          .section-about {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }
          .about-stat-grid {
            justify-content: center;
          }
          .about-visual {
            order: -1;
          }
          .contact-container {
            grid-template-columns: 1fr;
            padding: 2.5rem;
          }
          .landing-nav {
            padding: 0 2rem;
          }
          .hero-title {
            font-size: 3rem;
          }
        }
        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .footer-top {
            flex-direction: column;
            gap: 3rem;
          }
          .hero-title {
            font-size: 2.25rem;
          }
        }
      `}</style>

      {/* Nav */}
      <header className="landing-nav">
        <div className="nav-logo" onClick={() => scrollToSection('hero')}>
          <div className="nav-logo-icon">
            <Briefcase size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="nav-logo-text">WorkFlow Hub</span>
        </div>
        <nav className="nav-links">
          <button className="nav-link" onClick={() => scrollToSection('features')}>Features</button>
          <button className="nav-link" onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button className="nav-link" onClick={() => scrollToSection('about')}>About</button>
          <button className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button>
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <button className="btn-nav-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button className="btn-nav-outline" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-nav-primary" onClick={() => navigate('/login?signup=true')}>Get Started</button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="hero-section">
        <div className="hero-badge">✨ Live Real-time SaaS Database</div>
        <h1 className="hero-title">
          Supercharge Your Enterprise Workforce Structure.
        </h1>
        <p className="hero-subtitle">
          A modern unified SaaS platform to run your entire company structure. Manage employees, tasks, group chats, documents, attendance records, and deep analytics.
        </p>
        <div className="hero-cta">
          <button className="btn-cta-primary" onClick={() => navigate('/login?signup=true')}>
            Start Free Account <ArrowRight size={18} />
          </button>
          <button className="btn-cta-secondary" onClick={() => scrollToSection('features')}>
            Explore Features
          </button>
        </div>

        {/* Live Mockup */}
        <div className="mockup-container">
          <div className="mockup-header">
            <div className="mockup-dot" style={{ background: '#ef4444' }} />
            <div className="mockup-dot" style={{ background: '#f59e0b' }} />
            <div className="mockup-dot" style={{ background: '#22c55e' }} />
            <span style={{ fontSize: '0.6875rem', color: '#64748b', marginLeft: '0.5rem', fontFamily: 'monospace' }}>app.workflowhub.com/dashboard</span>
          </div>
          <div className="mockup-content">
            <div className="mockup-preview-grid">
              <div className="mockup-sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--primary-500)' }} />
                  <div style={{ height: 10, width: 70, background: '#1e293b', borderRadius: 4 }} />
                </div>
                <div className="mockup-sidebar-item active" />
                <div className="mockup-sidebar-item" />
                <div className="mockup-sidebar-item" />
                <div className="mockup-sidebar-item" style={{ width: '80%' }} />
                <div className="mockup-sidebar-item" />
              </div>
              <div className="mockup-body">
                <div className="mockup-body-header">
                  <div>
                    <div style={{ height: 16, width: 140, background: '#1e293b', borderRadius: 4, marginBottom: '0.5rem' }} />
                    <div style={{ height: 10, width: 220, background: '#0f172a', borderRadius: 4 }} />
                  </div>
                  <div style={{ height: 32, width: 90, background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 8 }} />
                </div>
                <div className="mockup-card-grid">
                  <div className="mockup-card">
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)' }} />
                      <div style={{ height: 8, width: 60, background: '#1e293b', borderRadius: 4 }} />
                    </div>
                    <div style={{ height: 24, width: 40, background: '#fff', borderRadius: 4 }} />
                    <div style={{ height: 8, width: '100%', background: '#0f172a', borderRadius: 4 }} />
                  </div>
                  <div className="mockup-card" style={{ borderLeft: '3px solid var(--primary-500)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)' }} />
                      <div style={{ height: 8, width: 70, background: '#1e293b', borderRadius: 4 }} />
                    </div>
                    <div style={{ height: 24, width: 50, background: '#fff', borderRadius: 4 }} />
                    <div style={{ height: 8, width: '90%', background: '#0f172a', borderRadius: 4 }} />
                  </div>
                  <div className="mockup-card">
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)' }} />
                      <div style={{ height: 8, width: 55, background: '#1e293b', borderRadius: 4 }} />
                    </div>
                    <div style={{ height: 24, width: 35, background: '#fff', borderRadius: 4 }} />
                    <div style={{ height: 8, width: '80%', background: '#0f172a', borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', height: 110 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }} />
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-features">
        <div className="section-header">
          <h2 className="section-title">Core Operations Modules</h2>
          <p className="section-subtitle">
            Say goodbye to fragmented SaaS apps. WorkFlow Hub bundles all enterprise tools into a unified product.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon-wrapper">
                <f.icon size={20} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-pricing">
        <div className="section-header">
          <h2 className="section-title">Flexible SaaS Pricing Plans</h2>
          <p className="section-subtitle">
            Choose the right subscription for your business. Grow smoothly with no hidden fees.
          </p>
        </div>

        {/* Toggle */}
        <div className="billing-toggle">
          <span className={`billing-label ${billingPeriod === 'monthly' ? 'active' : ''}`}>Monthly</span>
          <div 
            className={`toggle-switch ${billingPeriod === 'yearly' ? 'yearly' : ''}`}
            onClick={() => setBillingPeriod(bp => bp === 'monthly' ? 'yearly' : 'monthly')}
          >
            <div className="toggle-knob" />
          </div>
          <span className={`billing-label ${billingPeriod === 'yearly' ? 'active' : ''}`}>Yearly</span>
          <span className="yearly-badge">Save 20%</span>
        </div>

        {/* Grid */}
        <div className="pricing-grid">
          {/* Tier 1 */}
          <div className="pricing-card">
            <h3 className="pricing-title">Starter</h3>
            <p className="pricing-desc">Perfect for small teams and startups testing the waters.</p>
            <div className="pricing-price-box">
              <span className="pricing-currency">$</span>
              <span className="pricing-price">0</span>
              <span className="pricing-period">/forever</span>
            </div>
            <button className="pricing-btn btn-pricing-outline" onClick={() => navigate('/login?signup=true')}>
              Get Started Free
            </button>
            <ul className="pricing-features-list">
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Up to 5 employees</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Simple Task Kanban</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Public Announcements</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> basic Attendance clock</li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="pricing-card popular">
            <div className="pricing-popular-badge">Most Popular</div>
            <h3 className="pricing-title">Business</h3>
            <p className="pricing-desc">Fully featured tools for growing organizations & agencies.</p>
            <div className="pricing-price-box">
              <span className="pricing-currency">$</span>
              <span className="pricing-price">{billingPeriod === 'monthly' ? '12' : '9'}</span>
              <span className="pricing-period">/user /mo</span>
            </div>
            <button className="pricing-btn btn-pricing-solid" onClick={() => navigate('/login?signup=true')}>
              Start Business Trial
            </button>
            <ul className="pricing-features-list">
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Unlimited employees & teams</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Complete Task review workflows</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Real-time Group Chats</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Leave tracking & balances</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Performance goals & KPIs</li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className="pricing-card">
            <h3 className="pricing-title">Enterprise</h3>
            <p className="pricing-desc">Dedicated features, compliance, and custom infrastructure.</p>
            <div className="pricing-price-box">
              <span className="pricing-price">Custom</span>
            </div>
            <button className="pricing-btn btn-pricing-outline" onClick={() => scrollToSection('contact')}>
              Contact Sales
            </button>
            <ul className="pricing-features-list">
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Custom RLS Policies</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> Dedicated database cluster</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> SAML / SSO Integration</li>
              <li className="pricing-feature-item"><Check size={14} className="pricing-check-icon" /> 24/7 Priority SLA support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-about">
        <div className="about-content">
          <div className="hero-badge" style={{ alignSelf: 'flex-start' }}>WHO WE ARE</div>
          <h2 className="about-title">Scale with Structure, Integrity, and Security.</h2>
          <p className="about-desc">
            WorkFlow Hub was built to handle organizational shifts cleanly. From small startups to multinational enterprises, we provide role-based permissions (RBAC) and data isolation so your information remains encrypted, safe, and easily auditable.
          </p>
          <div className="about-stat-grid">
            <div className="about-stat">
              <span className="about-stat-num">99.9%</span>
              <span className="about-stat-label">SLA Uptime Guarantee</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-num">256-bit</span>
              <span className="about-stat-label">AES Data Encryption</span>
            </div>
          </div>
        </div>
        <div className="about-visual">
          <div className="about-glow" />
          <div className="about-visual-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Shield size={24} color="var(--primary-400)" />
                <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>Security Framework</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Each tenant's data resides behind custom security rules. Rest assured that sensitive files, private logs, and personal feedback are completely safe.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['RBAC Security', 'PostgreSQL RLS', 'SSO Ready', 'Audit Logs'].map(t => (
                  <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.625rem', borderRadius: 4, fontSize: '0.75rem', color: '#cbd5e1' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-contact">
        <div className="contact-container">
          <div className="contact-info">
            <h2 className="contact-info-title">Talk to our Team</h2>
            <p className="contact-info-desc">
              Have questions about integrations, security settings, or custom pricing tiers? Send us a message and our team will get right back to you.
            </p>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-method-icon"><Mail size={16} /></div>
                <span>support@workflowhub.com</span>
              </div>
              <div className="contact-method">
                <div className="contact-method-icon"><Phone size={16} /></div>
                <span>+1 (800) 555-0199</span>
              </div>
              <div className="contact-method">
                <div className="contact-method-icon"><Globe size={16} /></div>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="contact-input-group">
              <label className="contact-label">Your Name</label>
              <input 
                type="text" 
                className="contact-input" 
                placeholder="John Doe"
                value={contactForm.name}
                onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="contact-input-group">
              <label className="contact-label">Email Address</label>
              <input 
                type="email" 
                className="contact-input" 
                placeholder="john@company.com"
                value={contactForm.email}
                onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="contact-input-group">
              <label className="contact-label">Message</label>
              <textarea 
                className="contact-input" 
                rows={4} 
                placeholder="Tell us what you are looking for..."
                value={contactForm.message}
                onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={15} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-logo-box">
            <div className="nav-logo">
              <div className="nav-logo-icon">
                <Briefcase size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="nav-logo-text">WorkFlow Hub</span>
            </div>
            <p className="footer-tagline">
              Modern enterprise workforce cooperation, task planning, and messaging.
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <span className="footer-links-title">Product</span>
              <button className="footer-link" style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }} onClick={() => scrollToSection('features')}>Features</button>
              <button className="footer-link" style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }} onClick={() => scrollToSection('pricing')}>Pricing</button>
            </div>
            <div className="footer-links-col">
              <span className="footer-links-title">Company</span>
              <button className="footer-link" style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }} onClick={() => scrollToSection('about')}>About Us</button>
              <button className="footer-link" style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }} onClick={() => scrollToSection('contact')}>Contact</button>
            </div>
            <div className="footer-links-col">
              <span className="footer-links-title">Security</span>
              <a href="#about" className="footer-link">RLS Rules</a>
              <a href="#about" className="footer-link">Encryptions</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} WorkFlow Hub Inc. All rights reserved.</span>
          <span>Made for modern organizations.</span>
        </div>
      </footer>
    </div>
  );
}
