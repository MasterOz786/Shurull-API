import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Deploy from './pages/Deploy';
import About from './pages/About';
import Admin from './pages/Admin';
import Monitoring from './pages/Monitoring';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deploy" element={<Deploy />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/:id" element={<Monitoring />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;