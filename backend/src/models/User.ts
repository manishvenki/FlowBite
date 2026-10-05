import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  _id?: string;
  label: string; // 'Home', 'Work', 'Other'
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
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true, default: 'Home' },
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
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide user email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    addresses: [AddressSchema],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
