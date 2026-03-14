import { Schema, model, models, Types, Document } from "mongoose";

export type OperationStatus =
  | "Draft"
  | "Waiting"
  | "Ready"
  | "Done"
  | "Canceled";

export interface ITransferItem {
  productId: Types.ObjectId;

  fromWarehouseId: Types.ObjectId;
  fromLocationId?: Types.ObjectId;

  toWarehouseId: Types.ObjectId;
  toLocationId?: Types.ObjectId;

  quantity: number;
  note?: string;
}

export interface ITransfer extends Document {
  transferNo: string;
  status: OperationStatus;
  reference?: string;
  note?: string;

  items: ITransferItem[];

  transferredAt?: Date;
  validatedAt?: Date;
  createdBy?: Types.ObjectId;
  validatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const TransferItemSchema = new Schema<ITransferItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    fromWarehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },
    fromLocationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
      default: null,
      index: true,
    },

    toWarehouseId: {
      type: Schema.Types.ObjectId,
      ref: "Warehouse",
      required: true,
      index: true,
    },
    toLocationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
      default: null,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.0001,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const TransferSchema = new Schema<ITransfer>(
  {
    transferNo: {
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
      type: [TransferItemSchema],
      validate: {
        validator: function (items: ITransferItem[]) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Transfer must contain at least one item.",
      },
    },
    transferredAt: {
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

export default models.Transfer || model<ITransfer>("Transfer", TransferSchema);