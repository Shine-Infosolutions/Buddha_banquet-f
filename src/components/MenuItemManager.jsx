import { useState, useEffect } from 'react'
import { FaTrash, FaEdit, FaUtensils, FaPlus } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const MenuItemManager = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [editingItem, setEditingItem] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', category: '', foodType: '' })
  const [newItemForm, setNewItemForm] = useState({ name: '', category: '', foodType: '' })
  const [foodTypeFilter, setFoodTypeFilter] = useState('All')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories()
      await fetchMenuItems()
    }
    loadData()
  }, [])

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown'
    if (typeof categoryId === 'object' && categoryId.cateName) return categoryId.cateName
    const category = categories.find(cat => cat._id === categoryId || cat._id?.toString() === categoryId?.toString())
    return category?.cateName || 'Unknown'
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories/all')
      const data = res.data
      let cats = Array.isArray(data) ? data : data.data || data.categories || []
      setCategories(cats)
      return cats
    } catch {
      setCategories([])
      return []
    }
  }

  const fetchMenuItems = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/menu-items')
      const data = res.data
      const items = Array.isArray(data) ? data : data.data || data.menuItems || []
      setMenuItems(items)
      showMessage(`Loaded ${items.length} menu items`)
    } catch (err) {
      showMessage(`Failed to load menu items: ${err.message}`, 'error')
      setMenuItems([])
    }
    setLoading(false)
  }

  const fetchMenuItemsByFoodType = async (foodType) => {
    setLoading(true)
    try {
      const params = foodType !== 'All' ? `?foodType=${foodType}` : ''
      const res = await api.get(`/api/menu-items${params}`)
      const data = res.data
      const items = Array.isArray(data) ? data : data.data || data.menuItems || []
      setMenuItems(items)
    } catch {
      setMenuItems([])
    }
    setLoading(false)
  }

  const handleEdit = (id) => {
    const item = menuItems.find(i => (i._id || i.id) === id)
    setEditingItem(id)
    const categoryId = typeof item.category === 'object' ? item.category._id : item.category
    setEditForm({ name: item.name, category: categoryId, foodType: item.foodType })
  }

  const saveEdit = async () => {
    try {
      await api.put(`/api/menu-items/${editingItem}`, editForm)
      setMenuItems(menuItems.map(item => (item._id || item.id) === editingItem ? { ...item, ...editForm } : item))
      setEditingItem(null)
      showMessage('Item updated successfully!')
    } catch {
      showMessage('Failed to update item', 'error')
    }
  }

  const addMenuItem = async () => {
    if (!newItemForm.name || !newItemForm.category || !newItemForm.foodType) {
      showMessage('Please fill all fields', 'error')
      return
    }
    try {
      await api.post('/api/menu-items', newItemForm)
      setNewItemForm({ name: '', category: '', foodType: '' })
      showMessage('Menu item added successfully!')
      await fetchMenuItems()
    } catch (err) {
      showMessage(`Failed to add item: ${err.message}`, 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    try {
      await api.delete(`/api/menu-items/${id}`)
      setMenuItems(menuItems.filter(item => (item._id || item.id) !== id))
      showMessage('Item deleted successfully!')
    } catch {
      showMessage('Failed to delete item', 'error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#c3ad6b] px-6 py-4 flex items-center gap-3">
        <FaUtensils className="text-white text-xl" />
        <h2 className="text-xl font-bold text-white">Menu Item Manager</h2>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Add New Item */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaPlus className="text-[#c3ad6b]" />
            <h3 className="text-base font-semibold text-gray-800">Add New Menu Item</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Item Name"
              value={newItemForm.name}
              onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c3ad6b] text-sm"
            />
            <select
              value={newItemForm.category}
              onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c3ad6b] text-sm"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.cateName}</option>
              ))}
            </select>
            <select
              value={newItemForm.foodType}
              onChange={(e) => setNewItemForm({ ...newItemForm, foodType: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c3ad6b] text-sm"
            >
              <option value="">Select Food Type</option>
              <option value="Both">Both</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
            <button
              onClick={addMenuItem}
              className="px-6 py-2.5 bg-[#c3ad6b] hover:bg-[#b39b5a] text-white rounded-lg font-medium text-sm transition-colors"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
            messageType === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-700">
              Menu Items <span className="ml-1 px-2 py-0.5 bg-[#c3ad6b]/20 text-[#c3ad6b] rounded-full text-xs">{menuItems.length}</span>
            </h3>
            <select
              value={foodTypeFilter}
              onChange={(e) => { setFoodTypeFilter(e.target.value); fetchMenuItemsByFoodType(e.target.value) }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#c3ad6b]"
            >
              <option value="All">All Items</option>
              <option value="Veg">Veg Only</option>
              <option value="Non-Veg">Non-Veg Only</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c3ad6b]"></div>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No menu items found.</div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="block sm:hidden divide-y divide-gray-100">
                <AnimatePresence>
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item._id || item.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ delay: idx * 0.04 }}
                    className="p-4">
                    {editingItem === (item._id || item.id) ? (
                      <div className="space-y-3">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]" placeholder="Item Name" />
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]">
                          <option value="">Select Category</option>
                          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.cateName}</option>)}
                        </select>
                        <select value={editForm.foodType} onChange={(e) => setEditForm({ ...editForm, foodType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]">
                          <option value="Both">Both</option>
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={saveEdit} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium">Save</button>
                          <button onClick={() => setEditingItem(null)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{getCategoryName(item.category)} · {item.foodType || 'Both'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(item._id || item.id)} className="p-2 text-[#c3ad6b] hover:bg-[#c3ad6b]/10 rounded-lg transition-colors">
                            <FaEdit size={14} />
                          </button>
                          <button onClick={() => handleDelete(item._id || item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#c3ad6b] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Category</th>
                      <th className="px-6 py-3 text-left font-semibold">Food Type</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                    {menuItems.map((item, idx) => (
                      <motion.tr
                        key={item._id || item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={idx % 2 === 0 ? 'bg-white hover:bg-[#c3ad6b]/5' : 'bg-gray-50 hover:bg-[#c3ad6b]/5'}>
                        {editingItem === (item._id || item.id) ? (
                          <>
                            <td className="px-6 py-3"><input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]" /></td>
                            <td className="px-6 py-3">
                              <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]">
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.cateName}</option>)}
                              </select>
                            </td>
                            <td className="px-6 py-3">
                              <select value={editForm.foodType} onChange={(e) => setEditForm({ ...editForm, foodType: e.target.value })} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c3ad6b]">
                                <option value="Both">Both</option>
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                              </select>
                            </td>
                            <td className="px-6 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span></td>
                            <td className="px-6 py-3">
                              <button onClick={saveEdit} className="text-green-600 hover:text-green-800 font-medium mr-3">Save</button>
                              <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-3 font-medium text-gray-800">{item.name}</td>
                            <td className="px-6 py-3 text-[#c3ad6b] font-medium">{getCategoryName(item.category)}</td>
                            <td className="px-6 py-3 text-gray-600">{item.foodType || 'Both'}</td>
                            <td className="px-6 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span></td>
                            <td className="px-6 py-3">
                              <button onClick={() => handleEdit(item._id || item.id)} className="p-1.5 text-[#c3ad6b] hover:bg-[#c3ad6b]/10 rounded-lg mr-1 transition-colors"><FaEdit size={14} /></button>
                              <button onClick={() => handleDelete(item._id || item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash size={14} /></button>
                            </td>
                          </>
                        )}
                      </motion.tr>
                    ))}
                    </AnimatePresence>}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MenuItemManager
