import express from "express";
import { getDashboardSummary } from "../controller/dashboardController";

const dashboardRouter = express.Router();

dashboardRouter.route("/").get(getDashboardSummary);

export default dashboardRouter;
