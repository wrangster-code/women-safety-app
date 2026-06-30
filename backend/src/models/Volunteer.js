import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  isAvailable: { type: Boolean, default: false },
  lastKnownLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
  },
  successfulAssists: { type: Number, default: 0 },
  rating: { type: Number, default: 5 }
}, { timestamps: true });

volunteerSchema.index({ lastKnownLocation: '2dsphere' });

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
