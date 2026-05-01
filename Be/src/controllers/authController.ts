import { Request, Response } from 'express';
import { User, Creator } from '../db/models';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, walletAddress, role } = req.body;

    if (!email || !walletAddress) {
      return res.status(400).json({ error: 'Email and wallet address required' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.json({ user });
    }

    user = new User({ email, walletAddress, role });
    await user.save();

    if (role === 'creator') {
      const overlayUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/overlay/${user._id}`;
      const creator = new Creator({ userId: user._id, walletAddress, overlayUrl });
      await creator.save();
    }

    res.json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
