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
exports.createTransaction = createTransaction;
const db_1 = require("../../shared/lib/db");
function createTransaction(userId, items, totalAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!userId || !items || totalAmount <= 0) {
            throw new Error('Invalid transaction data');
        }
        const result = yield db_1.db.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const user = yield tx.user.findUnique({ where: { userId } });
            if (!user || user.balance < totalAmount) {
                throw new Error('Insufficient balance or user not found');
            }
            const newBalance = user.balance - totalAmount;
            yield tx.user.update({
                where: { id: user.id },
                data: { balance: newBalance },
            });
            const transaction = yield tx.transaction.create({
                data: {
                    userId: user.id,
                    type: 'Purchase',
                    amount: totalAmount,
                    balanceBefore: user.balance,
                    balanceAfter: newBalance,
                    description: `Purchase of ${items.length} items`,
                    reference: `ORDER_${Date.now()}`,
                    items: items,
                },
            });
            const createdPurchases = [];
            for (const item of items) {
                const product = yield tx.product.findUnique({ where: { id: item.id } });
                if (!product || !product.isActive || product.stock < item.quantity) {
                    throw new Error(`Invalid or out-of-stock product: ${item.id}`);
                }
                const itemTotal = product.price * item.quantity;
                const purchase = yield tx.purchase.create({
                    data: {
                        userId: user.id,
                        productId: item.id,
                        transactionId: transaction.id,
                        quantity: item.quantity,
                        unitPrice: product.price,
                        totalAmount: itemTotal,
                    },
                });
                yield tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } },
                });
                createdPurchases.push(purchase);
            }
            return {
                orderId: transaction.id,
                newBalance,
                estimatedTime: '15 mins',
                purchases: createdPurchases,
            };
        }));
        return result;
    });
}
