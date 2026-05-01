import { Request, Response } from 'express';
import { Creator, User } from '../db/models';

export const getCreatorByChannelId = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;

    const creator = await Creator.findOne({ youtubeChannelId: channelId }).populate('userId');

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json({ creator });
  } catch (error) {
    console.error('Get creator error:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
};

export const updateCreator = async (req: Request, res: Response) => {
  try {
    const { userId, youtubeChannelId, walletAddress } = req.body;

    if (!userId || !walletAddress) {
      return res.status(400).json({ error: 'userId and walletAddress required' });
    }

    let creator = await Creator.findOne({ userId });

    if (!creator) {
      creator = new Creator({
        userId,
        youtubeChannelId,
        walletAddress,
        overlayUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/overlay/${userId}`,
      });
    } else {
      creator.youtubeChannelId = youtubeChannelId;
      creator.walletAddress = walletAddress;
    }

    await creator.save();

    res.json({ creator });
  } catch (error) {
    console.error('Update creator error:', error);
    res.status(500).json({ error: 'Failed to update creator' });
  }
};

export const getCreatorById = async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;

    const creator = await Creator.findById(creatorId).populate('userId');

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json({ creator });
  } catch (error) {
    console.error('Get creator by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
};
