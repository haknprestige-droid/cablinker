
const { json, getAuthUser, ADMIN_EMAIL } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    const admin = (ADMIN_EMAIL && u.email.toLowerCase()===ADMIN_EMAIL);
    return json(200,{admin});
  }catch(e){ return json(401, { error:'Unauthorized' }); }
};
