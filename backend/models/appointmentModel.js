import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    doctor: {
      name: String,
      specialty: String,
      contact: String,
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    notes: {
      type: String,
    },
    reminder: {
      enabled: {
        type: Boolean,
        default: true,
      },
      time: {
        type: Number, // hours before appointment
        default: 24,
      },
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 