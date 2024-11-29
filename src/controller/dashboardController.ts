import prisma from "../utils/prismaClient";
import { Request, Response } from "express";

async function getDashboardSummary(req: Request, res: Response) {
  try {
    const customers = await prisma.customer.count();
    const purchases = await prisma.purchase.count();
    const pendingPurchases = await prisma.purchase.count({
      where: {
        status: "Pending",
      },
    });
    const completedPurchases = await prisma.purchase.count({
      where: {
        status: "Completed",
      },
    });
    const cancelledPurchases = await prisma.purchase.count({
      where: {
        status: "Cancelled",
      },
    });
    const claims = await prisma.contract.count();
    const activeClaims = await prisma.contract.count({
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
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.toString(),
    });
  }
}

export { getDashboardSummary };
