
const { json, auth, ADMIN_EMAIL } = require('./_common.js');
exports.handler = async (event) => {
  try{ const u=auth(event); const admin = (ADMIN_EMAIL && u.email===ADMIN_EMAIL.toLowerCase()); return json(200,{admin}); }
  catch(e){ return json(401,{error:'Unauthorized'}); }
};
