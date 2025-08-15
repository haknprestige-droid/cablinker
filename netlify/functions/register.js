
const { db, json, bad, User, bcrypt, jwt, JWT_SECRET } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    await db();
    const { firstName, lastName, email, phone, address, password } = JSON.parse(event.body || '{}');
    if(!firstName || !lastName || !email || !password) return bad('Champs requis');
    const e = String(email).toLowerCase();
    const exists = await User.findOne({ email: e });
    if (exists) return bad('Email déjà utilisé', 409);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email: e, phone, address, passwordHash });
    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.firstName+' '+user.lastName, admin: false }, JWT_SECRET, { expiresIn: '7d' });
    return json(200, { token });
  }catch(e){
    console.error(e);
    return bad('Erreur serveur', 500);
  }
};
