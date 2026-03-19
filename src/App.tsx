import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import About from './components/About';
import CodePlayground from './components/CodePlayground';
import ActivitySection from './components/ActivitySection';
import Testimonials from './components/Testimonials';
import JoinSection from './components/JoinSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <StatsBanner />
        <About />
        <CodePlayground />
        <ActivitySection />
        <Testimonials />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}
