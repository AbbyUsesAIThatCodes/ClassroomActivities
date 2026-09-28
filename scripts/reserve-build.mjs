import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
export const ledgerBranch='build-ledger';
export async function reserve({repository,token,scope,source,request=fetch}) {
  if(!/^pr-[1-9]\d*$/.test(scope))throw Error('PR reservations require an existing PR scope such as pr-6.');
  if(!/^[\w.-]+\/[\w.-]+$/.test(repository)||!/^[a-f0-9]{40}$/.test(source)||!token)throw Error('Repository, token, and full source SHA are required.');
  const base=`https://api.github.com/repos/${repository}`;
  const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
  const call=(path,options={})=>request(`${base}${path}`,{...options,headers});
  const pr=await call(`/pulls/${scope.slice(3)}`);
  if(!pr.ok)throw Error('Cannot verify the existing pull request.');
  const pull=await pr.json();
  if(pull.state!=='open'||pull.head.sha!==source||pull.head.repo.full_name!==repository)throw Error('Reserve against the open same-repository PR head.');
  const branch=await call(`/git/ref/heads/${ledgerBranch}`);
  if(branch.status===404){const created=await call('/git/refs',{method:'POST',body:JSON.stringify({ref:`refs/heads/${ledgerBranch}`,sha:source})});if(!created.ok&&created.status!==422)throw Error('Unable to initialize the durable build ledger.');}
  else if(!branch.ok)throw Error('Unable to read the durable build ledger.');
  for(let ordinal=1;ordinal<100000;ordinal++){
    const path=`reservations/${scope}/${String(ordinal).padStart(6,'0')}.json`;
    const found=await call(`/contents/${path}?ref=${ledgerBranch}`);
    if(found.ok)continue;
    if(found.status!==404)throw Error('Unable to inspect build reservation.');
    const reservation={scope,ordinal,source_revision:source,reserved_at:new Date().toISOString()};
    const result=await call(`/contents/${path}`,{method:'PUT',body:JSON.stringify({branch:ledgerBranch,message:`Reserve ${scope} Build ${ordinal}`,content:Buffer.from(JSON.stringify(reservation,null,2)+'\n').toString('base64')})});
    if(result.ok)return {...reservation,path};
    if([409,422].includes(result.status))continue; // Another allocator won this path. Never update it.
    throw Error(`Build reservation failed (${result.status}).`);
  }
  throw Error('Build reservation range exhausted.');
}
if(import.meta.url===pathToFileURL(process.argv[1]||'').href){
  const result=await reserve({repository:process.env.GITHUB_REPOSITORY,token:process.env.GITHUB_TOKEN,scope:process.argv[2],source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()});
  console.log(JSON.stringify(result,null,2));
  console.log(`Build With: npm run build -- --reservation ${result.path}`);
}
