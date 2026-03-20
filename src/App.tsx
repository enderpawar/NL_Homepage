import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroIntro from './components/HeroIntro';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import ExecutivesPage from './pages/ExecutivesPage';
import BlogPage from './pages/BlogPage';
import JoinPage from './pages/JoinPage';

export default function App() {
  const rawBasename = import.meta.env.BASE_URL;
  const basename = rawBasename === '/' ? '/' : rawBasename.replace(/\/$/, '');

  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem('nl_intro_done')
  );

  const handleIntroDone = () => {
    sessionStorage.setItem('nl_intro_done', '1');
    setShowIntro(false);
  };

  const handleReplay = useCallback(() => {
    sessionStorage.removeItem('nl_intro_done');
    setShowIntro(true);
  }, []);

  // /boot 키 시퀀스 감지 (input/textarea 포커스 시 무시)
  useEffect(() => {
    let buffer = '';
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      buffer += e.key;
      if (buffer.length > 5) buffer = buffer.slice(-5);
      if (buffer.endsWith('/boot')) {
        buffer = '';
        handleReplay();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleReplay]);

  return (
    <BrowserRouter basename={basename}>
      {showIntro && <HeroIntro onDone={handleIntroDone} />}
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home introActive={showIntro} onBoot={handleReplay} />} />
          <Route path="/activity"   element={<ActivityPage />} />
          <Route path="/executives" element={<ExecutivesPage />} />
          <Route path="/blog"       element={<BlogPage />} />
          <Route path="/join"       element={<JoinPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
