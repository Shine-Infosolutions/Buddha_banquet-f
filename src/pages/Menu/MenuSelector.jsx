import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import useWebSocket from "../../hooks/useWebSocket";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaUtensils, FaCheck } from "react-icons/fa";
const MenuSelector = ({
  onSave,
  onSaveCategory,
  onClose,
  initialItems,
  foodType,
  ratePlan
}) => {
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole?.toLowerCase() === 'admin';
  const { axios } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState(initialItems || []);
  const [currentCategory, setCurrentCategory] = useState("");
  const [planLimits, setPlanLimits] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  // WebSocket connection for real-time updates
  const { lastMessage, sendMessage } = useWebSocket();

  // Handle real-time menu updates
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'MENU_ITEM_CREATED':
        case 'MENU_ITEM_UPDATED':
        case 'MENU_ITEM_DELETED':
          // Refresh menu items when any menu changes
          fetchMenuItems().then(setMenuItems);
          break;
        case 'CATEGORY_CREATED':
        case 'CATEGORY_UPDATED':
        case 'CATEGORY_DELETED':
          // Refresh categories when any category changes
          fetchCategories().then(setCategories);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  // API functions
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu-items');
      return response.data.success ? response.data.data : response.data;
    } catch (error) {
      return [];
    }
  };

  const createMenuItem = async (itemData) => {
    try {
      const response = await axios.post('/api/menu-items', itemData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMenuItem = async (itemId) => {
    try {
      const response = await axios.delete(`/api/menu-items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteMenuItems = async () => {
    try {
      const response = await axios.delete('/api/menu-items');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/all');
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post('/api/categories/create', categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchPlanLimits = async () => {
    try {
      const response = await axios.get('/api/plan-limits/get');
      return response.data;
    } catch (error) {
      return [];
    }
  };

  const createPlanLimits = async (limitsData) => {
    try {
      const response = await axios.post('/api/plan-limits', limitsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Sync selectedItems when initialItems changes
  useEffect(() => {
    const newItems = initialItems || [];
    setSelectedItems(newItems);
  }, [initialItems]);

  // Fetch menu items, categories and plan limits
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuData, categoriesData, limitsData] = await Promise.all([
          fetchMenuItems(),
          fetchCategories(),
          fetchPlanLimits()
        ]);
        
        // Handle categories with predefined order
        if (categoriesData) {
          const cats = Array.isArray(categoriesData) ? categoriesData : 
                      categoriesData.data ? categoriesData.data : 
                      categoriesData.categories ? categoriesData.categories : [];
          
          // Define the desired order based on food type
          const vegCategoryOrder = [
            'WELCOME DRINK', 'STARTER VEG', 'SALAD', 'RAITA', 'MAIN COURSE[PANEER]', 
            'VEGETABLE', 'DAL', 'RICE', 'BREADS', 'DESSERTS'
          ];
          
          const nonVegCategoryOrder = [
            'WELCOME DRINK', 'STARTER VEG', 'SALAD', 'RAITA', 'MAIN COURSE[PANEER]', 
            'MAIN COURSE[NON-VEG]', 'VEGETABLE', 'DAL', 'RICE', 'BREADS', 'DESSERTS'
          ];
          
          const categoryOrder = foodType === 'Veg' ? vegCategoryOrder : nonVegCategoryOrder;
          
          // Filter categories based on food type
          const filteredCats = cats.filter(cat => {
            const catName = cat.cateName || cat.name;
            // For Veg, exclude any NON-VEG categories
            if (foodType === 'Veg' && (catName.includes('NON-VEG') || catName.includes('NON VEG'))) {
              return false;
            }
            return true;
          });
          

          
          const sortedCats = filteredCats.sort((a, b) => {
            const aName = a.cateName || a.name;
            const bName = b.cateName || b.name;
            const aIndex = categoryOrder.indexOf(aName);
            const bIndex = categoryOrder.indexOf(bName);
            
            // If both are in the order array, sort by their position
            if (aIndex !== -1 && bIndex !== -1) {
              return aIndex - bIndex;
            }
            // If only one is in the order array, prioritize it
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            // If neither is in the order array, sort alphabetically
            return aName.localeCompare(bName);
          });
          
          setCategories(sortedCats);
          if (sortedCats.length > 0) {
            setCurrentCategory(sortedCats[0].cateName || sortedCats[0].name);
          }
        }
        
        // Handle menu items
        if (menuData) {
          const items = Array.isArray(menuData) ? menuData :
                       menuData.data ? menuData.data :
                       menuData.items ? menuData.items : [];
          setMenuItems(items);
        }
        
        // Handle plan limits
        if (limitsData) {
          const limits = limitsData.success ? limitsData.data : limitsData;
          setPlanLimits(limits);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [axios]);

  // Get items for current category filtered by foodType and ratePlan
  const currentCategoryItems = useMemo(() => {
    if (!menuItems.length || !currentCategory) return [];
    
    // Find the current category object to get its ID
    const currentCategoryObj = categories.find(cat => 
      (cat.cateName || cat.name) === currentCategory
    );
    const currentCategoryId = currentCategoryObj?._id || currentCategoryObj?.id;
    
    const filteredItems = menuItems.filter(item => {
      // Match category by ID since menu items store category as ID string
      const categoryMatch = item.category === currentCategoryId;
      
      if (!categoryMatch) return false;
      
      // Filter by foodType
      if (foodType && item.foodType) {
        if (item.foodType === 'Both') return true;
        return item.foodType === foodType;
      }
      
      return true;
    });
    
    // Remove duplicates and format
    const uniqueItems = [];
    const seenNames = new Set();
    
    filteredItems.forEach(item => {
      const itemName = item.name || item.itemName;
      if (itemName && !seenNames.has(itemName)) {
        seenNames.add(itemName);
        uniqueItems.push({
          id: item._id || item.id || itemName,
          name: itemName
        });
      }
    });
    
    return uniqueItems;
  }, [menuItems, currentCategory, foodType, ratePlan, categories]);

  const buildCategorizedMenu = (items) => {
    const categorizedMenu = {};
    items.forEach(selectedItem => {
      const itemData = menuItems.find(mi => mi.name === selectedItem);
      if (itemData?.category) {
        const categoryObj = categories.find(cat =>
          cat._id === itemData.category || cat.id === itemData.category
        );
        const categoryName = categoryObj?.cateName || categoryObj?.name;
        if (categoryName) {
          if (!categorizedMenu[categoryName]) categorizedMenu[categoryName] = [];
          categorizedMenu[categoryName].push(selectedItem);
        }
      }
    });
    return categorizedMenu;
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(item);
      if (isSelected) {
        const newItems = prev.filter(i => i !== item);
        
        // Auto-save immediately when item is removed
        setTimeout(() => {
          if (onSave) onSave(newItems, buildCategorizedMenu(newItems));
        }, 0);
        
        return newItems;
      }
      
      // Skip limit checks for Admin users
      if (!isAdmin) {
        // Find matching plan limit based on foodType and ratePlan
        const matchingPlan = Array.isArray(planLimits) 
          ? planLimits.find(plan => plan.foodType === foodType && plan.ratePlan === ratePlan)
          : null;
        
        const categoryLimit = matchingPlan?.limits?.[currentCategory] || matchingPlan?.limits?.[categories.find(c => (c.cateName || c.name) === currentCategory)?._id];
        
        if (categoryLimit) {
          const currentCategorySelectedCount = prev.filter(selectedItem => {
            const selectedItemData = menuItems.find(mi => mi.name === selectedItem);
            if (selectedItemData?.category) {
              const categoryObj = categories.find(cat =>
                cat._id === selectedItemData.category || cat.id === selectedItemData.category
              );
              return (categoryObj?.cateName || categoryObj?.name) === currentCategory;
            }
            return false;
          }).length;
          

          
          if (currentCategorySelectedCount >= categoryLimit) {
            return prev;
          }
        }
      }
      
      const newItems = [...prev, item];
      
      // Auto-save immediately when item is selected
      setTimeout(() => {
        if (onSave) onSave(newItems, buildCategorizedMenu(newItems));
      }, 0);
      
      return newItems;
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await createCategory({ cateName: newCategoryName });
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setNewCategoryName("");
      setShowAddCategory(false);
      
      // Send WebSocket notification
      sendMessage({
        type: 'CATEGORY_CREATED',
        data: { name: newCategoryName }
      });
    } catch (error) {
    }
  };

  const handleDeleteMenuItem = async (itemName) => {
    try {
      const item = menuItems.find(mi => mi.name === itemName);
      if (item && item.id) {
        await deleteMenuItem(item.id);
        const updatedItems = await fetchMenuItems();
        setMenuItems(updatedItems);
        setSelectedItems(prev => prev.filter(i => i !== itemName));
        
        // Send WebSocket notification
        sendMessage({
          type: 'MENU_ITEM_DELETED',
          data: { name: itemName, id: item.id }
        });
      }
    } catch (error) {
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c3ad6b]"></div>
      </div>
    );
  }

  const matchingPlan = Array.isArray(planLimits)
    ? planLimits.find(p => p.foodType === foodType && p.ratePlan === ratePlan)
    : null;

  // Resolve limit for a category name — checks both by ID and by name
  const getCategoryLimit = (catName) => {
    if (!matchingPlan?.limits) return null;
    const catObj = categories.find(c => (c.cateName || c.name) === catName);
    const catId = catObj?._id || catObj?.id;
    // Try by ID first, then by name
    return matchingPlan.limits[catId] || matchingPlan.limits[catName] || null;
  };

  const getCategoryCount = (catName) =>
    selectedItems.filter(si => {
      const d = menuItems.find(mi => mi.name === si);
      if (!d?.category) return false;
      const obj = categories.find(c => c._id === d.category || c.id === d.category);
      return (obj?.cateName || obj?.name) === catName;
    }).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#c3ad6b] px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <FaUtensils className="text-white text-lg" />
          <div>
            <h3 className="text-white font-bold text-base">{ratePlan} · {foodType} Menu</h3>
            <p className="text-white/70 text-xs">{selectedItems.length} items selected</p>
          </div>
        </div>
        <button
          onClick={() => { if (onSave && selectedItems.length > 0) onSave(selectedItems, buildCategorizedMenu(selectedItems)); onClose(); }}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-lg font-bold"
        >✕</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Categories Sidebar */}
        <aside className="w-48 sm:w-56 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="px-3 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</span>
            {isAdmin && (
              <button onClick={() => setShowAddCategory(true)}
                className="w-6 h-6 rounded-full bg-[#c3ad6b] text-white flex items-center justify-center hover:bg-[#b39b5a] transition-colors">
                <FaPlus size={9} />
              </button>
            )}
          </div>

          {showAddCategory && (
            <div className="p-3 border-b border-gray-200 bg-white">
              <input type="text" placeholder="Category name"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#c3ad6b] mb-2"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)} />
              <div className="flex gap-1">
                <button onClick={handleAddCategory}
                  className="flex-1 py-1 bg-[#c3ad6b] text-white rounded text-xs font-medium hover:bg-[#b39b5a]">Add</button>
                <button onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}
                  className="flex-1 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium hover:bg-gray-300">Cancel</button>
              </div>
            </div>
          )}

          <div className="flex-1 p-2 space-y-1">
            {categories.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No categories</p>
            ) : (
              categories.map((cat) => {
                const catName = cat.cateName || cat.name;
                const isActive = currentCategory === catName;
                const limit = getCategoryLimit(catName);
                const count = getCategoryCount(catName);
                return (
                  <button key={catName} onClick={() => setCurrentCategory(catName)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive ? 'bg-[#c3ad6b] text-white shadow-sm' : 'text-gray-700 hover:bg-[#c3ad6b]/10'
                    }`}>
                    <div className="truncate">{catName}</div>
                    {limit && (
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                        {count}/{limit} selected
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Items Grid */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-700">{currentCategory}</h4>
            {(() => {
              const limit = getCategoryLimit(currentCategory);
              const count = getCategoryCount(currentCategory);
              if (!limit) return null;
              return (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  count >= limit ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {count}/{limit}
                </span>
              );
            })()}
          </div>

          {currentCategoryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FaUtensils className="text-3xl mb-2 opacity-30" />
              <p className="text-sm">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <AnimatePresence>
              {currentCategoryItems.map((item, idx) => {
                const isSelected = selectedItems.includes(item.name);
                let isLimitReached = false;
                if (!isAdmin) {
                  const limit = getCategoryLimit(currentCategory);
                  const count = getCategoryCount(currentCategory);
                  isLimitReached = limit && count >= limit && !isSelected;
                }
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => !isLimitReached && handleSelectItem(item.name)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all ${
                      isLimitReached
                        ? 'border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#c3ad6b] bg-[#c3ad6b]/10 cursor-pointer shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#c3ad6b]/50 hover:bg-[#c3ad6b]/5 cursor-pointer'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      isSelected ? 'bg-[#c3ad6b] border-[#c3ad6b]' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <FaCheck size={9} className="text-white" />}
                    </div>
                    <span className={`text-sm flex-1 ${isSelected ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
                      {item.name}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMenuItem(item.name); }}
                        className="w-5 h-5 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <FaTrash size={9} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-3 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Selected:</span>
          <span className="px-2 py-0.5 bg-[#c3ad6b]/20 text-[#c3ad6b] rounded-full text-xs font-bold">{selectedItems.length} items</span>
        </div>
        <button
          onClick={() => { if (onSave) onSave(selectedItems, buildCategorizedMenu(selectedItems)); onClose(); }}
          className="px-5 py-2 bg-[#c3ad6b] hover:bg-[#b39b5a] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

export default MenuSelector;