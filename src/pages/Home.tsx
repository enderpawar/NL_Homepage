import Hero from '../components/Hero';
import StatsBanner from '../components/StatsBanner';
import About from '../components/About';
import CodePlayground from '../components/CodePlayground';
import Testimonials from '../components/Testimonials';
import JoinSection from '../components/JoinSection';

export default function Home({ introActive = false, onBoot }: { introActive?: boolean; onBoot?: () => void }) {
  return (
    <>
      <Hero introActive={introActive} onBoot={onBoot} />
      <StatsBanner />
      <About />
      <CodePlayground />
      <Testimonials />
      <JoinSection />
    </>
  );
}
