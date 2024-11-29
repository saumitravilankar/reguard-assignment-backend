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
exports.getCustomers = getCustomers;
exports.getAllClaimsPerClient = getAllClaimsPerClient;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
// Return a list of all customers and allow paginating through them
function getCustomers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { pageNo, pageLimit } = req.query;
        let filterBody = {};
        if (Number(pageNo) && Number(pageNo) > 1) {
            filterBody.skip = Number(pageLimit) || 10;
        }
        if (Number(pageLimit)) {
            filterBody.take = Number(pageLimit);
        }
        try {
            const customers = yield prismaClient_1.default.customer.findMany(filterBody);
            res.status(200).json({
                success: true,
                data: customers,
                message: "Customers fetched successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: "Error fetching customers",
                error: error.toString(),
            });
        }
    });
}
// Get all claims (contracts) for a single client
function getAllClaimsPerClient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Please provide customer ID.",
            });
            return;
        }
        try {
            const customer = yield prismaClient_1.default.customer.findUnique({
                where: {
                    id,
                },
                include: {
                    Contract: {
                        include: {
                            purchase: {
                                include: {
                                    LineItem: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!customer) {
                res.status(400).json({
                    success: false,
                    message: "Invalid customer ID.",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: customer,
                message: "Customers fetched successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: "Error fetching claims data",
                error: error.toString(),
            });
        }
    });
}
