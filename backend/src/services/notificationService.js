import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/email.js';

export const triggerNotification = async (io, { userId, title, message, type, referenceId, sendEmailNotice = false }) => {
  try {
    // 1. Save to Database
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      referenceId
    });

    // 2. Emit Real-time Socket Event
    if (io) {
      // Send directly to the user's personal room
      io.to(`user_${userId}`).emit('new_notification', notification);
    }

    // 3. Send Email optionally
    if (sendEmailNotice) {
      const user = await User.findById(userId);
      if (user && user.email) {
        await sendEmail({
          email: user.email,
          subject: title,
          message: message,
          html: `<p><strong>${title}</strong></p><p>${message}</p>`
        });
      }
    }

    return notification;
  } catch (error) {
    console.error('Error triggering notification:', error);
  }
};
