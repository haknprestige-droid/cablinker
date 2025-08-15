
const { db, json, bad, getAuthUser, ADMIN_EMAIL, Listing } = require('./_common.js');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });
  try{
    const u = getAuthUser(event);
    const isAdmin = (ADMIN_EMAIL && u.email.toLowerCase()===ADMIN_EMAIL);
    if(!isAdmin) return bad('Accès admin requis',403);
    await db();
    const { id, status } = JSON.parse(event.body||'{}');
    if(!id || !status) return bad('Paramètres requis');
    const valid = ['actif','suspendu','supprime','supprimer'];
    if(!valid.includes(status)) return bad('Statut invalide');
    const final = (status==='supprimer')?'supprime':status;
    const l = await Listing.findByIdAndUpdate(id, { status: final }, { new:true });
    if(!l) return bad('Annonce introuvable',404);
    return json(200, { ok:true, status: l.status });
  }catch(e){
    console.error(e); return bad('Erreur serveur', 500);
  }
};
