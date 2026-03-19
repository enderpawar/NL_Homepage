import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import ExecutivesPage from './pages/ExecutivesPage';
import BlogPage from './pages/BlogPage';
import JoinPage from './pages/JoinPage';

export default function App() {
  const rawBasename = import.meta.env.BASE_URL
  const basename = rawBasename === '/'
    ? '/'
    : rawBasename.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
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
