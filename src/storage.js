// The remembered raw value is an optimistic lock: another tab must not be overwritten.
export class DraftStore {
  constructor(key, provider=()=>localStorage) { this.key=key; this.provider=provider; this.raw=null; this.blocked=false; }
  read() {
    try { this.raw=this.provider().getItem(this.key); return {ok:true,raw:this.raw}; }
    catch { this.blocked=true; return {ok:false,message:'Browser saving is unavailable. Keep this tab open and download a Draft Backup before leaving.'}; }
  }
  quarantine() { this.blocked=true; }
  save(draft) {
    if (this.blocked) return {ok:false,message:'Browser saving is paused to protect your work. Download a Draft Backup. Reload to inspect the saved copy, or deliberately start a new draft.'};
    try {
      const storage=this.provider();
      if (storage.getItem(this.key)!==this.raw) { this.blocked=true; return {ok:false,message:'Another tab changed this draft. Your answers remain in this tab. Download a Draft Backup before reloading; browser saving is paused.'}; }
      const next=JSON.stringify(draft);
      storage.setItem(this.key,next);
      this.raw=next;
      return {ok:true};
    } catch { return {ok:false,message:'Your latest changes could not be saved in this browser. Keep this tab open and download a Draft Backup.'}; }
  }
  reset() {
    try { const storage=this.provider(); storage.removeItem(this.key); this.raw=null; this.blocked=false; return {ok:true}; }
    catch { return {ok:false,message:'This browser could not clear its saved draft. Your current work remains open.'}; }
  }
}
