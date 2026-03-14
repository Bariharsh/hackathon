import mongoose, { Schema, model, models, Types, Document } from "mongoose";

export type LedgerSourceType =
  | "Receipt"
  | "Delivery"
  | "Transfer"
  | "Adjustment";

export type LedgerDirection = "IN" | "OUT" | "ADJUST";

export interface IStockLedger extends Document {
  sourceType: LedgerSourceType;
  sourceId: Types.ObjectId;
  sourceNo?: string;

  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locationId?: Types.ObjectId;

  direction: LedgerDirection;
  quantity: number;

  balanceBefore?: number;
  balanceAfter?: number;

  note?: string;
  movementAt: Date;
  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const StockLedgerSchema = new Schema<IStockLedger>(
  {
    sourceType: {
      type: String,
      enum: ["Receipt", "Delivery", "Transfer", "Adjustment"],
      required: true,
      index: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    sourceNo: {
      type: String,
      trim: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
      default: null,
      index: true,
    },

    direction: {
      type: String,
      enum: ["IN", "OUT", "ADJUST"],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceBefore: {
      type: Number,
      required: false,
    },
    balanceAfter: {
      type: Number,
      required: false,
    },

    note: {
      type: String,
      trim: true,
    },
    movementAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.StockLedger ||
  model<IStockLedger>("StockLedger", StockLedgerSchema);