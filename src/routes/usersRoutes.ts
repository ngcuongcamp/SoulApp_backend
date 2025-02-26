import express from 'express';

import { getAllUsers } from '../controllers/usersController';

const router = express.Router();

router.get('/get_users', getAllUsers)

export default router;