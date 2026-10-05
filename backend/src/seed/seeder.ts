import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';
import { Category } from '../models/Category';
import { Food } from '../models/Food';
import { Order } from '../models/Order';
import {
  seedUsers,
  seedCategories,
  seedRestaurants,
  sampleFoods,
} from './seedData';

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/biteflow';

  try {
    console.log('[BiteFlow Seeder] Connecting to database...');
    await mongoose.connect(mongoURI);
    console.log('[BiteFlow Seeder] Connected to MongoDB.');

    // Clear existing collections (preserve custom user accounts)
    console.log('[BiteFlow Seeder] Clearing existing data...');
    await Promise.all([
      User.deleteMany({ email: { $in: seedUsers.map((u) => u.email) } }),
      Restaurant.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // Insert Users
    console.log('[BiteFlow Seeder] Seeding users...');
    const createdUsers: any[] = [];
    for (const u of seedUsers) {
      const created = await User.create(u);
      createdUsers.push(created);
    }
    console.log(`[BiteFlow Seeder] Seeded ${createdUsers.length} users (Admin & Indian Diners).`);

    // Insert Categories
    console.log('[BiteFlow Seeder] Seeding categories...');
    const createdCategories = await Category.insertMany(seedCategories);
    console.log(`[BiteFlow Seeder] Seeded ${createdCategories.length} categories.`);

    const categoryMap = new Map<string, mongoose.Types.ObjectId>();
    createdCategories.forEach((cat) => {
      categoryMap.set(cat.name, cat._id as mongoose.Types.ObjectId);
    });

    // Insert Restaurants
    console.log('[BiteFlow Seeder] Seeding restaurants...');
    const createdRestaurants = await Restaurant.insertMany(seedRestaurants);
    console.log(`[BiteFlow Seeder] Seeded ${createdRestaurants.length} restaurants (Bengaluru locations).`);

    // Insert Foods
    console.log('[BiteFlow Seeder] Seeding food items...');
    const foodsToInsert = sampleFoods.map((item) => {
      const restaurant = createdRestaurants[item.restaurantIndex];
      const categoryId = categoryMap.get(item.categoryName) || createdCategories[0]._id;

      return {
        restaurantId: restaurant._id,
        categoryId: categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
      };
    });

    const createdFoods = await Food.insertMany(foodsToInsert);
    console.log(`[BiteFlow Seeder] Seeded ${createdFoods.length} Indian food items.`);

    // Find sample entities for seeding initial realistic Indian orders
    const rahulUser = createdUsers.find((u) => u.email === 'user@biteflow.com');
    const priyaUser = createdUsers.find((u) => u.email === 'priya.nair@biteflow.com');
    const arjunUser = createdUsers.find((u) => u.email === 'arjun.k@biteflow.com');
    const snehaUser = createdUsers.find((u) => u.email === 'sneha.reddy@biteflow.com');

    const spiceHub = createdRestaurants.find((r) => r.name === 'Spice Hub') || createdRestaurants[0];
    const greenLeaf = createdRestaurants.find((r) => r.name === 'Green Leaf Café') || createdRestaurants[1];
    const urbanBites = createdRestaurants.find((r) => r.name === 'Urban Bites') || createdRestaurants[2];
    const royalTable = createdRestaurants.find((r) => r.name === 'The Royal Table') || createdRestaurants[3];

    const chickenBiryani = createdFoods.find((f) => f.name === 'Chicken Biryani') || createdFoods[0];
    const filterCoffee = createdFoods.find((f) => f.name === 'Filter Coffee') || createdFoods[9];
    const masalaDosa = createdFoods.find((f) => f.name === 'Masala Dosa') || createdFoods[5];
    const paneerButterMasala = createdFoods.find((f) => f.name === 'Paneer Butter Masala') || createdFoods[15];
    const butterNaan = createdFoods.find((f) => f.name === 'Butter Naan') || createdFoods[16];
    const gobiManchurian = createdFoods.find((f) => f.name === 'Gobi Manchurian') || createdFoods[10];

    // Seed realistic demo orders (Prompt section 9: Order #ORD1024, etc.)
    console.log('[BiteFlow Seeder] Seeding initial Bengaluru demo orders...');
    const seedOrders = [
      // 1. Order #ORD1024 (Delivered)
      {
        orderNumber: 'ORD1024',
        userId: rahulUser._id,
        restaurantId: spiceHub._id,
        items: [
          {
            foodId: chickenBiryani._id,
            name: chickenBiryani.name,
            price: 249,
            quantity: 2,
            image: chickenBiryani.image,
            isVeg: false,
          },
          {
            foodId: filterCoffee._id,
            name: filterCoffee.name,
            price: 59,
            quantity: 1,
            image: filterCoffee.image,
            isVeg: true,
          },
        ],
        subtotal: 557,
        deliveryFee: 40,
        platformFee: 10,
        totalAmount: 607,
        deliveryAddress: {
          label: 'Home',
          fullName: 'Rahul Sharma',
          phone: '+91 98450 12345',
          addressLine1: '12, 5th Main Road',
          addressLine2: 'Sector 4',
          area: 'HSR Layout',
          street: '12, 5th Main Road, Sector 4, HSR Layout',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560102',
          zipCode: '560102',
          country: 'India',
        },
        paymentStatus: 'PAID',
        paymentMethod: 'DEMO_PAYMENT',
        transactionId: 'DEMO-TXN-IND901',
        orderStatus: 'DELIVERED',
        sentEmailStatuses: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'],
      },
      // 2. Order #ORD1025 (Preparing - In Progress)
      {
        orderNumber: 'ORD1025',
        userId: rahulUser._id,
        restaurantId: greenLeaf._id,
        items: [
          {
            foodId: masalaDosa._id,
            name: masalaDosa.name,
            price: 99,
            quantity: 2,
            image: masalaDosa.image,
            isVeg: true,
          },
          {
            foodId: filterCoffee._id,
            name: filterCoffee.name,
            price: 59,
            quantity: 2,
            image: filterCoffee.image,
            isVeg: true,
          },
        ],
        subtotal: 316,
        deliveryFee: 35,
        platformFee: 10,
        totalAmount: 361,
        deliveryAddress: {
          label: 'Home',
          fullName: 'Rahul Sharma',
          phone: '+91 98450 12345',
          addressLine1: '12, 5th Main Road',
          addressLine2: 'Sector 4',
          area: 'HSR Layout',
          street: '12, 5th Main Road, Sector 4, HSR Layout',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560102',
          zipCode: '560102',
          country: 'India',
        },
        paymentStatus: 'PAID',
        paymentMethod: 'DEMO_PAYMENT',
        transactionId: 'DEMO-TXN-IND902',
        orderStatus: 'PREPARING',
        sentEmailStatuses: ['PLACED', 'ACCEPTED', 'PREPARING'],
      },
      // 3. Order #ORD1026 (Placed - Incoming Ticket)
      {
        orderNumber: 'ORD1026',
        userId: priyaUser ? priyaUser._id : rahulUser._id,
        restaurantId: urbanBites._id,
        items: [
          {
            foodId: gobiManchurian._id,
            name: gobiManchurian.name,
            price: 159,
            quantity: 2,
            image: gobiManchurian.image,
            isVeg: true,
          },
        ],
        subtotal: 318,
        deliveryFee: 30,
        platformFee: 10,
        totalAmount: 358,
        deliveryAddress: {
          label: 'Home',
          fullName: 'Priya Nair',
          phone: '+91 98451 23456',
          addressLine1: '45, 4th Cross, 6th Block',
          area: 'Koramangala',
          street: '45, 4th Cross, 6th Block, Koramangala',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
          zipCode: '560034',
          country: 'India',
        },
        paymentStatus: 'PAID',
        paymentMethod: 'DEMO_PAYMENT',
        transactionId: 'DEMO-TXN-IND903',
        orderStatus: 'PLACED',
        sentEmailStatuses: ['PLACED'],
      },
      // 4. Order #ORD1027 (Delivered)
      {
        orderNumber: 'ORD1027',
        userId: arjunUser ? arjunUser._id : rahulUser._id,
        restaurantId: royalTable._id,
        items: [
          {
            foodId: paneerButterMasala._id,
            name: paneerButterMasala.name,
            price: 219,
            quantity: 1,
            image: paneerButterMasala.image,
            isVeg: true,
          },
          {
            foodId: butterNaan._id,
            name: butterNaan.name,
            price: 49,
            quantity: 3,
            image: butterNaan.image,
            isVeg: true,
          },
        ],
        subtotal: 366,
        deliveryFee: 45,
        platformFee: 10,
        totalAmount: 421,
        deliveryAddress: {
          label: 'Home',
          fullName: 'Arjun Kumar',
          phone: '+91 98452 34567',
          addressLine1: '88, 12th Main, HAL 2nd Stage',
          area: 'Indiranagar',
          street: '88, 12th Main, HAL 2nd Stage, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          zipCode: '560038',
          country: 'India',
        },
        paymentStatus: 'PAID',
        paymentMethod: 'DEMO_PAYMENT',
        transactionId: 'DEMO-TXN-IND904',
        orderStatus: 'DELIVERED',
        sentEmailStatuses: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'],
      },
      // 5. Order #ORD1028 (Delivered)
      {
        orderNumber: 'ORD1028',
        userId: snehaUser ? snehaUser._id : rahulUser._id,
        restaurantId: spiceHub._id,
        items: [
          {
            foodId: chickenBiryani._id,
            name: chickenBiryani.name,
            price: 249,
            quantity: 1,
            image: chickenBiryani.image,
            isVeg: false,
          },
        ],
        subtotal: 249,
        deliveryFee: 40,
        platformFee: 10,
        totalAmount: 299,
        deliveryAddress: {
          label: 'Home',
          fullName: 'Sneha Reddy',
          phone: '+91 98453 45678',
          addressLine1: 'Villa 14, Prestige Ozone',
          area: 'Whitefield',
          street: 'Villa 14, Prestige Ozone, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
          zipCode: '560066',
          country: 'India',
        },
        paymentStatus: 'PAID',
        paymentMethod: 'DEMO_PAYMENT',
        transactionId: 'DEMO-TXN-IND905',
        orderStatus: 'DELIVERED',
        sentEmailStatuses: ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'],
      },
    ];

    await Order.insertMany(seedOrders);
    console.log(`[BiteFlow Seeder] Seeded ${seedOrders.length} sample orders with INR amounts and Bengaluru addresses.`);

    console.log('\n=============================================');
    console.log('🌱 BiteFlow India Database Seeded Successfully!');
    console.log('=============================================');
    console.log('Demo Credentials:');
    console.log('👤 Customer: user@biteflow.com / UserPassword123! (Rahul Sharma, Bengaluru)');
    console.log('🛡️ Admin:    admin@biteflow.com / AdminPassword123! (BiteFlow Administrator)');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[BiteFlow Seeder] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
