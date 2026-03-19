import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ActivityPage from './pages/ActivityPage';
import ExecutivesPage from './pages/ExecutivesPage';
import BlogPage from './pages/BlogPage';

export default function App() {
  return (
    <BrowserRouter>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/activity"   element={<ActivityPage />} />
          <Route path="/executives" element={<ExecutivesPage />} />
          <Route path="/blog"       element={<BlogPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
