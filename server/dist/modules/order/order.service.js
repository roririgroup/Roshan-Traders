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
exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.assignOrderToManufacturer = assignOrderToManufacturer;
exports.updateOrderStatus = updateOrderStatus;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createOrder(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { customerName, customerEmail, orderDate, totalAmount, deliveryAddress, notes, items } = data;
        const order = yield prisma.order.create({
            data: {
                customerName,
                customerEmail,
                orderDate,
                totalAmount,
                deliveryAddress,
                notes,
                status: client_1.OrderStatus.PENDING,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        return order;
    });
}

function getOrders(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = {};
        if (filters.manufacturerId) {
            where.manufacturerId = filters.manufacturerId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        const orders = yield prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                manufacturer: true,
            },
        });
        return orders;
    });
}
function assignOrderToManufacturer(orderId, manufacturerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedOrder = yield prisma.order.update({
            where: { id: orderId },
            data: {
                manufacturerId,
                status: client_1.OrderStatus.IN_PROGRESS,
            },
            include: {
                items: true,
                manufacturer: true,
            },
        });
        return updatedOrder;
    });
}
function updateOrderStatus(orderId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedOrder = yield prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                items: true,
                manufacturer: true,
            },
        });
        return updatedOrder;
    });
}
