'use client';

import dynamic from 'next/dynamic';

// Skip SSR entirely — page reads localStorage and uses Math.random() for stars
const HomePageClient = dynamic(() => import('@/components/HomePageClient'), { ssr: false });

export default function HomePage() {
  return <HomePageClient />;
}
