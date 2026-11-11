'use strict';
// Presentation layer: orbit navigation, cinematic starfield and optional synth sounds.
const formStats = [72, 94, 63, 99, 100, 88, 97, 81];
function updateCharacter(index, animate = true) {
 const form = forms[index];
 $('#preview-face').dataset.face = index;
 $('#preview-name').textContent = form.name;
 $('#preview-quote').textContent = form.joke;
 $('#preview-tag').textContent = form.tag;
 $('#preview-rarity').textContent = form.rarity;
 $('#form-index').textContent = String(index + 1).padStart(2, '0');
 $('#rizz-val').textContent = `${formStats[index]}%`;
 $('#rizz-bar').style.width = `${formStats[index]}%`;
 if (animate && !reduceMotion) {
  $('#preview-face').animate([{opacity:.2,filter:'blur(8px)',scale:'.94'},{opacity:1,filter:'blur(0px)',scale:'1'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
 }
}
document.addEventListener('formchange',e=>{updateCharacter(e.detail);playSignal(280+e.detail*65,.12);});
updateCharacter(selectedForm,false);
$('#form-prev').addEventListener('click',()=>selectForm((selectedForm+7)%8));
$('#form-next').addEventListener('click',()=>selectForm((selectedForm+1)%8));
$('#forms-grid').addEventListener('keydown',e=>{
 if(e.key!=='ArrowLeft' && e.key!=='ArrowRight')return;
 e.preventDefault();selectForm((selectedForm+(e.key==='ArrowRight'?1:7))%8);
 $(`[data-select="${selectedForm}"]`).focus({preventScroll:true});
});
let audioOn=false, audioCtx;
function playSignal(freq=420,duration=.12) {
 if(!audioOn || document.hidden)return;
 try {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume().catch(disableAudio);
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.type='sine';osc.frequency.setValueAtTime(freq,audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq*.55,audioCtx.currentTime+duration);
  gain.gain.setValueAtTime(.025,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
  osc.connect(gain);gain.connect(audioCtx.destination);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start();osc.stop(audioCtx.currentTime+duration);
 } catch {disableAudio();}
}
function disableAudio(){audioOn=false;$('#audio-toggle').setAttribute('aria-pressed','false');$('#audio-toggle b').textContent='OFF';toast('Gli effetti sonori non sono disponibili in questo browser.');}
$('#audio-toggle').addEventListener('click',()=>{audioOn=!audioOn;$('#audio-toggle').setAttribute('aria-pressed',String(audioOn));$('#audio-toggle b').textContent=audioOn?'ON':'OFF';if(!audioOn)audioCtx?.suspend().catch(()=>{});else playSignal(620,.25);});
$('#generate-roast').addEventListener('click',()=>playSignal(730,.18));
$('#quiz-answers').addEventListener('click',e=>{if(e.target.closest('.answer.selected'))playSignal(390,.18);});
const heroEl=$('.hero'),starCanvas=$('#starfield'),starCtx=starCanvas.getContext('2d');
let starWidth=1,starHeight=1,heroVisible=true,previousFrame=0,warpUntil=0,stars=[],needsDraw=true,starFrame=0;
let warpTimer,warpSoundTimer;
function scheduleSpace(){
 const active=heroVisible&&!document.hidden&&(!reduceMotion||needsDraw);
 if(active&&!starFrame)starFrame=requestAnimationFrame(drawSpace);
 if(!active&&starFrame){cancelAnimationFrame(starFrame);starFrame=0;previousFrame=0;}
}
function initStars(){
 const r=heroEl.getBoundingClientRect();starWidth=r.width;starHeight=r.height;
 const dpr=Math.min(devicePixelRatio||1,1.75);starCanvas.width=Math.round(starWidth*dpr);starCanvas.height=Math.round(starHeight*dpr);starCtx.setTransform(dpr,0,0,dpr,0,0);
 stars=Array.from({length:starWidth<600?85:150},()=>({x:(Math.random()-.5)*2300,y:(Math.random()-.5)*1500,z:100+Math.random()*1400,size:.4+Math.random()*.8}));needsDraw=true;scheduleSpace();
}
new ResizeObserver(initStars).observe(heroEl);initStars();
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)needsDraw=true;else endWarp();scheduleSpace();}).observe(heroEl);
document.addEventListener('motionchange',()=>{needsDraw=true;if(reduceMotion){endWarp();resetParallax();}scheduleSpace();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){endWarp();audioCtx?.suspend().catch(()=>{});}else needsDraw=true;scheduleSpace();});
window.addEventListener('pagehide',()=>{endWarp();stopSpeech();if(starFrame)cancelAnimationFrame(starFrame);starFrame=0;});
window.addEventListener('pageshow',()=>{needsDraw=true;scheduleSpace();});
heroEl.addEventListener('pointermove',e=>{
 if(reduceMotion||e.pointerType==='touch')return;
 const r=heroEl.getBoundingClientRect();heroEl.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*2);heroEl.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*2);
},{passive:true});
function resetParallax(){heroEl.style.setProperty('--mx',0);heroEl.style.setProperty('--my',0);}
heroEl.addEventListener('pointerleave',resetParallax);
function endWarp(){clearTimeout(warpTimer);clearTimeout(warpSoundTimer);warpUntil=0;document.body.classList.remove('warp-active');$('#warp-button').setAttribute('aria-pressed','false');}
$('#warp-button').setAttribute('aria-pressed','false');
$('#warp-button').addEventListener('click',()=>{
 if(warpUntil){endWarp();clearTimeout(warpTimer);return;}
 if(reduceMotion){toast('Salto completato. Benvenuto nell’universo del rizz.');selectForm((selectedForm+1)%8);return;}
 warpUntil=performance.now()+4200;document.body.classList.add('warp-active');$('#warp-button').setAttribute('aria-pressed','true');
 playSignal(160,1.6);warpSoundTimer=setTimeout(()=>playSignal(600,.8),250);
 warpTimer=setTimeout(()=>{endWarp();toast('Iperspazio raggiunto. Nessuna traccia di chill.');},4200);
});
function drawSpace(time){
 starFrame=0;
 const dt=Math.min(.04,(time-(previousFrame||time))/1000);previousFrame=time;
 if(heroVisible&&!document.hidden&&(!reduceMotion||needsDraw)){
  starCtx.clearRect(0,0,starWidth,starHeight);const speed=warpUntil>time?500:6;
  const cx=starWidth*.73,cy=starHeight*.45,focal=starWidth*.55;
  for(const s of stars){
   const oldZ=s.z;if(!reduceMotion)s.z-=dt*speed;
   if(s.z<35){s.z=1500;continue;}
   const x=cx+s.x*focal/s.z,y=cy+s.y*focal/s.z;
   if(x<0||x>starWidth||y<0||y>starHeight)continue;
   const opacity=Math.min(.75,.15+(1-s.z/1500)*.5);starCtx.strokeStyle=`rgba(242,184,127,${opacity})`;starCtx.fillStyle=`rgba(255,227,188,${opacity})`;
   if(warpUntil>time){starCtx.lineWidth=s.size;starCtx.beginPath();starCtx.moveTo(cx+s.x*focal/(oldZ+30),cy+s.y*focal/(oldZ+30));starCtx.lineTo(x,y);starCtx.stroke();}
   else {starCtx.beginPath();starCtx.arc(x,y,s.size*.75,0,Math.PI*2);starCtx.fill();}
  }
  needsDraw=false;
 }
 scheduleSpace();
}
scheduleSpace();
