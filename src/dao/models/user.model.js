import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  age: { type: Number, required: false },
  role: { type: String, default: 'user', required: false },
}, { timestamps: true });

export default mongoose.model('User', userSchema);