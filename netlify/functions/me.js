
const { db, json, bad, User, getAuthUser } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    await db();
    const user = await User.findById(u.id).lean();
    if(!user) return bad('Introuvable', 404);
    delete user.passwordHash;
    return json(200, user);
  }catch(e){
    return bad('Unauthorized', 401);
  }
};
