"use client"

import { useState, useEffect } from "react"

export default function CafeMenu() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [menuItems, setMenuItems] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch menu items from API
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setMenuItems(data.menuItems)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch menu items', err)
        setError('Failed to load menu items. Please try again later.')
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const categories = ["all", ...new Set(menuItems.map((item) => item.category))]

  const filteredItems =
    activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#6B3DF4] flex flex-col items-center justify-center z-50">
        <div className="relative transform rotate-[-2deg] bg-white text-[#6B3DF4] p-4 md:p-6 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black mb-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            BEYOND<span className="text-black">MENU</span>
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#6B3DF4] text-white p-4 md:p-10 flex items-center justify-center">
        <div className="bg-[#5B2DE4] p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-white text-[#6B3DF4] px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#6B3DF4] text-white p-4 md:p-10">
      {/* Header */}
      <header className="mb-8 md:mb-12 flex justify-center">
        <div className="relative transform rotate-[-2deg] bg-white text-[#6B3DF4] p-3 md:p-6 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] border-4 border-black">
          <h1 className="text-3xl md:text-6xl font-black tracking-tighter">
            BEYOND<span className="text-black">MENU</span>
          </h1>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-3 py-1 md:px-4 md:py-2 text-sm md:text-lg font-bold uppercase border-3 border-black 
              transform transition-transform hover:translate-y-[-4px]
              ${
                activeCategory === category
                  ? "bg-white text-[#6B3DF4] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]"
                  : "bg-[#5B2DE4] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-1 md:px-0">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`
              relative bg-[#5B2DE4] p-4 md:p-5 border-4 border-black
              shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]
              transform hover:translate-y-[-2px] transition-transform
              ${index % 4 === 0 ? "rotate-[1deg]" : ""}
              ${index % 4 === 1 ? "rotate-[-1deg]" : ""}
              ${index % 4 === 2 ? "rotate-[0.5deg]" : ""}
              ${index % 4 === 3 ? "rotate-[-0.5deg]" : ""}
            `}
          >
            {/* Category Badge */}
            <div className="absolute top-[-12px] right-4 bg-black text-white px-3 py-1 text-xs md:text-sm font-bold">
              {item.category}
            </div>

            {/* Veg/Non-Veg Indicator */}
            <div
              className={`absolute top-[-12px] left-4 w-6 h-6 border-2 border-black ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}
            >
              <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg md:text-xl font-extrabold pr-2">{item.name}</h3>
              <span className="text-lg md:text-xl font-black bg-black text-white px-2 py-1 ml-2 transform rotate-[2deg] whitespace-nowrap">
                {item.price}
              </span>
            </div>

            <p className="text-white/90 text-sm md:text-base">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 md:mt-16 text-center pb-4">
        <div className="inline-block bg-black text-white px-4 py-2 transform rotate-[-1deg]">
          <p className="font-bold text-sm md:text-base">© 2025 BEYONDMENU • All Rights Reserved</p>
        </div>
      </footer>
    </div>
  )
}