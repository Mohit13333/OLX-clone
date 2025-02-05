import Product from "../models/product.js";
import cloudinary from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("photo");

export const createProduct = async (req, res) => {
  const handleUpload = () => {
    return new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  try {
    await handleUpload();

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, description, price, category, quantity, seller, location } =
      req.body;

    if (!name || !price || !seller) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedLocation = location;
    try {
      parsedLocation =
        typeof location === "string" && location.startsWith("{")
          ? JSON.parse(location)
          : location;
    } catch (error) {
      return res.status(400).json({ message: "Invalid location format" });
    }

    const cloudinaryUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            public_id: uuidv4(),
            folder: "products",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(stream);
      });
    };

    const cloudinaryResult = await cloudinaryUpload();

    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      photo: cloudinaryResult.secure_url,
      seller,
      location: parsedLocation,
    });

    const newProduct = await product.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error creating product",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getNearbyProducts = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required." });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Invalid latitude or longitude." });
    }

    const products = await Product.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: 5000,
          spherical: true,
        },
      },
    ]);

    res.json(Array.isArray(products) ? products : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, quantity, photo, seller } =
    req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No product with id: ${id}`);
  const updatedProduct = {
    name,
    description,
    price,
    category,
    quantity,
    photo,
    seller,
    _id: id,
  };
  await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
  res.json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No product with id: ${id}`);
  await Product.findByIdAndRemove(id);
  res.json({ message: "Product deleted successfully." });
};

export const searchProduct = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const filterProduct = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const sortProduct = async (req, res) => {
  const { sort } = req.query;
  try {
    const products = await Product.find().sort({ price: sort });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const paginateProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  if (endIndex < (await Product.countDocuments().exec())) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  try {
    results.results = await Product.find().limit(limit).skip(startIndex).exec();
    res.json(results);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsBySeller = async (req, res) => {
  const { seller } = req.query;
  try {
    const products = await Product.find({ seller });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByPrice = async (req, res) => {
  const { price } = req.query;
  try {
    const products = await Product.find({ price });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByRating = async (req, res) => {
  const { rating } = req.query;
  try {
    const products = await Product.find({ rating });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByReview = async (req, res) => {
  const { review } = req.query;
  try {
    const products = await Product.find({ review });
    res.json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
