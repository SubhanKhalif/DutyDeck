import express from 'express';
import { getAllEmployees } from '../controllers/userController.js';

const router = express.Router();

router.get('/employees', getAllEmployees); // GET /api/users/employees

export default router;
