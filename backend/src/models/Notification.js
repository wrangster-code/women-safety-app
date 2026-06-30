import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['SOS_TRIGGERED', 'VOLUNTEER_ASSIGNED', 'VOLUNTEER_ACCEPTED', 'INCIDENT_CLOSED', 'SYSTEM'], 
    required: true 
  },
  isRead: { type: Boolean, default: false },
  referenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SOSAlert' } 
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
