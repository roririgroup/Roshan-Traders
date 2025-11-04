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
const purchase_service_1 = require("./purchase.service");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, purchase_service_1.createPurchase)(req.body);
        res.status(201).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error('Purchase Error:', error.message);
        const statusCode = error.message.includes('Invalid') || error.message.includes('Insufficient')
            ? 400
            : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
}));

module.exports = router;
