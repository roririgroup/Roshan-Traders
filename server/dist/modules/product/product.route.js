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
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("./product.service");
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, product_service_1.getAllProducts)();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, product_service_1.getProductById)(req.params.id);
        if (!response) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const response = yield (0, product_service_1.createProduct)(payload);
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const id = req.params.id;
        const response = yield (0, product_service_1.updateProductById)(id, payload);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield (0, product_service_1.deleteProductById)(id);
        res.status(200).json('Product deleted successfully');
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}));
exports.default = router;
