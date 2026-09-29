import fs from 'node:fs';
import {publicFiles} from './public-inputs.mjs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const root=process.cwd();
const release=JSON.parse(fs.readFileSync('release.json','utf8'));
if(JSON.parse(fs.readFileSync('package.json','utf8')).version!==release.version)throw Error('Package and release versions disagree.');
if(!/^\d+\.\d+\.\d+$/.test(release.version)||!/^[A-Za-z0-9-]+$/.test(release.codename_slug))throw Error('Invalid release identity.');
execFileSync('python3',['scripts/verify_lever_content.py'],{stdio:'inherit'});
const publication=publicFiles();
const source=git('rev-parse','HEAD');
const dirty=Boolean(git('status','--porcelain','--untracked-files=normal'));
const inputs=['index.html','src','content','release.json','package.json','scripts/build.mjs','scripts/reserve-build.mjs','scripts/verify_lever_content.py','scripts/public-inputs.mjs','.github/workflows/pages.yml'];
const inputFiles=[];
function walk(file){const stat=fs.lstatSync(file);if(stat.isSymbolicLink())throw Error('Build inputs cannot be symlinks.');if(stat.isDirectory())for(const name of fs.readdirSync(file).sort())walk(path.join(file,name));else inputFiles.push(file);}
inputs.forEach(walk);
const hash=createHash('sha256');for(const file of inputFiles.sort()){hash.update(file+'\0');hash.update(fs.readFileSync(file));hash.update('\0');}
const fingerprint=hash.digest('hex');
let reservation;
const arg=process.argv.indexOf('--reservation');
if(arg!==-1){
  if(dirty)throw Error('A reserved build requires a clean source checkout. Use an explicit local build for dirty work.');
  const record=process.argv[arg+1];if(!/^reservations\/(pr-[1-9]\d*|main)\/\d{6}\.json$/.test(record))throw Error('Invalid reservation path.');
  git('fetch','origin','build-ledger');
  reservation=JSON.parse(git('show',`FETCH_HEAD:${record}`));
  if(reservation.source_revision!==source || record!==`reservations/${reservation.scope}/${String(reservation.ordinal).padStart(6,'0')}.json`)throw Error('Reservation does not match the source or ordinal.');
}else{
  fs.mkdirSync('.local-builds',{recursive:true});
  if(!fs.existsSync('.local-builds/session.json')){try{fs.writeFileSync('.local-builds/session.json',JSON.stringify({scope:`local-${randomUUID().slice(0,8)}`}),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}}
  const scope=process.env.LOCAL_BUILD_SCOPE||JSON.parse(fs.readFileSync('.local-builds/session.json','utf8')).scope;if(!/^local-[a-zA-Z0-9-]+$/.test(scope))throw Error('Use an explicit local scope.');
  fs.mkdirSync(`.local-builds/${scope}`,{recursive:true});
  for(let ordinal=1;ordinal<100000;ordinal++)try{const record={scope,ordinal,source_revision:source,reserved_at:new Date().toISOString()};fs.writeFileSync(`.local-builds/${scope}/${ordinal}.json`,JSON.stringify(record),{flag:'wx'});reservation=record;break;}catch(e){if(e.code!=='EEXIST')throw e;}
}
if(!reservation)throw Error('No build reservation allocated.');
// A reservation is consumed on first use, including failures. Shared claims are durable in the ledger.
if(arg!==-1){
  const token=process.env.GITHUB_TOKEN;
  if(!token)throw Error('GITHUB_TOKEN is required to claim a shared reservation exactly once. Without it, omit --reservation to create an explicitly local build.');
}
const builtAt=new Date().toISOString();
const stamp=builtAt.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const identifier=`${release.version}_${release.codename_slug}_${reservation.scope}_build-${String(reservation.ordinal).padStart(3,'0')}_${stamp}_g${source.slice(0,12)}${dirty?`-dirty-${fingerprint.slice(0,12)}`:''}_web`;
const manifest={version:release.version,codename:release.codename,codename_slug:release.codename_slug,status:release.status,scope:reservation.scope,pr:reservation.scope.startsWith('pr-')?Number(reservation.scope.slice(3)):null,ordinal:reservation.ordinal,built_at_utc:builtAt,source_revision:source,source_dirty:dirty,source_fingerprint:fingerprint,target:'web',identifier};
if(arg!==-1){
  const repository=process.env.GITHUB_REPOSITORY;if(!/^[\w.-]+\/[\w.-]+$/.test(repository||''))throw Error('GITHUB_REPOSITORY is required.');
  const result=await fetch(`https://api.github.com/repos/${repository}/contents/claims/${reservation.scope}/${String(reservation.ordinal).padStart(6,'0')}.json`,{method:'PUT',headers:{Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({branch:'build-ledger',message:`Claim ${identifier}`,content:Buffer.from(JSON.stringify(manifest,null,2)+'\n').toString('base64')})});
  if(!result.ok)throw Error(`Reservation already claimed or unavailable (${result.status}). Allocate a new ordinal.`);
}
console.log(`BUILD START ${identifier}`);
const out=path.join(root,'dist',identifier);
fs.mkdirSync(out,{recursive:true});
try{
  for(const file of publication){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);}
  fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  const report=`# Build Record\n\n\`${identifier}\`\n\n- Version: ${manifest.version} (${manifest.status})\n- Codename: ${manifest.codename}\n- Scope: ${manifest.scope}; ordinal: ${manifest.ordinal}\n- Build UTC: ${manifest.built_at_utc}\n- Source: ${source}${dirty?' (dirty)':''}\n- Input SHA-256: ${fingerprint}\n- Target: web\n- Artifact directory: dist/${identifier}\n- Verification is recorded separately; creating a build does not certify a classroom release.\n`;
  fs.writeFileSync(path.join(out,'BUILD.md'),report);
  const reportRoot=process.env.BUILD_REPORT_DIR||'.local-builds/reports';fs.mkdirSync(reportRoot,{recursive:true});
  fs.writeFileSync(path.join(reportRoot,`${identifier}.json`),JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(path.join(reportRoot,`${identifier}.md`),report);
  if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,`identifier=${identifier}\ndirectory=dist/${identifier}\n`);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
  console.log(`BUILD SUCCESS ${identifier}\nOUTPUT ${out}`);
}catch(error){console.error(`BUILD FAILED ${identifier}`);throw error;}
