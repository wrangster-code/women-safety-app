import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'], 
    default: 'PENDING' 
  },
  initialLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  assignedVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

sosAlertSchema.index({ initialLocation: '2dsphere' });

export const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);
