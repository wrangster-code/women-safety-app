import mongoose from 'mongoose';

const liveLocationSchema = new mongoose.Schema({
  sosAlertId: { type: mongoose.Schema.Types.ObjectId, ref: 'SOSAlert', required: true, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  heading: { type: Number },
  timestamp: { type: Date, default: Date.now, expires: '7d' } // Auto-delete after 7 days
});

export const LiveLocation = mongoose.model('LiveLocation', liveLocationSchema);
