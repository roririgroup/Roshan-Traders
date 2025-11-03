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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.getUserByQrCode = getUserByQrCode;
exports.getUserByUserId = getUserByUserId;
exports.createUser = createUser;
exports.updateUserById = updateUserById;
exports.updateUserBalance = updateUserBalance;
exports.rechargeUserBalance = rechargeUserBalance;
exports.verifyUserPin = verifyUserPin;
exports.setUserPin = setUserPin;
exports.checkUserHasPin = checkUserHasPin;
exports.deleteUserById = deleteUserById;
exports.getUserStats = getUserStats;
exports.searchUsers = searchUsers;
exports.getUserActivity = getUserActivity;
exports.exportUserData = exportUserData;
exports.validateUserData = validateUserData;
exports.getSystemStats = getSystemStats;
const db_1 = require("../../shared/lib/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Constants
const SALT_ROUNDS = 12;
const MAX_PIN_ATTEMPTS = 3;
const PIN_LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
function getAllUsers(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = {};
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            where.status = filters.status;
        }
        else {
            where.status = 'Active';
        }
        if (filters === null || filters === void 0 ? void 0 : filters.userType) {
            where.userType = filters.userType;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.department) {
            where.department = {
                contains: filters.department,
                mode: 'insensitive'
            };
        }
        if (filters === null || filters === void 0 ? void 0 : filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { userId: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
        const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
        const skip = (page - 1) * limit;
        const [users, total] = yield Promise.all([
            db_1.db.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    phone: true,
                    userType: true,
                    status: true,
                    pin: true,
                    balance: true,
                    department: true,
                    qrCode: true,
                    lastUsed: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            transactions: true,
                            purchases: true
                        }
                    }
                }
            }),
            db_1.db.user.count({ where })
        ]);
        return {
            users,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    });
}
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.user.findUnique({
            where: {
                userId: id,
            },
            include: {
                transactions: {
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                recharges: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        admin: {
                            select: {
                                name: true,
                                username: true
                            }
                        }
                    }
                },
                purchases: {
                    take: 5,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        }
                    }
                },
                tokens: {
                    where: {
                        status: 'Pending'
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 3
                }
            },
        });
    });
}
function getUserByQrCode(qrCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findFirst({
            where: {
                qrCode: qrCode,
                status: 'Active',
            },
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                phone: true,
                userType: true,
                status: true,
                balance: true,
                department: true,
                qrCode: true,
                qrCodeImage: true,
                pin: true,
                pinAttempts: true,
                pinLockedUntil: true,
                lastUsed: true,
                createdAt: true,
            },
        });
        if (user) {
            yield db_1.db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    lastUsed: new Date(),
                },
            });
            const { pin } = user, userWithoutPin = __rest(user, ["pin"]);
            return Object.assign(Object.assign({}, userWithoutPin), { hasPin: !!pin, isLocked: user.pinLockedUntil && new Date() < user.pinLockedUntil });
        }
        return null;
    });
}
function getUserByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.user.findFirst({
            where: {
                userId: userId,
                status: 'Active',
            },
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                phone: true,
                userType: true,
                status: true,
                balance: true,
                pin: true,
                department: true,
                qrCode: true,
                lastUsed: true,
                createdAt: true,
            }
        });
    });
}
function createUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const qrCode = generateQrCode(payload.userType, payload.name);
        let hashedPin = null;
        if (payload.pin && payload.pin.length === 4) {
            hashedPin = yield bcrypt_1.default.hash(payload.pin, SALT_ROUNDS);
        }
        return yield db_1.db.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.create({
                data: {
                    userId: payload.userId || generateUserId(payload.userType),
                    name: payload.name,
                    email: payload.email,
                    phone: payload.phone,
                    userType: payload.userType,
                    status: payload.status || 'Active',
                    qrCode: qrCode,
                    qrCodeImage: payload.qrCodeImage,
                    balance: payload.balance || 0.00,
                    department: payload.department,
                    pin: hashedPin,
                    pinAttempts: 0,
                    pinLockedUntil: null
                },
            });
            if (payload.balance && payload.balance > 0) {
                yield prisma.transaction.create({
                    data: {
                        userId: user.id,
                        type: 'Recharge',
                        amount: payload.balance,
                        balanceBefore: 0,
                        balanceAfter: payload.balance,
                        description: 'Initial balance on account creation',
                        reference: user.id
                    }
                });
            }
            return user;
        }));
    });
}
function updateUserById(id, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.user.update({
            where: {
                id: id,
            },
            data: Object.assign(Object.assign({}, payload), { updatedAt: new Date() }),
        });
    });
}
function updateUserBalance(id, amount, operation, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findUnique({
            where: { id: id },
            select: { balance: true, name: true, status: true },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.status !== 'Active') {
            throw new Error('Cannot update balance for inactive user');
        }
        const currentBalance = parseFloat(user.balance.toString());
        let newBalance;
        if (operation === 'add') {
            newBalance = currentBalance + amount;
        }
        else if (operation === 'subtract') {
            if (currentBalance < amount) {
                throw new Error('Insufficient balance');
            }
            newBalance = currentBalance - amount;
        }
        else {
            throw new Error('Invalid operation. Use "add" or "subtract"');
        }
        return yield db_1.db.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    balance: newBalance,
                    updatedAt: new Date(),
                },
            });
            yield prisma.transaction.create({
                data: {
                    userId: id,
                    type: operation === 'add' ? 'Recharge' : 'Purchase',
                    amount: amount,
                    balanceBefore: currentBalance,
                    balanceAfter: newBalance,
                    description: description || `Balance ${operation === 'add' ? 'added' : 'deducted'}`,
                }
            });
            return updatedUser;
        }));
    });
}
function rechargeUserBalance(userId, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findUnique({
            where: { id: userId },
            select: { balance: true, name: true, status: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.status !== 'Active') {
            throw new Error('Cannot recharge balance for inactive user');
        }
        if (payload.amount <= 0) {
            throw new Error('Recharge amount must be positive');
        }
        const currentBalance = parseFloat(user.balance.toString());
        const newBalance = currentBalance + payload.amount;
        return yield db_1.db.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    balance: newBalance,
                    updatedAt: new Date(),
                },
            });
            const recharge = yield prisma.recharge.create({
                data: {
                    userId: userId,
                    amount: payload.amount,
                    paymentMethod: payload.paymentMethod,
                    notes: payload.notes,
                    reference: payload.reference,
                    rechargedBy: payload.rechargedBy,
                },
            });
            yield prisma.transaction.create({
                data: {
                    userId: userId,
                    type: 'Recharge',
                    amount: payload.amount,
                    balanceBefore: currentBalance,
                    balanceAfter: newBalance,
                    description: `Balance recharged via ${payload.paymentMethod}`,
                    reference: recharge.id,
                },
            });
            return {
                user: updatedUser,
                recharge: recharge,
            };
        }));
    });
}
function verifyUserPin(userId, pin) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findUnique({
            where: { userId: userId },
            select: {
                pin: true,
                pinAttempts: true,
                pinLockedUntil: true,
                status: true,
                userId: true
            }
        });
        if (!user || user.status !== 'Active') {
            throw new Error('User not found or inactive');
        }
        if (!user.pin) {
            throw new Error('PIN not set for this user');
        }
        if (user.pinLockedUntil && new Date() < user.pinLockedUntil) {
            throw new Error('Account temporarily locked due to too many failed attempts');
        }
        const isValidPin = yield bcrypt_1.default.compare(pin, user.pin);
        if (isValidPin) {
            yield db_1.db.user.update({
                where: { userId: user.userId },
                data: {
                    pinAttempts: 0,
                    pinLockedUntil: null
                }
            });
            return { success: true, message: 'PIN verified successfully' };
        }
        else {
            const newAttempts = (user.pinAttempts || 0) + 1;
            let updateData = { pinAttempts: newAttempts };
            if (newAttempts >= MAX_PIN_ATTEMPTS) {
                updateData.pinLockedUntil = new Date(Date.now() + PIN_LOCK_DURATION);
            }
            yield db_1.db.user.update({
                where: { userId: user.userId },
                data: updateData
            });
            const attemptsRemaining = Math.max(0, MAX_PIN_ATTEMPTS - newAttempts);
            if (newAttempts >= MAX_PIN_ATTEMPTS) {
                throw new Error('Account locked due to too many failed attempts');
            }
            throw new Error(`Invalid PIN. ${attemptsRemaining} attempts remaining`);
        }
    });
}
function setUserPin(userIdentifier, pin) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            throw new Error('PIN must be exactly 4 digits');
        }
        const hashedPin = yield bcrypt_1.default.hash(pin, SALT_ROUNDS);
        const updatedUser = yield db_1.db.user.update({
            where: { userId: userIdentifier },
            data: {
                pin: hashedPin,
                pinAttempts: 0,
                pinLockedUntil: null
            }
        });
        return { success: true, message: 'PIN set successfully' };
    });
}
function checkUserHasPin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db.user.findUnique({
            where: { userId: userId },
            select: { pin: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return { hasPin: !!user.pin };
    });
}
function deleteUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.user.update({
            where: {
                id: id,
            },
            data: {
                status: 'Inactive',
                updatedAt: new Date(),
            },
        });
    });
}
function getUserStats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [user, transactions, purchases, recharges] = yield Promise.all([
            db_1.db.user.findUnique({
                where: { id: userId },
                select: {
                    balance: true,
                    createdAt: true,
                    lastUsed: true
                }
            }),
            db_1.db.transaction.aggregate({
                where: { userId },
                _sum: { amount: true },
                _count: true
            }),
            db_1.db.purchase.count({
                where: { userId }
            }),
            db_1.db.recharge.aggregate({
                where: { userId },
                _sum: { amount: true },
                _count: true
            })
        ]);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            currentBalance: user.balance,
            totalTransactions: transactions._count,
            totalSpent: transactions._sum.amount || 0,
            totalPurchases: purchases,
            totalRecharges: recharges._count,
            totalRecharged: recharges._sum.amount || 0,
            memberSince: user.createdAt,
            lastActivity: user.lastUsed
        };
    });
}
function searchUsers(query, filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { userId: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } }
            ]
        };
        if (filters === null || filters === void 0 ? void 0 : filters.userType) {
            where.userType = filters.userType;
        }
        if (filters === null || filters === void 0 ? void 0 : filters.department) {
            where.department = { contains: filters.department, mode: 'insensitive' };
        }
        if (filters === null || filters === void 0 ? void 0 : filters.status) {
            where.status = filters.status;
        }
        if ((filters === null || filters === void 0 ? void 0 : filters.balanceMin) !== undefined || (filters === null || filters === void 0 ? void 0 : filters.balanceMax) !== undefined) {
            where.balance = {};
            if (filters.balanceMin !== undefined) {
                where.balance.gte = filters.balanceMin;
            }
            if (filters.balanceMax !== undefined) {
                where.balance.lte = filters.balanceMax;
            }
        }
        if ((filters === null || filters === void 0 ? void 0 : filters.dateFrom) || (filters === null || filters === void 0 ? void 0 : filters.dateTo)) {
            where.createdAt = {};
            if (filters.dateFrom) {
                where.createdAt.gte = filters.dateFrom;
            }
            if (filters.dateTo) {
                where.createdAt.lte = filters.dateTo;
            }
        }
        return yield db_1.db.user.findMany({
            where,
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                userType: true,
                status: true,
                balance: true,
                department: true,
                lastUsed: true,
                createdAt: true
            },
            orderBy: [
                { lastUsed: 'desc' },
                { createdAt: 'desc' }
            ],
            take: 50
        });
    });
}
function getUserActivity(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, days = 30) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        const [transactions, purchases, tokens] = yield Promise.all([
            db_1.db.transaction.findMany({
                where: {
                    userId,
                    createdAt: { gte: fromDate }
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            }),
            db_1.db.purchase.findMany({
                where: {
                    userId,
                    createdAt: { gte: fromDate }
                },
                include: {
                    product: {
                        select: { name: true, price: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            }),
            db_1.db.token.findMany({
                where: {
                    userId,
                    createdAt: { gte: fromDate }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);
        return {
            period: `Last ${days} days`,
            transactions,
            purchases,
            tokens,
            summary: {
                totalTransactions: transactions.length,
                totalPurchases: purchases.length,
                totalSpent: transactions
                    .filter(t => t.type === 'Purchase')
                    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0),
                totalRecharged: transactions
                    .filter(t => t.type === 'Recharge')
                    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
            }
        };
    });
}
function exportUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = yield db_1.db.user.findUnique({
            where: { id: userId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' }
                },
                recharges: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        admin: {
                            select: { name: true, username: true }
                        }
                    }
                },
                purchases: {
                    include: {
                        product: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                tokens: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!userData) {
            throw new Error('User not found');
        }
        const { pin, pinAttempts, pinLockedUntil } = userData, exportData = __rest(userData, ["pin", "pinAttempts", "pinLockedUntil"]);
        return exportData;
    });
}
function validateUserData(userData) {
    var _a, _b;
    const errors = [];
    if (!((_a = userData.name) === null || _a === void 0 ? void 0 : _a.trim())) {
        errors.push('Name is required');
    }
    if (!((_b = userData.email) === null || _b === void 0 ? void 0 : _b.trim())) {
        errors.push('Email is required');
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.push('Invalid email format');
    }
    if (userData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(userData.phone.replace(/\s/g, ''))) {
        errors.push('Invalid phone number format');
    }
    if (userData.balance !== undefined && userData.balance < 0) {
        errors.push('Balance cannot be negative');
    }
    if (userData.pin && (userData.pin.length !== 4 || !/^\d{4}$/.test(userData.pin))) {
        errors.push('PIN must be exactly 4 digits');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
}
function getSystemStats() {
    return __awaiter(this, void 0, void 0, function* () {
        const [totalUsers, activeUsers, usersByType, totalBalance, recentActivity] = yield Promise.all([
            db_1.db.user.count(),
            db_1.db.user.count({ where: { status: 'Active' } }),
            db_1.db.user.groupBy({
                by: ['userType'],
                _count: true
            }),
            db_1.db.user.aggregate({
                _sum: { balance: true }
            }),
            db_1.db.user.count({
                where: {
                    lastUsed: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            })
        ]);
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            usersByType: usersByType.reduce((acc, item) => (Object.assign(Object.assign({}, acc), { [item.userType]: item._count })), {}),
            totalSystemBalance: totalBalance._sum.balance || 0,
            activeInLast24Hours: recentActivity,
            activityRate: totalUsers > 0 ? (recentActivity / totalUsers * 100).toFixed(1) + '%' : '0%'
        };
    });
}
function generateQrCode(userType, name) {
    const prefix = userType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${nameCode}${timestamp}${randomSuffix}`;
}
function generateUserId(userType) {
    const prefix = userType === 'Student' ? 'STU' :
        userType === 'Employee' ? 'EMP' :
            userType === 'Staff' ? 'STF' : 'VST';
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefix}${year}${randomNum}`;
}
