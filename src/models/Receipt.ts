import mongoose, { Schema, model, models, Types, Document } from "mongoose";

export type OperationStatus =
  | "Draft"
  | "Waiting"
  | "Ready"
  | "Done"
  | "Canceled";

export interface IReceiptItem {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locationId?: Types.ObjectId;
  quantity: number;
  unitCost?: number;
  note?: string;
}

export interface IReceipt extends Document {
  receiptNo: string;
  status: OperationStatus;
  reference?: string;
  note?: string;

  items: IReceiptItem[];

  receivedAt?: Date;
  validatedAt?: Date;
  createdBy?: Types.ObjectId;
  validatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ReceiptItemSchema = new Schema<IReceiptItem>(
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
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },
    unitCost: {
      type: Number,
      required: false,
      min: 0,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ReceiptSchema = new Schema<IReceipt>(
  {
    receiptNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Waiting", "Ready", "Done", "Canceled"],
      default: "Draft",
      index: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    items: {
      type: [ReceiptItemSchema],
      validate: {
        validator: function (items: IReceiptItem[]) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Receipt must contain at least one item.",
      },
    },
    receivedAt: {
      type: Date,
    },
    validatedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    validatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Receipt || model<IReceipt>("Receipt", ReceiptSchema);