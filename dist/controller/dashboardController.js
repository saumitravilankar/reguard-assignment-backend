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
exports.getDashboardSummary = getDashboardSummary;
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
function getDashboardSummary(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customers = yield prismaClient_1.default.customer.count();
            const purchases = yield prismaClient_1.default.purchase.count();
            const pendingPurchases = yield prismaClient_1.default.purchase.count({
                where: {
                    status: "Pending",
                },
            });
            const completedPurchases = yield prismaClient_1.default.purchase.count({
                where: {
                    status: "Completed",
                },
            });
            const cancelledPurchases = yield prismaClient_1.default.purchase.count({
                where: {
                    status: "Cancelled",
                },
            });
            const claims = yield prismaClient_1.default.contract.count();
            const activeClaims = yield prismaClient_1.default.contract.count({
                where: {
                    status: "Active",
                },
            });
            const data = {
                total_customers: customers,
                total_purchases: purchases,
                pending_purchases: pendingPurchases,
                cancelled_purchases: cancelledPurchases,
                completed_purchases: completedPurchases,
                total_claims: claims,
                active_claims: activeClaims,
                inactive_claims: claims - activeClaims,
            };
            res.status(200).json({
                success: true,
                data,
                message: "Dashboard data fetched successfully",
            });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({
                success: false,
                message: "Error fetching dashboard data",
                error: error.toString(),
            });
        }
    });
}
