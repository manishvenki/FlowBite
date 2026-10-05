import mongoose, { Schema, Document } from 'mongoose';

export interface IFood extends Document {
  restaurantId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant reference is required'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Food item description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Food price is required'],
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Food image URL is required'],
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Food = mongoose.model<IFood>('Food', FoodSchema);
