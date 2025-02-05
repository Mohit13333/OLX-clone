import { getProduct, getProducts, getProductsByCategory, getProductsByPrice, getProductsByRating, getProductsByReview, getProductsBySeller, paginateProduct, searchProduct, sortProduct, filterProduct, deleteProduct, updateProduct, createProduct, getNearbyProducts } from "../controllers/product.js";

import express from 'express';

const router = express.Router();

router.post('/createproduct', createProduct);

router.get('/product', getProducts);
router.get('/nearby',getNearbyProducts)
router.get('/product/:id', getProduct);
router.get('/product/category/:category', getProductsByCategory);
router.get('/product/price', getProductsByPrice);
router.get('/product/rating', getProductsByRating);
router.get('/product/review', getProductsByReview);
router.get('/product/seller', getProductsBySeller);
router.get('/product/search', searchProduct);
router.get('/product/sort', sortProduct);
router.get('/product/filter', filterProduct);
router.get('/product/paginate', paginateProduct);

router.delete('/product/:id', deleteProduct);

router.put('/product/:id', updateProduct);

export default router;