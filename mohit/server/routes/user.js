import {signup, login, getUser, getUsers, updateUser, deleteUser, searchUser } from "../controllers/user.js"

import express from 'express';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/user', getUser);
router.get('/users', getUsers);
router.put('/user', updateUser);
router.delete('/user', deleteUser);
router.get('/search', searchUser);

export default router;