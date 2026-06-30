import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

const mockAuth = (req, res, next) => {
  req.user = { _id: '60d0fe4f5311236168a109ca' }; // Mock ObjectId
  next();
};

router.get('/', mockAuth, getUserNotifications);
router.put('/:notificationId/read', mockAuth, markAsRead);

export default router;
