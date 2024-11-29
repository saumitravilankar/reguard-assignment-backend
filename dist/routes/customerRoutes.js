"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controller/customerController");
const customerRouter = express_1.default.Router();
customerRouter.route("/").get(customerController_1.getCustomers);
customerRouter.route("/:id/claims").get(customerController_1.getAllClaimsPerClient);
exports.default = customerRouter;
