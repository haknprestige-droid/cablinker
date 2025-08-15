
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase();
const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';

if (CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: CLOUDINARY_URL });
}

let conn = null;
async function db() {
  if (conn) return conn;
  conn = await mongoose.connect(MONGODB_URI, { dbName: 'cablinker' });
  return conn;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});
const ListingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  domaine: String,
  type: String,
  city: String,
  postal_code: String,
  brand: String,
  model: String,
  year: Number,
  price: Number,
  description: String,
  options: [String],
  assurance: String,
  caution: String,
  caution_amount: Number,
  photos: [String],
  status: { type: String, default: 'actif' },
  createdAt: { type: Date, default: Date.now },
});
const ThreadSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interestedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
const MessageSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  body: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
const Thread = mongoose.models.Thread || mongoose.model('Thread', ThreadSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

function json(status, data) {
  return { statusCode: status, headers: {'Content-Type':'application/json', 'Cache-Control':'no-store'}, body: JSON.stringify(data) };
}
function bad(msg, code=400){ return json(code, { error: msg }); }

function getAuthUser(event){
  const h = event.headers?.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if(!t) throw new Error('Unauthorized');
  return jwt.verify(t, JWT_SECRET);
}

async function uploadPhotos(photos){
  const out = [];
  for (const p of (photos||[]).slice(0,3)) {
    if (!p) continue;
    if (CLOUDINARY_URL) {
      try {
        const r = await cloudinary.uploader.upload(p, { resource_type: 'image' });
        out.push(r.secure_url);
      } catch(e) {}
    } else {
      out.push(p);
    }
  }
  return out;
}

module.exports = { db, json, bad, getAuthUser, JWT_SECRET, ADMIN_EMAIL, uploadPhotos, User, Listing, Thread, Message, bcrypt, jwt, uuidv4 };
