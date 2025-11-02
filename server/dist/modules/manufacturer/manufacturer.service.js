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
exports.getAllManufacturers = getAllManufacturers;
exports.getManufacturerById = getManufacturerById;
exports.createManufacturer = createManufacturer;
exports.updateManufacturer = updateManufacturer;
exports.deleteManufacturer = deleteManufacturer;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllManufacturers() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.manufacturer.findMany({
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                contact: true,
                companyInfo: true,
                products: true,
            },
        });
    });
}

function getManufacturerById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.manufacturer.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                contact: true,
                companyInfo: true,
                products: true,
            },
        });
    });
}
function createManufacturer(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            // Create the manufacturer
            const manufacturer = yield tx.manufacturer.create({
                data: {
                    userId: payload.userId,
                    companyName: payload.companyName,
                    businessType: payload.businessType,
                    gstNumber: payload.gstNumber,
                    panNumber: payload.panNumber,
                    businessAddress: payload.businessAddress,
                    websiteUrl: payload.websiteUrl,
                    description: payload.description,
                    established: payload.established,
                    location: payload.location,
                    rating: payload.rating,
                    image: payload.image,
                    contact: payload.contact ? {
                        create: {
                            phone: payload.contact.phone,
                            email: payload.contact.email,
                            website: payload.contact.website,
                            address: payload.contact.address,
                        }
                    } : undefined,
                    companyInfo: payload.companyInfo ? {
                        create: {
                            employees: payload.companyInfo.employees,
                            annualTurnover: payload.companyInfo.annualTurnover,
                            exportCountries: payload.companyInfo.exportCountries,
                        }
                    } : undefined,
                    founders: payload.founders ? {
                        create: payload.founders.map(f => ({
                            name: f.name,
                            experience: f.experience,
                            qualification: f.qualification,
                        }))
                    } : undefined,
                },
            });
            // Handle specializations
            if (payload.specializations && payload.specializations.length > 0) {
                for (const name of payload.specializations) {
                    let specialization = yield tx.specialization.findFirst({
                        where: { name },
                    });
                    if (!specialization) {
                        specialization = yield tx.specialization.create({
                            data: { name },
                        });
                    }
                    yield tx.manufacturerSpecialization.create({
                        data: {
                            manufacturerId: manufacturer.id,
                            specializationId: specialization.id,
                        },
                    });
                }
            }
            // Handle achievements
            if (payload.achievements && payload.achievements.length > 0) {
                for (const name of payload.achievements) {
                    let achievement = yield tx.achievement.findFirst({
                        where: { name },
                    });
                    if (!achievement) {
                        achievement = yield tx.achievement.create({
                            data: { name },
                        });
                    }
                    yield tx.manufacturerAchievement.create({
                        data: {
                            manufacturerId: manufacturer.id,
                            achievementId: achievement.id,
                        },
                    });
                }
            }
            // Handle certifications
            if (payload.certifications && payload.certifications.length > 0) {
                for (const name of payload.certifications) {
                    let certification = yield tx.certification.findFirst({
                        where: { name },
                    });
                    if (!certification) {
                        certification = yield tx.certification.create({
                            data: { name },
                        });
                    }
                    yield tx.manufacturerCertification.create({
                        data: {
                            manufacturerId: manufacturer.id,
                            certificationId: certification.id,
                        },
                    });
                }
            }
            // Return the manufacturer with all relations
            return yield tx.manufacturer.findUnique({
                where: { id: manufacturer.id },
                include: {
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                    contact: true,
                    companyInfo: true,
                    founders: true,
                    specializations: {
                        include: {
                            specialization: true,
                        },
                    },
                    achievements: {
                        include: {
                            achievement: true,
                        },
                    },
                    certifications: {
                        include: {
                            certification: true,
                        },
                    },
                },
            });
        }));
    });
}
function updateManufacturer(id, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.manufacturer.update({
            where: { id },
            data: payload,
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
                contact: true,
                companyInfo: true,
            },
        });
    });
}
function deleteManufacturer(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.manufacturer.delete({
            where: { id },
        });
    });
}
