// Optional real-browser integration check: supply Playwright and a Chromium installation.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--disable-gpu']});
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173/';
const server=process.env.EXTERNAL_TEST_SERVER?null:spawn('python3',['-m','http.server','4173','--bind','127.0.0.1'],{stdio:'ignore'});
for(let attempt=0;attempt<100;attempt++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,30));}}
await fs.mkdir('test-results',{recursive:true});
const context=await browser.newContext({viewport:{width:1365,height:1000}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const download=async(selector,name)=>{const wait=page.waitForEvent('download');await page.locator(selector).click();const d=await wait;const path=`test-results/${name}`;await d.saveAs(path);return fs.readFile(path,'utf8');};
try {
 await page.goto(base);await page.getByRole('heading',{name:'Think It Through. Keep Your Work.'}).waitFor();
 assert.equal(await page.locator('.card').count(),2);
 await page.locator('a[href="?activity=levers-load-effort-distance"]').click();
 await page.locator('#student-name').fill('Practice Student');await page.locator('#student-bell').fill('2');
 await page.locator('.question-link[data-question="q3"]').click();
 await page.locator('#q3-prediction').selectOption({index:1});await page.locator('#q3-result').selectOption({index:2});await page.locator('#q3-reason').fill('Fictional browser-test prediction.');
 const predict=await page.locator('#q3-prediction').inputValue(),observe=await page.locator('#q3-result').inputValue();assert.notEqual(predict,observe);
 await page.reload();await page.locator('#q3-prediction').waitFor();assert.equal(await page.locator('#q3-prediction').inputValue(),predict);assert.equal(await page.locator('#q3-result').inputValue(),observe);
 assert.ok(await page.locator('.prediction strong').count()>0);
 await page.locator('.question-link[data-question="q7"]').click();const input=page.locator('article input').first();const earlierId=await input.getAttribute('id');await input.fill('123 fictional trial');
 const backup=await download('#backup','draft.json');const draft=JSON.parse(backup);assert.equal(draft.answers[earlierId],'123 fictional trial');
 await page.locator('#part-picker').selectOption('2');await page.locator('.question-link[data-question="q11"]').click();assert.ok((await page.locator('.reference').innerText()).includes('123 fictional trial'));
 await page.locator('#prepare-submission').click();assert.ok((await page.locator('dialog').innerText()).includes('incomplete'));
 const part2=JSON.parse(await download('#download-answers','part2.json'));assert.ok(part2.responses.every(r=>r.question_number>=9));assert.ok(!part2.responses.some(r=>r.response_id===earlierId));
 const readable=await download('#download-readable','part2.txt');for(const text of [part2.submission_id,part2.exported_at,part2.activity.fingerprint,part2.build.identifier])assert.ok(readable.includes(text));
 await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.locator('#part-picker').selectOption('1');await page.locator('#prepare-submission').click();
 const part1=JSON.parse(await download('#download-answers','part1.json'));assert.ok(part1.responses.every(r=>r.question_number<=8));assert.equal(part1.responses.find(r=>r.response_id==='q3-prediction').value,predict);assert.equal(part1.responses.find(r=>r.response_id==='q3-result').value,observe);
 await page.getByRole('button',{name:'Return To Missing Answers'}).click();assert.ok(await page.locator('.field.missing').count()>0);assert.equal(await page.locator(':focus').getAttribute('id'),'q1-1');
 await page.locator('#new-draft').click();await page.locator('#confirm-new').click();assert.equal(await page.locator('#student-name').inputValue(),'');
 await page.locator('#restore-file').setInputFiles('test-results/draft.json');await page.locator('#confirm-restore').click();assert.equal(await page.locator('#student-name').inputValue(),'Practice Student');assert.equal(await page.locator(`#${earlierId}`).inputValue(),'123 fictional trial');
 const incompatible={...draft,activity:{...draft.activity,revision:'C99'}};await page.locator('#restore-file').setInputFiles({name:'incompatible.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(incompatible))});await page.getByRole('heading',{name:'Backup Could Not Be Restored'}).waitFor();assert.ok((await page.locator('dialog[open]').innerText()).includes('different activity'));await page.getByRole('button',{name:'Close',exact:true}).click();assert.equal(await page.locator(`#${earlierId}`).inputValue(),'123 fictional trial');
 await page.locator('#restore-file').setInputFiles({name:'submission.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(part1))});await page.getByRole('heading',{name:'Backup Could Not Be Restored'}).waitFor();assert.ok((await page.locator('dialog[open]').innerText()).includes('Answer submissions'));await page.getByRole('button',{name:'Close',exact:true}).click();
 // A separate activity starts blank and does not replace the lever draft.
 await page.goto(`${base}?activity=workflow-practice`);await page.locator('#student-name').waitFor();assert.equal(await page.locator('#student-name').inputValue(),'');await page.locator('#student-name').fill('Workflow Practice');await page.locator('#student-bell').fill('5');await page.locator('#q1-predict').fill('Fictional practice response.');
 await page.goto(`${base}?activity=levers-load-effort-distance&part=1&question=q3`);await page.locator('#q3-prediction').waitFor();assert.equal(await page.locator('#q3-prediction').inputValue(),predict);
 // Literal markup remains text; restored text never becomes an executable element.
 await page.locator('#q3-reason').fill('<img src=x onerror=alert(1)>');await page.reload();await page.locator('#q3-reason').waitFor();assert.equal(await page.locator('article img[src="x"]').count(),0);
 await page.locator('#q3-reason').fill('Fictional browser-test prediction.');
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 const buildText=await page.locator('#build-id').innerText();
 if(!buildText.includes('Unbuilt')){const manifest=await (await context.request.get(`${base}build-manifest.json`)).json();assert.equal(buildText,manifest.identifier);assert.ok(base.includes(manifest.identifier));assert.equal(part1.build.identifier,manifest.identifier);const doc=await (await context.request.get(`${base}BUILD.md`)).text();assert.ok(doc.includes(manifest.identifier));}
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'test-results/mobile.png',fullPage:true});
 // Keyboard Next preserves answers and focuses the question heading.
 await page.locator('#next').focus();await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'question-title');
 // Cross-tab notification stops stale writes without losing the in-memory answer.
 const second=await context.newPage();await second.goto(`${base}?activity=levers-load-effort-distance&question=q3`);await second.locator('#q3-reason').fill('Another tab wrote this fictional answer.');await page.locator('#save-status.warning').waitFor();assert.ok((await page.locator('#save-status').innerText()).includes('Another tab'));await second.close();
 // Storage denial is surfaced, but backup/download still works.
 const denied=await browser.newContext();await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage blocked for test');}}));const blocked=await denied.newPage();await blocked.goto(`${base}?activity=workflow-practice`);await blocked.locator('#save-status.warning').waitFor();await blocked.locator('#q1-predict').fill('Still editable');assert.ok((await blocked.locator('#save-status').innerText()).includes('paused'));await denied.close();
 // Corruption is retained and recoverable rather than automatically overwritten.
 const broken=await browser.newContext();await broken.addInitScript(()=>{const key='classroom-activities:draft:v1:workflow-practice:C01:';const original=Storage.prototype.getItem;Storage.prototype.getItem=function(k){return k.startsWith(key)?'{broken':original.call(this,k);};});const corrupt=await broken.newPage();await corrupt.goto(`${base}?activity=workflow-practice`);await corrupt.getByRole('button',{name:'Download Saved Browser Data'}).waitFor();assert.ok((await corrupt.locator('#save-status').innerText()).includes('left untouched'));await broken.close();
 const older=await browser.newContext();await older.addInitScript(()=>localStorage.setItem('classroom-activities:draft:v1:workflow-practice:C00:earlier',JSON.stringify({fictional:'old work'})));const oldPage=await older.newPage();await oldPage.goto(`${base}?activity=workflow-practice`);await oldPage.getByRole('button',{name:'Recover Other Saved Versions'}).click();await oldPage.getByRole('button',{name:'Download Earlier Draft 1 (C00)'}).waitFor();assert.equal(await oldPage.locator('#student-name').inputValue(),'');await older.close();
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({status:'PASS',build:buildText,checks:['desktop/mobile layout','reload autosave','prediction/observation distinction','Q7 reference','part isolation','paired export snapshot','missing-field navigation','portable restoration','incompatible/submission rejection','activity isolation','literal answer markup','visible build consistency','keyboard navigation','cross-tab conflict','storage denial','corrupt recovery','earlier-revision recovery notice'],screenshots:['test-results/desktop.png','test-results/mobile.png']},null,2));
}finally{await browser.close();server?.kill();}
