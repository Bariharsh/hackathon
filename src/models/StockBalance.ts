import mongoose, { Schema, model, models, Types, Document } from "mongoose";

export interface IStockBalance extends Document {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locationId?: Types.ObjectId;

  quantity: number;

  createdAt: Date;
  updatedAt: Date;
}

const StockBalanceSchema = new Schema<IStockBalance>(
  {
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
      index: true,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One stock balance per product + warehouse + location
StockBalanceSchema.index(
  { productId: 1, warehouseId: 1, locationId: 1 },
  { unique: true }
);

export default models.StockBalance ||
  model<IStockBalance>("StockBalance", StockBalanceSchema);