import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';

// Category ID to name mapping
const CATEGORY_MAPPING = {
  '68b13efe0ec05cc6ad713b39': 'Non-Veg',
  '68b13f6c0ec05cc6ad713b3c': 'Veg', 
  '68b13f750ec05cc6ad713b3f': 'Dessert',
  '68b13f7d0ec05cc6ad713b42': 'Beverage'
};

const getCategoryName = (category) => {
  if (typeof category === 'string' && category.length === 24) {
    return CATEGORY_MAPPING[category] || category;
  }
  return category;
};

export const useMenuData = (foodType) => {
  const { axios } = useAppContext();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!foodType) return;

    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/menu-items/foodtype/${foodType}`);
        
        if (response.data && (response.data.success || response.data.data || Array.isArray(response.data))) {
          const data = response.data.data || response.data;
          let categories = [];
          if (Array.isArray(data)) {
            const grouped = data.reduce((acc, item) => {
              const categoryName = getCategoryName(item.category);
              if (!acc[categoryName]) acc[categoryName] = [];
              acc[categoryName].push(item.name);
              return acc;
            }, {});
            categories = Object.entries(grouped).map(([name, items]) => ({ name, items }));
          } else if (typeof data === 'object') {
            categories = Object.entries(data).map(([name, items]) => ({
              name,
              items: Array.isArray(items) ? items : []
            }));
          }
          
          setMenuData({
            hotel_name: "BUDDHA AVENUE",
            menu_name: `BUDDHA ${foodType.toUpperCase()} MENU`,
            categories
          });
        } else {
          setMenuData({
            hotel_name: "BUDDHA AVENUE",
            menu_name: `BUDDHA ${foodType.toUpperCase()} MENU`,
            categories: []
          });
        }
      } catch (err) {
        setMenuData({
          hotel_name: "BUDDHA AVENUE",
          menu_name: `BUDDHA ${foodType.toUpperCase()} MENU`,
          categories: []
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [foodType]);

  return { menuData, loading, error };
};

export const usePlanLimits = () => {
  const { axios } = useAppContext();
  const [planLimits, setPlanLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanLimits = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/plan-limits/formatted');
        
        if (response.data && (response.data.success || response.data.data || typeof response.data === 'object')) {
          setPlanLimits(response.data.data || response.data || {});
        } else {
          setPlanLimits({});
        }
      } catch (err) {
        setPlanLimits({});
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanLimits();
  }, []);

  return { planLimits, loading, error };
};
