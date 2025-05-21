"use client"

import { useState, useEffect } from "react"
import { X, Edit, Trash, Plus, Eye, EyeOff, LogOut } from "lucide-react"

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || '',
  password: process.env.ADMIN_PASSWORD || '',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    isVeg: true,
    price: "",
  })

  // Load data from API on mount
  useEffect(() => {
    // Check if user is authenticated in session storage
    const authStatus = sessionStorage.getItem("beyondmenu_auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchMenuData()
    } else {
      setLoading(false)
    }
  }, [])

  // Fetch menu data from API
  const fetchMenuData = async () => {
    setLoading(true)
    setApiError(null)
    
    try {
      const response = await fetch('/api', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch menu data')
      }

      if (response.status === 404) {
        // If menu file doesn't exist, initialize with default items
        const defaultItems = createDefaultItems()
        setMenuItems(defaultItems)
        saveMenuData(defaultItems)
      } else {
        setMenuItems(data.menuItems || [])
      }
    } catch (error) {
      console.error('Error fetching menu data:', error)
      setApiError(`Error loading menu: ${error.message}`)
      // If API fails, try to use localStorage as fallback
      const storedItems = localStorage.getItem("beyondmenu_products")
      if (storedItems) {
        setMenuItems(JSON.parse(storedItems))
      } else {
        setMenuItems(createDefaultItems())
      }
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  // Save menu data to API
  const saveMenuData = async (items) => {
    setIsSaving(true)
    setApiError(null)
    
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItems: items })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save menu data')
      }
      
      // Also save to localStorage as backup
      localStorage.setItem("beyondmenu_products", JSON.stringify(items))
    } catch (error) {
      console.error('Error saving menu data:', error)
      setApiError(`Error saving changes: ${error.message}`)
      // Save to localStorage as fallback
      localStorage.setItem("beyondmenu_products", JSON.stringify(items))
    } finally {
      setIsSaving(false)
    }
  }

  // Create default menu items
  const createDefaultItems = () => {
    return [
      {
        name: "Crispy Loaded Nachos",
        description: "Corn tortilla chips topped with melted cheese, jalapeños, and tangy salsa.",
        category: "Starters",
        isVeg: true,
        price: "₹220",
      },
      {
        name: "Spicy Chicken Wings",
        description: "Deep-fried chicken wings tossed in a spicy BBQ sauce.",
        category: "Starters",
        isVeg: false,
        price: "₹280",
      },
      {
        name: "Classic Veg Burger",
        description: "Grilled veggie patty, lettuce, tomato, and mayo in a toasted bun.",
        category: "Burgers",
        isVeg: true,
        price: "₹200",
      },
      {
        name: "Smoky BBQ Chicken Burger",
        description: "Juicy chicken patty with BBQ sauce, cheddar cheese, and onions.",
        category: "Burgers",
        isVeg: false,
        price: "₹250",
      },
      {
        name: "Peri Peri Paneer Slider",
        description: "Soft slider buns filled with spicy peri peri paneer cubes and slaw.",
        category: "Burgers",
        isVeg: true,
        price: "₹190",
      },
      {
        name: "Classic Cold Coffee",
        description: "Rich, chilled coffee blended with milk and a touch of sweetness.",
        category: "Drinks",
        isVeg: true,
        price: "₹130",
      },
      {
        name: "Watermelon Mint Cooler",
        description: "Refreshing watermelon juice with mint and lime.",
        category: "Drinks",
        isVeg: true,
        price: "₹110",
      },
      {
        name: "Oreo Fudge Shake",
        description: "Thick shake blended with Oreo cookies and chocolate fudge.",
        category: "Drinks",
        isVeg: true,
        price: "₹160",
      },
      {
        name: "Baked Cheesecake Slice",
        description: "Creamy baked cheesecake with a buttery biscuit base.",
        category: "Desserts",
        isVeg: true,
        price: "₹150",
      },
      {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey molten center.",
        category: "Desserts",
        isVeg: true,
        price: "₹140",
      },
    ]
  }

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      sessionStorage.setItem("beyondmenu_auth", "true");
      setLoginError("");
      fetchMenuData();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    setLoginError("Something went wrong");
  }
};

  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("beyondmenu_auth")
  }

  // Delete item
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedItems = [...menuItems]
      updatedItems.splice(index, 1)
      setMenuItems(updatedItems)
      saveMenuData(updatedItems)
    }
  }

  // Start editing item
  const handleEdit = (item, index) => {
    setEditingItem({ ...item, index })
  }

  // Save edited item
  const handleSaveEdit = () => {
    const updatedItems = [...menuItems]
    updatedItems[editingItem.index] = {
      name: editingItem.name,
      description: editingItem.description,
      category: editingItem.category,
      isVeg: editingItem.isVeg,
      price: editingItem.price,
    }
    setMenuItems(updatedItems)
    setEditingItem(null)
    saveMenuData(updatedItems)
  }

  // Add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.description || !newItem.category || !newItem.price) {
      alert("Please fill all fields")
      return
    }
    
    const updatedItems = [...menuItems, { ...newItem }]
    setMenuItems(updatedItems)
    setNewItem({
      name: "",
      description: "",
      category: "",
      isVeg: true,
      price: "",
    })
    setShowAddModal(false)
    saveMenuData(updatedItems)
  }

  // Get unique categories
  const categories = [...new Set(menuItems.map((item) => item.category))]

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#6B3DF4] flex flex-col items-center justify-center z-50">
        <div className="relative transform rotate-[-2deg] bg-white text-[#6B3DF4] p-4 md:p-6 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black mb-8">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            BEYOND<span className="text-black">ADMIN</span>
          </h1>
        </div>
        <div className="mt-6 flex space-x-2">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    )
  }
  
  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#6B3DF4] text-white p-4 md:p-10 flex items-center justify-center">
        <div className="bg-[#5B2DE4] p-8 md:p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] max-w-md w-full">
          <div className="mb-8 text-center">
            <div className="relative transform rotate-[-2deg] bg-white text-[#6B3DF4] p-3 md:p-4 inline-block shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black">
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter">
                BEYOND<span className="text-black">ADMIN</span>
              </h1>
            </div>
          </div>
          
          <form onSubmit={handleLogin}>
            {loginError && (
              <div className="mb-4 bg-red-600 text-white p-3 border-2 border-black font-bold">
                {loginError}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-white font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-4 border-black bg-white text-black p-3 font-bold"
                required
              />
            </div>
            
            <div className="mb-6 relative">
              <label className="block text-white font-bold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-4 border-black bg-white text-black p-3 font-bold pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-white text-[#6B3DF4] border-4 border-black p-3 font-bold text-xl hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] transform transition-transform hover:translate-y-[-2px]"
            >
              Log In
            </button>
          </form>
          
          
        </div>
        
        {/* Password Help Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#5B2DE4] p-6 border-4 border-black shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Password Help</h3>
                <button onClick={() => setShowPasswordModal(false)} className="text-white">
                  <X size={24} />
                </button>
              </div>
              <p className="mb-4">Default credentials:</p>
              <p className="font-mono bg-black p-2 mb-4">
                Username: admin<br />
                Password: admin123
              </p>
              <p className="mb-4 text-sm">
                This is a demo application. In a real application, you would implement proper authentication
                and password reset functionality.
              </p>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full bg-white text-[#6B3DF4] border-2 border-black p-2 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#6B3DF4] text-white p-4 md:p-10">
      {/* Header */}
      <header className="mb-8 md:mb-12 flex justify-between items-center">
        <div className="relative transform rotate-[-2deg] bg-white text-[#6B3DF4] p-3 md:p-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter">
            BEYOND<span className="text-black">ADMIN</span>
          </h1>
        </div>
        
        <div className="flex space-x-4">
          <a 
            href="/cafemenu" 
            className="bg-white text-[#6B3DF4] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] font-bold"
          >
            View Menu
          </a>
          <button 
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] font-bold flex items-center"
          >
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </header>

      {/* API Error Alert */}
      {apiError && (
        <div className="mb-6 bg-red-600 text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <p className="font-bold">{apiError}</p>
          <p className="text-sm mt-1">Changes are being saved to browser storage as a fallback.</p>
        </div>
      )}
      
      {/* Saving Indicator */}
      {isSaving && (
        <div className="mb-6 bg-blue-600 text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <p className="font-bold flex items-center">
            <span className="mr-2 w-3 h-3 bg-white rounded-full animate-pulse"></span>
            Saving changes...
          </p>
        </div>
      )}

      {/* Admin Controls */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-[#6B3DF4] px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] font-bold text-lg flex items-center transform hover:translate-y-[-2px] transition-transform"
        >
          <Plus size={20} className="mr-2" /> Add New Item
        </button>
      </div>

      {/* Categories Summary */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const itemCount = menuItems.filter(item => item.category === category).length
          return (
            <div key={category} className="bg-[#5B2DE4] p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
              <h3 className="font-bold text-xl mb-1">{category}</h3>
              <p className="text-2xl font-black">{itemCount} items</p>
            </div>
          )
        })}
      </div>

      {/* Menu Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-[#5B2DE4] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-center">Veg/Non-Veg</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={index} className="border-t-2 border-black">
                <td className="p-4">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-white/80">{item.description}</div>
                </td>
                <td className="p-4">{item.category}</td>
                <td className="p-4 font-bold">{item.price}</td>
                <td className="p-4 text-center">
                  <div className={`inline-block w-6 h-6 ${item.isVeg ? "bg-green-500" : "bg-red-500"} border-2 border-black`}>
                    <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEdit(item, index)}
                      className="bg-white text-[#6B3DF4] p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:bg-gray-100"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:bg-red-600"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="mt-12 md:mt-16 text-center pb-4">
        <div className="inline-block bg-black text-white px-4 py-2 transform rotate-[-1deg]">
          <p className="font-bold text-sm md:text-base">© 2025 BEYONDMENU • Admin Portal</p>
        </div>
      </footer>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#5B2DE4] p-6 border-4 border-black shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Add New Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border-2 border-black bg-white text-black p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full border-2 border-black bg-white text-black p-2 h-20"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full border-2 border-black bg-white text-black p-2"
                    list="categories"
                    required
                  />
                  <datalist id="categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Price</label>
                  <input
                    type="text"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full border-2 border-black bg-white text-black p-2"
                    placeholder="₹000"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newItem.isVeg}
                      onChange={() => setNewItem({ ...newItem, isVeg: true })}
                      className="mr-2"
                    />
                    <span className="inline-block w-4 h-4 bg-green-500 border border-black mr-1"></span>
                    Vegetarian
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!newItem.isVeg}
                      onChange={() => setNewItem({ ...newItem, isVeg: false })}
                      className="mr-2"
                    />
                    <span className="inline-block w-4 h-4 bg-red-500 border border-black mr-1"></span>
                    Non-Vegetarian
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border-2 border-black bg-black text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 border-2 border-black bg-white text-[#6B3DF4] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#5B2DE4] p-6 border-4 border-black shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Edit Item</h3>
              <button onClick={() => setEditingItem(null)} className="text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full border-2 border-black bg-white text-black p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full border-2 border-black bg-white text-black p-2 h-20"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Category</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full border-2 border-black bg-white text-black p-2"
                    list="edit-categories"
                    required
                  />
                  <datalist id="edit-categories">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Price</label>
                  <input
                    type="text"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    className="w-full border-2 border-black bg-white text-black p-2"
                    placeholder="₹000"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingItem.isVeg}
                      onChange={() => setEditingItem({ ...editingItem, isVeg: true })}
                      className="mr-2"
                    />
                    <span className="inline-block w-4 h-4 bg-green-500 border border-black mr-1"></span>
                    Vegetarian
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!editingItem.isVeg}
                      onChange={() => setEditingItem({ ...editingItem, isVeg: false })}
                      className="mr-2"
                    />
                    <span className="inline-block w-4 h-4 bg-red-500 border border-black mr-1"></span>
                    Non-Vegetarian
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border-2 border-black bg-black text-white"

              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 border-2 border-black bg-white text-[#6B3DF4] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}