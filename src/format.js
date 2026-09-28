// Text nodes only: content and restored answers never become HTML.
const controls=['Swap Positions','Hold Level','Hide Math','Show Math','Side View','Controls','Release','Reset'];
const vocabulary=['ideal mechanical advantage','first-class lever','effort distance','load distance','arm distances','arm distance','effort force','effort mass','load mass','fulcrum','effort','weight','force','mass','lever','load','IMA'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const token=new RegExp(`\\b(${[...controls,...vocabulary].map(escape).join('|')})\\b`,'gi');
export function styledText(text) {
  const fragment=document.createDocumentFragment();
  let start=0;
  for(const match of text.matchAll(token)) {
    fragment.append(document.createTextNode(text.slice(start,match.index)));
    const strong=document.createElement('strong');
    const control=controls.find(c=>c.toLowerCase()===match[0].toLowerCase());
    if(control) strong.textContent=control;
    else { const underline=document.createElement('u'); underline.textContent=match[0]; strong.append(underline); }
    fragment.append(strong); start=match.index+match[0].length;
  }
  fragment.append(document.createTextNode(text.slice(start)));
  return fragment;
}
