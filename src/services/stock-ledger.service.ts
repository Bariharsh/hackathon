import { ClientSession, Types } from "mongoose";
import StockLedger from "@/models/StockLedger";

type LedgerSourceType = "Receipt" | "Delivery" | "Transfer" | "Adjustment";
type LedgerDirection = "IN" | "OUT" | "ADJUST";

export type CreateLedgerEntryInput = {
  sourceType: LedgerSourceType;
  sourceId: string | Types.ObjectId;
  sourceNo?: string;

  productId: string | Types.ObjectId;
  warehouseId: string | Types.ObjectId;
  locationId?: string | Types.ObjectId | null;

  direction: LedgerDirection;
  quantity: number;

  balanceBefore?: number;
  balanceAfter?: number;

  note?: string;
  movementAt?: Date;
  createdBy?: string | Types.ObjectId;
  session?: ClientSession;
};

function normalizeObjectId(value?: string | Types.ObjectId | null) {
  if (!value) return null;
  return new Types.ObjectId(value);
}

export async function createLedgerEntry(input: CreateLedgerEntryInput) {
  if (input.quantity < 0) {
    throw new Error("Ledger quantity cannot be negative.");
  }

  const [ledgerEntry] = await StockLedger.create(
    [
      {
        sourceType: input.sourceType,
        sourceId: normalizeObjectId(input.sourceId),
        sourceNo: input.sourceNo,
        productId: normalizeObjectId(input.productId),
        warehouseId: normalizeObjectId(input.warehouseId),
        locationId: normalizeObjectId(input.locationId ?? null),
        direction: input.direction,
        quantity: input.quantity,
        balanceBefore: input.balanceBefore,
        balanceAfter: input.balanceAfter,
        note: input.note,
        movementAt: input.movementAt ?? new Date(),
        createdBy: input.createdBy ? normalizeObjectId(input.createdBy) : undefined,
      },
    ],
    input.session ? { session: input.session } : {}
  );

  return ledgerEntry;
}

export async function createLedgerEntries(
  entries: CreateLedgerEntryInput[],
  session?: ClientSession
) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [];
  }

  const docs = entries.map((entry) => ({
    sourceType: entry.sourceType,
    sourceId: normalizeObjectId(entry.sourceId),
    sourceNo: entry.sourceNo,
    productId: normalizeObjectId(entry.productId),
    warehouseId: normalizeObjectId(entry.warehouseId),
    locationId: normalizeObjectId(entry.locationId ?? null),
    direction: entry.direction,
    quantity: entry.quantity,
    balanceBefore: entry.balanceBefore,
    balanceAfter: entry.balanceAfter,
    note: entry.note,
    movementAt: entry.movementAt ?? new Date(),
    createdBy: entry.createdBy ? normalizeObjectId(entry.createdBy) : undefined,
  }));

  return await StockLedger.insertMany(docs, session ? { session } : {});
}