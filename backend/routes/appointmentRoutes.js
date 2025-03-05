import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for a user
// @access  Private
router.get('/', protect, getAppointments);

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', protect, createAppointment);

// @route   GET /api/appointments/:id
// @desc    Get an appointment by ID
// @access  Private
router.get('/:id', protect, getAppointmentById);

// @route   PUT /api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', protect, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', protect, deleteAppointment);

export default router; 