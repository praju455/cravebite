import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Utensils, Clock, Star, ChevronDown, LayoutDashboard, MapPin, Package, Zap, Gift, Heart, Coffee } from 'lucide-react';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80',
    label: 'Sizzling Street Food',
  },
  {
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
    label: 'Juicy Burgers',
  },
  {
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&q=80',
    label: 'Aromatic Biryani',
  },
  {
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&q=80',
    label: 'Fresh Pizzas',
  },
];

function AnimatedStat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 20);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
      className="glass-card p-8 rounded-2xl text-center">
      <div className="text-5xl font-extrabold text-[#ff4d00] mb-2">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </motion.div>
  );
}

const FEATURES = [
  { icon: Zap, label: 'Lightning Fast', desc: 'Orders delivered in under 30 minutes' },
  { icon: Utensils, label: 'Pure Veg Mode', desc: 'Filter for 100% vegetarian meals' },
  { icon: Gift, label: 'Daily Offers', desc: 'Exclusive deals every single day' },
  { icon: Star, label: 'Top Rated', desc: 'Only 4+ star restaurants listed' },
  { icon: Heart, label: 'Favourites', desc: 'Save your go-to meals for later' },
  { icon: Coffee, label: 'All Cuisines', desc: 'From street food to fine dining' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ color: 'var(--text-primary)' }}>

      {/* ─── HERO: Cinematic Slideshow ─── */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center -mt-8">

        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slideIdx ? 1 : 0 }}
          >
            <div
              className="w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url(${slide.img})`,
                animation: i === slideIdx ? 'kenBurns 6s ease-in-out forwards' : 'none',
              }}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75 z-10" />

        {/* Hero content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff4d00] to-[#ff7a00] flex items-center justify-center shadow-2xl shadow-[#ff4d00]/40">
              <ShoppingBag className="text-white w-8 h-8" />
            </div>
            <span className="text-4xl font-black text-white tracking-tight">Crave<span className="text-[#ff4d00]">Bite</span></span>
          </motion.div>

          {/* Slide food label */}
          <motion.p
            key={slideIdx}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#ff4d00] font-semibold text-sm tracking-widest uppercase mb-3">
            🍽 {SLIDES[slideIdx].label}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-7xl font-black text-white leading-tight mb-4">
            Bangalore's <span className="text-[#ff4d00]">#1</span><br />Food Delivery App
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Fresh meals from 20+ top restaurants, delivered blazing fast to your door.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/restaurants')}
              className="px-10 py-4 bg-[#ff4d00] text-white text-lg font-bold rounded-full hover:bg-[#ff6a2b] transition-all shadow-[0_0_30px_rgba(255,77,0,0.5)] hover:shadow-[0_0_50px_rgba(255,77,0,0.7)] hover:scale-105 active:scale-95">
              Order Now 🍔
            </button>
            <button onClick={() => navigate('/dashboard')}
              className="px-8 py-4 border-2 border-white/40 text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all flex items-center space-x-2 backdrop-blur-sm">
              <LayoutDashboard className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </button>
          </motion.div>

          {/* Slide dot indicators */}
          <div className="flex justify-center space-x-2 mt-10">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? 'bg-[#ff4d00] w-7' : 'bg-white/40 w-2'}`} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center text-sm">
          <span>Scroll down</span>
          <ChevronDown className="w-5 h-5 mt-1" />
        </motion.div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Better food for <span className="text-[#ff4d00]">more people</span></h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg max-w-xl mx-auto">
            We've been connecting hungry Bangaloreans with their favourite restaurants since day one.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AnimatedStat end={20} suffix="+" label="Partner Restaurants" />
          <AnimatedStat end={5000} suffix="+" label="Orders Delivered" />
          <AnimatedStat end={30} suffix=" min" label="Average Delivery Time" />
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">What's waiting for <span className="text-[#ff4d00]">you?</span></h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
              CraveBite is packed with features to make every meal memorable
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[#ff4d00]/40 transition-all cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff4d00]/20 to-[#ff7a00]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-[#ff4d00]" />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{f.label}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-4 max-w-4xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-4xl font-extrabold mb-16">
          Order in <span className="text-[#ff4d00]">3 easy steps</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: MapPin, step: '01', title: 'Pick a Restaurant', desc: 'Browse 20+ top-rated places near you' },
            { icon: Package, step: '02', title: 'Add to Cart', desc: 'Choose your favourites from the menu' },
            { icon: Clock, step: '03', title: 'Fast Delivery', desc: 'Track your order live and enjoy!' },
          ].map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-[#ff4d00]/10 border-2 border-[#ff4d00]/30 flex items-center justify-center">
                  <item.icon className="w-9 h-9 text-[#ff4d00]" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#ff4d00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          onClick={() => navigate('/restaurants')}
          className="mt-16 px-12 py-4 bg-[#ff4d00] text-white text-lg font-bold rounded-full hover:bg-[#ff6a2b] transition-all shadow-[0_0_30px_rgba(255,77,0,0.4)] hover:scale-105 active:scale-95">
          Browse Restaurants →
        </motion.button>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-8" style={{ background: '#0a0a0a', color: '#fff' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="w-7 h-7 text-[#ff4d00]" />
                <span className="text-xl font-black">Crave<span className="text-[#ff4d00]">Bite</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bangalore's favourite food delivery platform. Fresh, fast, and always delicious.
              </p>
            </div>

            {[
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { title: 'For Restaurants', links: ['Partner With Us', 'Restaurant Login', 'Consulting'] },
              { title: 'Support', links: ['Help & Support', 'Privacy Policy', 'Terms of Service', 'Report a Fraud'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><span className="text-gray-400 text-sm hover:text-[#ff4d00] cursor-pointer transition-colors">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2025 CraveBite. All rights reserved.</p>
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-5 py-2.5 border border-white/20 rounded-full text-sm text-gray-300 hover:border-[#ff4d00] hover:text-[#ff4d00] transition-all">
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
