
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { getStore } = require('@netlify/blobs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const CLOUDINARY_CLOUD = process.env.CLOUDINARY_CLOUD || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || '';

function json(status, data){ return { statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }; }
function bad(msg, code=400){ return json(code, { error: msg }); }
function auth(event){ const h=event.headers?.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):null; if(!t) throw new Error('Unauthorized'); return jwt.verify(t, JWT_SECRET); }
async function getDb(){ return getStore({ name: 'cablinker' }); }
async function putObject(store, key, val){ await store.set(key, JSON.stringify(val)); }
async function getObject(store, key){ const s = await store.get(key); return s ? JSON.parse(s) : null; }
async function uploadPhotosIfConfigured(photos){ if(!CLOUDINARY_CLOUD || !CLOUDINARY_UPLOAD_PRESET) return photos || []; const urls=[]; for(const p of (photos||[]).slice(0,3)){ try{ const r = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { file: p, upload_preset: CLOUDINARY_UPLOAD_PRESET }); urls.push(r.data.secure_url); }catch(e){} } return urls.length? urls : (photos||[]); }
module.exports = { json, bad, auth, getDb, putObject, getObject, JWT_SECRET, ADMIN_EMAIL, CLOUDINARY_CLOUD, CLOUDINARY_UPLOAD_PRESET, uploadPhotosIfConfigured, uuidv4, bcrypt, jwt };
