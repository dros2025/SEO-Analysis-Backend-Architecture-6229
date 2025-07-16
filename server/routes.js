import express from 'express';
import { getAiOptimizationSuggestions } from './aiSuggestionsController.js';

const router = express.Router();

// AI Suggestions endpoint
router.post('/ai-suggestions', getAiOptimizationSuggestions);

export default router;