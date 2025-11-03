import React, { useState } from "react";
import Brick from "../../../assets/brick.jpg"; // ✅ added correct import
import HalfBrick from "../../../assets/half-brick.webp"; // ✅ added correct import

const ProductAvailability = () => {
  // Handle image load errors (use placeholder if missing)
  const handleImageError = (e) => {
    const productName = e.target.alt.replace(" ", "+");
    e.target.src = `https://via.placeholder.com/300x200/dc2626/ffffff?text=${productName}`;
  };
  

  // Product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Full Red Brick",
      image: Brick,
      stock: 1500,
      category: "full-brick",
      description: "Standard full-sized red bricks for construction",
      
    },
    {
      id: 2,
      name: "Half Red Brick",
      image: HalfBrick,
      stock: 800,
      category: "half-brick",
      description: "Durable half-sized bricks for partition walls and detailing",
    
    },
  ]);
  

  // Stock status function
  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "Out of Stock", color: "bg-red-500" };
    if (stock < 100) return { status: "Low Stock", color: "bg-yellow-500" };
    return { status: "In Stock", color: "bg-green-500" };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Red Brick Inventory
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Check availability and stock levels of our brick products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={handleImageError}
                    className="w-full h-64 object-cover"
                  />
                  {/* Stock Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${stockStatus.color}`}
                    >
                      {stockStatus.status}
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {product.category === "full-brick"
                        ? "Full Size"
                        : "Half Size"}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mb-4">{product.description}</p>

                  {/* Dimensions */}
                  

                  {/* Stock Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Available Stock:
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {product.stock.toLocaleString()} units
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${stockStatus.color}`}
                        style={{
                          width: `${Math.min(
                            (product.stock / 2000) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span className="font-medium">Max: 2,000</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      "Weather Proof",
                      "Durable",
                      "Fire Resistant",
                      "Low Maintenance",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-green-700"
                      >
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      Order Now
                    </button>
                    <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 font-medium">
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inventory Summary */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Inventory Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {products
                  .reduce((total, product) => total + product.stock, 0)
                  .toLocaleString()}
              </div>
              <div className="text-gray-700 font-medium">
                Total Bricks Available
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Across all products
              </div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {products.filter((p) => p.stock > 0).length}/{products.length}
              </div>
              <div className="text-gray-700 font-medium">Products In Stock</div>
              <div className="text-sm text-gray-500 mt-1">
                Available for order
              </div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {products.filter((p) => p.stock < 100).length}
              </div>
              <div className="text-gray-700 font-medium">Low Stock Items</div>
              <div className="text-sm text-gray-500 mt-1">Need restocking</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()} | Next delivery:{" "}
            {new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductAvailability;

