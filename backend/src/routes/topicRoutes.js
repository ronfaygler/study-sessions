import express from 'express';
import {getTopics} from "../controllers/topicsController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {requireRole} from "../middleware/requireRole.js";

const router = express.Router();

router.get('/topics', authMiddleware, requireRole('teacher'), getTopics)

export default router;