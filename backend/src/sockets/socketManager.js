import { Server } from 'socket.io';
import { LiveLocation } from '../models/LiveLocation.js';

export const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Join a room for a specific SOS incident
    socket.on('join_incident_room', (incidentId) => {
      socket.join(`incident_${incidentId}`);
      console.log(`[Socket] ${socket.id} joined incident_${incidentId}`);
    });

    // Victim sends live location
    socket.on('update_victim_location', async (data) => {
      // data: { incidentId, lat, lng, heading }
      const { incidentId, lat, lng, heading } = data;
      
      // Broadcast to volunteers/admins in this incident room
      socket.to(`incident_${incidentId}`).emit('victim_location_updated', { lat, lng, heading });
      
      // Persist in DB for history / playback
      try {
        await LiveLocation.create({
          sosAlertId: incidentId,
          location: { type: 'Point', coordinates: [lng, lat] },
          heading
        });
      } catch (err) {
        console.error('Error saving victim location:', err);
      }
    });

    // Volunteer sends live location while approaching
    socket.on('update_volunteer_location', (data) => {
      const { incidentId, volunteerId, lat, lng } = data;
      // Broadcast to the victim and admins
      socket.to(`incident_${incidentId}`).emit('volunteer_location_updated', { volunteerId, lat, lng });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
  
  return io;
};
