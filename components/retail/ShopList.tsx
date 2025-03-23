import { useState, useEffect } from 'react';
import '../../styles/retail/ShopList.css';

interface Item {
  "Item ID": number;
  "Category": string;
  "Item Name": string;
  "Stock": number;
  "Cost": number; // Updated from Price to Cost
  "Image"?: string;
}

interface Shop {
  "Shop Name": string;
  "Shop ID": number;
  "Location": string;
  "Inventory": Item[];
}

interface CartItem extends Item {
  quantity: number;
}

const ShopList = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);

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

  // Calculate total cost whenever cart changes
  useEffect(() => {
    const newTotalCost = cart.reduce((sum, item) => {
      return sum + (item.Cost * item.quantity);
    }, 0);
    setTotalCost(newTotalCost);
  }, [cart]);

  const generateTimeSlots = () => {
    const slots = [];
    const currentDate = new Date('2025-03-23T06:45:38Z'); // Using the provided current time
    const currentHour = currentDate.getUTCHours();
    
    // Start from the next available slot
    let startHour = currentHour;
    if (currentDate.getUTCMinutes() >= 30) {
      startHour = currentHour + 1;
    }

    for (let hour = startHour; hour < 21; hour++) {
      // Only add the :30 slot if we're starting from the current hour and minutes are less than 30
      if (hour === currentHour && currentDate.getUTCMinutes() < 30) {
        slots.push(`${hour.toString().padStart(2, '0')}:30 - ${(hour + 1).toString().padStart(2, '0')}:00`);
      } else if (hour !== currentHour) {
        slots.push(`${hour.toString().padStart(2, '0')}:00 - ${hour.toString().padStart(2, '0')}:30`);
        slots.push(`${hour.toString().padStart(2, '0')}:30 - ${(hour + 1).toString().padStart(2, '0')}:00`);
      }
    }
    return slots;
  };

  const addToCart = (item: Item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem["Item ID"] === item["Item ID"]);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem["Item ID"] === item["Item ID"]
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item["Item ID"] === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item["Item ID"] === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item["Item ID"] !== itemId);
    });
  };

  const formatTime = (timeSlot: string) => {
    return timeSlot.split(' - ').map(time => {
      const [hours, minutes] = time.split(':');
      const period = Number(hours) >= 12 ? 'PM' : 'AM';
      const formattedHours = Number(hours) > 12 ? Number(hours) - 12 : Number(hours);
      return `${formattedHours}:${minutes} ${period}`;
    }).join(' - ');
  };

  return (
    <div className="shop-container">
      <div className="time-slot-selector">
        <select 
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
          className="time-slot-select"
        >
          <option value="">Select Pickup Time</option>
          {generateTimeSlots().map(slot => (
            <option key={slot} value={slot}>{formatTime(slot)}</option>
          ))}
        </select>
      </div>

      <div className="shop-grid">
        {shops.map((shop) => (
          <div key={shop["Shop ID"]} className="shop-section">
            <h2 className="shop-title">{shop["Shop Name"]}</h2>
            <p className="shop-location">📍 {shop["Location"]}</p>
            
            <div className="items-grid">
              {shop.Inventory.map((item) => (
                <div key={item["Item ID"]} className="item-card">
                  <div className="item-image">
                    <div className="placeholder-image">
                      📦
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item["Item Name"]}</h3>
                    <p className="item-category">{item["Category"]}</p>
                    <p className="item-stock">In Stock: {item["Stock"]}</p>
                    <p className="item-cost">₹{item["Cost"]}</p>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(item)}
                      disabled={item["Stock"] === 0}
                    >
                      {item["Stock"] === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item["Item ID"]} className="cart-item">
                <div className="cart-item-details">
                  <span className="cart-item-name">{item["Item Name"]}</span>
                  <div className="cart-item-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => removeFromCart(item["Item ID"])}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => addToCart(item)}
                      disabled={item["Stock"] === item.quantity}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-cost">₹{item["Cost"] * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total:</span>
            <span>₹{totalCost}</span>
          </div>
          <button 
            className="checkout-btn"
            disabled={!selectedTimeSlot}
            onClick={() => {
              if (selectedTimeSlot) {
                // Generate pickup token
                const token = Math.random().toString(36).substr(2, 9).toUpperCase();
                alert(`Your pickup token is: ${token}\nPickup time: ${formatTime(selectedTimeSlot)}`);
              }
            }}
          >
            {selectedTimeSlot ? 'Proceed to Checkout' : 'Select Pickup Time'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopList;