import { Request, Response } from 'express';
import { Tip, Creator } from '../db/models';

export const createTip = async (req: Request, res: Response) => {
  try {
    const { senderWallet, receiverWallet, amount, token, message, txSignature, creatorId } = req.body;

    if (!senderWallet || !receiverWallet || !amount) {
      return res.status(400).json({ error: 'senderWallet, receiverWallet, and amount required' });
    }

    const tip = new Tip({
      senderWallet,
      receiverWallet,
      amount,
      token: token || 'SOL',
      message,
      txSignature,
      status: 'pending',
      creatorId,
    });

    await tip.save();

    // Update creator's total donations
    if (creatorId) {
      await Creator.findByIdAndUpdate(
        creatorId,
        { $inc: { totalDonations: amount } }
      );
    }

    res.json({ tip });
  } catch (error) {
    console.error('Create tip error:', error);
    res.status(500).json({ error: 'Failed to create tip' });
  }
};

export const getTipsByCreator = async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const tips = await Tip.find({ creatorId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ tips });
  } catch (error) {
    console.error('Get tips error:', error);
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
};

export const getOverlayTips = async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const tips = await Tip.find({
      creatorId,
      status: 'confirmed',
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ tips });
  } catch (error) {
    console.error('Get overlay tips error:', error);
    res.status(500).json({ error: 'Failed to fetch overlay tips' });
  }
};

export const updateTipStatus = async (req: Request, res: Response) => {
  try {
    const { tipId } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required' });
    }

    const tip = await Tip.findByIdAndUpdate(tipId, { status }, { new: true });

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ tip });
  } catch (error) {
    console.error('Update tip status error:', error);
    res.status(500).json({ error: 'Failed to update tip status' });
  }
};

export const getTipStats = async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const stats = await Tip.aggregate([
      { $match: { creatorId: require('mongoose').Types.ObjectId(creatorId) } },
      {
        $group: {
          _id: '$creatorId',
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    res.json({ stats: stats[0] || { totalAmount: 0, totalCount: 0, avgAmount: 0 } });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
