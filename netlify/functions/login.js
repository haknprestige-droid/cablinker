
const { db, json, bad, User, bcrypt, jwt, JWT_SECRET, ADMIN_EMAIL } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    await db();
    const { email, password } = JSON.parse(event.body || '{}');
    const e = String(email||'').toLowerCase();
    const user = await User.findOne({ email: e });
    if(!user) return bad('Identifiants invalides', 401);
    const ok = await bcrypt.compare(password||'', user.passwordHash||'');
    if(!ok) return bad('Identifiants invalides', 401);
    const isAdmin = (ADMIN_EMAIL && ADMIN_EMAIL === user.email);
    const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.firstName+' '+user.lastName, admin: isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    return json(200, { token });
  }catch(e){
    console.error(e);
    return bad('Erreur serveur', 500);
  }
};
