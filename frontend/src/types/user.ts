export interface Address {
  _id?: string;
  label: string; // 'Home' | 'Work' | 'Other'
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

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  addresses: Address[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
