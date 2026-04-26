'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarField from './StarField';
import { useGameStore } from '@/store/useGameStore';
import { i18n } from '@/lib/i18n';

export default function HomePageClient() {
  const router = useRouter();
  const [highscore] = useState(() => Number(localStorage.getItem('th_highscore') || 0));
  const language = useGameStore((s) => s.language);
  const setLanguage = useGameStore((s) => s.setLanguage);
  const t = i18n[language];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#020408] overflow-hidden">
      <StarField velocity={0} />

      <div
        className="absolute left-[-15%] top-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(circle, rgba(80,20,140,0.25) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Language selector */}
      <div className="absolute top-4 right-6 flex gap-2" style={{ zIndex: 10 }}>
        {(['en', 'pt'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
              language === lang
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col items-center gap-10 text-center px-6"
        style={{ zIndex: 3 }}
      >
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">{t.tagline}</p>
          <h1
            className="text-6xl md:text-8xl font-black text-white tracking-tight"
            style={{ textShadow: '0 0 60px rgba(99,179,237,0.3)' }}
          >
            TYPE
          </h1>
          <h2
            className="text-4xl md:text-5xl font-black tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HORIZON
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mt-2">{t.description}</p>
        </div>

        {highscore > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-600 uppercase tracking-widest">{t.yourBest}</span>
            <span className="text-2xl font-bold text-yellow-400">{highscore.toLocaleString()}</span>
          </div>
        )}

        <button
          onClick={() => router.push('/game')}
          className="group relative px-12 py-4 rounded-xl text-white font-bold text-lg tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
          }}
        >
          <span className="relative z-10">{t.playNow}</span>
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #6d28d9, #2563eb)',
              boxShadow: '0 0 50px rgba(99,102,241,0.6)',
            }}
          />
        </button>

        <div className="flex flex-col gap-2 text-xs text-slate-600 max-w-xs">
          {[
            { color: 'text-emerald-500', text: t.hint1 },
            { color: 'text-blue-500', text: t.hint2 },
            { color: 'text-purple-500', text: t.hint3 },
            { color: 'text-red-500', text: t.hint4 },
          ].map(({ color, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className={color}>→</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
