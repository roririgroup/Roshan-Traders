import React from 'react';

export const manufacturersData = [
  {
    id: 'rn-tiles',
    name: 'RN Tiles',
    location: 'Morbi, Gujarat',
    specialization: 'Ceramic Tiles',
    established: 2010,
    image: 'https://rntilesmachinery.com/wp-content/uploads/2025/08/LOGO-3.png',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzc-ItTtSkXM7hUA9mB3_lWbvZIw8L44HJEA&s',
    rating: 4.8,
    founder: {
      name: 'Rajesh Patel',
      experience: '15 years',
      qualification: 'B.E. Ceramic Engineering'
    }, 
    
    companyInfo: {
      employees: 150,
      annualTurnover: '₹50 Crores',
      exportCountries: 15,
      certifications: ['ISO 9001:2015', 'CE Marking', 'GREENGUARD']
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'info@rntiles.com',
      website: 'rntiles.com',
      address: 'Plot 45, GIDC Industrial Estate, Morbi - 363641, Gujarat'
    },
    products: [
      {
        id: 'p1',
        name: 'Ceramic Floor Tiles',
        category: 'Tiles',
        sizes: ['600x600mm', '800x800mm', '1200x600mm'],
        finishes: ['Glossy', 'Matte', 'Sugar'],
        priceRange: '₹25-45 per sq.ft',
        image: 'https://images.unsplash.com/photo-1581093458791-9d1f8f5b88f8?q=80&w=400&auto=format&fit=crop',
        description: 'High-quality ceramic floor tiles perfect for residential and commercial spaces. Excellent durability and slip resistance.',
        specifications: {
          waterAbsorption: '< 3%',
          thickness: '8-10mm',
          surface: 'Glazed',
          usage: 'Flooring'
        }
      },
      {
        id: 'p2',
        name: 'Vitrified Tiles',
        category: 'Tiles',
        sizes: ['600x600mm', '800x800mm'],
        finishes: ['Polished', 'Lapato', 'Carving'],
        priceRange: '₹35-65 per sq.ft',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop',
        description: 'Premium vitrified tiles with superior strength and stain resistance. Ideal for high-traffic areas.',
        specifications: {
          waterAbsorption: '< 0.5%',
          thickness: '10-12mm',
          surface: 'Polished',
          usage: 'Flooring'
        }
      },
      {
        id: 'p3',
        name: 'Wall Tiles',
        category: 'Tiles',
        sizes: ['300x450mm', '300x600mm', '400x800mm'],
        finishes: ['Glossy', 'Matte', 'Digital Print'],
        priceRange: '₹18-35 per sq.ft',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=400&auto=format&fit=crop',
        description: 'Elegant wall tiles with modern designs and easy maintenance. Perfect for kitchens and bathrooms.',
        specifications: {
          waterAbsorption: '< 10%',
          thickness: '6-8mm',
          surface: 'Glazed',
          usage: 'Wall Cladding'
        }
      }
    ],
    specializations: ['Digital Printing', 'Large Format Tiles', 'Outdoor Applications'],
    description: 'Leading manufacturer of premium ceramic and vitrified tiles with state-of-the-art manufacturing facilities in Morbi. Known for innovative designs and superior quality products.',
    achievements: [
      'Best Exporter Award 2023',
      'Quality Excellence Award 2022',
      'Innovation in Design Award 2021'
    ],
    orders: [
      {
        id: 'ORD-001',
        customerName: 'ABC Construction Ltd.',
        customerEmail: 'orders@abcconstruction.com',
        orderDate: '2024-01-15',
        status: 'completed',
        totalAmount: 1250000,
        items: [
          {
            productId: 'p1',
            productName: 'Ceramic Floor Tiles',
            quantity: 5000,
            unitPrice: 35,
            totalPrice: 175000
          },
          {
            productId: 'p2',
            productName: 'Vitrified Tiles',
            quantity: 3000,
            unitPrice: 50,
            totalPrice: 150000
          }
        ],
        deliveryAddress: 'Plot 123, Industrial Area, Mumbai - 400001',
        notes: 'Urgent delivery required'
      },
      {
        id: 'ORD-002',
        customerName: 'XYZ Builders',
        customerEmail: 'procurement@xyzbuilders.com',
        orderDate: '2024-01-20',
        status: 'in_progress',
        totalAmount: 850000,
        items: [
          {
            productId: 'p3',
            productName: 'Wall Tiles',
            quantity: 8000,
            unitPrice: 25,
            totalPrice: 200000
          },
          {
            productId: 'p1',
            productName: 'Ceramic Floor Tiles',
            quantity: 2000,
            unitPrice: 35,
            totalPrice: 70000
          }
        ],
        deliveryAddress: 'Sector 15, Gurgaon - 122001',
        notes: 'Quality check required before dispatch'
      },
      {
        id: 'ORD-003',
        customerName: 'PQR Developers',
        customerEmail: 'orders@pqrdevelopers.com',
        orderDate: '2024-01-25',
        status: 'pending',
        totalAmount: 450000,
        items: [
          {
            productId: 'p2',
            productName: 'Vitrified Tiles',
            quantity: 1500,
            unitPrice: 50,
            totalPrice: 75000
          }
        ],
        deliveryAddress: 'Tech Park, Bangalore - 560001',
        notes: 'Awaiting payment confirmation'
      }
    ],
    productsCount: 3,
    turnover: '₹50 Crores',
    exportCountries: 15,
    teamSize: 150
  },
  {
    id: 'isr',
    name: 'ISR',
    location: 'Nashik, Maharashtra',
    specialization: 'Steel Sheets',
    established: 2008,
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=200&auto=format&fit=crop',
    rating: 4.6,
    founder: {
      name: 'Israil Ahmed Khan',
      experience: '18 years',
      qualification: 'M.Tech Metallurgical Engineering'
    },
    companyInfo: {
      employees: 200,
      annualTurnover: '₹75 Crores',
      exportCountries: 8,
      certifications: ['ISO 9001:2015', 'BIS Certification', 'NSIC']
    },
    contact: {
      phone: '+91 97654 32109',
      email: 'sales@isr.com',
      website: 'isr.com',
      address: 'MIDC Industrial Area, Ambad, Nashik - 422010, Maharashtra'
    },
    products: [
      {
        id: 'p4',
        name: 'Galvanized Sheets',
        category: 'Steel Sheets',
        thickness: ['0.5mm', '0.7mm', '1.0mm', '1.2mm'],
        grades: ['SGCC', 'DX51D', 'S350GD'],
        priceRange: '₹45-65 per kg',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=400&auto=format&fit=crop',
        description: 'High-quality galvanized steel sheets with excellent corrosion resistance.',
        specifications: {
          coating: 'Zinc Coated',
          standard: 'IS 277',
          finish: 'Commercial'
        }
      },
      {
        id: 'p5',
        name: 'Color Coated Sheets',
        category: 'Steel Sheets',
        thickness: ['0.4mm', '0.5mm', '0.7mm'],
        colors: ['RAL Colors', 'Custom Colors'],
        priceRange: '₹55-75 per kg',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop',
        description: 'Pre-painted steel sheets available in various colors and finishes.',
        specifications: {
          coating: 'PVDF/Polyester',
          standard: 'IS 513',
          finish: 'Matt/Gloss'
        }
      },
      {
        id: 'p6',
        name: 'Roofing Sheets',
        category: 'Steel Sheets',
        profiles: ['Corrugated', 'Trapezoidal', 'Standing Seam'],
        lengths: ['Custom lengths up to 12m'],
        priceRange: '₹50-70 per kg',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=400&auto=format&fit=crop',
        description: 'Durable roofing sheets designed for long-lasting protection.',
        specifications: {
          material: 'Galvanized Steel',
          profile: 'Corrugated',
          coating: 'Zinc Aluminium'
        }
      }
    ],
    specializations: ['Custom Fabrication', 'Large Volume Orders', 'Quick Delivery'],
    description: 'Premier manufacturer of high-quality steel sheets and roofing solutions. Specializes in galvanized and color-coated steel products for construction and industrial applications.',
    achievements: [
      'Quality Supplier Award 2023',
      'Best Manufacturing Unit 2022',
      'Export Excellence Award 2021'
    ],
    orders: [
      {
        id: 'ORD-004',
        customerName: 'Metro Construction Co.',
        customerEmail: 'orders@metroconstruction.com',
        orderDate: '2024-01-10',
        status: 'completed',
        totalAmount: 2100000,
        items: [
          {
            productId: 'p4',
            productName: 'Galvanized Steel Sheets',
            quantity: 15000,
            unitPrice: 55,
            totalPrice: 825000
          },
          {
            productId: 'p5',
            productName: 'Color Coated Sheets',
            quantity: 10000,
            unitPrice: 65,
            totalPrice: 650000
          }
        ],
        deliveryAddress: 'Industrial Zone, Delhi - 110001',
        notes: 'Bulk order - priority delivery'
      },
      {
        id: 'ORD-005',
        customerName: 'Steel Works India',
        customerEmail: 'procurement@steelworks.com',
        orderDate: '2024-01-18',
        status: 'in_progress',
        totalAmount: 1200000,
        items: [
          {
            productId: 'p6',
            productName: 'Roofing Sheets',
            quantity: 8000,
            unitPrice: 60,
            totalPrice: 480000
          },
          {
            productId: 'p4',
            productName: 'Galvanized Steel Sheets',
            quantity: 5000,
            unitPrice: 55,
            totalPrice: 275000
          }
        ],
        deliveryAddress: 'Factory Area, Chennai - 600001',
        notes: 'Custom cutting required'
      }
    ],
    productsCount: 3,
    turnover: '₹75 Crores',
    exportCountries: 8,
    teamSize: 200
  },
  {
    id: 'mss',
    name: 'MSS',
    location: 'Pune, Maharashtra',
    specialization: 'Bricks & Blocks',
    established: 2012,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
    rating: 4.4,
    founder: {
      name: 'Gosal Singh Rathore',
      experience: '12 years',
      qualification: 'Diploma in Civil Engineering'
    },
    companyInfo: {
      employees: 80,
      annualTurnover: '₹25 Crores',
      exportCountries: 3,
      certifications: ['BIS 3495', 'IGBC Approved', 'GRIHA Certified']
    },
    contact: {
      phone: '+91 98234 56789',
      email: 'orders@mss.com',
      website: 'mss.com',
      address: 'Survey No. 123, Chakan Industrial Area, Pune - 410501, Maharashtra'
    },
    products: [
      {
        id: 'p7',
        name: 'Clay Bricks',
        category: 'Bricks',
        types: ['Common Bricks', 'Facing Bricks', 'Engineering Bricks'],
        sizes: ['230x110x70mm', '230x110x100mm'],
        priceRange: '₹4-8 per piece',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
        description: 'Traditional clay bricks with excellent compressive strength.',
        specifications: {
          compressiveStrength: '35-40 kg/cm²',
          waterAbsorption: '15-20%',
          size: 'Standard'
        }
      },
      {
        id: 'p8',
        name: 'Fly Ash Bricks',
        category: 'Bricks',
        types: ['Standard', 'High Strength', 'Lightweight'],
        sizes: ['230x110x70mm', '230x110x100mm'],
        priceRange: '₹3-6 per piece',
        image: 'https://images.unsplash.com/photo-1572998133418-2be45e29a8d4?q=80&w=400&auto=format&fit=crop',
        description: 'Eco-friendly bricks made from fly ash, perfect for modern construction.',
        specifications: {
          compressiveStrength: '70-100 kg/cm²',
          waterAbsorption: '12-15%',
          size: 'Standard'
        }
      },
      {
        id: 'p9',
        name: 'Concrete Blocks',
        category: 'Blocks',
        types: ['Solid', 'Hollow', 'AAC Blocks'],
        sizes: ['400x200x200mm', '600x200x200mm'],
        priceRange: '₹25-45 per piece',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=400&auto=format&fit=crop',
        description: 'Versatile concrete blocks for various construction needs.',
        specifications: {
          compressiveStrength: '30-35 kg/cm²',
          density: '1800-2000 kg/m³',
          size: 'Standard'
        }
      }
    ],
    specializations: ['Eco-Friendly Products', 'Custom Sizes', 'Bulk Supply'],
    description: 'Quality brick manufacturer focused on sustainable and eco-friendly building materials. Specializes in clay bricks, fly ash bricks, and concrete blocks for residential and commercial construction.',
    achievements: [
      'Green Building Material Award 2023',
      'Quality Certification 2022',
      'Regional Supplier Award 2021'
    ],
    orders: [
      {
        id: 'ORD-006',
        customerName: 'Eco Builders Ltd.',
        customerEmail: 'orders@ecobuilders.com',
        orderDate: '2024-01-12',
        status: 'completed',
        totalAmount: 350000,
        items: [
          {
            productId: 'p7',
            productName: 'Clay Bricks',
            quantity: 50000,
            unitPrice: 6,
            totalPrice: 300000
          },
          {
            productId: 'p8',
            productName: 'Fly Ash Bricks',
            quantity: 10000,
            unitPrice: 5,
            totalPrice: 50000
          }
        ],
        deliveryAddress: 'Green Valley, Pune - 411001',
        notes: 'Eco-friendly construction project'
      },
      {
        id: 'ORD-007',
        customerName: 'Urban Developers',
        customerEmail: 'procurement@urbandevelopers.com',
        orderDate: '2024-01-22',
        status: 'in_progress',
        totalAmount: 180000,
        items: [
          {
            productId: 'p9',
            productName: 'Concrete Blocks',
            quantity: 4000,
            unitPrice: 35,
            totalPrice: 140000
          },
          {
            productId: 'p7',
            productName: 'Clay Bricks',
            quantity: 10000,
            unitPrice: 6,
            totalPrice: 60000
          }
        ],
        deliveryAddress: 'Commercial Complex, Mumbai - 400001',
        notes: 'High-rise building project'
      }
    ],
    productsCount: 3,
    turnover: '₹25 Crores',
    exportCountries: 3,
    teamSize: 80
  }
];

// Function to get manufacturer by ID
export const getManufacturerById = (id) => {
  return manufacturersData.find(manufacturer => manufacturer.id === id);
}

export const getAllManufacturers = () => {
  return manufacturersData.map(({ 
    id, 
    name, 
    location, 
    products, 
    image, 
    companyInfo, 
    orders,
    specialization,
    established,
    rating 
  }) => ({
    id,
    name,
    location,
    specialization,
    established,
    rating,
    productsCount: products.length,
    ordersCount: orders ? orders.length : 0,
    image,
    turnover: companyInfo.annualTurnover,
    employees: companyInfo.employees,
    exportCountries: companyInfo.exportCountries
  }));
}


// Function to get product details by manufacturer ID and product ID
export const getProductDetails = (manufacturerId, productId) => {
  const manufacturer = getManufacturerById(manufacturerId);
  if (!manufacturer) return null;
  
  const product = manufacturer.products.find(p => p.id === productId);
  return product ? { 
    ...product, 
    manufacturerName: manufacturer.name,
    manufacturerLocation: manufacturer.location 
  } : null;
}

// Function to place a new order
export const placeOrder = (manufacturerId, orderData) => {
  const manufacturer = getManufacturerById(manufacturerId);
  if (!manufacturer) {
    return { success: false, message: 'Manufacturer not found' };
  }

  // Generate new order ID
  const newOrderId = `ORD-${String(manufacturer.orders.length + 1).padStart(3, '0')}`;
  
  const newOrder = {
    id: newOrderId,
    ...orderData,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };

  return {
    success: true,
    order: newOrder,
    message: 'Order placed successfully'
  };
}

// Function to get navigation path for manufacturer view
export const getManufacturerViewPath = (manufacturerId) => {
  return `/superadmin/manufacturers/${manufacturerId}`;
}

// Export as default for easier imports
const ManufacturersData = {
  manufacturersData,
  getManufacturerById,
  getAllManufacturers,
  getProductDetails,
  placeOrder,
  getManufacturerViewPath
};

export default ManufacturersData;
