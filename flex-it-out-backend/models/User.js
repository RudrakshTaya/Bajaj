const mongoose = require("mongoose");

// Regular expression for validating email format
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Regular expression for validating phone number format (basic example)
const phoneRegex = /^[0-9]{10,15}$/;

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true, 
      index: true, 
      match: emailRegex // Validate email format
    },

    phone: { 
      type: String, 
      unique: true, 
      sparse: true, // Optional field
      match: phoneRegex, // Validate phone number format
      trim: true 
    },

    password: { 
      type: String, 
      required: true, 
      minlength: 6 // Password length validation
    },

    avatar: { 
      type: String, 
      default: "" 
    },

    score: { 
      type: Number, 
      default: 0 
    },

    streak: { 
      type: Number, 
      default: 0 
    },

    calories: { 
      type: Number, 
      default: 0 
    },

    membership: {
      plan: { 
        type: String, 
        enum: ["basic", "premium", "student"], 
        default: "basic" 
      },
      expiresAt: { 
        type: Date, 
        default: null 
      }
    },

    age: { 
      type: Number, 
      required: true, 
      min: 13, // Age validation, minimum 13 years old
      max: 120 // Maximum age validation
    },

    createdAt: { 
      type: Date, 
      default: Date.now 
    },

    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true // Automatically create updatedAt field and manage time-stamps
  }
);

// Index phone and email fields for faster searches
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

// Pre-save hook to update the `updatedAt` field on each document update
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
