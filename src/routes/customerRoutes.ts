import express from "express";
import {
  getAllClaimsPerClient,
  getCustomers,
} from "../controller/customerController";

const customerRouter = express.Router();

customerRouter.route("/").get(getCustomers);
customerRouter.route("/:id/claims").get(getAllClaimsPerClient);

export default customerRouter;
