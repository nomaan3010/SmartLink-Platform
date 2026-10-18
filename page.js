// app/card/[slug]/page.js
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize free Supabase client (Replace with your actual free project credentials)
const supabase = createClient('HTTPS://ibkjbhkazrmjgiomuekx
.supabase.co', 'sb_publishable_MTVIiE1mzoRxC9ofhuCPRA_OQv1LCSS');

export default function DigitalCard({ params }) {
  const [data, setData] = useState(null);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchCardData() {
      const { data: clientData, error } = await supabase
        .from('digital_cards')
        .select('*')
        .eq('slug', params.slug)
        .single();
      
      if (!error && clientData) setData(clientData);
    }
    fetchCardData();
  }, [params.slug]);

  if (!data) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase' }}>Loading Secure Smart Profile...</p>
      </div>
    );
  }

  // Theme Configurator Matrix
  const themes = {
    'luxury-gold': { bg: '#0A0A0A', container: '#141414', accent: '#D4AF37', text: '#FFFFFF', subText: '#A0A0A0', btnText: '#000000' },
    'cyber-neon': { bg: '#05050A', container: '#0D0D1A', accent: '#00FFCC', text: '#FFFFFF', subText: '#8888AA', btnText: '#000000' },
    'minimal-nordic': { bg: '#F3F4F6', container: '#FFFFFF', accent: '#1F2937', text: '#111827', subText: '#6B7280', btnText: '#FFFFFF' }
  };

  const style = themes[data.design_theme] || themes['luxury-gold'];
  const liveUrl = `https://vercel.app{data.slug}`;
  const qrUrl = `https://qrserver.com{encodeURIComponent(liveUrl)}&color=${style.accent.replace('#','')}&bgcolor=${style.container.replace('#','')}`;

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    
    // Save customer lead into your central system database automatically
    const { error } = await supabase
      .from('captured_leads')
      .insert([{ client_slug: data.slug, lead_name: leadName, lead_phone: leadPhone }]);
    
    if (!error) {
      setSubmitted(true);
      setLeadName('');
      setLeadPhone('');
    }
  };

  return (
    <div style={{ backgroundColor: style.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 15px', boxSizing: 'border-box', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: style.container, borderRadius: '28px', padding: '35px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', boxSizing: 'border-box', textAlign: 'center' }}>
        
        {/* Profile Identity */}
        <img src={data.profile_photo_url || "https://unsplash.com"} alt="Profile" style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${style.accent}`, marginBottom: '15px' }} />
        <h1 style={{ color: style.text, fontSize: '24px', margin: '5px 0', fontWeight: '700' }}>{data.full_name}</h1>
        <h2 style={{ color: style.accent, fontSize: '13px', margin: '0 0 20px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px' }}>{data.job_title} @ {data.company_name}</h2>
        <p style={{ color: style.subText, fontSize: '14px', lineHeight: '1.6', margin: '0 0 25px 0', padding: '0 10px' }}>{data.about_short}</p>

        {/* Primary Action Panel */}
        <a href={`tel:${data.phone_number}`} style={{ display: 'block', width: '100%', padding: '16px 0', margin: '12px 0', borderRadius: '14px', backgroundColor: style.accent, color: style.btnText, textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>📞 Connect via Call</a>
        <a href={`https://wa.me{data.whatsapp_number}?text=Hi,%20I%20just%20tapped%20your%20Smart%20Card.`} style={{ display: 'block', width: '100%', padding: '16px 0', margin: '12px 0', borderRadius: '14px', backgroundColor: '#25D366', color: '#FFF', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>💬 Chat on WhatsApp</a>
        {data.location_maps_url && (
          <a href={data.location_maps_url} style={{ display: 'block', width: '100%', padding: '15px 0', margin: '12px 0', borderRadius: '14px', backgroundColor: 'transparent', color: style.text, textDecoration: 'none', fontWeight: '600', fontSize: '15px', border: `1px solid ${style.subText}` }}>📍 Navigate to Office</a>
        )}

        {/* Portfolio Showcase Module */}
        {data.portfolio_images && data.portfolio_images.length > 0 && (
          <div style={{ marginTop: '30px', textAlign: 'left' }}>
            <h3 style={{ color: style.accent, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px 5px', fontWeight: '700' }}>💼 Corporate Portfolio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {data.portfolio_images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt="Project" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '10px', backgroundColor: '#222' }} />
              ))}
            </div>
          </div>
        )}

        {/* Value Add 1: Dynamic UPI Payments Panel */}
        {data.upi_id && (
          <div style={{ marginTop: '30px', padding: '20px 15px', backgroundColor: style.bg, borderRadius: '16px', border: `1px dashed ${style.accent}` }}>
            <h4 style={{ color: style.text, margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600' }}>💸 Instant Business Transfer</h4>
            <p style={{ color: style.subText, fontSize: '12px', margin: '0 0 15px 0' }}>Tap below to process direct vendor settlements securely.</p>
            <a href={`upi://pay?pa=${data.upi_id}&pn=${encodeURIComponent(data.full_name)}&cu=INR`} style={{ display: 'inline-block', backgroundColor: style.accent, color: style.btnText, padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700' }}>Pay via Any UPI App</a>
          </div>
        )}

        {/* Value Add 2: Integrated Live Lead Capture Engine */}
        <div style={{ marginTop: '35px', textAlign: 'left', borderTop: `1px solid ${style.bg}`, paddingTop: '25px' }}>
          <h3 style={{ color: style.accent, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 8px 5px', fontWeight: '700' }}>📩 Drop Your Details</h3>
          <p style={{ color: style.subText, fontSize: '12px', margin: '0 0 15px 5px' }}>Leave your information below to instantly notify {data.full_name.split(' ')[0]}.</p>
          {submitted ? (
            <p style={{ color: '#25D366', fontSize: '13px', fontWeight: '600', paddingLeft: '5px' }}>✓ Contact information submitted securely!</p>
          ) : (
            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Your Name" value={leadName} onChange={(e) => setLeadName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: style.bg, color: style.text, fontSize: '14px' }} required />
              <input type="tel" placeholder="Your Phone Number" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: style.bg, color: style.text, fontSize: '14px' }} required />
              <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: style.accent, color: style.btnText, fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Submit Inquiry</button>
            </form>
          )}
        </div>

        {/* Live Automatic QR Asset Display */}
        <div style={{ marginTop: '35px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={qrUrl} alt="System Generated QR Code" style={{ borderRadius: '12px', padding: '10px', backgroundColor: style.container, border: `1px solid ${style.accent}`, width: '120px', height: '120px' }} />
          <p style={{ color: style.subText, fontSize: '10px', marginTop: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Dynamic Cloud Sync Asset</p>
        </div>

      </div>
      
      {/* Platform Level Global Branding Stamp */}
      <div style={{ marginTop: '25px', color: '#555555', fontSize: '10px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
        © SYSTEM INFRASTRUCTURE OWNED BY YOURCOMPANY
      </div>
      
    </div>
  );
}
