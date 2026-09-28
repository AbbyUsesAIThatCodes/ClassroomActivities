import {validateActivity,fingerprint,fields,partFields,freshDraft,validateDraft,storageKey,answered,createSubmission,readableSubmission,exportStem,MAX_TEXT,MAX_FILE_BYTES} from './model.js';
import {DraftStore} from './storage.js';
import {styledText} from './format.js';
const $=id=>document.getElementById(id);
const main=$('main');
function el(tag,text,attrs={}) {const node=document.createElement(tag);if(text!==null)node.textContent=text;for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);return node;}
function rich(tag,text,attrs={}) {const node=el(tag,null,attrs);node.append(styledText(text));return node;}
function button(text,handler,attrs={}) {const node=el('button',text,{type:'button',...attrs});node.addEventListener('click',handler);return node;}
function download(text,name,type='application/json') {const url=URL.createObjectURL(new Blob([text],{type:`${type};charset=utf-8`}));const a=el('a',null,{href:url,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function modal(title) {
  const dialog=el('dialog');dialog.append(el('h2',title));
  const content=el('div'),actions=el('div',null,{class:'actions'});
  dialog.append(content,actions);actions.append(button('Close',()=>dialog.close()));
  dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);
  return {dialog,content,actions,show:()=>dialog.showModal()};
}
async function readJson(path) {const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(`Unable to load ${path}.`);return r.json();}
let build={identifier:'Development Source · Unbuilt',version:'0.1.0',codename:'First Light',scope:'development',source_revision:null};
try {const response=await fetch('build-manifest.json',{cache:'no-store'});if(response.ok)build=await response.json();}catch{/* Source preview is explicitly unbuilt. */}
$('build-id').textContent=build.identifier;
try {
  const registry=await readJson('content/activities.json');
  const selectedId=new URL(location.href).searchParams.get('activity');
  const items=await Promise.all(registry.map(async entry=>{
    const response=await fetch(entry.path,{cache:'no-store'});if(!response.ok)throw Error('The activity could not be loaded. Check your connection and reload.');
    const text=await response.text();return {...entry,activity:validateActivity(JSON.parse(text)),hash:await fingerprint(text)};
  }));
  if(items.some(item=>item.id!==item.activity.activity_id))throw Error('The activity catalog does not match its content.');
  main.replaceChildren();
  if(!selectedId) {
    main.append(el('p','Your Classroom Workspace',{class:'eyebrow'}),el('h1','Think It Through. Keep Your Work.'),el('p','Choose an activity, keep your predictions and observations together, and download your answers when you are ready.',{class:'intro'}));
    const cards=el('div',null,{class:'cards'});
    for(const item of items) {const card=el('section',null,{class:'card'});card.append(el('p',`${item.activity.parts.length} Parts · ${item.activity.questions.length} Questions`,{class:'eyebrow'}),el('h2',item.activity.title),el('p',item.description),el('a','Open Activity →',{href:`?activity=${item.id}`}));cards.append(card);}main.append(cards);
    main.append(el('p','Development preview for teacher review. The school-device and Google Classroom trial comes next.',{class:'notice'}));
  } else {
    const selected=items.find(item=>item.id===selectedId);if(!selected)throw Error('This activity was not found. Return to All Activities and choose one from the list.');
    start(selected);
  }
} catch(error) {main.replaceChildren(el('section',null,{class:'panel error-page'}));main.firstChild.append(el('h1','Activity Could Not Open'),el('p',error.message),el('a','All Activities',{href:'./'}));}
function start(item) {
  const a=item.activity,hash=item.hash;
  const store=new DraftStore(storageKey({id:a.activity_id,revision:a.content_revision,fingerprint:hash}));
  let draft=freshDraft(a,hash),showMissing=false;
  const saved=store.read();let initialWarning='';
  if(saved.ok && saved.raw!==null) {try {draft=validateDraft(JSON.parse(saved.raw),a,hash);}catch {store.quarantine();initialWarning='The saved draft could not be read safely. It has been left untouched. Download the Saved Browser Data for recovery; browser saving is paused.';}}
  if(!saved.ok)initialWarning=saved.message;
  const query=new URL(location.href).searchParams;
  const requested=a.questions.find(q=>q.id===query.get('question'))||a.questions.find(q=>q.part===Number(query.get('part')));
  if(requested)draft.navigation.question_id=requested.id;
  let current=a.questions.findIndex(q=>q.id===draft.navigation.question_id);
  document.title=`${a.title} · Classroom Activities`;
  main.append(el('a','← All Activities',{href:'./'}),el('p',`Content ${a.content_revision} · ${a.questions.length} Questions`,{class:'eyebrow'}),el('h1',a.title));
  const workspace=el('div',null,{class:'workspace'}),sidebar=el('aside',null,{class:'panel sidebar','aria-label':'Activity Navigation'}),right=el('div');workspace.append(sidebar,right);main.append(workspace);
  const identity=el('div',null,{class:'identity'});
  for(const [key,label,max] of [['name','Name',120],['bell','Bell',40]]) {const group=el('div');group.append(el('label',label,{for:`student-${key}`}));const input=el('input',null,{id:`student-${key}`,maxlength:String(max),autocomplete:'off'});input.value=draft.student[key];input.addEventListener('input',()=>{draft.student[key]=input.value;save();});group.append(input);identity.append(group);}sidebar.append(identity);
  sidebar.append(el('p','Shared computer? Check the name above. Back up your work before starting a new draft.',{class:'small'}));
  sidebar.append(el('label','Activity Part',{for:'part-picker'}));
  const partPicker=el('select',null,{id:'part-picker'});
  for(const p of a.parts)partPicker.append(el('option',`Part ${p.number}: ${p.title}`,{value:String(p.number)}));
  partPicker.addEventListener('change',()=>navigate(a.questions.findIndex(q=>q.part===Number(partPicker.value))));sidebar.append(partPicker);
  const nav=el('nav',null,{'aria-label':'Questions'});sidebar.append(nav);
  const progress=el('p',null,{class:'small',id:'part-progress'});sidebar.append(progress);
  const status=el('p',null,{class:'status',role:'status','aria-live':'polite',id:'save-status'});right.append(status);
  const instructions=el('details');instructions.append(el('summary','Activity Directions'));
  a.introduction.forEach(p=>instructions.append(rich('p',p)));right.append(instructions);
  const toolbar=el('div',null,{class:'toolbar'});right.append(toolbar);
  toolbar.append(button('Download Draft Backup',backup,{id:'backup'}),button('Restore Draft Backup',()=>fileInput.click(),{id:'restore'}),button('Start New Draft',newDraft,{class:'quiet',id:'new-draft'}));
  const fileInput=el('input',null,{type:'file',accept:'.json,application/json',class:'file-input',id:'restore-file','aria-label':'Choose A Draft Backup'});fileInput.addEventListener('change',restore);right.append(fileInput);
  if(saved.raw!==null && initialWarning)toolbar.append(button('Download Saved Browser Data',()=>download(saved.raw,'unreadable-browser-draft.txt','text/plain')));
  const article=el('article',null,{class:'panel question','aria-labelledby':'question-title'});right.append(article);
  const controls=el('div',null,{class:'navigation'}),previous=button('← Previous',()=>navigate(current-1),{id:'previous'}),position=el('span',null,{id:'question-position'}),next=button('Next →',()=>navigate(current+1),{id:'next'});controls.append(previous,position,next);right.append(controls);
  const submission=button('Prepare Part Submission',prepareSubmission,{class:'primary',id:'prepare-submission'});const submissionBar=el('div',null,{class:'toolbar'});submissionBar.append(submission);right.append(submissionBar);
  const help=el('details');help.append(el('summary','Download And Turn In Your Answers'));
  const steps=el('ol');for(const step of ['Finish the assigned part, check your Name and Bell, then choose Prepare Part Submission.','Download the answer JSON. Download the readable text copy from the same window if your teacher requests it, or keep it for yourself.','Open the correct assignment in Google Classroom. Choose Add or Create, then File. Select your downloaded answer JSON and any readable copy your teacher requested.','Wait for the attachment to finish, then choose Turn In in Classroom. Check that Classroom shows it as turned in. If your school blocks a file type, show your teacher the message and keep both downloads.'])steps.append(el('li',step));help.append(steps,el('p','A Draft Backup restores your unfinished work and includes both parts. It is not an answer submission. Downloading any file here does not turn it in to your teacher.',{class:'notice'}));right.append(help,el('p',a.authorship,{class:'small'}));
  window.addEventListener('storage',event=>{if(event.key===store.key || event.key===null){store.quarantine();setStatus('Another tab changed or cleared the saved draft. Your current answers remain here. Download a Draft Backup before reloading; saving is paused.',true);}});
  window.addEventListener('beforeunload',event=>{if(status.classList.contains('warning')){event.preventDefault();event.returnValue='';}});
  render();setStatus(initialWarning || (saved.raw?'Draft Restored · Check Your Name And Bell':'Ready · Answers Save In This Browser'),Boolean(initialWarning));
  function setStatus(text,warning=false){status.textContent=text;status.className=`status${warning?' warning':''}`;}
  function save(){draft.updated_at=new Date().toISOString();const result=store.save(draft);setStatus(result.ok?'Saved In This Browser · Download A Backup Before Leaving':result.message,!result.ok);updateProgress();}
  function backup(){draft.updated_at=new Date().toISOString();download(JSON.stringify(draft,null,2),`${a.activity_id}_${a.content_revision}_DRAFT_${new Date().toISOString().replace(/[:.]/g,'-')}.json`);}
  function updateProgress(){const p=a.questions[current].part,all=partFields(a,p);progress.textContent=`Part ${p}: ${all.filter(f=>answered(draft.answers[f.id])).length} of ${all.length} responses recorded.`;for(const node of nav.children){const q=a.questions.find(q=>q.id===node.dataset.question);const qFields=fields(a).filter(f=>f.question.id===q.id);node.querySelector('.count').textContent=`${qFields.filter(f=>answered(draft.answers[f.id])).length}/${qFields.length}`;}}
  function navigate(index){if(index<0||index>=a.questions.length)return;current=index;draft.navigation.question_id=a.questions[current].id;save();render();$('question-title').focus();}
  function render(){
    const q=a.questions[current],p=a.parts.find(p=>p.number===q.part);partPicker.value=String(q.part);
    const url=new URL(location.href);url.searchParams.set('activity',a.activity_id);url.searchParams.set('part',String(q.part));url.searchParams.set('question',q.id);history.replaceState(null,'',url);
    nav.replaceChildren();for(const question of a.questions.filter(question=>question.part===q.part)){const b=button(`${question.number}. ${question.title}`,()=>navigate(a.questions.indexOf(question)),{class:'question-link','aria-current':question.id===q.id?'step':'false'});b.dataset.question=question.id;b.append(el('span','',{class:'count','aria-hidden':'true'}));nav.append(b);}
    article.replaceChildren();const heading=el('div',null,{class:'question-heading'});heading.append(el('p',`Part ${p.number} · ${p.title}`,{class:'eyebrow'}),el('h2',`Question ${q.number}: ${q.title}`,{id:'question-title',tabindex:'-1'}));article.append(heading);
    for(const block of q.blocks){
      if(block.type==='text')article.append(rich('p',block.text));
      else if(block.type==='image')article.append(el('img',null,{class:'figure',src:new URL(block.src,new URL(item.path,location.href)).href,alt:block.alt}));
      else if(block.type==='student-response-reference'){
        const ref=el('section',null,{class:'reference','aria-label':'Your Earlier Responses'});ref.append(el('h3',`Your Question ${a.questions.find(ref=>ref.id===block.question_id).number} Responses`),el('p','These are your own recorded answers. No answer key is shown.'));const dl=el('dl');for(const f of fields(a).filter(f=>f.question.id===block.question_id)){dl.append(rich('dt',f.label||f.text),el('dd',answered(draft.answers[f.id])?String(draft.answers[f.id]):'Not recorded yet',{class:answered(draft.answers[f.id])?'':'empty'}));}ref.append(dl);article.append(ref);
      } else renderField(block);
    }
    previous.disabled=current===0;next.disabled=current===a.questions.length-1;position.textContent=`Question ${q.number} Of ${a.questions.length}`;submission.textContent=`Prepare Part ${q.part} Submission`;updateProgress();
  }
  function renderField(block){
    const sketch=block.type==='sketch',prediction=block.purpose==='prediction';
    const container=el('div',null,{class:`field${prediction?' prediction':''}${showMissing&&!answered(draft.answers[block.id])?' missing':''}`});
    container.append(el('span',sketch?'Paper Sketch':prediction?'Prediction · Keep Your First Thinking':'Your Response',{class:'field-tag'}));
    const label=rich('label',block.label||block.text,{for:block.id});container.append(label);let input;
    if(sketch){input=el('input',null,{type:'checkbox',id:block.id});input.checked=draft.answers[block.id];const checkLabel=el('label','I completed the paper sketch.',{for:block.id});checkLabel.prepend(input);container.append(checkLabel);}
    else if(block.kind==='choice'){input=el('select',null,{id:block.id});input.append(el('option','Choose a response…',{value:''}));block.options.forEach(o=>input.append(el('option',o,{value:o})));container.append(input);}
    else {input=el(block.kind==='paragraph'?'textarea':'input',null,{id:block.id,maxlength:String(MAX_TEXT)});if(block.kind==='number'){input.type='text';input.inputMode='decimal';input.setAttribute('aria-describedby',`${block.id}-hint`);}container.append(input);if(block.kind==='number')container.append(el('span','Enter your measurement; include a unit if helpful.',{class:'small',id:`${block.id}-hint`}));}
    if(!sketch)input.value=draft.answers[block.id];
    input.addEventListener('input',()=>{draft.answers[block.id]=sketch?input.checked:input.value;container.classList.toggle('missing',showMissing&&!answered(draft.answers[block.id]));save();});article.append(container);
  }
  async function restore(){
    const file=fileInput.files[0];fileInput.value='';if(!file)return;
    try {
      if(file.size>MAX_FILE_BYTES)throw Error('This file is too large for a Draft Backup. Choose the JSON backup downloaded by this activity.');
      const incoming=validateDraft(JSON.parse(await file.text()),a,hash);
      const m=modal('Restore Draft Backup');m.content.append(el('p',`This backup belongs to ${incoming.student.name||'an unnamed student'}, Bell ${incoming.student.bell||'not entered'}. It has ${Object.values(incoming.answers).filter(answered).length} recorded responses across both parts.`),el('p','Restoring replaces the work currently open in this tab. Download a backup of your current work first if you want to keep it.'));
      m.actions.append(button('Back Up Current Work',backup),button('Restore These Answers',()=>{draft=incoming;current=a.questions.findIndex(q=>q.id===draft.navigation.question_id);$('student-name').value=draft.student.name;$('student-bell').value=draft.student.bell;showMissing=false;save();render();m.dialog.close();},{class:'primary',id:'confirm-restore'}));m.show();
    } catch(error){const m=modal('Backup Could Not Be Restored');m.content.append(el('p',error instanceof SyntaxError?'The file is not valid JSON. Your current answers have not changed.':error.message));m.show();}
  }
  function newDraft(){const m=modal('Start A New Draft');m.content.append(el('p','This clears the saved draft for this activity version on this browser, including Name, Bell, and both parts. Download a Draft Backup first to keep it. Other activities and revisions stay separate.'));m.actions.append(button('Back Up Current Work',backup),button('Clear And Start New',()=>{const result=store.reset();if(!result.ok){m.content.append(el('p',result.message));return;}draft=freshDraft(a,hash);current=0;showMissing=false;$('student-name').value='';$('student-bell').value='';save();render();m.dialog.close();},{id:'confirm-new'}));m.show();}
  function prepareSubmission(){
    try {
      const s=createSubmission(a,hash,draft,a.questions[current].part,build);
      const m=modal(`Part ${s.part.number} Submission`);m.content.append(el('p',`${s.student.name} · Bell ${s.student.bell}`),el('p',`${s.completion.answered} of ${s.completion.total} responses recorded. ${s.completion.status==='complete'?'Ready to download.':'This submission is incomplete. You can return to finish it or download an explicitly marked incomplete submission.'}`,{class:s.completion.status==='complete'?'status':'status warning'}));
      if(s.completion.missing_response_ids.length){m.content.append(el('p',`Missing: ${s.completion.missing_response_ids.join(', ')}`,{class:'small'}));m.actions.append(button('Return To Missing Answers',()=>{showMissing=true;const f=fields(a).find(f=>f.id===s.completion.missing_response_ids[0]);navigate(a.questions.indexOf(f.question));m.dialog.close();document.getElementById(f.id).focus();}));}
      m.content.append(el('p','Both downloads below contain this same snapshot of this part. Close this window and prepare again after editing answers.'),el('p','Download the JSON, then attach it to the correct Google Classroom assignment and choose Turn In. These buttons do not submit it for you.',{class:'notice'}));
      m.actions.append(button('Download Answers (.json)',()=>download(JSON.stringify(s,null,2),`${exportStem(s)}_ANSWERS.json`),{class:'primary',id:'download-answers'}),button('Download Readable Copy (.txt)',()=>download(readableSubmission(s),`${exportStem(s)}_READABLE.txt`,'text/plain'),{id:'download-readable'}));m.show();
    }catch(error){const m=modal('Name And Bell Needed');m.content.append(el('p',error.message));m.show();}
  }
}
