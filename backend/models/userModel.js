import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['female', 'male', 'other'],
      default: 'female'
    },
    address: {
      type: String
    },
    bio: {
      type: String
    },
    profilePicture: {
      type: String
    },
    pregnancyDetails: {
      dueDate: Date,
      weeksPregnant: Number,
      pregnancyHistory: [
        {
          year: Number,
          outcome: String,
          details: String
        }
      ]
    },
    healthMetrics: {
      weight: [
        {
          date: Date,
          value: Number
        }
      ],
      bloodPressure: [
        {
          date: Date,
          systolic: Number,
          diastolic: Number
        }
      ],
      bloodSugar: [
        {
          date: Date,
          value: Number
        }
      ]
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    preferences: {
      language: {
        type: String,
        default: 'English'
      },
      theme: {
        type: String,
        default: 'Light'
      },
      units: {
        type: String,
        enum: ['Imperial', 'Metric'],
        default: 'Imperial'
      }
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 