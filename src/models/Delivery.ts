import { Schema, model, models, Types, Document } from "mongoose";

export type OperationStatus =
  | "Draft"
  | "Waiting"
  | "Ready"
  | "Done"
  | "Canceled";

export interface IDeliveryItem {
  productId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locationId?: Types.ObjectId;
  quantity: number;
  note?: string;
}

export interface IDelivery extends Document {
  deliveryNo: string;
  status: OperationStatus;
  reference?: string;
  note?: string;

  items: IDeliveryItem[];

  deliveredAt?: Date;
  validatedAt?: Date;
  createdBy?: Types.ObjectId;
  validatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const DeliveryItemSchema = new Schema<IDeliveryItem>(
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
      min: 0.0001,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const DeliverySchema = new Schema<IDelivery>(
  {
    deliveryNo: {
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
      type: [DeliveryItemSchema],
      validate: {
        validator: function (items: IDeliveryItem[]) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "Delivery must contain at least one item.",
      },
    },
    deliveredAt: {
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

export default models.Delivery || model<IDelivery>("Delivery", DeliverySchema);