import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { Categories } from './pages/Categories';
import { Retail } from './pages/Retail';
import './index.css';
import './styles/signin.css';
import './styles/categories.css';
import './styles/retail/Navbar.css';
import './styles/retail/ShopList.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/retail/*" element={<Retail />} />
      </Routes>
    </Router>
  );
}

export default App;