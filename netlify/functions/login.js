
const { json, bad, getDb, getObject, jwt, JWT_SECRET, bcrypt, ADMIN_EMAIL } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  const { email, password } = JSON.parse(event.body||'{}');
  const store = await getDb();
  const user = await getObject(store, `user:${(email||'').toLowerCase()}`);
  if(!user) return bad('Identifiants invalides', 401);
  const ok = await bcrypt.compare(password||'', user.password_hash||'');
  if(!ok) return bad('Identifiants invalides', 401);
  const isAdmin = (ADMIN_EMAIL && ADMIN_EMAIL.toLowerCase()===user.email);
  const token = jwt.sign({ id:user.id, email:user.email, name:user.firstName+' '+user.lastName, admin:isAdmin }, JWT_SECRET, { expiresIn: '7d' });
  return json(200, { token });
};
