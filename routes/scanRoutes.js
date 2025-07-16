import express from 'express';
import { scanWebsite, getScanHistory, getScanDetails } from '../controllers/scanController.js';

const router = express.Router();

// Main scan endpoint
router.post('/scan', scanWebsite);

// Get scan history (optional for future use)
router.get('/scans', getScanHistory);

// Get specific scan details
router.get('/scan/:id', getScanDetails);

export default router;