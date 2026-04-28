'use client';

import React, { useState, useEffect, useRef } from 'react';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '254700000000'; // Update with real number
const EMAIL_ADDRESS   = 'info@climotravels.com';
const PHONE_NUMBER    = '+254 700 000 000';

// ─── FLEET DATA ──────────────────────────────────────────────────────────────
// Each vehicle has an `images` array for the slideshow (3 images per vehicle).
// Update these paths to match your actual filenames in /public/images/
const vehicles = [
  {
    id: 1, name: 'Toyota RAV4', category: 'SUV', passengers: 5, bags: 3, transmission: 'Auto',
    badge: '#E87722',
    images: ['/images/rav4.jpg', '/images/rav4-2.jpg', '/images/rav4-3.jpg'],
  },
  {
    id: 2, name: 'Toyota Camry', category: 'Sedan', passengers: 5, bags: 2, transmission: 'Auto',
    badge: '#1A3C6E',
    images: ['/images/camry.jpg', '/images/camry-2.jpg', '/images/camry-3.jpg'],
  },
  {
    id: 3, name: 'Toyota Hiace', category: 'Van', passengers: 14, bags: 8, transmission: 'Manual',
    badge: '#2E7D32',
    images: ['/images/hiace.jpg', '/images/hiace-2.jpg', '/images/hiace-3.jpg'],
  },
  {
    id: 4, name: 'Land Cruiser V8', category: 'Safari Vehicle', passengers: 7, bags: 5, transmission: 'Auto',
    badge: '#7B341E',
    images: ['/images/landcruiser.jpg', '/images/landcruiser-2.jpg', '/images/landcruiser-3.jpg'],
  },
  {
    id: 5, name: 'Toyota Alphard', category: 'Minivan', passengers: 7, bags: 4, transmission: 'Auto',
    badge: '#5B21B6',
    images: ['/images/alphard.jpg', '/images/alphard-2.jpg', '/images/alphard-3.jpg'],
  },
  {
    id: 6, name: 'Toyota Prado', category: 'SUV', passengers: 7, bags: 4, transmission: 'Auto',
    badge: '#E87722',
    images: ['/images/prado.jpg', '/images/prado-2.jpg', '/images/prado-3.jpg'],
  },
];

const CAR_TYPE_OPTIONS = [
  '5-Seater Hatchback / Salon / Sedan Car',
  '5-Seater Mini SUV / Crossover',
  '5-Seater Full Size SUV (eg Prado / V8 Range Rover)',
  '7-Seater Mini Van (eg Voxy / Alphard)',
  '7-Seater Land Cruiser Safari Van',
  '8-Seater Tour Van (eg Hiace)',
  '14-Seater Toyota Hiace Van',
  '22-Seater Coaster Bus',
  '33-Seater Bus (Isuzu / Mercedes)',
  '40 / 44 / 50 Seater Bus',
  'Vintage Car',
  'Other',
];

const EVENT_TYPES   = ['Airport Transfer', 'Corporate Transfer', 'Wedding', 'Safari', 'School Trip', 'Other'];
const REFERRAL_OPTS = ['Google Search', 'Social Media', 'Friend / Referral', 'Walk-in', 'Other'];

// ─── INLINE STYLES ───────────────────────────────────────────────────────────
const S = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    color: '#111827',
    background: '#F8F7F4',
    overflowX: 'hidden',
    minHeight: '100vh',
  },

  // NAV
  nav: (scrolled) => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    height: '72px', display: 'flex', alignItems: 'center',
    padding: '0 48px',
    background: scrolled ? 'rgba(13,27,42,0.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    boxShadow: scrolled ? '0 2px 32px rgba(0,0,0,0.25)' : 'none',
    transition: 'background 0.4s ease, box-shadow 0.4s ease',
  }),
  navInner: {
    width: '100%', maxWidth: '1400px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  // ── LOGO IMAGE (replaces text logo) ──
  logoImg: {
    height: '56px',
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '8px',
  },
  // Fallback text logo (shown if image fails)
  logoText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem',
    color: '#fff', letterSpacing: '0.05em',
  },
  logoSub: { fontSize: '0.65rem', color: '#E87722', letterSpacing: '0.12em', marginTop: '-2px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '40px' },
  navLink: (active) => ({
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 500,
    color: active ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none',
    borderBottom: active ? '2px solid #E87722' : '2px solid transparent',
    paddingBottom: '2px', transition: 'color 0.3s, border-color 0.3s',
  }),

  // HERO
  hero: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center', overflow: 'hidden',
  },
  heroBgGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E42 45%, #8B3D0A 80%, #E87722 100%)',
    zIndex: 0,
  },
  heroBgImage: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', opacity: 0.35, zIndex: 1,
  },
  heroOverlay: {
    position: 'absolute', inset: 0, zIndex: 2,
    background: 'linear-gradient(105deg, rgba(13,27,42,0.85) 0%, rgba(13,27,42,0.6) 45%, rgba(232,119,34,0.12) 80%, rgba(13,27,42,0.4) 100%)',
  },
  heroContent: (visible) => ({
    position: 'relative', zIndex: 3,
    padding: '0 48px', paddingTop: '72px',
    maxWidth: '760px', marginLeft: 'max(48px, calc((100vw - 1400px) / 2))',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
  }),
  heroPretitle: {
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600,
    letterSpacing: '0.2em', color: '#E87722', textTransform: 'uppercase',
    marginBottom: '18px', display: 'block',
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
    fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: '22px',
  },
  heroAccent: { color: '#E87722' },
  heroSubtitle: {
    fontSize: '1.05rem', fontWeight: 400, color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.75, marginBottom: '40px',
  },
  heroCta: {
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    background: '#E87722', color: '#fff', border: 'none',
    borderRadius: '56px', padding: '16px 36px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 8px 32px rgba(232,119,34,0.4)',
    transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
  },
  scrollDotWrap: {
    position: 'absolute', bottom: '32px', left: '50%',
    transform: 'translateX(-50%)', zIndex: 3,
  },
  scrollDot: {
    width: '28px', height: '44px',
    border: '2px solid rgba(255,255,255,0.35)',
    borderRadius: '20px', position: 'relative',
  },

  // FLEET SECTION
  fleet: { padding: '100px 48px', maxWidth: '1400px', margin: '0 auto' },
  fleetHeader: { textAlign: 'center', marginBottom: '60px' },
  sectionPretitle: {
    display: 'inline-block', fontSize: '0.78rem', fontWeight: 700,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: '#E87722', marginBottom: '12px',
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 800, color: '#111827', marginBottom: '12px',
  },
  sectionSubtitle: { fontSize: '1.02rem', color: '#6B7280', fontWeight: 400 },
  divider: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '22px' },
  dividerBar: (w, o) => ({
    display: 'block', height: '3px', borderRadius: '2px',
    background: '#E87722', width: w, opacity: o,
  }),
  fleetGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px',
  },

  // CARD
  card: (hovered, visible, delay) => ({
    background: '#fff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.14)' : '0 4px 24px rgba(0,0,0,0.07)',
    transform: hovered ? 'translateY(-8px)' : (visible ? 'translateY(0)' : 'translateY(40px)'),
    opacity: visible ? 1 : 0,
    transition: `transform 0.45s ease ${delay}s, box-shadow 0.45s ease, opacity 0.55s ease ${delay}s`,
    cursor: 'pointer',
  }),
  // ── SLIDESHOW WRAPPER ──
  slideshowWrap: {
    position: 'relative', height: '220px', overflow: 'hidden', background: '#f0eeeb',
  },
  slideImg: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%', objectFit: 'cover',
    transition: 'opacity 0.55s ease, transform 0.55s ease',
  },
  slideshowPlaceholder: {
    width: '100%', height: '100%', display: 'flex',
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#f0eeeb,#e0ddd8)',
  },
  // Prev / Next arrows
  slideArrow: (side) => ({
    position: 'absolute', top: '50%',
    [side]: '10px',
    transform: 'translateY(-50%)',
    zIndex: 5,
    background: 'rgba(0,0,0,0.38)',
    border: 'none',
    color: '#fff',
    width: '28px', height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem',
    transition: 'background 0.2s',
    lineHeight: 1,
    padding: 0,
  }),
  // Dot indicators
  slideDots: {
    position: 'absolute', bottom: '8px', left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex', gap: '5px', zIndex: 5,
  },
  slideDot: (active) => ({
    width: active ? '18px' : '6px', height: '6px',
    borderRadius: '3px',
    background: active ? '#E87722' : 'rgba(255,255,255,0.6)',
    transition: 'width 0.3s, background 0.3s',
    cursor: 'pointer',
    border: 'none',
    padding: 0,
  }),
  badge: (color) => ({
    position: 'absolute', top: '14px', right: '14px', zIndex: 4,
    background: color, color: '#fff',
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
    textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px',
  }),
  cardBody: { padding: '22px 24px 24px' },
  cardTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: '1.18rem',
    fontWeight: 700, color: '#111827', marginBottom: '12px',
  },
  specs: { display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' },
  spec: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: '#6B7280', fontWeight: 500 },
  actions: { display: 'flex', gap: '8px' },
  btn: (bg, shadow) => ({
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '5px', padding: '10px 0', borderRadius: '10px',
    fontSize: '0.81rem', fontWeight: 600, textDecoration: 'none',
    color: '#fff', background: bg, border: 'none', cursor: 'pointer',
    boxShadow: shadow, transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
    whiteSpace: 'nowrap',
  }),

  // QUOTE SECTION
  quoteSection: {
    position: 'relative', padding: '100px 48px', overflow: 'hidden',
    background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E42 55%, #7B3010 100%)',
  },
  quoteInner: { position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' },
  quoteHeader: { textAlign: 'center', marginBottom: '48px' },
  quoteTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
    fontWeight: 800, color: '#fff', marginBottom: '14px', lineHeight: 1.3,
  },
  quoteDesc: { fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', fontWeight: 400 },

  // FORM
  formWrap: {
    background: '#fff', borderRadius: '20px',
    padding: '48px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
  },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' },
  label: { fontSize: '0.87rem', fontWeight: 600, color: '#0D1B2A', letterSpacing: '0.01em' },
  input: (err) => ({
    border: `1.5px solid ${err ? '#EF4444' : '#E5E7EB'}`, borderRadius: '10px',
    padding: '12px 16px', fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.95rem', color: '#111827', background: '#FAFAFA',
    outline: 'none', width: '100%',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  }),
  checkboxGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px',
    padding: '16px', background: '#FAFAFA',
    border: '1.5px solid #E5E7EB', borderRadius: '10px',
  },
  checkboxLabel: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    fontSize: '0.86rem', color: '#374151', cursor: 'pointer', lineHeight: 1.4,
  },
  submitBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '12px', padding: '17px',
    background: 'linear-gradient(135deg, #E87722, #C4621A)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 6px 24px rgba(232,119,34,0.35)',
    transition: 'transform 0.25s, box-shadow 0.25s',
    letterSpacing: '0.02em',
  },

  // SUCCESS
  successWrap: {
    background: '#fff', borderRadius: '20px',
    padding: '80px 48px', textAlign: 'center',
    boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
  },
  successIcon: {
    width: '72px', height: '72px', background: 'linear-gradient(135deg, #10B981, #059669)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', color: '#fff', margin: '0 auto 24px',
    boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
  },
  successTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' },
  successText: { fontSize: '1rem', color: '#6B7280' },

  // REVIEWS
  reviews: {
    padding: '100px 48px', textAlign: 'center',
    background: 'linear-gradient(135deg, #0D1B2A 0%, #243B55 100%)',
  },
  reviewsTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    fontWeight: 800, color: '#fff', marginBottom: '14px',
  },
  reviewsSubtitle: {
    fontSize: '0.98rem', color: 'rgba(255,255,255,0.58)',
    maxWidth: '560px', margin: '0 auto 56px', lineHeight: 1.7,
  },
  reviewCards: { display: 'flex', justifyContent: 'center', gap: '32px', maxWidth: '900px', margin: '0 auto' },
  reviewCard: (hovered) => ({
    flex: 1, maxWidth: '400px', background: '#fff', borderRadius: '16px',
    padding: '40px 32px', textDecoration: 'none', color: '#111827',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
    boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.22)' : '0 4px 24px rgba(0,0,0,0.08)',
    transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
    transition: 'transform 0.35s, box-shadow 0.35s',
    cursor: 'pointer',
  }),
  reviewIcon: (bg) => ({
    width: '64px', height: '64px', borderRadius: '16px',
    background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif",
  }),
  reviewTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700 },
  stars: (c) => ({ fontSize: '1.3rem', color: c, letterSpacing: '3px' }),
  reviewText: { fontSize: '0.87rem', color: '#6B7280', textAlign: 'center', lineHeight: 1.6 },
  reviewBtn: (bg) => ({
    display: 'inline-block', marginTop: '8px', padding: '12px 24px',
    background: bg, color: '#fff', borderRadius: '8px',
    fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
    border: 'none', textDecoration: 'none', transition: 'opacity 0.2s',
  }),

  // FOOTER
  footer: { background: '#060E17', padding: '60px 48px 0' },
  footerInner: {
    maxWidth: '1400px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px',
    paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  footerH4: {
    fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700,
    color: '#E87722', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px',
  },
  footerBrandText: { fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLink: { fontSize: '0.87rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.25s' },
  footerBottom: {
    maxWidth: '1400px', margin: '0 auto',
    padding: '20px 0', textAlign: 'center',
    fontSize: '0.8rem', color: 'rgba(255,255,255,0.22)',
  },
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconUsers = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconBag   = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconGear  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 1 21 12a10 10 0 0 1-1.93 5.07M12 2a10 10 0 0 1 7.07 2.93M12 22a10 10 0 0 1-7.07-2.93M4.93 19.07A10 10 0 0 1 2 12a10 10 0 0 1 1.93-5.07"/></svg>;
const IconArrow = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconWA    = () => <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconEmail = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconCar   = () => <svg width="52" height="52" fill="none" stroke="#bbb" strokeWidth="1.5" viewBox="0 0 64 64"><path d="M12 40 L20 24 L44 24 L52 40 Z"/><circle cx="20" cy="43" r="5"/><circle cx="44" cy="43" r="5"/><rect x="8" y="36" width="48" height="9" rx="2"/></svg>;

// ─── IMAGE SLIDESHOW ──────────────────────────────────────────────────────────
const ImageSlideshow = ({ images, vehicleName, badge, badgeColor, hovered }) => {
  const [current,    setCurrent]    = useState(0);
  const [failedSet,  setFailedSet]  = useState(new Set());
  const timerRef = useRef(null);

  // Auto-advance every 3 s while card is hovered; pause when not
  useEffect(() => {
    if (hovered) {
      timerRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % images.length);
      }, 2800);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [hovered, images.length]);

  const go = (dir, e) => {
    e.stopPropagation();
    setCurrent(c => (c + dir + images.length) % images.length);
  };

  const allFailed = images.every((_, i) => failedSet.has(i));

  return (
    <div style={S.slideshowWrap}>
      {/* Category badge */}
      <span style={S.badge(badgeColor)}>{badge}</span>

      {allFailed ? (
        <div style={S.slideshowPlaceholder}>
          <IconCar />
          <span style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '8px' }}>{vehicleName}</span>
        </div>
      ) : (
        <>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${vehicleName} - view ${i + 1}`}
              style={{
                ...S.slideImg,
                opacity: i === current && !failedSet.has(i) ? 1 : 0,
                transform: i === current ? (hovered ? 'scale(1.06)' : 'scale(1)') : 'scale(1)',
                zIndex: i === current ? 2 : 1,
              }}
              onError={() => setFailedSet(prev => new Set([...prev, i]))}
            />
          ))}

          {/* Prev / Next arrows — only visible on hover */}
          {hovered && (
            <>
              <button style={S.slideArrow('left')}  onClick={e => go(-1, e)} aria-label="Previous image">‹</button>
              <button style={S.slideArrow('right')} onClick={e => go(+1, e)} aria-label="Next image">›</button>
            </>
          )}

          {/* Dot indicators */}
          <div style={S.slideDots}>
            {images.map((_, i) => (
              <button
                key={i}
                style={S.slideDot(i === current)}
                onClick={e => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── VEHICLE CARD ─────────────────────────────────────────────────────────────
const VehicleCard = ({ vehicle, index }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [btnHover, setBtnHover] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const delay = index * 0.1;

  const btnStyles = [
    { bg: '#25D366', bgH: '#1daa52', shadow: '0 4px 12px rgba(37,211,102,0.25)', label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'd like to hire the ${vehicle.name}`, Icon: IconWA },
    { bg: '#1E40AF', bgH: '#1730a3', shadow: '0 4px 12px rgba(30,64,175,0.2)',   label: 'Email',    href: `mailto:${EMAIL_ADDRESS}?subject=Car Hire Inquiry - ${vehicle.name}`,                  Icon: IconEmail },
    { bg: '#E87722', bgH: '#C4621A', shadow: '0 4px 12px rgba(232,119,34,0.25)', label: 'Call',     href: `tel:${PHONE_NUMBER}`,                                                                   Icon: IconPhone },
  ];

  return (
    <div
      ref={ref}
      style={S.card(hovered, visible, delay)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Slideshow */}
      <ImageSlideshow
        images={vehicle.images}
        vehicleName={vehicle.name}
        badge={vehicle.category}
        badgeColor={vehicle.badge}
        hovered={hovered}
      />

      {/* Body */}
      <div style={S.cardBody}>
        <h3 style={S.cardTitle}>{vehicle.name}</h3>
        <div style={S.specs}>
          <span style={S.spec}><IconUsers /> {vehicle.passengers} Passengers</span>
          <span style={S.spec}><IconBag />   {vehicle.bags} Bags</span>
          <span style={S.spec}><IconGear />  {vehicle.transmission}</span>
        </div>
        <div style={S.actions}>
          {btnStyles.map((b, i) => (
            <a
              key={b.label}
              href={b.href}
              target={b.label === 'WhatsApp' ? '_blank' : undefined}
              rel={b.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
              style={{
                ...S.btn(b.bg, b.shadow),
                background: btnHover === i ? b.bgH : b.bg,
                transform: btnHover === i ? 'translateY(-2px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setBtnHover(i)}
              onMouseLeave={() => setBtnHover(null)}
            >
              <b.Icon /> {b.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};



// ─── QUOTE FORM ───────────────────────────────────────────────────────────────
const QuoteForm = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    business: '', dateTravel: '', dateReturn: '',
    carTypes: [], eventType: '', pickup: '', destination: '',
    days: '', travellers: '', itinerary: '', instructions: '', budget: '',
    referral: '', agreed: false,
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hovering,  setHovering]  = useState(false);
  const [focusField, setFocus]    = useState(null);

  const set      = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleCar = v => setForm(f => ({
    ...f,
    carTypes: f.carTypes.includes(v) ? f.carTypes.filter(c => c !== v) : [...f.carTypes, v],
  }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())       e.firstName   = true;
    if (!form.lastName.trim())        e.lastName    = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.phone.trim())           e.phone       = true;
    if (!form.dateTravel)             e.dateTravel  = true;
    if (!form.dateReturn)             e.dateReturn  = true;
    if (!form.pickup.trim())          e.pickup      = true;
    if (!form.destination.trim())     e.destination = true;
    if (!form.agreed)                 e.agreed      = true;
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const inputStyle = (field) => ({
    ...S.input(errors[field]),
    boxShadow: focusField === field ? '0 0 0 3px rgba(232,119,34,0.13)' : 'none',
    borderColor: errors[field] ? '#EF4444' : focusField === field ? '#E87722' : '#E5E7EB',
  });

  const Field = ({ label, field, type = 'text', placeholder, half }) => (
    <div style={half ? {} : S.formGroup}>
      <label style={{ ...S.label, color: errors[field] ? '#EF4444' : '#0D1B2A' }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        onFocus={() => setFocus(field)}
        onBlur={() => setFocus(null)}
        placeholder={placeholder}
        style={inputStyle(field)}
      />
    </div>
  );

  const SelectField = ({ label, field, options, placeholder }) => (
    <div style={S.formGroup}>
      <label style={S.label}>{label}</label>
      <select
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        onFocus={() => setFocus(field)}
        onBlur={() => setFocus(null)}
        style={{ ...inputStyle(field), background: '#FAFAFA' }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (submitted) return (
    <div style={S.successWrap}>
      <div style={S.successIcon}>✓</div>
      <h3 style={S.successTitle}>Request Submitted!</h3>
      <p style={S.successText}>Thank you! We'll get back to you with a quote as soon as possible.</p>
    </div>
  );

  return (
    <div style={S.formWrap}>
      <div style={S.formRow}>
        <Field label="First Name*" field="firstName" placeholder="John" half />
        <Field label="Last Name*"  field="lastName"  placeholder="Doe"  half />
      </div>
      <div style={S.formRow}>
        <Field label="Email*"        field="email" type="email" placeholder="john@example.com" half />
        <Field label="Phone Number*" field="phone" placeholder="+254 7XX XXX XXX" half />
      </div>
      <Field label="Business / Organization" field="business" placeholder="If not corporate, indicate it's for personal use" />
      <div style={S.formRow}>
        <Field label="Date of travel*"  field="dateTravel" type="date" half />
        <Field label="Date of return*"  field="dateReturn" type="date" half />
      </div>

      <div style={S.formGroup}>
        <label style={S.label}>Type of car to hire*</label>
        <div style={S.checkboxGrid}>
          {CAR_TYPE_OPTIONS.map(opt => (
            <label key={opt} style={S.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.carTypes.includes(opt)}
                onChange={() => toggleCar(opt)}
                style={{ accentColor: '#E87722', width: '16px', height: '16px', flexShrink: 0, marginTop: '2px' }}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <SelectField label="Type of event"     field="eventType"   options={EVENT_TYPES}   placeholder="Please Select" />
      <Field       label="Pick-up location*" field="pickup"      placeholder="Town, building, street address" />
      <Field       label="Destination*"      field="destination" placeholder="Town, Village, Government Institution. Share WhatsApp / Google pin if possible" />

      <div style={S.formRow}>
        <Field label="Number of days*"       field="days"       type="number" placeholder="e.g. 3" half />
        <Field label="Number of Travellers*" field="travellers" type="number" placeholder="e.g. 4" half />
      </div>

      <div style={S.formGroup}>
        <label style={S.label}>Proposed Travel Itinerary*</label>
        <textarea
          rows={4}
          value={form.itinerary}
          onChange={e => set('itinerary', e.target.value)}
          onFocus={() => setFocus('itinerary')}
          onBlur={() => setFocus(null)}
          placeholder="Indicate a detailed travel plan"
          style={{ ...inputStyle('itinerary'), resize: 'vertical', minHeight: '100px' }}
        />
      </div>

      <div style={S.formGroup}>
        <label style={S.label}>Your instructions and specifications</label>
        <textarea
          rows={3}
          value={form.instructions}
          onChange={e => set('instructions', e.target.value)}
          onFocus={() => setFocus('instructions')}
          onBlur={() => setFocus(null)}
          style={{ ...inputStyle('instructions'), resize: 'vertical' }}
        />
      </div>

      <Field label="Your budget" field="budget" placeholder="USD ($) or KES (/=)" />
      <SelectField label="How did you learn about us" field="referral" options={REFERRAL_OPTS} placeholder="Please Select" />

      <label style={{ ...S.checkboxLabel, marginBottom: '28px', alignItems: 'flex-start', gap: '12px' }}>
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={e => set('agreed', e.target.checked)}
          style={{ accentColor: '#E87722', width: '17px', height: '17px', flexShrink: 0, marginTop: '3px',
                   outline: errors.agreed ? '2px solid #EF4444' : 'none' }}
        />
        <span style={{ fontSize: '0.87rem', color: errors.agreed ? '#EF4444' : '#374151', lineHeight: 1.5 }}>
          By completing this form, you acknowledge and consent to the terms outlined in the{' '}
          <a href="/terms" style={{ color: '#E87722', textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</a>
          {' '}of Climo Travels &amp; Car Hire.*
        </span>
      </label>

      <button
        onClick={handleSubmit}
        style={{
          ...S.submitBtn,
          transform: hovering ? 'translateY(-2px)' : 'none',
          boxShadow: hovering ? '0 12px 36px rgba(232,119,34,0.45)' : '0 6px 24px rgba(232,119,34,0.35)',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        Submit Request <IconArrow />
      </button>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CarHirePage = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [heroHover,   setHeroHover]   = useState(false);
  const [rvHover,     setRvHover]     = useState(null);
  const fleetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollToFleet = () => fleetRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F7F4; }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          70%       { transform: translateX(-50%) translateY(18px); opacity: 0; }
        }
        @keyframes underlineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .hero-accent-line {
          display: block; height: 4px; background: #E87722;
          border-radius: 2px; margin-top: 4px;
          transform-origin: left;
          animation: underlineGrow 0.6s 1.1s ease forwards;
          transform: scaleX(0);
        }
        .scroll-dot-inner {
          position: absolute; top: 6px; left: 50%;
          transform: translateX(-50%);
          width: 6px; height: 6px;
          background: #E87722; border-radius: 50%;
          animation: scrollBounce 1.8s ease infinite;
        }
        input:focus, select:focus, textarea:focus { outline: none; }
        a { color: inherit; }
        @media (max-width: 900px) {
          .fleet-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .fleet-grid    { grid-template-columns: 1fr !important; }
          .review-cards  { flex-direction: column !important; align-items: center !important; }
          .review-card   { max-width: 100% !important; width: 100% !important; }
          .form-row      { grid-template-columns: 1fr !important; }
          .checkbox-grid { grid-template-columns: 1fr !important; }
          .footer-grid   { grid-template-columns: 1fr !important; }
          .nav-wrap      { padding: 0 20px !important; }
          .hero-content  { padding: 0 20px !important; padding-top: 72px !important; margin-left: 0 !important; }
          .section-wrap  { padding: 60px 20px !important; }
        }
      `}</style>

      <div style={S.page}>

        {/* ── NAV ── */}
        <nav className="nav-wrap" style={S.nav(scrolled)}>
          <div style={S.navInner}>
            {/* ── LOGO IMAGE ── */}
            <img
              src="/logos/climologo2.png"
              alt="Climo Travels & Car Hire"
              style={{ height: '56px', width: 'auto', objectFit: 'contain', display: 'block' }}
            />

            {/* Links */}
            <div style={S.navLinks}>
              <a href="#" style={S.navLink(true)}>Car Hire</a>
              <a href="/safaris" style={S.navLink(false)}
                 onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.borderBottomColor='#E87722'; }}
                 onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.7)'; e.target.style.borderBottomColor='transparent'; }}>
                Safaris &amp; Tours
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={S.hero}>
          <div style={S.heroBgGradient} />
          <img
            src="/images/climohero.jpg"
            alt=""
            style={S.heroBgImage}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div style={S.heroOverlay} />

          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', zIndex: 2, pointerEvents: 'none',
              left: `${8 + i * 9}%`, bottom: '-10px',
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              background: 'rgba(232,119,34,0.55)', borderRadius: '50%',
              animation: `particleFloat ${4 + i * 0.5}s ${i * 0.6}s linear infinite`,
            }} />
          ))}

          <div className="hero-content" style={S.heroContent(heroVisible)}>
            <span style={S.heroPretitle}>CLIMO TRAVELS &amp; CAR HIRE</span>
            <h1 style={S.heroTitle}>
              Premium Car Hire<br />
              <span style={S.heroAccent}>Services</span>
              <span className="hero-accent-line" />
            </h1>
            <p style={S.heroSubtitle}>
              Ride in Style, Arrive with a Smile. Choose from our wide range of<br />
              well-maintained vehicles for your journey.
            </p>
            <button
              style={{
                ...S.heroCta,
                background: heroHover ? '#C4621A' : '#E87722',
                transform: heroHover ? 'translateY(-3px)' : 'none',
                boxShadow: heroHover ? '0 16px 48px rgba(232,119,34,0.5)' : '0 8px 32px rgba(232,119,34,0.4)',
              }}
              onMouseEnter={() => setHeroHover(true)}
              onMouseLeave={() => setHeroHover(false)}
              onClick={scrollToFleet}
            >
              Browse Our Fleet <IconArrow />
            </button>
          </div>

          <div style={S.scrollDotWrap}>
            <div style={S.scrollDot}>
              <div className="scroll-dot-inner" />
            </div>
          </div>
        </section>

        {/* ── FLEET ── */}
        <section className="section-wrap" ref={fleetRef} style={S.fleet}>
          <div style={S.fleetHeader}>
            <span style={S.sectionPretitle}>What We Offer</span>
            <h2 style={S.sectionTitle}>Our Fleet</h2>
            <p style={S.sectionSubtitle}>Choose from our diverse range of vehicles to suit your needs</p>
            <div style={S.divider}>
              <span style={S.dividerBar('12px', 0.4)} />
              <span style={S.dividerBar('40px', 1)} />
              <span style={S.dividerBar('12px', 0.4)} />
            </div>
          </div>
          <div className="fleet-grid" style={S.fleetGrid}>
            {vehicles.map((v, i) => <VehicleCard key={v.id} vehicle={v} index={i} />)}
          </div>
        </section>

        {/* ── QUOTE FORM ── */}
        <section className="section-wrap" style={S.quoteSection}>
          <div style={S.quoteInner}>
            <div style={S.quoteHeader}>
              <span style={{ ...S.sectionPretitle, color: '#E87722' }}>Get In Touch</span>
              <h2 style={S.quoteTitle}>Fill the contact form and we'll revert ASAP with a quote</h2>
              <p style={S.quoteDesc}>By completing this form, you acknowledge and consent to the Terms &amp; Conditions of Climo Travels &amp; Car Hire.</p>
            </div>
            <QuoteForm />
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="section-wrap" style={S.reviews}>
          <h2 style={S.reviewsTitle}>Share Your Experience</h2>
          <p style={S.reviewsSubtitle}>We value your feedback! Help us serve you better by sharing your experience with CLIMO Travels &amp; Car Hire</p>
          <div className="review-cards" style={S.reviewCards}>
            {[
              { bg: '#4285F4', label: 'G', title: 'Google Reviews',     stars: '#F59E0B', starStr: '★★★★★', text: 'Share your experience on Google and help other travelers discover our services.',              btnBg: '#4285F4', btnLabel: 'Leave Google Review ↗',     href: 'https://g.page/r/your-google-link' },
              { bg: '#34E0A1', label: '⬤', title: 'TripAdvisor Reviews', stars: '#34E0A1', starStr: '★★★★★', text: 'Tell the TripAdvisor community about your journey with CLIMO Travels & Car Hire.', btnBg: '#F2A900', btnLabel: 'Leave TripAdvisor Review ↗', href: 'https://tripadvisor.com/your-link' },
            ].map((r, i) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="review-card"
                style={S.reviewCard(rvHover === i)}
                onMouseEnter={() => setRvHover(i)}
                onMouseLeave={() => setRvHover(null)}
              >
                <div style={S.reviewIcon(r.bg)}>{r.label}</div>
                <h3 style={S.reviewTitle}>{r.title}</h3>
                <div style={S.stars(r.stars)}>{r.starStr}</div>
                <p style={S.reviewText}>{r.text}</p>
                <span style={S.reviewBtn(r.btnBg)}>{r.btnLabel}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={S.footer}>
          <div className="footer-grid" style={S.footerInner}>
            <div>
              {/* Footer also uses the logo image */}
              <img
                src="/logos/climologo2.png"
                alt="Climo Travels"
                style={{ height: '56px', width: 'auto', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
              />
              <span style={{ ...S.logoText, fontSize: '1.3rem', display: 'none' }}>CLIMO</span>
              <p style={S.footerBrandText}>Ride in Style, Arrive with a Smile</p>
            </div>
            <div>
              <h4 style={S.footerH4}>Contact Us</h4>
              <div style={S.footerLinks}>
                <a href={`tel:${PHONE_NUMBER}`}     style={S.footerLink} onMouseEnter={e=>e.target.style.color='#E87722'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>📞 {PHONE_NUMBER}</a>
                <a href={`mailto:${EMAIL_ADDRESS}`} style={S.footerLink} onMouseEnter={e=>e.target.style.color='#E87722'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>{EMAIL_ADDRESS}</a>
                <span style={S.footerLink}>📍 Nairobi, Kenya</span>
              </div>
            </div>
            <div>
              <h4 style={S.footerH4}>Quick Links</h4>
              <div style={S.footerLinks}>
                <a href="#"        style={S.footerLink} onMouseEnter={e=>e.target.style.color='#E87722'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>Car Hire</a>
                <a href="/safaris" style={S.footerLink} onMouseEnter={e=>e.target.style.color='#E87722'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>Safaris &amp; Tours</a>
                <a href="/terms"   style={S.footerLink} onMouseEnter={e=>e.target.style.color='#E87722'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
          <div style={S.footerBottom}>
            <p>© 2026 CLIMO Travels &amp; Car Hire. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default CarHirePage;