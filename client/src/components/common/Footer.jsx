import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Mail, Phone, MapPin, Award, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to HotelPro Private Collection updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner: Newsletter & Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-400">
              The HotelPro Circle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Unlock Exclusive Member Rates & Private Escapes
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-lg">
              Receive secret seasonal offers, room upgrade vouchers, and curated travel inspirations directly to your inbox.
            </p>
          </div>
          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your VIP email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-sm shadow-md shadow-gold-500/20 transition-all shrink-0"
              >
                Join Collection
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-slate-950 shadow-md">
              <Hotel className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              Hotel<span className="text-gold-500">Pro</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed pr-6">
            HotelPro (Roomly) is an award-winning luxury hospitality platform uniting premier oceanfront resorts, heritage palaces, and metropolitan penthouses worldwide.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold bg-gold-950/40 border border-gold-900/60 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-gold-400" />
              Five Star Diamond Certified
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Escrow Stays
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
            Destinations & Hotels
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/explore?city=Miami" className="hover:text-gold-400 transition-colors">Miami Beach, USA</Link></li>
            <li><Link to="/explore?city=Jaipur" className="hover:text-gold-400 transition-colors">Jaipur Heritage, India</Link></li>
            <li><Link to="/explore?city=New+York" className="hover:text-gold-400 transition-colors">Manhattan, New York</Link></li>
            <li><Link to="/explore?city=Bora+Bora" className="hover:text-gold-400 transition-colors">Bora Bora Lagoons</Link></li>
            <li><Link to="/explore?city=Zermatt" className="hover:text-gold-400 transition-colors">Zermatt Swiss Alps</Link></li>
          </ul>
        </div>

        {/* Column 3: Hospitality Services */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
            Hospitality Suite
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/explore" className="hover:text-gold-400 transition-colors">All Flagship Resorts</Link></li>
            <li><Link to="/offers" className="hover:text-gold-400 transition-colors">Seasonal Specials</Link></li>
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">Our Heritage & Story</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">24/7 VIP Concierge</Link></li>
            <li><Link to="/login" className="hover:text-gold-400 transition-colors">Partner Hotel Portal</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4">
            Global Concierge
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>+1 (800) 555-LUXURY</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>concierge@hotelpro.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>HotelPro Plaza, 100 Hospitality Way, FL 33139</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="border-t border-slate-900 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HotelPro (Roomly) Luxury Management Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Security & Escrow</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
