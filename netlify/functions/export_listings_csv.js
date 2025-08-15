
const { db, json, getAuthUser, Listing } = require('./_common.js');
exports.handler = async (event) => {
  try{
    const u = getAuthUser(event);
    await db();
    const arr = await Listing.find({ ownerId: u.id }).sort({ createdAt: -1 }).lean();
    const rows = [['id','domaine','type','city','postal_code','brand','model','year','price','created_at']];
    for (const l of arr) {
      rows.push([l._id, l.domaine, l.type, l.city||'', l.postal_code||'', l.brand||'', l.model||'', String(l.year||''), String(l.price||''), l.createdAt?.toISOString?.() || '']);
    }
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    return json(200, { csv });
  }catch(e){ return json(401, { error:'Unauthorized' }); }
};
