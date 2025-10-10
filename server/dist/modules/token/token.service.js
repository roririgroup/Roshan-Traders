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
exports.createToken = createToken;
const db_1 = require("../../shared/lib/db");
const nodemailer_1 = __importDefault(require("nodemailer"));
function createToken(_a) {
    return __awaiter(this, arguments, void 0, function* ({ purchaseId, items }) {
        const purchase = yield db_1.db.purchase.findUnique({
            where: { id: purchaseId },
            include: { user: true },
        });
        if (!purchase) {
            throw new Error("Purchase not found");
        }
        const existingToken = yield db_1.db.token.findUnique({
            where: { purchaseId },
        });
        if (existingToken) {
            return existingToken;
        }
        const tokenNumber = `TK-${Date.now().toString().slice(-6)}`;
        const email = purchase.user.email;
        const unitPrice = purchase.unitPrice;
        if (!email) {
            throw new Error("User does not have an email");
        }
        const token = yield db_1.db.token.create({
            data: {
                userId: purchase.userId,
                purchaseId: purchase.id,
                tokenNumber,
                totalAmount: purchase.totalAmount,
                items: JSON.stringify(items),
                sentTo: email,
                sentAt: new Date(),
                emailSent: true,
                smsSent: false,
                status: "Pending",
            },
        });
        console.log(items);
        yield sendTokenEmail(purchase.user.email, tokenNumber, items, unitPrice);
        return token;
    });
}
function sendTokenEmail(to, tokenNumber, items, grandTotal) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "kprahul1143@gmail.com",
                pass: "evqa zlee flqk kikc",
            },
        });
        const itemList = items
            .map((item) => {
            const name = item.name || "Unnamed";
            const qty = item.quantity || 0;
            const unit = item.price || 0;
            const itemTotal = qty * unit;
            return `• ${name} x ${qty} @ ₹${unit} = ₹${itemTotal}`;
        })
            .join("<br>");
        console.log("EMAIL ITEMS:", items);
        const mailOptions = {
            from: "Roriri Cafe<kprahul1143@gmail.com>",
            to,
            subject: `🧾 Roriri Cafe Token: ${tokenNumber}`,
            html: `
      <h2>✅ Order Confirmation</h2>
       <p><strong>Token Number:</strong> ${tokenNumber}</p>
      <p><strong>Total:</strong> ₹${grandTotal}</p>
      <p><strong>Items:</strong><br>${itemList}</p>
      <br />
      <p>Thank you for ordering from Roriri Cafe!</p>
    `,
        };
        yield transporter.sendMail(mailOptions);
    });
}
