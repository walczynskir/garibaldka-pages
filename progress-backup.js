/* Garibaldka durable progress adapter. No active game data is imported. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GaribaldkaBackup=api;})(globalThis,()=>{
 const rewardIds=['orange-grove','copper','starry-sky'];
 const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
 const naturalWins=records=>Object.values(records).filter(r=>r.outcome==='win'&&(r.reason==='natural'||r.reason===undefined)).length;
 function validProgress(p){return exact(p,['wins','records','unlockedThemes'])&&Number.isSafeInteger(p.wins)&&p.wins>=0
 &&p.records&&typeof p.records==='object'&&!Array.isArray(p.records)&&Object.entries(p.records).every(([id,r])=>id.length>0&&id.length<=128&&!['__proto__','constructor','prototype'].includes(id)&&(exact(r,['outcome','reason','endedAt'])||exact(r,['outcome','endedAt']))&&['win','loss','draw','abandoned'].includes(r.outcome)&&(r.reason===undefined||['natural','replaced','abandoned'].includes(r.reason))&&Number.isSafeInteger(r.endedAt)&&r.endedAt>=0)
 &&Array.isArray(p.unlockedThemes)&&new Set(p.unlockedThemes).size===p.unlockedThemes.length&&p.unlockedThemes.every(id=>rewardIds.includes(id));}
 function merge(a,b){const records={...b.records,...a.records};const base=Math.max(0,a.wins-naturalWins(a.records),b.wins-naturalWins(b.records));const wins=base+naturalWins(records);if(!Number.isSafeInteger(wins))throw Error('invalid');const unlocked=new Set([...a.unlockedThemes,...b.unlockedThemes]);for(const id of rewardIds)if(wins>=(id==='starry-sky'?10:3))unlocked.add(id);return {wins,records,unlockedThemes:rewardIds.filter(id=>unlocked.has(id))};}
 const journal='garibaldka.backup-transaction.v1';
 const allowed=['garibaldka.preferences.v1','garibaldka.achievements.v1','garibaldka.results.v1','garibaldka.unlocks.v1'];
 function recover(storage){const raw=storage.getItem(journal);if(!raw)return;const values=JSON.parse(raw);if(!exact(values,allowed)||!Object.values(values).every(v=>v===null||typeof v==='string'))throw Error('invalid journal');for(const key of allowed){if(values[key]===null)storage.removeItem(key);else storage.setItem(key,values[key]);}storage.removeItem(journal);}
 function commit(storage,values){recover(storage);if(!exact(values,allowed))throw Error('invalid transaction');const before=Object.fromEntries(allowed.map(k=>[k,storage.getItem(k)]));storage.setItem(journal,JSON.stringify(before));try{for(const key of allowed)storage.setItem(key,values[key]);storage.removeItem(journal);}catch(error){try{recover(storage);}catch{}throw error;}}
 return {rewardIds,validProgress,merge,commit,recover,naturalWins};
});
