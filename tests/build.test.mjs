import test from 'node:test';
import assert from 'node:assert/strict';
import {reserve} from '../scripts/reserve-build.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
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

test('main allocation is durable, concurrent, and rejects a stale checkout before writing',async()=>{
 const records=new Map([['reservations/main/000001.json','failed attempt']]);let writes=0;
 const request=async(url,opts)=>{
  const p=new URL(url).pathname;const reply=(status,data={})=>({ok:status<300,status,json:async()=>data});
  if(p.endsWith('/git/ref/heads/main'))return reply(200,{object:{sha:'b'.repeat(40)}});
  if(p.endsWith('/git/ref/heads/build-ledger'))return reply(200);
  const file=p.split('/contents/')[1];
  if(opts.method==='PUT'){writes++;if(records.has(file))return reply(422);records.set(file,JSON.parse(opts.body));return reply(201);}
  return reply(records.has(file)?200:404);
 };
 const config={repository:'owner/repo',token:'fictional-token',scope:'main',source:'b'.repeat(40),request};
 await assert.rejects(reserve({...config,source:'a'.repeat(40)}),/current main/);assert.equal(writes,0);
 const results=await Promise.all([reserve(config),reserve(config)]);
 assert.deepEqual(results.map(r=>r.ordinal).sort(),[2,3]);
 assert.equal((await reserve(config)).ordinal,4);
 assert.ok(records.has('reservations/main/000001.json'));
});

test('two clean builds keep immutable identities and expose only the exact artifact to Actions',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'classroom-build-'));
 const run=(cmd,args,env={})=>execFileSync(cmd,args,{cwd:root,encoding:'utf8',env:{...process.env,...env}}).trim();
 try{
  for(const file of ['index.html','src','content','release.json','package.json','scripts','.github','.gitignore'])fs.cpSync(file,path.join(root,file),{recursive:true});
  run('git',['init','-q']);run('git',['add','.']);run('git',['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','Fictional build fixture']);
  const source=run('git',['rev-parse','HEAD']);
  const evidence=path.join(root,'.local-builds');fs.mkdirSync(evidence,{recursive:true});
  const output=path.join(evidence,'outputs'),summary=path.join(evidence,'summary');
  const env={GITHUB_OUTPUT:output,GITHUB_STEP_SUMMARY:summary,LOCAL_BUILD_SCOPE:'local-fixture',BUILD_REPORT_DIR:path.join(evidence,'reports')};
  const firstLog=run('node',['scripts/build.mjs'],env);
  const firstOutputs=Object.fromEntries(fs.readFileSync(output,'utf8').trim().split('\n').map(line=>line.split('=')));
  const firstDirectory=path.join(root,firstOutputs.directory);
  const original=fs.readFileSync(path.join(firstDirectory,'build-manifest.json'),'utf8');
  const first=JSON.parse(original);
  assert.equal(first.source_dirty,false);assert.equal(first.source_revision,source);assert.equal(first.ordinal,1);
  assert.equal(firstOutputs.identifier,first.identifier);assert.equal(path.basename(firstDirectory),first.identifier);
  assert.ok(firstLog.includes(`BUILD START ${first.identifier}`));assert.ok(firstLog.includes(`BUILD SUCCESS ${first.identifier}`));
  assert.ok(fs.readFileSync(summary,'utf8').includes(first.identifier));
  assert.ok(fs.readFileSync(path.join(firstDirectory,'BUILD.md'),'utf8').includes(first.identifier));
  const {publicFiles}=await import('../scripts/public-inputs.mjs');
  const actual=fs.readdirSync(firstDirectory,{recursive:true}).filter(f=>fs.statSync(path.join(firstDirectory,f)).isFile()).sort();
  assert.deepEqual(actual,[...publicFiles(),'BUILD.md','build-manifest.json','.nojekyll'].sort());
  run('node',['scripts/build.mjs'],env);
  const manifests=fs.readdirSync(path.join(root,'dist')).map(dir=>JSON.parse(fs.readFileSync(path.join(root,'dist',dir,'build-manifest.json'),'utf8'))).sort((a,b)=>a.ordinal-b.ordinal);
  assert.equal(manifests[1].ordinal,2);assert.notEqual(manifests[1].identifier,first.identifier);
  assert.equal(manifests[1].source_fingerprint,first.source_fingerprint);
  assert.equal(fs.readFileSync(path.join(firstDirectory,'build-manifest.json'),'utf8'),original);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
