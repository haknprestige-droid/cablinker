
const { json, auth, getDb, getObject } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = auth(event);
    const store = await getDb();
    const user = await getObject(store, `user:${u.email}`);
    if(!user) return json(404,{error:'Not found'});
    delete user.password_hash; return json(200, user);
  }catch(e){ return json(401,{error:'Unauthorized'}); }
};
