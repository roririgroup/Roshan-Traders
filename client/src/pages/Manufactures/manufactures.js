export const manufacturersData = [
  {
    id: 'rn-tiles',
    name: 'RN Tiles',
    location: 'Morbi, Gujarat',
    establishedYear: 2010,
    image: 'https://images.unsplash.com/photo-1581093458791-9d1f8f5b88f8?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop',
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
      website: 'www.rntiles.com',
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
        image: 'https://images.unsplash.com/photo-1581093458791-9d1f8f5b88f8?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p2',
        name: 'Vitrified Tiles',
        category: 'Tiles',
        sizes: ['600x600mm', '800x800mm'],
        finishes: ['Polished', 'Lapato', 'Carving'],
        priceRange: '₹35-65 per sq.ft',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p3',
        name: 'Wall Tiles',
        category: 'Tiles',
        sizes: ['300x450mm', '300x600mm', '400x800mm'],
        finishes: ['Glossy', 'Matte', 'Digital Print'],
        priceRange: '₹18-35 per sq.ft',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=400&auto=format&fit=crop'
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
    ]
  },
  {
    id: 'isr',
    name: 'ISR',
    location: 'Nashik, Maharashtra',
    establishedYear: 2008,
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=200&auto=format&fit=crop',
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
      email: 'sales@steelmaxsheets.com',
      website: 'www.steelmaxsheets.com',
      address: 'MIDC Industrial Area, Ambad, Nashik - 422010, Maharashtra'
    },
    products: [
      {
        id: 'p4',
        name: 'Galvanized Steel Sheets',
        category: 'Steel Sheets',
        thickness: ['0.5mm', '0.7mm', '1.0mm', '1.2mm'],
        grades: ['SGCC', 'DX51D', 'S350GD'],
        priceRange: '₹45-65 per kg',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p5',
        name: 'Color Coated Sheets',
        category: 'Steel Sheets',
        thickness: ['0.4mm', '0.5mm', '0.7mm'],
        colors: ['RAL Colors', 'Custom Colors'],
        priceRange: '₹55-75 per kg',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p6',
        name: 'Roofing Sheets',
        category: 'Steel Sheets',
        profiles: ['Corrugated', 'Trapezoidal', 'Standing Seam'],
        lengths: ['Custom lengths up to 12m'],
        priceRange: '₹50-70 per kg',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=400&auto=format&fit=crop'
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
    ]
  },
  {
    id: 'mss',
    name: 'MSS',
    location: 'Pune, Maharashtra',
    establishedYear: 2012,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
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
      email: 'orders@alphabricks.com',
      website: 'www.alphabricks.com',
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
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p8',
        name: 'Fly Ash Bricks',
        category: 'Bricks',
        types: ['Standard', 'High Strength', 'Lightweight'],
        sizes: ['230x110x70mm', '230x110x100mm'],
        priceRange: '₹3-6 per piece',
        image: 'https://images.unsplash.com/photo-1572998133418-2be45e29a8d4?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p9',
        name: 'Concrete Blocks',
        category: 'Blocks',
        types: ['Solid', 'Hollow', 'AAC Blocks'],
        sizes: ['400x200x200mm', '600x200x200mm'],
        priceRange: '₹25-45 per piece',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=400&auto=format&fit=crop'
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
      },
      {
        id: 'ORD-008',
        customerName: 'Rural Housing Corp.',
        customerEmail: 'orders@ruralhousing.com',
        orderDate: '2024-01-28',
        status: 'pending',
        totalAmount: 120000,
        items: [
          {
            productId: 'p8',
            productName: 'Fly Ash Bricks',
            quantity: 20000,
            unitPrice: 5,
            totalPrice: 100000
          },
          {
            productId: 'p9',
            productName: 'Concrete Blocks',
            quantity: 500,
            unitPrice: 35,
            totalPrice: 17500
          }
        ],
        deliveryAddress: 'Village Development, Satara - 415001',
        notes: 'Government housing scheme'
      }
    ]
  },
  {
    id: 'rks',
    name: 'RKS',
    location: 'Pune, Maharashtra',
    establishedYear: 2012,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
    founder: {
      name: 'Chellaya Reddy',
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
      email: 'orders@alphabricks.com',
      website: 'www.alphabricks.com',
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
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p8',
        name: 'Fly Ash Bricks',
        category: 'Bricks',
        types: ['Standard', 'High Strength', 'Lightweight'],
        sizes: ['230x110x70mm', '230x110x100mm'],
        priceRange: '₹3-6 per piece',
        image: 'https://images.unsplash.com/photo-1572998133418-2be45e29a8d4?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'p9',
        name: 'Concrete Blocks',
        category: 'Blocks',
        types: ['Solid', 'Hollow', 'AAC Blocks'],
        sizes: ['400x200x200mm', '600x200x200mm'],
        priceRange: '₹25-45 per piece',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=400&auto=format&fit=crop'
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
      },
      {
        id: 'ORD-008',
        customerName: 'Rural Housing Corp.',
        customerEmail: 'orders@ruralhousing.com',
        orderDate: '2024-01-28',
        status: 'pending',
        totalAmount: 120000,
        items: [
          {
            productId: 'p8',
            productName: 'Fly Ash Bricks',
            quantity: 20000,
            unitPrice: 5,
            totalPrice: 100000
          },
          {
            productId: 'p9',
            productName: 'Concrete Blocks',
            quantity: 500,
            unitPrice: 35,
            totalPrice: 17500
          }
        ],
        deliveryAddress: 'Village Development, Satara - 415001',
        notes: 'Government housing scheme'
      }
    ]
  },
  {
    id: 'premium-steel',
    name: 'Premium Steel Works',
    location: 'Chennai, Tamil Nadu',
    establishedYear: 2015,
    image: 'https://images.unsplash.com/photo-1581093458791-9d1f8f5b88f8?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200&auto=format&fit=crop',
    founder: {
      name: 'Dr. Priya Sharma',
      experience: '10 years',
      qualification: 'Ph.D. Materials Science'
    },
    companyInfo: {
      employees: 120,
      annualTurnover: '₹40 Crores',
      exportCountries: 12,
      certifications: ['ISO 9001:2015', 'IATF 16949', 'OHSAS 18001']
    },
    contact: {
      phone: '+91 98765 12345',
      email: 'info@premiumsteel.com',
      website: 'www.premiumsteel.com',
      address: 'Industrial Area, Chennai - 600001, Tamil Nadu'
    },
    products: [
      {
        id: 'ps1',
        name: 'Stainless Steel Sheets',
        category: 'Steel Products',
        grades: ['304', '316L', '430'],
        thickness: ['0.5mm', '1.0mm', '2.0mm'],
        priceRange: '₹180-350 per kg',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=400&auto=format&fit=crop'
      }
    ],
    specializations: ['Precision Engineering', 'Custom Fabrication', 'Quality Control'],
    description: 'Leading manufacturer of high-grade stainless steel products with advanced manufacturing capabilities and strict quality standards.',
    achievements: [
      'Excellence in Innovation Award 2023',
      'Best Quality Supplier 2022',
      'Export Achievement Award 2021'
    ],
    orders: []
  },
  {
    id: 'green-construction',
    name: 'Green Construction Materials',
    location: 'Bangalore, Karnataka',
    establishedYear: 2018,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=200&auto=format&fit=crop',
    founder: {
      name: 'Arjun Kumar Mehta',
      experience: '8 years',
      qualification: 'M.Tech Environmental Engineering'
    },
    companyInfo: {
      employees: 65,
      annualTurnover: '₹18 Crores',
      exportCountries: 5,
      certifications: ['IGBC Platinum', 'GRIHA 5-Star', 'LEED Certified']
    },
    contact: {
      phone: '+91 87654 32109',
      email: 'contact@greenconstruction.com',
      website: 'www.greenconstruction.com',
      address: 'Tech Park, Bangalore - 560001, Karnataka'
    },
    products: [
      {
        id: 'gc1',
        name: 'Eco-Friendly Bricks',
        category: 'Sustainable Materials',
        types: ['Fly Ash Bricks', 'Recycled Bricks', 'Bio Bricks'],
        sizes: ['230x110x70mm', '230x110x100mm'],
        priceRange: '₹5-8 per piece',
        image: 'https://images.unsplash.com/photo-1572998133418-2be45e29a8d4?q=80&w=400&auto=format&fit=crop'
      }
    ],
    specializations: ['Sustainable Materials', 'Green Technology', 'Environmental Solutions'],
    description: 'Pioneer in eco-friendly construction materials, committed to sustainable building practices and environmental conservation.',
    achievements: [
      'Green Innovation Award 2023',
      'Sustainability Excellence 2022',
      'Environmental Impact Award 2021'
    ],
    orders: []
  }
]

export const getManufacturerById = (id) => {
  return manufacturersData.find(manufacturer => manufacturer.id === id)
}

export const getAllManufacturers = () => {
  return manufacturersData.map(({ id, name, location, products, image, companyInfo, orders }) => ({
    id,
    name,
    location,
    productsCount: products.length,
    ordersCount: orders ? orders.length : 0,
    image,
    turnover: companyInfo.annualTurnover,
    employees: companyInfo.employees
  }))
}