'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const forms = [
  { name: 'BASED HR', tag: 'LA FORMA ORIGINALE', joke: 'Ha aperto LinkedIn. È già troppo tardi.', rarity: 'COMUNE' },
  { name: 'RIZZ RECRUITER', tag: 'SOFT SKILLS, HARD VIBES', joke: 'Ti assume con il sorriso. In Ohio.', rarity: 'RARA' },
  { name: 'ATS IN PANICO', tag: 'PLOT TWIST AZIENDALE', joke: 'Quando il candidato chiede la RAL.', rarity: 'EPICA' },
  { name: 'SIGMA SOURCING', tag: 'AURA NON NEGOZIABILE', joke: 'Il networking viene a cercare lui.', rarity: 'LEGGENDARIA' },
  { name: 'CEO DEL CHILL', tag: 'IL CAPO DELL’ORGANIGRAMMA', joke: 'Ha promosso se stesso a final boss.', rarity: 'MITICA' },
  { name: 'MAGO DEI KPI', tag: 'EXCELLIARMUS', joke: 'Evoca talenti. E una call alle 18:59.', rarity: 'ARCANA' },
  { name: 'ESPRESSO MANAGER', tag: 'TRALALERO CAFFEINERO', joke: 'Il caffè ha chiesto un colloquio con lui.', rarity: 'CAFFEINATA' },
  { name: 'ZEN STAKEHOLDER', tag: 'IL CHILL È STATO TROVATO', joke: 'Ha silenziato le notifiche. Ascensione.', rarity: 'CELESTIALE' }
];
const roasts = [
 ['hr','Gabriele, persino il tuo «buongiorno» ha tre KPI e una call di allineamento.'],
 ['hr','Bro non cerca amici. Apre una talent pipeline per andare a prendere un caffè.'],
 ['hr','Gabriele, «ciao» non richiede una needs analysis.'],
 ['hr','Hai fatto employer branding pure alla macchinetta del caffè. Adesso vuole il welfare.'],
 ['hr','Il tuo chill è ancora in onboarding. Gli manca il badge.'],
 ['hr','Gabriele, se dici ancora «potenziale umano», il tostapane ti manda il curriculum.'],
 ['hr','Bro ha chiesto un feedback a una porta automatica. Candidate experience impeccabile.'],
 ['hr','Gabriele, «ci vediamo alle otto» non è una strategia di talent retention.'],
 ['hr','Ha organizzato una performance review al gruppo WhatsApp. Il gruppo ha lasciato il gruppo.'],
 ['hr','Gabriele non arriva in ritardo. Sta ottimizzando il time-to-arrive.'],
 ['linkedin','Gabriele, hai già trasformato la pausa pranzo in un post sulla crescita personale?'],
 ['linkedin','Il bro cade dalle scale e scrive: «Oggi ho imparato il valore della resilienza».'],
 ['linkedin','Gabriele, il tuo frigorifero non ha bisogno di una mission e di una vision. Ha bisogno di latte.'],
 ['linkedin','Bro ha messo «problem solving» pure sul tostapane. Adesso il pane fa networking.'],
 ['linkedin','Gabriele, hai appena detto «felice di condividere» a un piccione.'],
 ['linkedin','Il bro non va in vacanza. Esplora nuove opportunità di crescita territoriale.'],
 ['linkedin','Pure la tua tesi ha fatto personal branding. Gabriele, falla riposare.'],
 ['linkedin','Gabriele, questo roast non va aggiunto nella sezione certificazioni.'],
 ['linkedin','Ha fatto networking col Wi-Fi. Finalmente una connessione stabile.'],
 ['linkedin','Gabriele, «Open to Work» non significa tenere aperte quarantasette schede.'],
 ['brainrot','Gabriele Zumbinelli, tralalero recruitinghelli. Il colloquio è diventato un rituale.'],
 ['brainrot','Skibidi stakeholder. Sigma sourcing. Rizzorse umane. Gabriele, riavviati.'],
 ['brainrot','Il bro ha sbloccato il B2 in inglese e il C∞ in corporate brainrot.'],
 ['brainrot','Gabriele, stai farmando aura o stai solo aggiornando il profilo ogni otto minuti?'],
 ['brainrot','Zumbino non perde aura. La inserisce nel piano di welfare.'],
 ['brainrot','Bro è il final boss del colloquio. La seconda fase è una presentazione PowerPoint.'],
 ['brainrot','Gabriele, hai fatto un assessment al cappuccino. Schiuma: ottimo cultural fit.'],
 ['brainrot','Tralalero talent acquisition. Tung tung tung onboarding. Il cervello è in call.'],
 ['brainrot','Gabriele, il tuo organigramma sembra l’albero delle evoluzioni di un Pokémon.'],
 ['brainrot','Il bro ha studiato HR Analytics per misurare quanti punti aura perde dicendo «sinergia».'],
 ['brainrot','Gabriele, «sigma mindset» non è un CCNL.'],
 ['brainrot','Benvenuti in Zumbino S.p.A. La A sta per aura. La produttività è un DLC.']
];
let selectedForm = 3, category = 'all', roastCount = 1, currentRoast = roasts[0][1];
let recentRoasts = [currentRoast];
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = reduceQuery.matches;
const atlas = new Image();
let atlasFailed = false;
let atlasReady = atlas.complete && atlas.naturalWidth > 0;
let cursorEnabled = matchMedia('(pointer:fine)').matches;
let pointer = null, pressed = false, pressTimer, toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600); }
function applyMotion() {
 document.documentElement.classList.add('motion-ready');
 document.documentElement.classList.toggle('reduce-motion', reduceMotion);
 if (reduceMotion) { document.getAnimations().forEach(a => a.cancel()); $('#particles').replaceChildren(); }
 document.body.classList.toggle('reduce-motion', reduceMotion); $('#motion').setAttribute('aria-pressed', String(reduceMotion)); $('#motion b').textContent = reduceMotion ? 'OFF' : 'ON'; document.dispatchEvent(new Event('motionchange')); }
applyMotion();
$('#motion').addEventListener('click', () => { reduceMotion = !reduceMotion; applyMotion(); });
reduceQuery.addEventListener('change', e => { reduceMotion = e.matches; applyMotion(); });
function applyCursor() { document.body.classList.toggle('custom-cursor', cursorEnabled && atlasReady); $('#cursor-toggle').setAttribute('aria-pressed', String(cursorEnabled)); $('#cursor-toggle b').textContent = cursorEnabled ? 'ON' : 'OFF'; }
atlas.addEventListener('load', () => { atlasReady = true; atlasFailed = false; applyCursor(); });
atlas.addEventListener('error', () => { atlasReady = false; atlasFailed = true; document.body.classList.add('faces-unavailable'); applyCursor(); });
atlas.src = 'assets/gabriele-multiverse.png';
applyCursor(); document.body.classList.add('cursor-out');
$('#cursor-toggle').addEventListener('click', () => { cursorEnabled = !cursorEnabled; applyCursor(); });
function refreshCursor() {
 let form = selectedForm, label = '+1 AURA';
 const target = pointer ? document.elementFromPoint(pointer.x, pointer.y) : null;
 if (target?.closest('button,a')) { form = 1; label = 'RIZZ APPROVATO'; }
 if (pressed) { form = 2; label = 'SKIBIDI?!'; }
 $('#cursor .face').dataset.face = form; $('#cursor small').textContent = label;
}
window.addEventListener('pointermove', e => { if(e.pointerType === 'touch') return; pointer = {x:e.clientX,y:e.clientY}; document.body.classList.remove('cursor-out'); $('#cursor').style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; refreshCursor(); }, {passive:true});
document.documentElement.addEventListener('pointerleave', () => document.body.classList.add('cursor-out'));
function resetPointer() { pressed = false; clearTimeout(pressTimer); document.body.classList.add('cursor-out'); }
window.addEventListener('blur', resetPointer);
window.addEventListener('pointercancel', resetPointer);
window.addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.add('cursor-out'); });
window.addEventListener('pointerdown', e => { if(e.pointerType === 'touch') return; pressed = true; clearTimeout(pressTimer); refreshCursor(); });
window.addEventListener('pointerup', () => { pressTimer = setTimeout(() => { pressed = false; refreshCursor(); }, 200); });
function renderForms() {
 $('#forms-grid').innerHTML = forms.map((f,i) => `<button class="form-card${i===selectedForm?' active':''}" data-select="${i}" aria-pressed="${i===selectedForm}"><span class="form-top">FORM 0${i+1}<span>↗</span></span><span class="face" data-face="${i}"></span><strong>${f.name}</strong><small>${f.joke}</small><span class="form-bottom">${f.rarity}<b>${i===selectedForm?'●':'+'}</b></span></button>`).join('');
 $$('[data-select]').forEach(button => button.addEventListener('click', () => selectForm(Number(button.dataset.select))));
}
function selectForm(index) {
 selectedForm = index; $('#hero-face').dataset.face = index; $('#hero-form').textContent = forms[index].name;
 $('#selected-label').textContent = `FORMA ATTIVA: ${forms[index].name}`;
 $$('[data-select]').forEach((button,i) => { button.classList.toggle('active',i===index); button.setAttribute('aria-pressed',String(i===index)); button.querySelector('.form-bottom b').textContent = i===index?'●':'+'; });
 refreshCursor(); $('#status').textContent = `Sbloccata la forma ${forms[index].name}. ${forms[index].joke}`; document.dispatchEvent(new CustomEvent('formchange', {detail:index}));
}
renderForms(); $('#hero-face-button').addEventListener('click', () => selectForm((selectedForm+1)%8));
function cloneStorm() {
 if ($('#particles').childElementCount) return;
 const count = reduceMotion ? 5 : 26;
 for(let i=0;i<count;i++) {
  const p=document.createElement('span'); p.className='face particle';p.dataset.face=i%8;
  p.style.width=`${45+Math.random()*60}px`; p.style.left=`${Math.random()*94}vw`;p.style.top=reduceMotion?`${15+Math.random()*65}vh`:'-150px';$('#particles').append(p);
  const animation=p.animate(reduceMotion?[{opacity:0},{opacity:1},{opacity:0}]:[{opacity:0,transform:'translateY(0) rotate(-20deg)'},{opacity:1,offset:.12},{opacity:1,transform:`translate(${Math.random()*180-90}px,${innerHeight+300}px) rotate(${Math.random()*380-190}deg)`}],{duration:reduceMotion?900:2800+Math.random()*1800,delay:reduceMotion?0:i*35,easing:'ease-in'});
  animation.onfinish=animation.oncancel=()=>p.remove();
 }
 toast('Flotta Zumbino in orbita. Il rizz è fuori controllo.');
}
$('#clone').addEventListener('click',cloneStorm);$('#final-clone').addEventListener('click',cloneStorm);
$$('[data-category]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;$$('[data-category]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});generateRoast();}));
let activeUtterance = null;
function resetSpeechButton() {
 $('#speak-roast').textContent = '◖ Ascolta il roast';
 $('#speak-roast').setAttribute('aria-pressed', 'false');
}
function stopSpeech() {
 const previous = activeUtterance;
 activeUtterance = null;
 if (previous) { previous.onend = null; previous.onerror = null; }
 if ('speechSynthesis' in window) window.speechSynthesis.cancel();
 resetSpeechButton();
}
function generateRoast(){
 stopSpeech();let pool=roasts.filter(([c,t])=>(category==='all'||c===category)&&!recentRoasts.includes(t));
 if(!pool.length){recentRoasts=[currentRoast];pool=roasts.filter(([c,t])=>(category==='all'||c===category)&&t!==currentRoast);}
 currentRoast=pool[Math.floor(Math.random()*pool.length)][1];recentRoasts.push(currentRoast);roastCount++;
 $('#roast-text').textContent=currentRoast;$('#roast-number').textContent=`N° ${String(roastCount).padStart(3,'0')}`;
 const aura=500+Math.floor(Math.random()*15)*100;$('#damage-label').textContent=`+${aura} AURA`;$('#damage-bar').style.width=`${58+Math.random()*40}%`;
 if(!reduceMotion)$('#roast-text').animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
}
$('#generate-roast').addEventListener('click',generateRoast);
$('#speak-roast').setAttribute('aria-pressed','false');
$('#speak-roast').addEventListener('click', () => {
 if (!('speechSynthesis' in window)) { toast('La lettura vocale non è disponibile in questo browser.'); return; }
 if (activeUtterance) { stopSpeech(); return; }
 const utterance = new SpeechSynthesisUtterance(currentRoast);
 utterance.lang = 'it-IT'; utterance.rate = 1.03; utterance.pitch = 1;
 const voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('it'));
 if (voice) utterance.voice = voice;
 activeUtterance = utterance;
 const complete = e => {
  if (activeUtterance !== utterance) return;
  activeUtterance = null; resetSpeechButton();
  if (e?.error && !['canceled', 'interrupted'].includes(e.error)) toast('Voce non disponibile: la perla resta qui da leggere.');
 };
 utterance.onend = complete; utterance.onerror = complete;
 $('#speak-roast').textContent = '■ Ferma la lettura';
 $('#speak-roast').setAttribute('aria-pressed', 'true');
 try { speechSynthesis.speak(utterance); } catch { complete({error:'unavailable'}); }
});
document.addEventListener('visibilitychange', () => {
 if (document.hidden) { stopSpeech(); resetPointer(); $('#particles').replaceChildren(); }
});
async function copyText(text, message = 'Perla copiata. Usala con rizz.') {
 try {
  if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(text); toast(message);
 } catch {
  const dialog = $('#copy-dialog');
  $('#copy-field').value = text;
  dialog.showModal(); $('#copy-field').focus(); $('#copy-field').select();
 }
}
$('#copy-close').addEventListener('click', () => $('#copy-dialog').close());
$('#copy-field').addEventListener('focus', e => e.target.select());
$('#copy-roast').addEventListener('click', () => copyText(currentRoast));
$('#share-site').addEventListener('click', async () => {
 const url = location.protocol === 'file:' ? '' : location.origin + location.pathname;
 if (!url || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
  toast('Anteprima locale: usa il pacchetto ZIP o il link pubblicato per condividere.'); return;
 }
 const share = {title:'Zumbino Universe', text:'Gabriele, il tuo personal branding ha lasciato la Terra. 🪐', url};
 if (navigator.share) {
  try { await navigator.share(share); return; } catch (error) { if (error.name === 'AbortError') return; }
 }
 await copyText(url, 'Link copiato. Il multiverso è pronto a partire.');
});
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight){let line='';for(const word of text.split(' ')){const test=line+word+' ';if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line.trim(),x,y);line=word+' ';y+=lineHeight;}else line=test;}ctx.fillText(line.trim(),x,y);}
$('#download-card').addEventListener('click',async()=>{
 if(!atlasReady){toast(atlasFailed ? 'Immagine non caricata: ricarica la pagina e riprova.' : 'La faccia sta finendo l’onboarding. Riprova tra un attimo.');return;}
 if (location.protocol === 'file:') { toast('Scarica le carte dalla versione online del sito.'); return; }
 const cardIndex = selectedForm;
 const form=forms[selectedForm],out=document.createElement('canvas');out.width=800;out.height=1050;const c=out.getContext('2d');
 c.fillStyle='#f28b54';c.fillRect(0,0,800,1050);c.fillStyle='#151313';c.fillRect(8,8,784,1034);c.fillStyle='#ece7dd';
 c.font='bold 21px monospace';c.fillText(`ZUMBINO UNIVERSE / FORM 0${selectedForm+1}`,65,85);c.font='14px monospace';c.fillText(form.rarity,65,118);
 c.fillStyle='#241d19';c.fillRect(65,155,670,600);c.strokeStyle='#79533a';c.lineWidth=1;c.beginPath();c.ellipse(400,450,290,200,-.35,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(400,450,230,280,.35,0,Math.PI*2);c.stroke();
 const sw=atlas.naturalWidth/4,sh=atlas.naturalHeight/2;c.drawImage(atlas,(selectedForm%4)*sw,Math.floor(selectedForm/4)*sh,sw,sh,105,165,590,590);
 c.fillStyle='#f28b54';c.font='bold 43px sans-serif';c.fillText(form.name,65,815);c.fillStyle='#ece7dd';c.font='26px sans-serif';wrapCanvasText(c,form.joke,65,865,665,37);
 c.font='13px monospace';c.fillStyle='#b8a18a';c.fillText('PARODIA NON UFFICIALE / VARIANTE GENERATA',65,980);
 out.toBlob(blob=>{if(!blob){toast('Download non disponibile. Riprova.');return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`zumbino-forma-${cardIndex+1}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Download della carta avviato. Aura certificata.');},'image/png');
});

const questions=[
 {q:'Parlami un po’ di te.',sub:'Il momento in cui tutte le competenze lasciano il corpo.',answers:[['Sono una persona motivata e collaborativa.',10,'Risposta corretta. Troppo corretta. Gabriele sospetta che tu sia un template.',0],['Sono uno skibidi stakeholder con rizz trasversale.',50,'Gabriele ha appena aggiunto «rizz trasversale» alla job description.',3],['Ho messo problem solving anche sul tostapane.',30,'Il tostapane è stato invitato al secondo colloquio.',2]]},
 {q:'Qual è il tuo più grande punto di forza?',sub:'Se dici «sono troppo perfezionista», parte un webinar.',answers:[['Trasformo ogni pausa caffè in un networking event.',40,'Gabriele si commuove. La macchinetta ha già mandato la richiesta di collegamento.',1],['Mantengo 10.000 punti aura anche su Excel.',50,'Formattazione condizionale: verde. Aura: fuori scala.',4],['So chiudere una call prima che diventi una serie TV.',20,'Competenza leggendaria. Gabriele chiede un corso di formazione.',7]]},
 {q:'Perché vuoi lavorare in Ohio S.p.A.?',sub:'La sede è ovunque. Il buon senso è in ferie.',answers:[['Per la vostra cultura aziendale orientata allo skibidi.',50,'Cultural fit perfetto. Gabriele sta aggiornando la mission.',3],['Ho sentito che la pausa pranzo conta come side quest.',35,'Confermiamo: il dessert sblocca un achievement.',1],['Mi ha mandato qui l’algoritmo.',15,'L’algoritmo è ora il tuo referente HR. In bocca al rizz.',2]]},
 {q:'Come gestisci un conflitto nel team?',sub:'Il gruppo WhatsApp ha 87 messaggi non letti.',answers:[['Convoco una riunione per pianificare una riunione.',20,'Gabriele ha trovato il suo erede. Nessuno lavorerà più.',0],['Lancio Excelleriarmus e invoco il Mago dei KPI.',50,'Incantesimo riuscito. Il conflitto è diventato una tabella pivot.',5],['Offro un caffè e silenzio le notifiche.',35,'La pace nel mondo, ma con un budget di un euro e venti.',6]]},
 {q:'Dove ti vedi tra cinque anni?',sub:'Gabriele ha già preparato un piano di sviluppo.',answers:[['Chief Rizz Officer con delega al tralalero.',50,'Il consiglio di amministrazione ha approvato. Il consiglio è tutto Gabriele.',4],['Nella stessa call. Qualcuno sta ancora condividendo lo schermo.',25,'Gabriele ride, poi controlla da quanto è aperta questa riunione.',2],['Con il chill finalmente fuori dal periodo di prova.',40,'Obiettivo SMART: serenità misurabile e notifiche disattivate.',7]]},
 {q:'Hai qualche domanda per noi?',sub:'Ultima chance per mettere l’aura a contratto.',answers:[['La RAL viene pagata in euro o in punti aura?',50,'Euro no, meme sì. Il payroll ha appena fatto un backflip.',2],['Il caffè ha un contratto a tempo indeterminato?',35,'Il caffè è l’unico dipendente che non ha mai chiesto ferie.',6],['Posso scrivere «felice di condividere» prima di essere assunto?',45,'Gabriele ha aperto LinkedIn per te. È fatta.',1]]}
];
let questionIndex=0,aura=0,answered=false,finished=false;
function focusQuiz(element) {
 element.focus({preventScroll:true});
 const r = element.getBoundingClientRect();
 if (r.top < 20 || r.bottom > innerHeight - 20) element.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'center'});
}
function renderQuestion(focus=false){
 const q=questions[questionIndex];answered=false;finished=false;$('#quiz-step').textContent=`DOMANDA ${String(questionIndex+1).padStart(2,'0')} / 06`;$('#quiz-progress-bar').style.width=`${(questionIndex+1)/6*100}%`;
 $('#quiz-question').textContent=q.q;$('#quiz-subtitle').textContent=q.sub;$('#quiz-feedback').hidden=true;$('#quiz-result').hidden=true;$('#quiz-answers').hidden=false;
 $('#quiz-answers').innerHTML=q.answers.map((a,i)=>`<button class="answer" data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${a[0]}</button>`).join('');
 $$('[data-answer]').forEach(button=>button.addEventListener('click',()=>answerQuestion(Number(button.dataset.answer))));
 if(focus)focusQuiz($('#quiz-question'));
}
function answerQuestion(index){
 if(answered||finished)return;answered=true;const answer=questions[questionIndex].answers[index];aura+=answer[1];$('#aura-score').textContent=String(aura).padStart(3,'0');$('#quiz-face').dataset.face=answer[3];
 $$('[data-answer]').forEach((button,i)=>{button.disabled=true;button.classList.toggle('selected',i===index);});
 $('#feedback-label').textContent=`VERDETTO HR / +${answer[1]} AURA`;$('#feedback-text').textContent=answer[2];$('#quiz-feedback').hidden=false;
 $('#quiz-next').innerHTML=questionIndex===questions.length-1?'Scopri il verdetto <span>↗</span>':'Prossima domanda <span>→</span>';
 focusQuiz($('#quiz-next'));
}
let resultSummary='';
function finishQuiz(){
 finished=true;$('#quiz-answers').hidden=true;$('#quiz-feedback').hidden=true;$('#quiz-result').hidden=false;$('#quiz-step').textContent='COLLOQUIO COMPLETATO';$('#quiz-progress-bar').style.width='100%';
 const title=aura>=270?'Assunto. Chief Skibidi Officer.':aura>=190?'Promosso a Rizz Analyst.':'Tirocinante del chill.';
 const message=aura>=270?'Gabriele ti ha dato le chiavi dell’Ohio. L’organigramma trema. Il tuo primo compito è convincerlo a non fare un post su questa esperienza.':aura>=190?'Hai passato il cultural fit. Gabriele ti offre una scrivania, un caffè e dodici call che potevano essere un meme.':'Il tuo livello di normalità ha confuso Gabriele. Ti assegniamo un corso intensivo di tralalero e una pausa pranzo senza networking.';
 $('#quiz-question').textContent=title;$('#quiz-subtitle').textContent=`${aura} / 300 PUNTI AURA · CONTRATTO IMMAGINARIO, RISATE REALI`;$('#result-text').textContent=message;$('#quiz-face').dataset.face=aura>=270?4:aura>=190?3:7;
 resultSummary=`${title} ${aura}/300 punti aura nel colloquio di Zumbino™. Parodia, ovviamente.`;focusQuiz($('#quiz-question'));$('#status').textContent=resultSummary;
}
$('#quiz-next').addEventListener('click',()=>{if(!answered)return;if(questionIndex===questions.length-1)finishQuiz();else{questionIndex++;renderQuestion(true);}});
function restartQuiz(){questionIndex=0;aura=0;$('#aura-score').textContent='000';$('#quiz-face').dataset.face=0;renderQuestion(true);}
$('#quiz-restart').addEventListener('click',restartQuiz);$('#quiz-again').addEventListener('click',restartQuiz);$('#copy-result').addEventListener('click',()=>copyText(resultSummary, 'Verdetto copiato. Il rizz è ufficiale.'));renderQuestion();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
$$('.section-heading,.lore-grid,.credentials,.interview-heading,.closing h2').forEach(element=>{if(reduceMotion)return;element.classList.add('reveal');observer.observe(element);});
