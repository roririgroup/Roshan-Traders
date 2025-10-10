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
const express_1 = __importDefault(require("express"));
const manufacturer_service_1 = require("./manufacturer.service");
const router = express_1.default.Router();
// Get all manufacturers
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const manufacturers = yield (0, manufacturer_service_1.getAllManufacturers)();
        res.json(manufacturers);
    }
    catch (error) {
        console.error('Error fetching manufacturers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Get manufacturer by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const manufacturer = yield (0, manufacturer_service_1.getManufacturerById)(id);
        if (!manufacturer) {
            return res.status(404).json({ error: 'Manufacturer not found' });
        }
        res.json(manufacturer);
    }
    catch (error) {
        console.error('Error fetching manufacturer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Create manufacturer
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const manufacturer = yield (0, manufacturer_service_1.createManufacturer)(payload);
        res.status(201).json(manufacturer);
    }
    catch (error) {
        console.error('Error creating manufacturer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Update manufacturer
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const payload = req.body;
        const manufacturer = yield (0, manufacturer_service_1.updateManufacturer)(id, payload);
        res.json(manufacturer);
    }
    catch (error) {
        console.error('Error updating manufacturer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// Delete manufacturer
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        yield (0, manufacturer_service_1.deleteManufacturer)(id);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting manufacturer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
