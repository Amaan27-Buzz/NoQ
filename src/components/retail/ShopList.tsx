import { useState, useEffect } from 'react';
import '../../styles/retail/ShopList.css';

interface Item {
  "Item ID": number;
  "Category": string;
  "Item Name": string;
  "Stock": number;
}

interface Shop {
  "Shop Name": string;
  "Shop ID": number;
  "Location": string;
  "Inventory": Item[];
}

const ShopList = () => {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('https://jsonblob.com/api/jsonBlob/1353250595338903552');
        const data = await response.json();
        setShops(data.shops);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      }
    };

    fetchShops();
  }, []);

  return (
    <div className="shop-list">
      {shops.map((shop) => (
        <div key={shop["Shop ID"]} className="shop-card">
          <h2>{shop["Shop Name"]}</h2>
          <p>Location: {shop["Location"]}</p>
          <div className="inventory">
            {shop.Inventory.map((item) => (
              <div key={item["Item ID"]} className="inventory-item">
                <p>{item["Item Name"]}</p>
                <p>Category: {item["Category"]}</p>
                <p>Stock: {item["Stock"]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopList;