'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '254723930123';
const EMAIL_ADDRESS   = 'info@climotravels.com';
const PHONE_NUMBER    = '+254 723 930 123';

// ─── SAFARI PACKAGES DATA ─────────────────────────────────────────────────────
// Each package now has an `images` array for the slideshow (3 images each).
// Update these paths to match your actual filenames in /public/images/safari/
const safariPackages = [
  {
    id: 1,
    name: 'Maasai Mara Safari',
    description: 'Experience the world-famous Great Migration and witness the Big Five in their natural habitat. An unforgettable wildlife adventure awaits.',
    duration: '3–7 Days',
    location: 'Maasai Mara, Kenya',
    groupSize: '2–15 People',
    images: ['/images/safari/maasai-mara-1.jpg', '/images/safari/maasai-mara-2.jpg', '/images/safari/maasai-mara-3.jpg'],
    accent: '#2E7D32',
  },
  {
    id: 2,
    name: 'Amboseli National Park',
    description: 'Enjoy breathtaking views of Mount Kilimanjaro while exploring the diverse wildlife and stunning landscapes of Amboseli.',
    duration: '2–4 Days',
    location: 'Amboseli, Kenya',
    groupSize: '2–12 People',
    images: ['/images/safari/amboseli-1.jpg', '/images/safari/amboseli-2.jpg', '/images/safari/amboseli-3.jpg'],
    accent: '#1A3C6E',
  },
  {
    id: 3,
    name: 'Tsavo East & West',
    description: "Discover Kenya's largest national park, home to the famous red elephants and diverse wildlife in pristine wilderness.",
    duration: '3–5 Days',
    location: 'Tsavo, Kenya',
    groupSize: '2–20 People',
    images: ['/images/safari/tsavo-1.jpg', '/images/safari/tsavo-2.jpg', '/images/safari/tsavo-3.jpg'],
    accent: '#E87722',
  },
  {
    id: 4,
    name: 'Lake Nakuru & Naivasha',
    description: 'Witness millions of flamingos at Lake Nakuru and enjoy boat rides, bird watching, and game drives at Lake Naivasha.',
    duration: '2–3 Days',
    location: 'Rift Valley, Kenya',
    groupSize: '2–15 People',
    images: ['/images/safari/nakuru-1.jpg', '/images/safari/nakuru-2.jpg', '/images/safari/nakuru-3.jpg'],
    accent: '#7B341E',
  },
  {
    id: 5,
    name: 'Samburu Game Reserve',
    description: 'Explore the unique wildlife of Northern Kenya, including the Samburu Special Five — species found nowhere else on earth.',
    duration: '3–5 Days',
    location: 'Samburu, Kenya',
    groupSize: '2–12 People',
    images: ['/images/safari/samburu-1.jpg', '/images/safari/samburu-2.jpg', '/images/safari/samburu-3.jpg'],
    accent: '#5B21B6',
  },
  {
    id: 6,
    name: 'Coastal Safari & Beach',
    description: "Combine wildlife adventure with relaxation on Kenya's beautiful beaches. The perfect blend of safari and seaside luxury.",
    duration: '5–10 Days',
    location: 'Mombasa & Surrounds',
    groupSize: '2–20 People',
    images: ['/images/safari/coastal-1.jpg', '/images/safari/coastal-2.jpg', '/images/safari/coastal-3.jpg'],
    accent: '#0E7490',
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
const EVENT_TYPES   = ['Safari / Game Drive', 'Beach Holiday', 'Airport Transfer', 'Corporate Transfer', 'Wedding', 'School Trip', 'Other'];
const REFERRAL_OPTS = ['Google Search', 'Social Media', 'Friend / Referral', 'Walk-in', 'Other'];

// ─── INLINE STYLES ────────────────────────────────────────────────────────────
const S = {
  page: { fontFamily: "'DM Sans', sans-serif", color: '#111827', background: '#F8F7F4', overflowX: 'hidden', minHeight: '100vh' },

  nav: (sc) => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    height: '96px', display: 'flex', alignItems: 'center', padding: '0 48px',
    background: sc ? 'rgba(13,27,42,0.96)' : 'transparent',
    backdropFilter: sc ? 'blur(20px)' : 'none',
    boxShadow: sc ? '0 2px 32px rgba(0,0,0,0.25)' : 'none',
    transition: 'background 0.4s ease, box-shadow 0.4s ease',
  }),
  navInner: { width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoText: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#fff', letterSpacing: '0.05em' },
  logoSub:  { fontSize: '0.65rem', color: '#E87722', letterSpacing: '0.12em', marginTop: '-2px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '40px' },
  navLink: (active) => ({
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 500,
    color: active ? '#fff' : 'rgba(255,255,255,0.7)', textDecoration: 'none',
    borderBottom: active ? '2px solid #E87722' : '2px solid transparent',
    paddingBottom: '2px', transition: 'color 0.3s, border-color 0.3s',
  }),

  hero: { position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0D1B2A 0%, #1B3A1A 50%, #4A2800 80%, #E87722 100%)', zIndex: 0 },
  heroBgImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38, zIndex: 1, objectPosition: 'center 30%' },
  heroOverlay: { position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(105deg, rgba(13,27,42,0.88) 0%, rgba(13,27,42,0.55) 45%, rgba(74,40,0,0.1) 80%, rgba(13,27,42,0.45) 100%)' },
  heroContent: (v) => ({
    position: 'relative', zIndex: 3, padding: '0 48px', paddingTop: '72px',
    maxWidth: '760px', marginLeft: 'max(48px, calc((100vw - 1400px) / 2))',
    opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(32px)',
    transition: 'opacity 0.9s ease, transform 0.9s ease',
  }),
  heroPretitle: { fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', color: '#E87722', textTransform: 'uppercase', marginBottom: '18px', display: 'block' },
  heroTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.6rem, 6vw, 4.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: '22px' },
  heroAccent: { color: '#E87722' },
  heroSubtitle: { fontSize: '1.05rem', fontWeight: 400, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '40px' },
  heroCta: (h) => ({
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    background: h ? '#C4621A' : '#E87722', color: '#fff', border: 'none',
    borderRadius: '56px', padding: '16px 36px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
    boxShadow: h ? '0 16px 48px rgba(232,119,34,0.5)' : '0 8px 32px rgba(232,119,34,0.4)',
    transform: h ? 'translateY(-3px)' : 'none', transition: 'all 0.3s ease',
  }),
  scrollDotWrap: { position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 },
  scrollDot: { width: '28px', height: '44px', border: '2px solid rgba(255,255,255,0.35)', borderRadius: '20px', position: 'relative' },

  // PACKAGES SECTION
  packages: { padding: '100px 48px', maxWidth: '1400px', margin: '0 auto' },
  sectionHeader: { textAlign: 'center', marginBottom: '60px' },
  pretitle: { display: 'inline-block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#E87722', marginBottom: '12px' },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#111827', marginBottom: '12px' },
  sectionSub: { fontSize: '1.02rem', color: '#6B7280', fontWeight: 400 },
  divider: { display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '22px' },
  divBar: (w, o) => ({ display: 'block', height: '3px', borderRadius: '2px', background: '#E87722', width: w, opacity: o }),
  packagesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' },

  // CARD
  card: (h, v, d) => ({
    background: '#fff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: h ? '0 20px 60px rgba(0,0,0,0.14)' : '0 4px 24px rgba(0,0,0,0.07)',
    transform: h ? 'translateY(-8px)' : (v ? 'translateY(0)' : 'translateY(40px)'),
    opacity: v ? 1 : 0,
    transition: `transform 0.45s ease ${d}s, box-shadow 0.45s ease, opacity 0.55s ease ${d}s`,
    cursor: 'pointer',
  }),

  // SLIDESHOW (mirrors car hire page)
  slideshowWrap: { position: 'relative', height: '230px', overflow: 'hidden', background: '#1B3A1A' },
  slideImg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.55s ease, transform 0.55s ease' },
  slideshowPlaceholder: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1B3A1A,#2E5D2E)' },
  slideArrow: (side) => ({
    position: 'absolute', top: '50%', [side]: '10px', transform: 'translateY(-50%)', zIndex: 5,
    background: 'rgba(0,0,0,0.38)', border: 'none', color: '#fff',
    width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', transition: 'background 0.2s', lineHeight: 1, padding: 0,
  }),
  slideDots: { position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 5 },
  slideDot: (active) => ({
    width: active ? '18px' : '6px', height: '6px', borderRadius: '3px',
    background: active ? '#E87722' : 'rgba(255,255,255,0.6)',
    transition: 'width 0.3s, background 0.3s', cursor: 'pointer', border: 'none', padding: 0,
  }),
  badge: (c) => ({ position: 'absolute', top: '14px', right: '14px', zIndex: 4, background: c, color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 13px', borderRadius: '20px' }),

  cardBody: { padding: '24px 24px 26px' },
  cardTitle: { fontFamily: "'Syne', sans-serif", fontSize: '1.18rem', fontWeight: 700, color: '#111827', marginBottom: '10px' },
  cardDesc: { fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.65, marginBottom: '18px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardMeta: { display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid #F3F4F6' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#374151' },
  actions: { display: 'flex', gap: '8px' },
  btn: (bg, bgH, isH) => ({
    flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
    padding: '10px 0', borderRadius: '10px', fontSize: '0.81rem', fontWeight: 600,
    textDecoration: 'none', color: '#fff', background: isH ? bgH : bg, border: 'none', cursor: 'pointer',
    transform: isH ? 'translateY(-2px)' : 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  }),

  // QUOTE SECTION
  quoteSection: { position: 'relative', padding: '100px 48px', overflow: 'hidden', background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2E42 55%, #7B3010 100%)' },
  quoteInner: { position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' },
  quoteHeader: { textAlign: 'center', marginBottom: '48px' },
  quoteTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 800, color: '#fff', marginBottom: '14px', lineHeight: 1.3 },
  quoteDesc: { fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)' },

  // FORM
  formWrap: { background: '#fff', borderRadius: '20px', padding: '48px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '20px' },
  label: { fontSize: '0.87rem', fontWeight: 600, color: '#0D1B2A', letterSpacing: '0.01em' },
  input: (err, focused) => ({
    border: `1.5px solid ${err ? '#EF4444' : focused ? '#E87722' : '#E5E7EB'}`,
    borderRadius: '10px', padding: '12px 16px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', color: '#111827',
    background: '#FAFAFA', outline: 'none', width: '100%',
    boxShadow: focused ? '0 0 0 3px rgba(232,119,34,0.13)' : 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  }),
  checkboxGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', padding: '16px', background: '#FAFAFA', border: '1.5px solid #E5E7EB', borderRadius: '10px' },
  checkboxLabel: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#374151', cursor: 'pointer', lineHeight: 1.4 },
  submitBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
    padding: '17px', background: 'linear-gradient(135deg, #E87722, #C4621A)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(232,119,34,0.35)', transition: 'transform 0.25s, box-shadow 0.25s', letterSpacing: '0.02em',
  },

  successWrap: { background: '#fff', borderRadius: '20px', padding: '80px 48px', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' },
  successIcon: { width: '72px', height: '72px', background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' },

  reviews: { padding: '100px 48px', textAlign: 'center', background: 'linear-gradient(135deg,#0D1B2A 0%,#243B55 100%)' },
  reviewsTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '14px' },
  reviewsSub: { fontSize: '0.98rem', color: 'rgba(255,255,255,0.58)', maxWidth: '560px', margin: '0 auto 56px', lineHeight: 1.7 },
  reviewCards: { display: 'flex', justifyContent: 'center', gap: '32px', maxWidth: '900px', margin: '0 auto' },
  reviewCard: (h) => ({ flex: 1, maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '40px 32px', textDecoration: 'none', color: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', boxShadow: h ? '0 24px 64px rgba(0,0,0,0.22)' : '0 4px 24px rgba(0,0,0,0.08)', transform: h ? 'translateY(-8px)' : 'translateY(0)', transition: 'transform 0.35s, box-shadow 0.35s' }),
  reviewIcon: (bg) => ({ width: '64px', height: '64px', borderRadius: '16px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif" }),

  footer: { background: '#060E17', padding: '60px 48px 0' },
  footerInner: { maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  footerH4: { fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#E87722', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' },
  footerBrandText: { fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px' },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLink: { fontSize: '0.87rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.25s' },
  footerBottom: { maxWidth: '1400px', margin: '0 auto', padding: '20px 0', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.22)' },
};

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconArrow  = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IconClock  = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconPin    = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconPeople = () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconWA     = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconEmail  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.44 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconSend   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IconLeaf   = () => <svg width="48" height="48" fill="none" stroke="#4a7c4e" strokeWidth="1.5" viewBox="0 0 64 64"><path d="M32 8 C12 8 8 28 8 48 C28 48 52 44 52 24 C52 14 44 8 32 8Z"/><path d="M8 48 L32 24"/></svg>;

// ─── IMAGE SLIDESHOW (identical pattern to car hire page) ─────────────────────
const ImageSlideshow = ({ images, packageName, badgeLabel, badgeColor, hovered }) => {
  const [current,   setCurrent]   = useState(0);
  const [failedSet, setFailedSet] = useState(new Set());
  const timerRef = useRef(null);

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
      {/* Location badge */}
      <span style={S.badge(badgeColor)}>{badgeLabel}</span>

      {allFailed ? (
        <div style={S.slideshowPlaceholder}>
          <IconLeaf />
          <span style={{ color: '#6aad6e', fontSize: '0.85rem', marginTop: '10px', fontWeight: 500 }}>{packageName}</span>
        </div>
      ) : (
        <>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${packageName} - view ${i + 1}`}
              style={{
                ...S.slideImg,
                opacity: i === current && !failedSet.has(i) ? 1 : 0,
                transform: i === current ? (hovered ? 'scale(1.06)' : 'scale(1)') : 'scale(1)',
                zIndex: i === current ? 2 : 1,
              }}
              onError={() => setFailedSet(prev => new Set([...prev, i]))}
            />
          ))}

          {/* Prev / Next arrows — visible on hover */}
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

// ─── SAFARI CARD ──────────────────────────────────────────────────────────────
const SafariCard = ({ pkg, index }) => {
  const [visible,  setVisible]  = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const [btnHover, setBtnHover] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const delay = index * 0.1;
  const btns = [
    { bg: '#25D366', bgH: '#1daa52', label: 'WhatsApp', href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in the ${pkg.name} safari package`, Icon: IconWA, target: '_blank' },
    { bg: '#1E40AF', bgH: '#1730a3', label: 'Email',    href: `mailto:${EMAIL_ADDRESS}?subject=Safari Inquiry - ${pkg.name}`, Icon: IconEmail, target: undefined },
    { bg: '#E87722', bgH: '#C4621A', label: 'Call',     href: `tel:${PHONE_NUMBER}`, Icon: IconPhone, target: undefined },
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
        images={pkg.images}
        packageName={pkg.name}
        badgeLabel={pkg.location.split(',')[0]}
        badgeColor={pkg.accent}
        hovered={hovered}
      />

      <div style={S.cardBody}>
        <h3 style={S.cardTitle}>{pkg.name}</h3>
        <p style={S.cardDesc}>{pkg.description}</p>
        <div style={S.cardMeta}>
          <span style={S.metaRow}><IconClock /> {pkg.duration}</span>
          <span style={S.metaRow}><IconPin />   {pkg.location}</span>
          <span style={S.metaRow}><IconPeople /> {pkg.groupSize}</span>
        </div>
        <div style={S.actions}>
          {btns.map((b, i) => (
            <a key={b.label} href={b.href} target={b.target} rel={b.target ? 'noopener noreferrer' : undefined}
               style={S.btn(b.bg, b.bgH, btnHover === i)}
               onMouseEnter={() => setBtnHover(i)} onMouseLeave={() => setBtnHover(null)}>
              <b.Icon /> {b.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STANDALONE FIELD COMPONENTS (defined OUTSIDE QuoteForm — prevents remount on every keystroke) ──
const TextField = ({ label, fieldKey, value, onChange, type, placeholder, error, half }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={half ? {} : S.formGroup}>
      <label style={{ ...S.label, color: error ? '#EF4444' : '#0D1B2A' }}>{label}</label>
      <input
        type={type || 'text'}
        value={value}
        onChange={e => onChange(fieldKey, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={S.input(error, focused)}
      />
    </div>
  );
};

const TextAreaField = ({ label, fieldKey, value, onChange, rows, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.formGroup}>
      <label style={S.label}>{label}</label>
      <textarea
        rows={rows || 4}
        value={value}
        onChange={e => onChange(fieldKey, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{ ...S.input(error, focused), resize: 'vertical', minHeight: rows ? `${rows * 28}px` : '100px' }}
      />
    </div>
  );
};

const SelectField = ({ label, fieldKey, value, onChange, options, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.formGroup}>
      <label style={S.label}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(fieldKey, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...S.input(error, focused), background: '#FAFAFA' }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
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
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);
  const [sending,     setSending]     = useState(false);
  const [sendError,   setSendError]   = useState('');
  const [hovering,    setHovering]    = useState(false);

  const handleChange = useCallback((key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: false }));
  }, []);

  const toggleCar = useCallback((v) => {
    setForm(f => ({
      ...f,
      carTypes: f.carTypes.includes(v) ? f.carTypes.filter(c => c !== v) : [...f.carTypes, v],
    }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName  = true;
    if (!form.lastName.trim())   e.lastName   = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.phone.trim())      e.phone      = true;
    if (!form.dateTravel)        e.dateTravel = true;
    if (!form.dateReturn)        e.dateReturn = true;
    if (!form.pickup.trim())     e.pickup     = true;
    if (!form.destination.trim()) e.destination = true;
    if (!form.agreed)            e.agreed     = true;
    return e;
  };

  const buildMailtoLink = () => {
    const subject = encodeURIComponent(`Safari / Tour Quote Request – ${form.firstName} ${form.lastName}`);
    const body = encodeURIComponent(
`CLIMO TRAVELS & CAR HIRE — SAFARI / TOUR QUOTE REQUEST
========================================================

CONTACT DETAILS
---------------
Name:         ${form.firstName} ${form.lastName}
Email:        ${form.email}
Phone:        ${form.phone}
Organisation: ${form.business || 'N/A'}

TRIP DETAILS
------------
Date of Travel:  ${form.dateTravel}
Date of Return:  ${form.dateReturn}
Pick-up:         ${form.pickup}
Destination:     ${form.destination}
Number of Days:  ${form.days || 'N/A'}
Travellers:      ${form.travellers || 'N/A'}
Event Type:      ${form.eventType || 'N/A'}

VEHICLE PREFERENCES
-------------------
${form.carTypes.length ? form.carTypes.map(c => `• ${c}`).join('\n') : 'Not specified'}

SAFARI ITINERARY
----------------
${form.itinerary || 'N/A'}

SPECIAL INSTRUCTIONS
--------------------
${form.instructions || 'N/A'}

BUDGET
------
${form.budget || 'N/A'}

HOW THEY FOUND US
-----------------
${form.referral || 'N/A'}
`
    );
    return `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSending(true);
    setSendError('');

    try {
      window.location.href = buildMailtoLink();
      setTimeout(() => {
        setSending(false);
        setSubmitted(true);
      }, 800);
    } catch {
      setSending(false);
      setSendError('Something went wrong. Please email us directly at ' + EMAIL_ADDRESS);
    }
  };

  if (submitted) return (
    <div style={S.successWrap}>
      <div style={S.successIcon}>✓</div>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Request Sent!</h3>
      <p style={{ fontSize: '1rem', color: '#6B7280' }}>
        Your email client has been opened with all your safari details pre-filled. Please send the email to complete your request.
        We'll get back to you with a tailored quote as soon as possible.
      </p>
      <p style={{ marginTop: '16px', fontSize: '0.88rem', color: '#9CA3AF' }}>
        Alternatively, reach us directly at{' '}
        <a href={`mailto:${EMAIL_ADDRESS}`} style={{ color: '#E87722' }}>{EMAIL_ADDRESS}</a>
      </p>
    </div>
  );

  return (
    <div style={S.formWrap}>
      {/* Name row */}
      <div className="form-row" style={S.formRow}>
        <TextField label="First Name*" fieldKey="firstName" value={form.firstName} onChange={handleChange} placeholder="John" error={errors.firstName} half />
        <TextField label="Last Name*"  fieldKey="lastName"  value={form.lastName}  onChange={handleChange} placeholder="Doe"  error={errors.lastName}  half />
      </div>

      {/* Contact row */}
      <div className="form-row" style={S.formRow}>
        <TextField label="Email*"        fieldKey="email" value={form.email} onChange={handleChange} type="email" placeholder="john@example.com" error={errors.email} half />
        <TextField label="Phone Number*" fieldKey="phone" value={form.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX" error={errors.phone} half />
      </div>

      {/* Business */}
      <TextField label="Business / Organization" fieldKey="business" value={form.business} onChange={handleChange}
        placeholder="If not corporate, indicate it's for personal use" error={false} />

      {/* Dates */}
      <div className="form-row" style={S.formRow}>
        <TextField label="Date of Travel*" fieldKey="dateTravel" value={form.dateTravel} onChange={handleChange} type="date" error={errors.dateTravel} half />
        <TextField label="Date of Return*" fieldKey="dateReturn" value={form.dateReturn} onChange={handleChange} type="date" error={errors.dateReturn} half />
      </div>

      {/* Vehicle preferences */}
      <div style={S.formGroup}>
        <label style={S.label}>Type of vehicle required</label>
        <div className="cb-grid" style={S.checkboxGrid}>
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

      {/* Event type */}
      <SelectField label="Type of trip / event" fieldKey="eventType" value={form.eventType} onChange={handleChange}
        options={EVENT_TYPES} placeholder="Please Select" error={false} />

      {/* Pickup & Destination */}
      <TextField label="Pick-up location*" fieldKey="pickup" value={form.pickup} onChange={handleChange}
        placeholder="Town, building, street address" error={errors.pickup} />
      <TextField label="Safari destination / park*" fieldKey="destination" value={form.destination} onChange={handleChange}
        placeholder="National Park / Reserve / Town — share a WhatsApp or Google pin if possible" error={errors.destination} />

      {/* Days & Travellers */}
      <div className="form-row" style={S.formRow}>
        <TextField label="Number of days" fieldKey="days" value={form.days} onChange={handleChange} type="number" placeholder="e.g. 3" error={false} half />
        <TextField label="Number of travellers" fieldKey="travellers" value={form.travellers} onChange={handleChange} type="number" placeholder="e.g. 4" error={false} half />
      </div>

      {/* Itinerary */}
      <TextAreaField label="Proposed Safari Itinerary*" fieldKey="itinerary" value={form.itinerary}
        onChange={handleChange} rows={4} placeholder="e.g. Day 1: Depart Nairobi → Maasai Mara. Day 2: Morning & evening game drives…" error={errors.itinerary} />

      {/* Instructions */}
      <TextAreaField label="Special instructions or requirements" fieldKey="instructions" value={form.instructions}
        onChange={handleChange} rows={3} placeholder="e.g. dietary needs, accessibility requirements, accommodation preferences" error={false} />

      {/* Budget */}
      <TextField label="Your budget" fieldKey="budget" value={form.budget} onChange={handleChange}
        placeholder="USD ($) or KES (/=)" error={false} />

      {/* Referral */}
      <SelectField label="How did you learn about us" fieldKey="referral" value={form.referral}
        onChange={handleChange} options={REFERRAL_OPTS} placeholder="Please Select" error={false} />

      {/* T&C */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={e => handleChange('agreed', e.target.checked)}
          style={{ accentColor: '#E87722', width: '17px', height: '17px', flexShrink: 0, marginTop: '3px', outline: errors.agreed ? '2px solid #EF4444' : 'none' }}
        />
        <span style={{ fontSize: '0.87rem', color: errors.agreed ? '#EF4444' : '#374151', lineHeight: 1.5 }}>
          By completing this form, you acknowledge and consent to the terms outlined in the{' '}
          <a href="/terms" style={{ color: '#E87722', textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</a>
          {' '}of Climo Travels &amp; Car Hire.*
        </span>
      </label>

      {/* Error banner */}
      {sendError && (
        <div style={{ marginBottom: '16px', padding: '14px 18px', background: '#FEE2E2', borderRadius: '10px', color: '#B91C1C', fontSize: '0.9rem', fontWeight: 500 }}>
          {sendError}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={sending}
        style={{
          ...S.submitBtn,
          transform: hovering && !sending ? 'translateY(-2px)' : 'none',
          boxShadow: hovering ? '0 12px 36px rgba(232,119,34,0.45)' : '0 6px 24px rgba(232,119,34,0.35)',
          opacity: sending ? 0.75 : 1,
          cursor: sending ? 'wait' : 'pointer',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {sending ? 'Opening email client…' : <><IconSend /> Submit Safari Request</>}
      </button>

      <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.82rem', color: '#9CA3AF' }}>
        Clicking submit will open your email client with all details pre-filled.
      </p>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const SafarisPage = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [ctaHover,    setCtaHover]    = useState(false);
  const [rvHover,     setRvHover]     = useState(null);
  const packagesRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollToPackages = () => packagesRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F7F4; }
        input:focus, select:focus, textarea:focus { outline: none; }
        a { color: inherit; }
        select { appearance: auto; -webkit-appearance: auto; }
        @keyframes particleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 0.7; } 90% { opacity: 0.2; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          70%       { transform: translateX(-50%) translateY(18px); opacity: 0; }
        }
        @keyframes underlineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .safari-accent-line { display:block; height:4px; background:#E87722; border-radius:2px; margin-top:4px; transform-origin:left; animation: underlineGrow 0.6s 1.1s ease forwards; transform:scaleX(0); }
        .scroll-dot-inner { position:absolute; top:6px; left:50%; transform:translateX(-50%); width:6px; height:6px; background:#E87722; border-radius:50%; animation: scrollBounce 1.8s ease infinite; }
        @media (max-width: 900px) { .pkg-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
          .review-cards { flex-direction: column !important; align-items: center !important; }
          .review-card  { max-width: 100% !important; width: 100% !important; }
          .form-row     { grid-template-columns: 1fr !important; }
          .cb-grid      { grid-template-columns: 1fr !important; }
          .footer-grid  { grid-template-columns: 1fr !important; }
          .nav-w  { padding: 0 20px !important; }
          .hero-c { padding: 0 20px !important; padding-top: 72px !important; margin-left: 0 !important; }
          .sec-w  { padding: 60px 20px !important; }
        }
      `}</style>

      <div style={S.page}>

        {/* ── NAV ── */}
        <nav className="nav-w" style={S.nav(scrolled)}>
          <div style={S.navInner}>
            {/* LOGO IMAGE — enlarged for visibility, matching car hire page */}
            <img
              src="/logos/climologo3.png"
              alt="Climo Travels & Car Hire"
              style={{ height: '80px', width: 'auto', objectFit: 'contain', display: 'block' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback text logo */}
            <div style={{ display: 'none', flexDirection: 'column' }}>
              <span style={S.logoText}>CLIMO</span>
              <span style={S.logoSub}>TRAVELS &amp; CAR HIRE</span>
            </div>

            <div style={S.navLinks}>
              <a href="/" style={S.navLink(false)}
                 onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.borderBottomColor='#E87722'; }}
                 onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.7)'; e.target.style.borderBottomColor='transparent'; }}>
                Car Hire
              </a>
              <a href="/safaris" style={S.navLink(true)}>Safaris &amp; Tours</a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={S.hero}>
          <div style={S.heroBg} />
          <img src="/images/safarihero2.jpg" alt="" style={S.heroBgImg} onError={e => { e.target.style.display='none'; }} />
          <div style={S.heroOverlay} />

          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none', left: `${8+i*9}%`, bottom: '-10px', width: `${2+(i%3)}px`, height: `${2+(i%3)}px`, background: 'rgba(232,119,34,0.5)', borderRadius: '50%', animation: `particleFloat ${4+i*0.5}s ${i*0.6}s linear infinite` }} />
          ))}

          <div className="hero-c" style={S.heroContent(heroVisible)}>
            <span style={S.heroPretitle}>SAFARI &amp; TOURS</span>
            <h1 style={S.heroTitle}>
              Unforgettable Safari<br />
              <span style={S.heroAccent}>Adventures</span>
              <span className="safari-accent-line" />
            </h1>
            <p style={S.heroSubtitle}>
              Discover the magic of Kenya's wildlife and landscapes with our<br />
              expertly curated safari packages.
            </p>
            <button style={S.heroCta(ctaHover)} onMouseEnter={() => setCtaHover(true)} onMouseLeave={() => setCtaHover(false)} onClick={scrollToPackages}>
              Explore Our Tours <IconArrow />
            </button>
          </div>

          <div style={S.scrollDotWrap}>
            <div style={S.scrollDot}><div className="scroll-dot-inner" /></div>
          </div>
        </section>

        {/* ── SAFARI PACKAGES ── */}
        <section className="sec-w" ref={packagesRef} style={S.packages}>
          <div style={S.sectionHeader}>
            <span style={S.pretitle}>What We Offer</span>
            <h2 style={S.sectionTitle}>Our Safari Packages</h2>
            <p style={S.sectionSub}>Experience the best of Kenya's wildlife and natural wonders with our curated tour packages</p>
            <div style={S.divider}>
              <span style={S.divBar('12px', 0.4)} />
              <span style={S.divBar('40px', 1)} />
              <span style={S.divBar('12px', 0.4)} />
            </div>
          </div>
          <div className="pkg-grid" style={S.packagesGrid}>
            {safariPackages.map((pkg, i) => <SafariCard key={pkg.id} pkg={pkg} index={i} />)}
          </div>
        </section>

        {/* ── QUOTE FORM ── */}
        <section className="sec-w" style={S.quoteSection}>
          <div style={S.quoteInner}>
            <div style={S.quoteHeader}>
              <span style={{ ...S.pretitle, color: '#E87722' }}>Get In Touch</span>
              <h2 style={S.quoteTitle}>Fill the contact form and we'll revert ASAP with a quote</h2>
              <p style={S.quoteDesc}>By completing this form, you acknowledge and consent to the Terms &amp; Conditions of Climo Travels &amp; Car Hire.</p>
            </div>
            <QuoteForm />
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="sec-w" style={S.reviews}>
          <h2 style={S.reviewsTitle}>Share Your Experience</h2>
          <p style={S.reviewsSub}>We value your feedback! Help us serve you better by sharing your experience with CLIMO Travels &amp; Car Hire</p>
          <div className="review-cards" style={S.reviewCards}>
            {[
              { bg: '#4285F4', label: 'G',  title: 'Google Reviews',     stars: '#F59E0B', btnBg: '#4285F4', btnLabel: 'Leave Google Review ↗',     href: 'https://g.page/r/your-google-link', text: 'Share your experience on Google and help other travelers discover our services.' },
              { bg: '#34E0A1', label: '⬤', title: 'TripAdvisor Reviews', stars: '#34E0A1', btnBg: '#F2A900', btnLabel: 'Leave TripAdvisor Review ↗', href: 'https://tripadvisor.com/your-link',  text: 'Tell the TripAdvisor community about your safari journey with CLIMO Travels & Car Hire.' },
            ].map((r, i) => (
              <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer" className="review-card"
                 style={S.reviewCard(rvHover === i)} onMouseEnter={() => setRvHover(i)} onMouseLeave={() => setRvHover(null)}>
                <div style={S.reviewIcon(r.bg)}>{r.label}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.2rem', fontWeight: 700 }}>{r.title}</h3>
                <div style={{ fontSize: '1.3rem', color: r.stars, letterSpacing: '3px' }}>★★★★★</div>
                <p style={{ fontSize: '0.87rem', color: '#6B7280', textAlign: 'center', lineHeight: 1.6 }}>{r.text}</p>
                <span style={{ display: 'inline-block', marginTop: '8px', padding: '12px 24px', background: r.btnBg, color: '#fff', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}>{r.btnLabel}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={S.footer}>
          <div className="footer-grid" style={S.footerInner}>
            <div>
              <img
                src="/logos/climologo2.png"
                alt="Climo Travels"
                style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
              />
              <span style={{ ...S.logoText, fontSize: '1.3rem', display: 'none' }}>CLIMO</span>
              <p style={S.footerBrandText}>Ride in Style, Arrive with a Smile</p>
            </div>
            <div>
              <h4 style={S.footerH4}>Contact Us</h4>
              <div style={S.footerLinks}>
                <a href={`tel:${PHONE_NUMBER}`}     style={S.footerLink} onMouseEnter={e => e.target.style.color='#E87722'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>📞 {PHONE_NUMBER}</a>
                <a href={`mailto:${EMAIL_ADDRESS}`} style={S.footerLink} onMouseEnter={e => e.target.style.color='#E87722'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>{EMAIL_ADDRESS}</a>
                <span style={S.footerLink}>📍 Nairobi, Kenya</span>
              </div>
            </div>
            <div>
              <h4 style={S.footerH4}>Quick Links</h4>
              <div style={S.footerLinks}>
                <a href="/"        style={S.footerLink} onMouseEnter={e => e.target.style.color='#E87722'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>Car Hire</a>
                <a href="/safaris" style={S.footerLink} onMouseEnter={e => e.target.style.color='#E87722'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>Safaris &amp; Tours</a>
                <a href="/terms"   style={S.footerLink} onMouseEnter={e => e.target.style.color='#E87722'} onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}>Terms &amp; Conditions</a>
              </div>
            </div>
          </div>
          <div style={S.footerBottom}><p>© 2026 CLIMO Travels &amp; Car Hire. All rights reserved.</p></div>
        </footer>

      </div>
    </>
  );
};

export default SafarisPage;