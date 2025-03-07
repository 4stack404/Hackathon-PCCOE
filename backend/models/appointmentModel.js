import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  type: {
    type: String,
    enum: ['checkup', 'ultrasound', 'test', 'consultation', 'other'],
    required: true
  },
  doctor: {
    name: String,
    specialty: String,
    contact: String
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  notes: String,
  reminders: [{
    type: Date,
    notification: {
      type: String,
      enum: ['email', 'sms', 'push'],
      default: 'email'
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment; 