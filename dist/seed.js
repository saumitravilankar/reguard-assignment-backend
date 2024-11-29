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
const prismaClient_1 = __importDefault(require("./utils/prismaClient"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
/* Function to parse date */
function parseDate(dateString) {
    if (!dateString)
        return null;
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{6}$/;
    if (dateTimeRegex.test(dateString)) {
        const [datePart, timePart] = dateString.split(" ");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hours, minutes, secondsWithMicro] = timePart.split(":");
        const [seconds, microseconds] = secondsWithMicro.split(".").map(Number);
        const milliseconds = Math.floor(microseconds / 1000);
        return new Date(year, month - 1, day, Number(hours), Number(minutes), Number(seconds), milliseconds);
    }
    return null;
}
/* Functions to read CSV file and seed the database */
function seedCustomersFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const customers = [];
        yield new Promise((res, rej) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const { id, firstName, lastName, mainPhone, mobilePhone, email, createdAt, updatedAt, deletedAt, } = row;
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
            yield prismaClient_1.default.customer.upsert({
                where: {
                    id: customer.id,
                },
                update: {},
                create: customer,
            });
        }
        console.log("Customers seeded successfully");
    });
}
function seedContractsFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const contracts = [];
        yield new Promise((res, rej) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const { id, name, startDate, endDate, createdAt, updatedAt, deletedAt, customerId, merchantId, purchaseId, status, contractAmount, activatedAt, } = row;
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
            yield prismaClient_1.default.contract.upsert({
                where: {
                    id: contract.id,
                },
                update: {},
                create: contract,
            });
        }
        console.log("Contracts seeded successfully");
    });
}
function seedPurchasesFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const purchases = [];
        yield new Promise((res, rej) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const { id, status, totalSaleAmount, purchaseDate, vendor, createdAt, updatedAt, deletedAt, customerId, merchantId, orderNumber, } = row;
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
            yield prismaClient_1.default.purchase.upsert({
                where: {
                    id: purchase.id,
                },
                update: {},
                create: purchase,
            });
        }
        console.log("Purchases seeded successfully");
    });
}
function seedLineItemsFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const lineItems = [];
        yield new Promise((res, rej) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on("data", (row) => {
                const { id, invoice, invoiceDate, deliveryDate, itemCost, createdAt, updatedAt, deletedAt, purchaseId, } = row;
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
            yield prismaClient_1.default.lineItem.upsert({
                where: {
                    id: lineItem.id,
                },
                update: {},
                create: lineItem,
            });
        }
        console.log("LineItems seeded successfully");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const customersFilePath = "./seeding-data/customers.csv";
        const purchasesFilePath = "./seeding-data/purchases.csv";
        const contractsFilePath = "./seeding-data/contracts.csv";
        const lineItemsPath = "./seeding-data/line_items.csv";
        yield seedCustomersFromCSV(customersFilePath)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield seedPurchasesFromCSV(purchasesFilePath);
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield seedContractsFromCSV(contractsFilePath);
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield seedLineItemsFromCSV(lineItemsPath);
        }));
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e, "------------error seeding db");
    yield prismaClient_1.default.$disconnect();
    process.exit(1);
}));
