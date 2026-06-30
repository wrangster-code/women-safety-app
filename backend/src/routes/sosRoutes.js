import express from 'express';
import { createSOSAlert, volunteerAcceptSOS } from '../controllers/sosController.js';

const router = express.Router();

// Mock Auth Middleware (will be replaced by actual JWT middleware later)
const mockAuth = (req, res, next) => {
  req.user = { _id: '60d0fe4f5311236168a109ca' }; // Dummy ObjectId
  next();
};

router.post('/', mockAuth, createSOSAlert);
router.post('/:sosId/accept', mockAuth, volunteerAcceptSOS);

export default router;
