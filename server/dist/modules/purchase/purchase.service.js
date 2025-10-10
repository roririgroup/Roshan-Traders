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
exports.createPurchase = createPurchase;
const db_1 = require("../../shared/lib/db");
function createPurchase(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, items }) {
        if (!userId || !items || items.length === 0) {
            throw new Error("User ID and items are required");
        }
        const user = yield db_1.db.user.findUnique({ where: { id: userId } });
        if (!user || user.status !== "Active") {
            throw new Error("Invalid or inactive user");
        }
        let totalAmount = 0;
        const purchaseDetails = [];
        for (const item of items) {
            const product = yield db_1.db.product.findUnique({ where: { id: item.productId } });
            if (!product || !product.isActive || product.stock < item.quantity) {
                throw new Error(`Invalid or out-of-stock product: ${item.productId}`);
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;
            purchaseDetails.push({
                productId: product.id,
                unitPrice: product.price,
                quantity: item.quantity,
                totalAmount: itemTotal,
            });
        }
        if (user.balance < totalAmount) {
            throw new Error("Insufficient balance");
        }
        const transaction = yield db_1.db.transaction.create({
            data: {
                userId,
                type: "Purchase",
                amount: totalAmount,
                balanceBefore: user.balance,
                balanceAfter: user.balance - totalAmount,
                description: "Food product purchase",
            },
        });
        const createdPurchases = [];
        for (const detail of purchaseDetails) {
            const purchase = yield db_1.db.purchase.create({
                data: {
                    userId,
                    productId: detail.productId,
                    transactionId: transaction.id,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                    totalAmount: detail.totalAmount,
                },
            });
            yield db_1.db.product.update({
                where: { id: detail.productId },
                data: {
                    stock: { decrement: detail.quantity },
                },
            });
            createdPurchases.push(purchase);
        }
        yield db_1.db.user.update({
            where: { id: userId },
            data: {
                balance: { decrement: totalAmount },
                lastUsed: new Date(),
            },
        });
        return {
            message: "Purchase successful",
            transactionId: transaction.id,
            totalAmount,
            purchases: createdPurchases,
        };
    });
}
