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
const orderHistory_service_1 = require("./orderHistory.service ");
const router = express_1.default.Router();
router.get('/order-history', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, orderHistory_service_1.getAllOrderHistories)();
        res.status(200).json({ success: true, orders });
    }
    catch (err) {
        console.error('Order history error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
module.exports = router;
