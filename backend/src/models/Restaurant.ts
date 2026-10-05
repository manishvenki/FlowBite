import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  image: string;
  cuisine: string;
  address: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  isActive: boolean;
  phone?: string;
  email?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Restaurant description is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Restaurant image URL is required'],
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Restaurant address is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 80 4123 4567',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    area: {
      type: String,
      trim: true,
      default: 'Indiranagar',
    },
    city: {
      type: String,
      trim: true,
      default: 'Bengaluru',
    },
    state: {
      type: String,
      trim: true,
      default: 'Karnataka',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: String,
      required: [true, 'Delivery time is required'],
      default: '25-35 min',
    },
    deliveryFee: {
      type: Number,
      required: [true, 'Delivery fee is required'],
      default: 40,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
