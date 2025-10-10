"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_service_1 = require("./order.service");
const router = express_1.default.Router();
// Create a new order
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield (0, order_service_1.createOrder)(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Create order error:', error.message);
        res.status(500).json({ error: error.message });
    }
}));
// Get orders with optional filters (e.g., by manufacturer, status)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, order_service_1.getOrders)(req.query);
        res.json(orders);
    }
    catch (error) {
        console.error('Get orders error:', error.message);
        res.status(500).json({ error: error.message });
    }
}));
// Assign order to manufacturer
router.post('/:orderId/assign', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { manufacturerId } = req.body;
        const updatedOrder = yield (0, order_service_1.assignOrderToManufacturer)(orderId, manufacturerId);
        res.json(updatedOrder);
    }
    catch (error) {
        console.error('Assign order error:', error.message);
        res.status(500).json({ error: error.message });
    }
}));
// Update order status (e.g., confirm or reject by manufacturer)
router.post('/:orderId/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const updatedOrder = yield (0, order_service_1.updateOrderStatus)(orderId, status);
        res.json(updatedOrder);
    }
    catch (error) {
        console.error('Update order status error:', error.message);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
