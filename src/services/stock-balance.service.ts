import { ClientSession, Types } from "mongoose";
import StockBalance from "@/models/StockBalance";

type StockKeyInput = {
  productId: string | Types.ObjectId;
  warehouseId: string | Types.ObjectId;
  locationId?: string | Types.ObjectId | null;
};

type ChangeStockInput = StockKeyInput & {
  quantity: number;
  session?: ClientSession;
};

type SetStockInput = StockKeyInput & {
  quantity: number;
  session?: ClientSession;
};

function normalizeObjectId(value?: string | Types.ObjectId | null) {
  if (!value) return null;
  return new Types.ObjectId(value);
}

function buildStockQuery(input: StockKeyInput) {
  return {
    productId: normalizeObjectId(input.productId),
    warehouseId: normalizeObjectId(input.warehouseId),
    locationId: normalizeObjectId(input.locationId ?? null),
  };
}

export async function getStockBalance(input: StockKeyInput & { session?: ClientSession }) {
  const query = buildStockQuery(input);

  let stockBalance = await StockBalance.findOne(query).session(input.session ?? null);

  if (!stockBalance) {
    const created = await StockBalance.create(
      [
        {
          ...query,
          quantity: 0,
        },
      ],
      input.session ? { session: input.session } : {}
    );

    stockBalance = created[0];
  }

  return stockBalance;
}

export async function increaseStock(input: ChangeStockInput) {
  if (input.quantity <= 0) {
    throw new Error("Increase quantity must be greater than 0.");
  }

  const stockBalance = await getStockBalance(input);
  const before = stockBalance.quantity;
  const after = before + input.quantity;

  stockBalance.quantity = after;
  await stockBalance.save(input.session ? { session: input.session } : {});

  return {
    stockBalance,
    before,
    after,
    changedBy: input.quantity,
  };
}

export async function decreaseStock(input: ChangeStockInput) {
  if (input.quantity <= 0) {
    throw new Error("Decrease quantity must be greater than 0.");
  }

  const stockBalance = await getStockBalance(input);
  const before = stockBalance.quantity;

  if (before < input.quantity) {
    throw new Error("Insufficient stock balance.");
  }

  const after = before - input.quantity;
  stockBalance.quantity = after;
  await stockBalance.save(input.session ? { session: input.session } : {});

  return {
    stockBalance,
    before,
    after,
    changedBy: input.quantity,
  };
}

export async function setStock(input: SetStockInput) {
  if (input.quantity < 0) {
    throw new Error("Stock quantity cannot be negative.");
  }

  const stockBalance = await getStockBalance(input);
  const before = stockBalance.quantity;
  const after = input.quantity;

  stockBalance.quantity = after;
  await stockBalance.save(input.session ? { session: input.session } : {});

  return {
    stockBalance,
    before,
    after,
    changedBy: after - before,
  };
}