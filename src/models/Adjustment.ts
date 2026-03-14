import { Schema, model, models, Types, Document } from "mongoose";

export type OperationStatus =
  | "Draft"
  | "Waiting"
  | "Ready"
  | "Done"
  | "Canceled";

export interface IAdjustmentItem {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locationId?: Types.ObjectId;

  countedQuantity: number;
  note?: string;
}

export interface IAdjustment extends Document {
  adjustmentNo: string;
  status: OperationStatus;
  reference?: string;
  reason?: string;
  note?: string;

  items: IAdjustmentItem[];

  adjustedAt?: Date;
  validatedAt?: Date;
  createdBy?: Types.ObjectId;
  validatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const AdjustmentItemSchema = new Schema<IAdjustmentItem>(
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
      default: null,
      index: true,
    },
    countedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const AdjustmentSchema = new Schema<IAdjustment>(
  {
    adjustmentNo: {
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
    reason: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    items: {
      type: [AdjustmentItemSchema],
      validate: {
        validator: function (items: IAdjustmentItem[]) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Adjustment must contain at least one item.",
      },
    },
    adjustedAt: {
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

export default models.Adjustment ||
  model<IAdjustment>("Adjustment", AdjustmentSchema);