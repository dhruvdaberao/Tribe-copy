import express from 'express';
import {
  createTribe,
  getTribes,
  getTribeById,
  joinTribe,
  leaveTribe,
  updateTribe,
  deleteTribe,
  sendMessage,
} from '../controllers/tribeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/tribes
// @desc    Create a new tribe
// @access  Private
router.post('/', protect, createTribe);

// @route   GET /api/tribes
// @desc    Get all tribes
// @access  Private
router.get('/', protect, getTribes);

// @route   GET /api/tribes/:id
// @desc    Get tribe by ID
// @access  Private
router.get('/:id', protect, getTribeById);

// @route   POST /api/tribes/:id/join
// @desc    Join a tribe
// @access  Private
router.post('/:id/join', protect, joinTribe);

// @route   POST /api/tribes/:id/leave
// @desc    Leave a tribe
// @access  Private
router.post('/:id/leave', protect, leaveTribe);

// @route   PUT /api/tribes/:id
// @desc    Update tribe (only owner can do this)
// @access  Private
router.put('/:id', protect, updateTribe);

// @route   DELETE /api/tribes/:id
// @desc    Delete tribe (only owner can do this)
// @access  Private
router.delete('/:id', protect, deleteTribe);

// @route   POST /api/tribes/:id/messages
// @desc    Send a message to tribe
// @access  Private
router.post('/:id/messages', protect, sendMessage);

export default router;
