import { Router } from 'express';
import {
  createTip,
  getTipsByCreator,
  getOverlayTips,
  updateTipStatus,
  getTipStats,
} from '../controllers/tipController';

const router = Router();

router.post('/', createTip);
router.get('/creator/:creatorId', getTipsByCreator);
router.get('/overlay/:creatorId', getOverlayTips);
router.post('/:tipId/status', updateTipStatus);
router.get('/stats/:creatorId', getTipStats);

export default router;
