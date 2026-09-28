export const DRAFT_SCHEMA = 1;
export const SUBMISSION_SCHEMA = 1;
export const MAX_TEXT = 10000;
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const exactKeys = (value, keys) => object(value) && Object.keys(value).every(k => keys.includes(k)) && keys.every(k => Object.hasOwn(value, k));
export const fields = activity => activity.questions.flatMap(q => q.blocks.filter(b => ['field','sketch'].includes(b.type)).map(b => ({...b, question: q})));
export const fieldKind = field => field.type === 'sketch' ? 'confirmation' : field.kind;
export const purpose = field => field.type === 'sketch' ? 'sketch' : field.purpose === 'prediction' ? 'prediction' : 'response';
export const emptyValue = field => field.type === 'sketch' ? false : '';
export const answered = value => value === true || (typeof value === 'string' && value.trim() !== '');
export const partFields = (activity, part) => fields(activity).filter(f => f.question.part === part);
export function validateActivity(a) {
  if (!exactKeys(a,['content_format','activity_id','content_revision','title','authorship','introduction','parts','questions']) || a.content_format !== 'reviewed-student-content-v1' || !/^[a-z0-9-]+$/.test(a.activity_id) || !/^[A-Za-z0-9.-]+$/.test(a.content_revision)) throw Error('Invalid activity identity.');
  if (!Array.isArray(a.questions) || !a.questions.length || !Array.isArray(a.parts) || !a.parts.length || !Array.isArray(a.introduction) || !a.introduction.every(s=>typeof s==='string') || typeof a.title!=='string' || typeof a.authorship!=='string') throw Error('Invalid activity structure.');
  const ids = new Set(), numbers = new Set(), parts = new Set();
  for (const p of a.parts) {
    if (!exactKeys(p,['number','title','questions']) || !Number.isSafeInteger(p.number) || parts.has(p.number) || typeof p.title!=='string' || !Array.isArray(p.questions)) throw Error('Invalid part.');
    parts.add(p.number);
  }
  for (const q of a.questions) {
    if (!exactKeys(q,['id','number','title','part','blocks']) || !/^[a-z0-9-]+$/.test(q.id) || ids.has(q.id) || numbers.has(q.number) || !Number.isSafeInteger(q.number) || typeof q.title!=='string' || !Array.isArray(q.blocks) || !parts.has(q.part)) throw Error('Invalid question.');
    ids.add(q.id); numbers.add(q.number);
    for (const b of q.blocks) {
      const blockKeys={text:['type','text'],image:['type','src','alt'],sketch:['type','id','text'],'student-response-reference':['type','question_id','text'],field:['type','id','label','kind','purpose',...(b.kind==='choice'?['options']:[])]};
      if (!blockKeys[b.type] || !exactKeys(b,blockKeys[b.type])) throw Error('Unknown content block.');
      if (['text','sketch','student-response-reference'].includes(b.type) && typeof b.text !== 'string') throw Error('Missing block text.');
      if (b.type === 'image' && (!/^assets\/[a-zA-Z0-9._-]+\.png$/.test(b.src) || typeof b.alt !== 'string')) throw Error('Invalid image.');
      if (b.type === 'field' && (!['number','choice','paragraph'].includes(b.kind) || !['prediction','response'].includes(b.purpose) || typeof b.label !== 'string' || (b.kind==='choice' && (!Array.isArray(b.options) || !b.options.length || !b.options.every(v=>typeof v==='string'))))) throw Error('Invalid response field.');
    }
  }
  for (const p of a.parts) if (JSON.stringify(p.questions)!==JSON.stringify(a.questions.filter(q=>q.part===p.number).map(q=>q.number))) throw Error('Part question order does not match.');
  for (const f of fields(a)) {
    if (!/^[a-z0-9-]+$/.test(f.id) || ids.has(f.id)) throw Error('Duplicate or invalid response ID.');
    ids.add(f.id);
  }
  for (const q of a.questions) for (const b of q.blocks) if (b.type==='student-response-reference' && !a.questions.some(ref=>ref.id===b.question_id && ref.number<q.number)) throw Error('Invalid earlier response reference.');
  return a;
}
export async function fingerprint(text) {
  const bytes = new TextEncoder().encode(text);
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export const identity = (activity, hash) => ({id: activity.activity_id, revision: activity.content_revision, fingerprint: hash});
export const storageKey = id => `classroom-activities:draft:v1:${id.id}:${id.revision}:${id.fingerprint}`;
export function freshDraft(activity, hash) {
  return {kind:'classroom-activity-draft', draft_schema_version:DRAFT_SCHEMA, activity:identity(activity,hash), student:{name:'',bell:''}, answers:Object.fromEntries(fields(activity).map(f=>[f.id,emptyValue(f)])), navigation:{question_id:activity.questions[0].id}, updated_at:new Date().toISOString()};
}
export function validateDraft(data, activity, hash) {
  if (!exactKeys(data,['kind','draft_schema_version','activity','student','answers','navigation','updated_at']) || data.kind!=='classroom-activity-draft' || data.draft_schema_version!==DRAFT_SCHEMA) throw Error('Choose a version 1 Draft Backup. Answer submissions and older prototype backups cannot be restored here.');
  const id = identity(activity,hash);
  if (!exactKeys(data.activity,['id','revision','fingerprint']) || Object.keys(id).some(k=>id[k]!==data.activity[k])) throw Error('This backup belongs to a different activity or content revision. Open its matching activity version; your current work has not changed.');
  if (!exactKeys(data.student,['name','bell']) || typeof data.student.name!=='string' || typeof data.student.bell!=='string' || data.student.name.length>120 || data.student.bell.length>40) throw Error('Invalid student fields.');
  const all = fields(activity);
  if (!exactKeys(data.answers,all.map(f=>f.id))) throw Error('The backup has missing or unknown response IDs. Nothing has been imported.');
  for (const f of all) {
    const v = data.answers[f.id];
    if (f.type==='sketch' ? typeof v!=='boolean' : typeof v!=='string' || v.length>MAX_TEXT || (f.kind==='choice' && v!=='' && !f.options.includes(v))) throw Error(`Invalid response for ${f.id}. Nothing has been imported.`);
  }
  if (!exactKeys(data.navigation,['question_id']) || !activity.questions.some(q=>q.id===data.navigation.question_id) || typeof data.updated_at!=='string' || !Number.isFinite(Date.parse(data.updated_at))) throw Error('Invalid draft navigation or date.');
  return structuredClone(data);
}
export function createSubmission(activity, hash, draft, part, build, date=new Date().toISOString(), id=crypto.randomUUID()) {
  validateDraft(draft,activity,hash);
  const selected = activity.parts.find(p=>p.number===part);
  if (!selected) throw Error('Unknown activity part.');
  if (!draft.student.name.trim() || !draft.student.bell.trim()) throw Error('Enter your Name and Bell before preparing a submission.');
  const responses = partFields(activity,part).map(f=>({question_id:f.question.id, question_number:f.question.number, question_title:f.question.title, response_id:f.id, label:f.label||f.text, kind:fieldKind(f), purpose:purpose(f), value:draft.answers[f.id]}));
  const missing = responses.filter(r=>!answered(r.value)).map(r=>r.response_id);
  return {kind:'classroom-activity-submission', submission_schema_version:SUBMISSION_SCHEMA, submission_id:id, exported_at:date, activity:{...identity(activity,hash),title:activity.title}, part:{number:part,title:selected.title}, student:structuredClone(draft.student), build:structuredClone(build), completion:{status:missing.length?'incomplete':'complete', answered:responses.length-missing.length,total:responses.length,missing_response_ids:missing}, responses};
}
export function readableSubmission(s) {
  const lines = [s.activity.title, `Part ${s.part.number}: ${s.part.title}`, `Name: ${s.student.name}`, `Bell: ${s.student.bell}`, `Activity ID: ${s.activity.id}`, `Content Revision: ${s.activity.revision}`, `Content Fingerprint: ${s.activity.fingerprint}`, `Submission Schema: ${s.submission_schema_version}`, `Submission ID: ${s.submission_id}`, `Exported At: ${s.exported_at}`, `Build: ${s.build.identifier}`, `Status: ${s.completion.status} (${s.completion.answered}/${s.completion.total})`, `Missing Response IDs: ${s.completion.missing_response_ids.join(', ') || 'None'}`, '', 'This file is a copy of the same part submission as the JSON. It has not been turned in to Google Classroom.', ''];
  let question;
  for (const r of s.responses) {
    if (r.question_id!==question) { lines.push(`Question ${r.question_number}: ${r.question_title} [${r.question_id}]`); question=r.question_id; }
    lines.push(`[${r.response_id} | ${r.purpose} | ${r.kind}] ${r.label}`, typeof r.value==='boolean' ? (r.value?'Paper sketch confirmed':'[Not confirmed]') : (answered(r.value)?r.value:'[No answer]'), '');
  }
  return lines.join('\n');
}
export function exportStem(s) {
  const name = s.student.name.normalize('NFKD').replace(/[^a-zA-Z0-9-]+/g,'-').replace(/^-|-$/g,'').slice(0,50) || 'student';
  return `${s.activity.id}_${s.activity.revision}_part-${s.part.number}_${name}_${s.submission_id}`;
}
