import { Volunteer } from '../models/Volunteer.js';
import { SOSAlert } from '../models/SOSAlert.js';

export const findNearestVolunteers = async (coordinates, maxDistanceInMeters) => {
  return await Volunteer.find({
    isAvailable: true,
    lastKnownLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistanceInMeters
      }
    }
  }).limit(5); // Notify up to 5 nearest volunteers
};

export const autoAssignLogic = async (coordinates) => {
  // Expanding radius search: 5km, 10km, 20km
  const radii = [5000, 10000, 20000]; 

  for (const radius of radii) {
    const volunteers = await findNearestVolunteers(coordinates, radius);
    if (volunteers.length > 0) {
      return volunteers; // Return the first batch found within the smallest possible radius
    }
  }
  return []; // No volunteers available within 20km
};

export const acceptSOS = async (sosId, volunteerUserId) => {
  // Manual acceptance logic
  const alert = await SOSAlert.findById(sosId);
  
  if (!alert) throw new Error('SOS Alert not found');
  if (alert.status !== 'PENDING') throw new Error('Alert has already been accepted or resolved');

  alert.status = 'ACCEPTED';
  alert.assignedVolunteerId = volunteerUserId;
  await alert.save();

  // Increment volunteer's successful assist count
  await Volunteer.findOneAndUpdate(
    { userId: volunteerUserId },
    { $inc: { successfulAssists: 1 } }
  );

  return alert;
};
