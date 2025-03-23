import Navbar from '../components/retail/Navbar';
import ShopList from '../components/retail/ShopList';

export const Retail = () => {
  return (
    <div className="retail-page">
      <Navbar />
      <main className="retail-content">
        <ShopList />
      </main>
    </div>
  );
};