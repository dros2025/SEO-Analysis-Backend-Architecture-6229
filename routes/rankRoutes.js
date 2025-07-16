import express from 'express';
import { checkRankPosition } from '../controllers/rankCheckController.js';

const router = express.Router();

router.post('/rank-check', checkRankPosition);

export default router;