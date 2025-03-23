import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';

export const CategoryCard = ({ id, name, icon, description }: Category) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    // Navigate to the appropriate route based on category
    switch (name.toLowerCase()) {
      case 'retail':
        navigate('/retail');
        break;
      // Add other categories as needed
      default:
        break;
    }
  };

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <div className="category-icon">{icon}</div>
      <h3 className="category-title">{name}</h3>
      <p className="category-description">{description}</p>
    </div>
  );
};