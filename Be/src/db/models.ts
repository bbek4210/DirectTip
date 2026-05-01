import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  walletAddress: String,
  role: { type: String, enum: ['creator', 'viewer'], default: 'viewer' },
  createdAt: { type: Date, default: Date.now },
});

// Creator Schema
const CreatorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  youtubeChannelId: String,
  walletAddress: { type: String, required: true },
  overlayUrl: String,
  totalDonations: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Tip Schema
const TipSchema = new mongoose.Schema({
  senderWallet: { type: String, required: true },
  receiverWallet: { type: String, required: true },
  amount: { type: Number, required: true },
  token: { type: String, default: 'SOL' },
  message: String,
  txSignature: String,
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', UserSchema);
export const Creator = mongoose.model('Creator', CreatorSchema);
export const Tip = mongoose.model('Tip', TipSchema);
