# TODO: Add Search Endpoint to Products API

- [x] Edit `server/src/modules/product/product.service.js` to add `searchProducts` function and export it
- [x] Edit `server/src/modules/product/product.route.js` to add the new `/search` GET route and import `searchProducts`
- [ ] Test the new endpoint by making requests with query parameters (e.g., `/api/products/search?name=example&category=electronics`)
