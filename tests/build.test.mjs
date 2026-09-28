import test from 'node:test';
import assert from 'node:assert/strict';
import {reserve} from '../scripts/reserve-build.mjs';
test('durable PR allocator preserves failed reservations and concurrent callers receive different ordinals',async()=>{
 const records=new Map([['reservations/pr-6/000001.json','prior failed attempt']]);
 const request=async(url,opts)=>{const path=new URL(url).pathname;const respond=(status,data={})=>({ok:status<300,status,json:async()=>data});
 if(path.endsWith('/pulls/6'))return respond(200,{state:'open',head:{sha:'a'.repeat(40),repo:{full_name:'owner/repo'}}});
 if(path.endsWith('/git/ref/heads/build-ledger'))return respond(200);
 const file=path.split('/contents/')[1];
 if(opts.method==='PUT'){if(records.has(file))return respond(422);records.set(file,JSON.parse(opts.body));return respond(201);}
 return respond(records.has(file)?200:404);
 };
 const config={repository:'owner/repo',token:'fictional-token',scope:'pr-6',source:'a'.repeat(40),request};
 const [a,b]=await Promise.all([reserve(config),reserve(config)]);assert.deepEqual([a.ordinal,b.ordinal].sort(),[2,3]);assert.equal((await reserve(config)).ordinal,4);
});

test('student build uses only the explicit app/content/assets/notices allowlist',async()=>{
 const {publicFiles}=await import('../scripts/public-inputs.mjs');const files=publicFiles();assert.ok(files.includes('content/levers/student-content.json'));assert.equal(files.filter(f=>f.endsWith('.png')).length,14);assert.ok(files.includes('content/levers/THIRD_PARTY_NOTICES.md'));assert.ok(!files.some(f=>/test-results|README|PROVENANCE|docs\//.test(f)));
});
