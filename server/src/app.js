const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const host = process.env.APP_HOST || 'localhost';
const port = process.env.APP_PORT || 7700;

app.use(express.json());
app.use(express.urlencoded());

//Express configuration.
app.set("host", host);
app.set("port", port);

//Using custom cors policy
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.append('Access-Control-Allow-Headers', '*');
  next();
});


app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});


const userApi = require('./modules/user/user.route.js');
const adminAuthApi = require('./modules/admin/admin.route.js');
const productApi = require('./modules/product/product.route.js');
const ordersApi = require('./modules/order/order.route.js');
const manufacturerApi = require('./modules/manufacturer/manufacturer.route.js');
const agentApi = require('./modules/agent/agent.route.js');

app.use('/api/users', userApi);
app.use('/api/admin-auth', adminAuthApi);
app.use('/api/products', productApi);
app.use('/api/orders', ordersApi);
app.use('/api/manufacturers', manufacturerApi);
app.use('/api/agents', agentApi);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(app.get("port"), () => {
  console.log(
    "Server started at %s : %d ",
    app.get("host"),
    app.get("port"),
  );
});

module.exports = app;
