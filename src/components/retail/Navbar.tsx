import { useState, useEffect } from 'react';
import '../../styles/retail/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const categories = [
    { id: 1, name: 'Food', icon: '🍽️' },
    { id: 2, name: 'Toiletries', icon: '🚿' },
    { id: 3, name: 'Household', icon: '🏠' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`retail-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <a href="/retail" className="nav-logo">
          NoQ Retail
        </a>

        <div className="nav-categories" 
             onMouseEnter={() => setIsDropdownOpen(true)}
             onMouseLeave={() => setIsDropdownOpen(false)}>
          <button className="category-dropdown-btn">
            Categories <span className="dropdown-arrow">▼</span>
          </button>
          <div className={`category-dropdown ${isDropdownOpen ? 'show' : ''}`}>
            {categories.map(category => (
              <a key={category.id} href={`/retail/category/${category.name.toLowerCase()}`} 
                 className="category-item">
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </a>
            ))}
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            🔍
          </button>
        </div>

        <div className="cart-container">
          <button className="cart-btn">
            🛒 <span className="cart-count">0</span>
          </button>
          <button className="checkout-btn">
            Checkout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;