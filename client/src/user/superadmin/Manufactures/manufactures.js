export const manufacturersData = [];

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
