import { Router } from 'express';
import {
  getCreatorByChannelId,
  updateCreator,
  getCreatorById,
} from '../controllers/creatorController';

const router = Router();

router.get('/:channelId', getCreatorByChannelId);
router.get('/id/:creatorId', getCreatorById);
router.post('/update', updateCreator);

export default router;
