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
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
const db_1 = require("../../shared/lib/db");
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.product.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    });
}
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.product.findUnique({
            where: {
                id: id,
            },
        });
    });
}
function createProduct(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.product.create({
            data: {
                id: payload.id || Math.random().toString(36).substring(2, 15),
                name: payload.name,
                category: payload.category || 'General',
                priceRange: payload.priceRange,
                imageUrl: payload.imageUrl,
                manufacturerId: payload.manufacturerId,
                qualityRating: payload.qualityRating || 4.0,
                offer: payload.offer,
                buyersCount: payload.buyersCount || 0,
                returnExchange: payload.returnExchange || false,
                cashOnDelivery: payload.cashOnDelivery || false,
                paymentOptions: payload.paymentOptions,
                description: payload.description,
                isActive: payload.isActive !== undefined ? payload.isActive : true,
            },
        });
    });
}
function updateProductById(id, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.product.update({
            where: {
                id: id,
            },
            data: {
                name: payload.name,
                category: payload.category,
                priceRange: payload.priceRange,
                imageUrl: payload.imageUrl,
                manufacturerId: payload.manufacturerId,
                qualityRating: payload.qualityRating,
                offer: payload.offer,
                buyersCount: payload.buyersCount,
                returnExchange: payload.returnExchange,
                cashOnDelivery: payload.cashOnDelivery,
                paymentOptions: payload.paymentOptions,
                description: payload.description,
                isActive: payload.isActive,
            },
        });
    });
}
function deleteProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.product.update({
            where: {
                id: id,
            },
            data: {
                isActive: false,
            },
        });
    });
}
