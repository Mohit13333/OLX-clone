import mongoose from "mongoose";
import Product from "./models/product.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  });

const seedProducts = [
  {
    name: "Product 1",
    description: "This is the description for product 1.",
    price: 19.99,
    category: "Electronics",
    quantity: 100,
    photo: "https://example.com/photo1.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 2",
    description: "This is the description for product 2.",
    price: 29.99,
    category: "Clothing",
    quantity: 50,
    photo: "https://example.com/photo2.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 3",
    description: "This is the description for product 3.",
    price: 39.99,
    category: "Books",
    quantity: 75,
    photo: "https://example.com/photo3.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 4",
    description: "This is the description for product 4.",
    price: 49.99,
    category: "Home",
    quantity: 60,
    photo: "https://example.com/photo4.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 5",
    description: "This is the description for product 5.",
    price: 59.99,
    category: "Beauty",
    quantity: 80,
    photo: "https://example.com/photo5.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 6",
    description: "This is the description for product 6.",
    price: 69.99,
    category: "Sports",
    quantity: 90,
    photo: "https://example.com/photo6.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 7",
    description: "This is the description for product 7.",
    price: 79.99,
    category: "Toys",
    quantity: 40,
    photo: "https://example.com/photo7.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 8",
    description: "This is the description for product 8.",
    price: 89.99,
    category: "Garden",
    quantity: 30,
    photo: "https://example.com/photo8.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 9",
    description: "This is the description for product 9.",
    price: 99.99,
    category: "Electronics",
    quantity: 120,
    photo: "https://example.com/photo9.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 10",
    description: "This is the description for product 10.",
    price: 109.99,
    category: "Clothing",
    quantity: 70,
    photo: "https://example.com/photo10.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 11",
    description: "This is the description for product 11.",
    price: 119.99,
    category: "Books",
    quantity: 55,
    photo: "https://example.com/photo11.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 12",
    description: "This is the description for product 12.",
    price: 129.99,
    category: "Home",
    quantity: 85,
    photo: "https://example.com/photo12.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 13",
    description: "This is the description for product 13.",
    price: 139.99,
    category: "Beauty",
    quantity: 65,
    photo: "https://example.com/photo13.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 14",
    description: "This is the description for product 14.",
    price: 149.99,
    category: "Sports",
    quantity: 45,
    photo: "https://example.com/photo14.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 15",
    description: "This is the description for product 15.",
    price: 159.99,
    category: "Toys",
    quantity: 35,
    photo: "https://example.com/photo15.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 16",
    description: "This is the description for product 16.",
    price: 169.99,
    category: "Garden",
    quantity: 25,
    photo: "https://example.com/photo16.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 17",
    description: "This is the description for product 17.",
    price: 179.99,
    category: "Electronics",
    quantity: 110,
    photo: "https://example.com/photo17.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 18",
    description: "This is the description for product 18.",
    price: 189.99,
    category: "Clothing",
    quantity: 95,
    photo: "https://example.com/photo18.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 19",
    description: "This is the description for product 19.",
    price: 199.99,
    category: "Books",
    quantity: 65,
    photo: "https://example.com/photo19.jpg",
    seller: "67a279e703fb9183297984c2",
  },
  {
    name: "Product 20",
    description: "This is the description for product 20.",
    price: 209.99,
    category: "Home",
    quantity: 75,
    photo: "https://example.com/photo20.jpg",
    seller: "67a279e703fb9183297984c2",
  },
];

async function seedDB() {
  try {
    await Product.deleteMany({});
    console.log("Products collection cleared.");

    await Product.insertMany(seedProducts);
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function updateImages(){
    try {
        const products = await Product.find();
        for (let product of products) {
        product.photo = `https://jamesclear.com/wp-content/uploads/2020/11/atomic-habits_gallery_hi-res_01.jpg`;
        await product.save();
        }
        console.log("Images updated successfully.");
    } catch (error) {
        console.error("Error updating images:", error);
    } finally {
        mongoose.connection.close();
    }
}

async function updateLocations(){
    try {
        const products = await Product.find();
        for (let product of products) {
        product.location = `Port Blair, Andaman & Nicobar`;
        await product.save();
        }
        console.log("Locations updated successfully.");
    } catch (error) {
        console.error("Error updating locations:", error);
    } finally {
        mongoose.connection.close();
    }
}

updateLocations();

// seedDB();