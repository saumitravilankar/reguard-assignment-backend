import prisma from "../utils/prismaClient";
import { Request, Response } from "express";

// Return a list of all customers and allow paginating through them
async function getCustomers(req: Request, res: Response) {
  const { pageNo, pageLimit } = req.query;

  let filterBody: any = {};

  if (Number(pageNo) && Number(pageNo) > 1) {
    filterBody.skip = Number(pageLimit) || 10;
  }
  if (Number(pageLimit)) {
    filterBody.take = Number(pageLimit);
  }

  try {
    const customers = await prisma.customer.findMany(filterBody);
    res.status(200).json({
      success: true,
      data: customers,
      message: "Customers fetched successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error fetching customers",
      error: error.toString(),
    });
  }
}

// Get all claims (contracts) for a single client
async function getAllClaimsPerClient(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Please provide customer ID.",
    });
    return;
  }

  try {
    const customer = await prisma.customer.findUnique({
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
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error fetching claims data",
      error: error.toString(),
    });
  }
}

export { getCustomers, getAllClaimsPerClient };
