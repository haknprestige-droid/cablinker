
const { json, bad, getDb, putObject, getObject, uuidv4, bcrypt } = require('./_common.js');
exports.handler = async (event) => {
  if(event.httpMethod!=='POST') return json(405,{error:'Method'});
  const { firstName, lastName, email, phone, address, password } = JSON.parse(event.body||'{}');
  if(!firstName||!lastName||!email||!password) return bad('Champs requis');
  const store = await getDb();
  const key = `user:${email.toLowerCase()}`;
  const exists = await getObject(store, key);
  if(exists) return bad('Email déjà utilisé');
  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), firstName, lastName, email: email.toLowerCase(), phone, address, created_at: new Date().toISOString(), password_hash: hash, role:'user' };
  await putObject(store, key, user);
  return json(200, { ok:true });
};
