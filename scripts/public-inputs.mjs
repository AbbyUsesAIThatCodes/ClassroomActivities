import fs from 'node:fs';
import path from 'node:path';
import {validateActivity} from '../src/model.js';
// Explicit publication inputs; incidental files cannot enter the student distribution.
export function publicFiles(){
 const registry=JSON.parse(fs.readFileSync('content/activities.json','utf8'));
 if(!Array.isArray(registry)||!registry.length)throw Error('Invalid activity catalog.');
 const files=new Set(['index.html','content/activities.json']);
 for(const name of ['app.js','model.js','storage.js','format.js','styles.css'])files.add(`src/${name}`);
 const ids=new Set();
 for(const entry of registry){
  if(Object.keys(entry).sort().join(',')!=='description,id,path'||typeof entry.description!=='string'||!/^content\/[a-z0-9-]+\/student-content\.json$/.test(entry.path)||ids.has(entry.id))throw Error('Invalid or duplicate catalog entry.');
  ids.add(entry.id);const activity=validateActivity(JSON.parse(fs.readFileSync(entry.path,'utf8')));if(activity.activity_id!==entry.id)throw Error('Catalog identity mismatch.');
  files.add(entry.path);const dir=path.dirname(entry.path);
  for(const q of activity.questions)for(const b of q.blocks)if(b.type==='image'){const asset=path.join(dir,b.src);if(!fs.statSync(asset).isFile())throw Error('Missing image.');files.add(asset);}
  const notices=path.join(dir,'THIRD_PARTY_NOTICES.md');if(fs.existsSync(notices))files.add(notices);
 }
 return [...files].sort();
}
