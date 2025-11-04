"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const host = process.env.APP_HOST || 'localhost';
const port = process.env.APP_PORT || 7700;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
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
const scan_route_1 = __importDefault(require("./modules/scan/scan.route"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const admin_route_1 = __importDefault(require("./modules/admin/admin.route"));
const product_route_1 = __importDefault(require("./modules/product/product.route"));
const purchase_route_1 = __importDefault(require("./modules/purchase/purchase.route"));
const transaction_route_1 = __importDefault(require("./modules/transaction/transaction.route"));
const token_route_1 = __importDefault(require("./modules/token/token.route"));
const orderhistory_route_1 = __importDefault(require("./modules/user/[userId]/orderhistory.route"));
const manufacturer_route_1 = __importDefault(require("./modules/manufacturer/manufacturer.route"));
app.use('/api', scan_route_1.default);
app.use('/api/users', user_route_1.default);
app.use('/api/admin-auth', admin_route_1.default);
app.use('/api/products', product_route_1.default);
app.use("/api/purchases", purchase_route_1.default);
app.use('/api/transactions', transaction_route_1.default);
app.use('/api/tokens', token_route_1.default);
app.use('/api', orderhistory_route_1.default);
app.use('/api/manufacturers', manufacturer_route_1.default);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.listen(app.get("port"), () => {
    console.log("Server started at %s : %d ", app.get("host"), app.get("port"));
});
module.exports = app;
