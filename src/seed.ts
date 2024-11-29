import prisma from "./utils/prismaClient";
import fs from "fs";
import csvParser from "csv-parser";

/* Function to parse date */
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/;
  if (dateTimeRegex.test(dateString)) {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, secondsWithMicro] = timePart.split(":");
    const [seconds, microseconds] = secondsWithMicro.split(".").map(Number);
    const milliseconds = Math.floor(microseconds / 1000);
    return new Date(
      year,
      month - 1,
      day,
      Number(hours),
      Number(minutes),
      Number(seconds),
      milliseconds
    );
  }
  return null;
}

/* Functions to read CSV file and seed the database */
async function seedCustomersFromCSV(filePath: string) {
  const customers: any = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const {
          id,
          firstName,
          lastName,
          mainPhone,
          mobilePhone,
          email,
          createdAt,
          updatedAt,
          deletedAt,
        } = row;

        customers.push({
          id,
          firstName,
          lastName,
          mainPhone,
          mobilePhone,
          email,
          createdAt: parseDate(createdAt),
          updatedAt: parseDate(updatedAt),
          deletedAt: parseDate(deletedAt),
        });
      })
      .on("end", res)
      .on("error", rej);
  });

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: {
        id: customer.id,
      },
      update: {},
      create: customer,
    });
  }

  console.log("Customers seeded successfully");
}

async function seedContractsFromCSV(filePath: string) {
  const contracts: any = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const {
          id,
          name,
          startDate,
          endDate,
          createdAt,
          updatedAt,
          deletedAt,
          customerId,
          merchantId,
          purchaseId,
          status,
          contractAmount,
          activatedAt,
        } = row;
        contracts.push({
          id,
          name,
          startDate: parseDate(startDate),
          endDate: parseDate(endDate),
          createdAt: parseDate(createdAt),
          updatedAt: parseDate(updatedAt),
          deletedAt: parseDate(deletedAt),
          customerId,
          merchantId,
          purchaseId,
          status,
          contractAmount,
          activatedAt: parseDate(activatedAt),
        });
      })
      .on("end", res)
      .on("error", rej);
  });

  for (const contract of contracts) {
    await prisma.contract.upsert({
      where: {
        id: contract.id,
      },
      update: {},
      create: contract,
    });
  }

  console.log("Contracts seeded successfully");
}

async function seedPurchasesFromCSV(filePath: string) {
  const purchases: any = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const {
          id,
          status,
          totalSaleAmount,
          purchaseDate,
          vendor,
          createdAt,
          updatedAt,
          deletedAt,
          customerId,
          merchantId,
          orderNumber,
        } = row;
        purchases.push({
          id,
          status,
          totalSaleAmount,
          purchaseDate: parseDate(purchaseDate),
          vendor,
          createdAt: parseDate(createdAt),
          updatedAt: parseDate(updatedAt),
          deletedAt: parseDate(deletedAt),
          customerId,
          merchantId,
          orderNumber,
        });
      })
      .on("end", res)
      .on("error", rej);
  });

  for (const purchase of purchases) {
    await prisma.purchase.upsert({
      where: {
        id: purchase.id,
      },
      update: {},
      create: purchase,
    });
  }

  console.log("Purchases seeded successfully");
}

async function seedLineItemsFromCSV(filePath: string) {
  const lineItems: any = [];

  await new Promise((res, rej) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const {
          id,
          invoice,
          invoiceDate,
          deliveryDate,
          itemCost,
          createdAt,
          updatedAt,
          deletedAt,
          purchaseId,
        } = row;
        lineItems.push({
          id,
          invoice,
          invoiceDate: parseDate(invoiceDate),
          deliveryDate: parseDate(deliveryDate),
          itemCost,
          createdAt: parseDate(createdAt),
          updatedAt: parseDate(updatedAt),
          deletedAt: parseDate(deletedAt),
          purchaseId,
        });
      })
      .on("end", res)
      .on("error", rej);
  });

  for (const lineItem of lineItems) {
    await prisma.lineItem.upsert({
      where: {
        id: lineItem.id,
      },
      update: {},
      create: lineItem,
    });
  }

  console.log("LineItems seeded successfully");
}

async function main() {
  const customersFilePath = "./seeding-data/customers.csv";
  const purchasesFilePath = "./seeding-data/purchases.csv";
  const contractsFilePath = "./seeding-data/contracts.csv";
  const lineItemsPath = "./seeding-data/line_items.csv";
  await seedCustomersFromCSV(customersFilePath)
    .then(async () => {
      await seedPurchasesFromCSV(purchasesFilePath);
    })
    .then(async () => {
      await seedContractsFromCSV(contractsFilePath);
    })
    .then(async () => {
      await seedLineItemsFromCSV(lineItemsPath);
    });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e, "------------error seeding db");
    await prisma.$disconnect();
    process.exit(1);
  });
