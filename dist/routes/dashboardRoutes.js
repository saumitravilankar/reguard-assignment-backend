"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controller/dashboardController");
const dashboardRouter = express_1.default.Router();
dashboardRouter.route("/").get(dashboardController_1.getDashboardSummary);
exports.default = dashboardRouter;
