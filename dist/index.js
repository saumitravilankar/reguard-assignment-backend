"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8001;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
}));
app.use(express_1.default.json());
app.use("/customers", customerRoutes_1.default);
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/", (req, res) => {
    res.json({ message: "Hello world" });
});
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
