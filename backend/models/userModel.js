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
      match: [/^\+?[0-9]{10,15}$/, 'Please add a valid phone number']
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
    age: {
      type: Number,
      default: 25,
      required: [true, 'Please add your age in years']
    },
    weight: {
      type: Number,
      required: [true, 'Please add your weight in kg']
    },
    height: {
      type: Number,
      required: [true, 'Please add your height in cm']
    },
    bmr: {
      type: Number
    },
    calories: {
      type: Number
    },
    protein: {
      type: Number
    },
    carbohydrates: {
      type: Number
    },
    fats: {
      type: Number
    },
    weightHistory: [{
      weight: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    pregnancyDetails: {
      dueDate: {
        type: Date,
        required: [true, 'Please add your due date']
      },
      firstPregnancy: {
        type: Boolean,
        default: true
      },
      medicalConditions: {
        type: [String],
        default: []
      },
      trimester: {
        type: Number,
        enum: [1, 2, 3],
        default: 1
      }
    },
    healthInfo: {
      age: {
        type: Number,
        default: function() { return this.age; },
        required: [true, 'Please add your age in years']
      },
      bloodType: String,
      allergies: [String],
      medications: [String],
      medicalConditions: {
        type: [String],
        required: [true, 'Please select at least one medical condition or "None"']
      },
      hasJointPain: {
        type: Boolean,
        default: false
      },
      jointPainType: {
        type: String,
        enum: ['knee', 'hip', 'ankle', 'wrist', 'elbow', 'shoulder', 'back', 'neck', 'other', null],
        default: null
      },
      nutrition: {
        calories: {
          type: Number
        },
        protein: {
          type: Number
        },
        carbohydrates: {
          type: Number
        },
        fats: {
          type: Number
        }
      }
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
    dietType: {
      type: String,
      required: [true, 'Please select your diet type'],
      enum: ['vegetarian', 'non-vegetarian']
    },
    notificationPreference: {
      type: String,
      required: [true, 'Please select your notification preference'],
      enum: ['email', 'sms', 'both']
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

// Add a pre-save middleware to calculate macronutrients based on calories
userSchema.pre('save', function(next) {
  // Ensure healthInfo exists
  if (!this.healthInfo) {
    this.healthInfo = {};
  }
  
  // Ensure healthInfo.age is set
  if (!this.healthInfo.age) {
    this.healthInfo.age = this.age;
  }
  
  // Calculate macronutrients if calories are available
  if (this.calories) {
    // Protein: 25% of calories (1g protein = 4 calories)
    this.protein = Math.round((this.calories * 0.25) / 4);
    
    // Carbohydrates: 45% of calories (1g carbs = 4 calories)
    this.carbohydrates = Math.round((this.calories * 0.45) / 4);
    
    // Fats: 30% of calories (1g fat = 9 calories)
    this.fats = Math.round((this.calories * 0.30) / 9);
    
    // Also store in healthInfo.nutrition
    if (!this.healthInfo.nutrition) {
      this.healthInfo.nutrition = {};
    }
    
    this.healthInfo.nutrition.calories = this.calories;
    this.healthInfo.nutrition.protein = this.protein;
    this.healthInfo.nutrition.carbohydrates = this.carbohydrates;
    this.healthInfo.nutrition.fats = this.fats;
  }
  
  next();
});

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