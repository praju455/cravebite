import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Pizza, Utensils, Clock, Star, ChevronDown, MapPin, Package, Zap, Gift, Heart, Coffee, Shield, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&q=80',
    label: 'Street-side signatures',
  },
  {
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
    label: 'Stacked comfort plates',
  },
  {
    img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&q=80',
    label: 'Slow-cooked biryani bowls',
  },
  {
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&q=80',
    label: 'Oven-fresh slices',
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
      <div className="text-5xl font-extrabold text-[#d97706] mb-2">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </motion.div>
  );
}

const FEATURES = [
  { icon: Zap, label: 'Lightning Fast', desc: 'Find restaurants by location, cuisine, and delivery time' },
  { icon: Utensils, label: 'Smart Filters', desc: 'Filter by veg, non-veg, price range, and ratings' },
  { icon: Gift, label: 'Best Deals', desc: 'Exclusive offers and discounts on your favorite meals' },
  { icon: Star, label: 'Top Rated', desc: 'Discover highly-rated restaurants in your area' },
  { icon: Heart, label: 'Save Favorites', desc: 'Quick reorder from your favorite restaurants' },
  { icon: Coffee, label: 'Wide Variety', desc: 'Cafes, biryani, pizza, desserts, rolls, and more' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page" style={{ color: 'var(--text-primary)' }}>
      <div className="absolute top-5 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d97706] to-[#f59e0b]">
              <Pizza className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black text-white">Crave<span className="text-[#f59e0b]">Bite</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:bg-white/20"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          </div>
        </div>
      </div>

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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97706] to-[#f59e0b] flex items-center justify-center shadow-2xl shadow-[#d97706]/40">
              <Pizza className="text-white w-8 h-8" />
            </div>
            <span className="text-4xl font-black text-white tracking-tight">Crave<span className="text-[#f59e0b]">Bite</span></span>
          </motion.div>

          {/* Slide food label */}
          <motion.p
            key={slideIdx}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#f59e0b] font-semibold text-sm tracking-widest uppercase mb-3">
            {SLIDES[slideIdx].label}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-7xl font-black text-white leading-tight mb-4">
            Pick a plate,<br /><span className="text-[#f59e0b]">not a queue.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Order from your favorite restaurants in Bangalore. Fast delivery, great food, unbeatable convenience.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/restaurants')}
              className="px-10 py-4 bg-[#d97706] text-white text-lg font-bold rounded-full hover:bg-[#f59e0b] transition-all shadow-[0_0_30px_rgba(217,119,6,0.5)] hover:shadow-[0_0_50px_rgba(217,119,6,0.7)] hover:scale-105 active:scale-95">
              Explore Restaurants
            </button>

          </motion.div>

          {/* Slide dot indicators */}
          <div className="flex justify-center space-x-2 mt-10">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? 'bg-[#d97706] w-7' : 'bg-white/40 w-2'}`} />
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
          <h2 className="text-4xl font-extrabold mb-4">Built around the <span className="text-[#d97706]">food journey</span></h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg max-w-xl mx-auto">
            From browsing restaurants to doorstep delivery, every step is designed for your convenience.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AnimatedStat end={20} suffix="+" label="Partner Restaurants" />
          <AnimatedStat end={500} suffix="+" label="Happy Customers" />
          <AnimatedStat end={30} suffix=" min" label="Average Delivery" />
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">A food app with a <span className="text-[#d97706]">smart platform</span></h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
              Simple interface, powerful features, and seamless ordering experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group hover:border-[#d97706]/40 transition-all cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d97706]/20 to-[#f59e0b]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-[#d97706]" />
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
          From craving to <span className="text-[#d97706]">confirmed order</span>
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: MapPin, step: '01', title: 'Choose Restaurant', desc: 'Browse restaurants and explore diverse menus' },
            { icon: Package, step: '02', title: 'Build Your Order', desc: 'Select your favorite dishes and customize them' },
            { icon: Clock, step: '03', title: 'Track Delivery', desc: 'Real-time tracking from kitchen to your doorstep' },
          ].map((item, i) => (
            <motion.div key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-[#d97706]/10 border-2 border-[#d97706]/30 flex items-center justify-center">
                  <item.icon className="w-9 h-9 text-[#d97706]" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#d97706] text-white text-xs font-bold rounded-full flex items-center justify-center">
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
          className="mt-16 px-12 py-4 bg-[#d97706] text-white text-lg font-bold rounded-full hover:bg-[#f59e0b] transition-all shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:scale-105 active:scale-95">
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
                <Pizza className="w-7 h-7 text-[#d97706]" />
                <span className="text-xl font-black">Crave<span className="text-[#f59e0b]">Bite</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your favorite food delivery platform for quick and delicious meals.
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
                    <li key={l}><span className="text-gray-400 text-sm hover:text-[#d97706] cursor-pointer transition-colors">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">© 2025 CraveBite. All rights reserved.</p>

          </div>
        </div>
      </footer>
    </div>
  );
}
