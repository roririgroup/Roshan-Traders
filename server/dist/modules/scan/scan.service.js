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
exports.scanQRCode = scanQRCode;
const db_1 = require("../../shared/lib/db");
function scanQRCode(qrCode) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!qrCode)
            throw new Error('QR Code is required');
        const user = yield db_1.db.user.findFirst({
            where: {
                OR: [
                    { qrCode: qrCode },
                    { userId: qrCode },
                    { email: qrCode },
                    { pin: qrCode }
                ],
                status: 'Active'
            },
            include: {
                transactions: {
                    where: { type: 'Purchase' },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!user)
            throw new Error('User not found');
        return {
            userId: user.userId,
            name: user.name,
            role: user.userType,
            balance: user.balance,
            email: user.email,
            phone: user.phone,
            qrCode: user.qrCode,
            pin: user.pin,
            department: user.department,
            UserType: user.userType,
            recentPurchases: user.transactions,
        };
    });
}
