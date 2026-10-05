import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface IOrderItem {
  foodId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg?: boolean;
}

export interface IDeliveryAddress {
  label?: string;
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  street: string;
  city: string;
  state: string;
  pincode?: string;
  zipCode?: string;
  country?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  deliveryAddress: IDeliveryAddress;
  paymentStatus: PaymentStatus;
  paymentMethod: 'DEMO_PAYMENT';
  transactionId?: string;
  orderStatus: OrderStatus;
  sentEmailStatuses?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    foodId: {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const DeliveryAddressSchema = new Schema<IDeliveryAddress>(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    area: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true, default: 'Bengaluru' },
    state: { type: String, required: true, default: 'Karnataka' },
    pincode: { type: String },
    zipCode: { type: String, default: '560038' },
    country: { type: String, default: 'India' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      default: 1.25,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['DEMO_PAYMENT'],
      default: 'DEMO_PAYMENT',
    },
    transactionId: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: [
        'PLACED',
        'ACCEPTED',
        'PREPARING',
        'READY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
      ],
      default: 'PLACED',
      index: true,
    },
    sentEmailStatuses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
