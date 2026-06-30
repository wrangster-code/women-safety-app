import { SOSAlert } from '../models/SOSAlert.js';
import { autoAssignLogic, acceptSOS } from '../services/volunteerService.js';
import { triggerNotification } from '../services/notificationService.js';

export const createSOSAlert = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const userId = req.user._id; // Extracted from auth middleware

    const alert = await SOSAlert.create({
      userId,
      initialLocation: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    });

    // Auto-assignment search
    const nearbyVolunteers = await autoAssignLogic([lng, lat]);

    // Send Real-Time Notifications
    const io = req.app.get('io');
    if (io && nearbyVolunteers.length > 0) {
      nearbyVolunteers.forEach(volunteer => {
        // Broadcast to specific volunteer's room
        io.to(`volunteer_${volunteer.userId}`).emit('new_sos_alert', {
          sosId: alert._id,
          location: { lat, lng }
        });

        triggerNotification(io, {
          userId: volunteer.userId,
          title: 'SOS Alert Nearby!',
          message: 'Someone nearby has triggered an SOS alert.',
          type: 'SOS_TRIGGERED',
          referenceId: alert._id,
          sendEmailNotice: true
        });
      });
    }

    res.status(201).json({
      success: true,
      data: {
        alert,
        volunteersNotified: nearbyVolunteers.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const volunteerAcceptSOS = async (req, res) => {
  try {
    const { sosId } = req.params;
    const volunteerId = req.user._id;

    // Manual acceptance
    const alert = await acceptSOS(sosId, volunteerId);

    // Notify the victim that a volunteer is coming
    const io = req.app.get('io');
    if (io) {
      io.to(`incident_${sosId}`).emit('sos_accepted', {
        volunteerId,
        message: 'A volunteer has accepted and is on the way.'
      });

      triggerNotification(io, {
        userId: alert.userId,
        title: 'Volunteer Assigned',
        message: 'A volunteer has accepted your SOS and is on their way.',
        type: 'VOLUNTEER_ACCEPTED',
        referenceId: sosId,
        sendEmailNotice: true
      });
    }

    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
