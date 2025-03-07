import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    resetOtp: {
      type: String,
      default: ''
    },
    resetOtpExpireAt: {
      type: Date,
      default: null
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
      pregnancyHistory: String
    },
    healthInfo: {
      bloodType: String,
      allergies: [String],
      medications: [String],
      medicalConditions: [String]
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
      dietaryRestrictions: [String],
      notificationSettings: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      },
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
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 