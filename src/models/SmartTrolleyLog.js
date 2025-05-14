import mongoose from 'mongoose';

const TrolleyLogSchema = new mongoose.Schema({
  reference: String,
  status: String,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SmartTrolleyLog || mongoose.model('SmartTrolleyLog', TrolleyLogSchema);
