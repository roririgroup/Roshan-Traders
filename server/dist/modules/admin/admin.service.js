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
exports.registerAdmin = registerAdmin;
exports.loginAdmin = loginAdmin;
const db_1 = require("../../shared/lib/db");
const auth_1 = require("../../shared/lib/utils/auth");
function registerAdmin(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield db_1.db.admin.findUnique({
            where: { email: payload.email },
        });
        if (existing)
            throw new Error("Admin already exists");
        const hashed = yield (0, auth_1.hashPassword)(payload.password);
        const admin = yield db_1.db.admin.create({
            data: Object.assign({ name: payload.name, email: payload.email, username: payload.username, password: hashed, role: payload.role || "Staff" }, (payload.phone && { phone: payload.phone })),
        });
        return { message: "Registered Successfully", admin };
    });
}
function loginAdmin(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield db_1.db.admin.findUnique({
            where: { email: payload.email },
        });
        if (!admin)
            throw new Error("Invalid credentials");
        const valid = yield (0, auth_1.comparePassword)(payload.password, admin.password);
        if (!valid)
            throw new Error("Invalid credentials");
        const token = (0, auth_1.generateToken)({
            id: admin.id,
            email: admin.email,
            role: admin.role,
        });
        return {
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };
    });
}
