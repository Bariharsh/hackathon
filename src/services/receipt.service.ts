import mongoose, { Types } from "mongoose";
import Receipt from "@/models/Receipt";
import { increaseStock } from "@/services/stock-balance.service";
import { createLedgerEntries } from "@/services/stock-ledger.service";

type ReceiptItemInput = {
  productId: string;
  warehouseId: string;
  locationId?: string | null;
  quantity: number;
  unitCost?: number;
  note?: string;
};

type CreateReceiptInput = {
  receiptNo: string;
  status?: "Draft" | "Waiting" | "Ready" | "Done" | "Canceled";
  reference?: string;
  note?: string;
  receivedAt?: Date | string;
  createdBy?: string;
  items: ReceiptItemInput[];
};

type UpdateReceiptInput = {
  reference?: string;
  note?: string;
  receivedAt?: Date | string;
  status?: "Draft" | "Waiting" | "Ready" | "Canceled";
  items?: ReceiptItemInput[];
};

function toObjectId(id: string | Types.ObjectId | null | undefined) {
  if (!id) return null;
  return new Types.ObjectId(id);
}

function mapReceiptItems(items: ReceiptItemInput[]) {
  return items.map((item) => ({
    productId: toObjectId(item.productId)!,
    warehouseId: toObjectId(item.warehouseId)!,
    locationId: toObjectId(item.locationId),
    quantity: item.quantity,
    unitCost: item.unitCost,
    note: item.note,
  }));
}

function validateReceiptItems(items: ReceiptItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Receipt must contain at least one item.");
  }

  for (const item of items) {
    if (!item.productId) throw new Error("productId is required.");
    if (!item.warehouseId) throw new Error("warehouseId is required.");
    if (!item.quantity || item.quantity <= 0) {
      throw new Error("Item quantity must be greater than 0.");
    }
  }
}

export async function createReceipt(input: CreateReceiptInput) {
  if (!input.receiptNo?.trim()) {
    throw new Error("receiptNo is required.");
  }

  validateReceiptItems(input.items);

  const receipt = await Receipt.create({
    receiptNo: input.receiptNo.trim(),
    status: input.status ?? "Draft",
    reference: input.reference,
    note: input.note,
    receivedAt: input.receivedAt ? new Date(input.receivedAt) : undefined,
    createdBy: toObjectId(input.createdBy),
    items: mapReceiptItems(input.items),
  });

  return receipt;
}

export async function listReceipts() {
  return await Receipt.find({}).sort({ createdAt: -1 }).lean();
}

export async function getReceiptById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid receipt id.");
  }

  const receipt = await Receipt.findById(id);

  if (!receipt) {
    throw new Error("Receipt not found.");
  }

  return receipt;
}

export async function updateReceipt(id: string, input: UpdateReceiptInput) {
  const receipt = await getReceiptById(id);

  if (receipt.status === "Done" || receipt.status === "Canceled") {
    throw new Error("Only non-final receipts can be updated.");
  }

  if (input.items) {
    validateReceiptItems(input.items);
    receipt.items = mapReceiptItems(input.items) as any;
  }

  if (input.reference !== undefined) {
    receipt.reference = input.reference;
  }

  if (input.note !== undefined) {
    receipt.note = input.note;
  }

  if (input.receivedAt !== undefined) {
    receipt.receivedAt = input.receivedAt ? new Date(input.receivedAt) : undefined;
  }

  if (input.status !== undefined) {
    receipt.status = input.status;
  }

  await receipt.save();
  return receipt;
}

export async function validateReceipt(id: string, validatedBy?: string) {
  const session = await mongoose.startSession();

  try {
    let validatedReceipt: any = null;

    await session.withTransaction(async () => {
      const receipt = await Receipt.findById(id).session(session);

      if (!receipt) {
        throw new Error("Receipt not found.");
      }

      if (receipt.status === "Done") {
        throw new Error("Receipt is already validated.");
      }

      if (receipt.status === "Canceled") {
        throw new Error("Canceled receipt cannot be validated.");
      }

      if (!receipt.items || receipt.items.length === 0) {
        throw new Error("Receipt has no items.");
      }

      const ledgerEntries = [];

      for (const item of receipt.items) {
        const stockResult = await increaseStock({
          productId: item.productId,
          warehouseId: item.warehouseId,
          locationId: item.locationId ?? null,
          quantity: item.quantity,
          session,
        });

        ledgerEntries.push({
          sourceType: "Receipt" as const,
          sourceId: receipt._id,
          sourceNo: receipt.receiptNo,
          productId: item.productId,
          warehouseId: item.warehouseId,
          locationId: item.locationId ?? null,
          direction: "IN" as const,
          quantity: item.quantity,
          balanceBefore: stockResult.before,
          balanceAfter: stockResult.after,
          note: item.note || receipt.note,
          movementAt: new Date(),
          createdBy: validatedBy ?? receipt.createdBy?.toString(),
        });
      }

      await createLedgerEntries(ledgerEntries, session);

      receipt.status = "Done";
      receipt.validatedAt = new Date();
      receipt.validatedBy = validatedBy ? toObjectId(validatedBy) : receipt.validatedBy;

      await receipt.save({ session });
      validatedReceipt = receipt;
    });

    return validatedReceipt;
  } finally {
    session.endSession();
  }
}