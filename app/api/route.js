// app/api/route.js
import { readFileSync, writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

// Path to the menu.json file
const dataFilePath = path.join(process.cwd(), 'app', 'data', 'menu.json');

// GET handler to retrieve menu items
export async function GET() {
  try {
    // Read the menu.json file
    const fileData = readFileSync(dataFilePath, 'utf8');
    const menuData = JSON.parse(fileData);
    
    return NextResponse.json({ 
      message: "Menu data retrieved successfully", 
      menuItems: menuData 
    }, { status: 200 });
  } catch (error) {
    console.error('Error reading menu data:', error);
    
    // If file doesn't exist yet, return empty array
    if (error.code === 'ENOENT') {
      return NextResponse.json({ 
        message: "Menu file not found", 
        menuItems: [] 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: "Error retrieving menu data", 
      error: error.message 
    }, { status: 500 });
  }
}

// POST handler to update menu items
export async function POST(request) {
  try {
    // Parse the request body
    const { menuItems } = await request.json();
    
    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ 
        message: "Invalid data format. Expected 'menuItems' array."
      }, { status: 400 });
    }
    
    // Write to the menu.json file
    writeFileSync(dataFilePath, JSON.stringify(menuItems, null, 2), 'utf8');
    
    return NextResponse.json({ 
      message: "Menu data updated successfully"
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating menu data:', error);
    
    return NextResponse.json({ 
      message: "Error updating menu data", 
      error: error.message 
    }, { status: 500 });
  }
}