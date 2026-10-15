'use strict';
const DELIVERY_ENDPOINT='https://formsubmit.co/ajax/hot1agent007@gmail.com';
let sending=false;
const $=id=>document.getElementById(id);
let step=0,gift=null,result='',toastTimer,jokeIndex=0;
const answers=['','',''];
const gifts=[['💐','Квіти','Обери улюблені'],['🍫','Солодощі','Щось смачне'],['💐 + 🍫','І те, і інше','Квіти та солодощі'],['📦','Свій варіант','Напиши, що хотілося б']];
const jokes=['Нічого не сталося. Але ти перевірила.','Ця кнопка не робить скриншот. Можеш видихнути.','Тепер можна сказати, що всі кнопки перевірено.'];
const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;},3600);}
function burst(x,y,finale=false){
 if(reducedMotion())return;
 const layer=$('effects');
 for(let i=0;i<(finale?54:12);i++){
  if(layer.childElementCount>=80)break;
  const el=document.createElement('span');el.className='particle';el.textContent=(finale?['♡','✿','♥','✧']:['♡','♥','✧'])[i%(finale?4:3)];el.style.color=['#c75670','#e9929c','#d5a065','#e7b5be'][i%4];el.style.left=(finale?Math.random()*window.innerWidth:x)+'px';el.style.top=(finale?-30:y)+'px';el.style.fontSize=(12+Math.random()*18)+'px';layer.append(el);
  const dx=(Math.random()-.5)*(finale?240:190),dy=finale?window.innerHeight+80:-(65+Math.random()*140);
  const animation=el.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(${Math.random()*360-180}deg)`,opacity:0}],{duration:finale?2100+Math.random()*1800:900+Math.random()*500,easing:finale?'linear':'cubic-bezier(.15,.65,.35,1)'});animation.onfinish=()=>el.remove();
 }
}
const questions=[
 {title:'Що ти ніколи не зробиш першою, але з радістю підтримаєш, якщо хтось запропонує?',hint:'Можна згадати щось конкретне — або відповісти так, як відчуваєш.',placeholder:'Сама я б не наважилась, але…'},
 {title:'Які три мрії ти найбільше хотіла б втілити в життя?',hint:'Великі чи маленькі — тут можна написати всі три.',placeholder:'1. …\n2. …\n3. …'},
 {title:'Яка історія з твого життя звучить вигаданою, хоча це правда?',hint:'Дивний збіг, випадкове знайомство, незапланована пригода. Якщо нічого не згадується — пропусти.',placeholder:'Одного разу…'}
];
function screen(id){['intro','quest','finish'].forEach(x=>$(x).hidden=x!==id);}
function render(){
 screen('quest');$('quest').dataset.stage=String(step);$('progressCount').textContent=String(step+1).padStart(2,'0')+' / 05';$('questionArt').textContent=['☕','✎','“','✉','✓'][step];$('charCount').textContent=(step<3?answers[step].length:0)+' / 1500';if(!reducedMotion())$('quest').animate([{opacity:0,transform:'translateY(15px) scale(.985)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:430,easing:'cubic-bezier(.2,.7,.2,1)'});document.querySelectorAll('.steps span').forEach((x,i)=>x.classList.toggle('active',i<=step));
 $('stepLabel').textContent=step<3?`питання ${step+1} з 3`:step===3?'тепер — подарунок':'останнє уточнення';
 $('question').textContent=step<3?questions[step].title:step===3?'Маленька радість для тебе':'Усе правильно?';
 $('hint').textContent=step<3?questions[step].hint:step===3?'Обери один варіант і за бажанням уточни, що саме.':'Можна повернутися й змінити відповіді.';
 $('customWrap').hidden=step>=3;$('choices').hidden=step!==3;$('detailWrap').hidden=step!==3;$('messageWrap').hidden=step!==4;$('summary').hidden=step!==4;$('choices').replaceChildren();$('summary').replaceChildren();$('status').textContent='';$('backupCopy').hidden=true;
 if(step<3){$('customAnswer').value=answers[step];$('customAnswer').placeholder=questions[step].placeholder;}
 if(step===3){$('choices').classList.toggle('gift-grid',true);gifts.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='choice';b.classList.toggle('selected',gift===i);b.setAttribute('aria-pressed',String(gift===i));const icon=document.createElement('span');icon.className='icon cat-sprite cat-'+i;icon.setAttribute('aria-hidden','true');const title=document.createElement('strong');title.textContent=v[1];const sub=document.createElement('small');sub.textContent=v[2];b.append(icon,title,sub);b.onclick=()=>{const r=b.getBoundingClientRect();gift=i;render();$('choices').children[i].focus({preventScroll:true});burst(r.left+r.width/2,r.top+r.height/2);toast(['Котик із букетом — твій 🌷','Солодкий вибір. Котик теж не проти 🍰','І квіти, і солодощі. Обидві лапки зайняті 🐾','Котик чекає на твою ідею ✉'][i]);};$('choices').append(b);});$('detailLabel').textContent=gift===3?'Що саме хотілося б?':'Які саме квіти чи солодощі?';}
 if(step===4){summaryRows().forEach(([label,value])=>{const row=document.createElement('p'),small=document.createElement('small'),b=document.createElement('b');small.textContent=label;b.textContent=value;row.append(small,b);$('summary').append(row);});if(!DELIVERY_ENDPOINT)$('status').textContent='Наприкінці можна скопіювати всі відповіді й надіслати їх одним повідомленням.';}
 $('next').disabled=step>=3&&gift===null;$('next').textContent=step<3?(answers[step].trim()?'Далі →':'Пропустити →'):step===3?'Далі →':DELIVERY_ENDPOINT?'Надіслати відповіді →':'Завершити →';
}
function summaryRows(){return [...questions.map((q,i)=>[q.title,answers[i].trim()||'Пропущено']),['Подарунок',gifts[gift][1]],['Уточнення',$('detail').value.trim()||'Без уточнень']];}
$('start').onclick=()=>{render();$('question').focus();};
$('customAnswer').oninput=()=>{if(step<3){answers[step]=$('customAnswer').value;$('charCount').textContent=answers[step].length+' / 1500';$('next').textContent=answers[step].trim()?'Далі →':'Пропустити →';}};
$('littleJoke').onclick=()=>{toast(jokes[jokeIndex++%jokes.length]);const r=$('littleJoke').getBoundingClientRect();burst(r.left+r.width/2,r.top);};
$('back').onclick=()=>{if(step===0)screen('intro');else{step--;render();$('question').focus();}};
$('wishForm').onsubmit=async e=>{e.preventDefault();if(sending||step>=3&&gift===null)return;if(step<4){step++;render();$('question').focus();return;}
 result=['Відповіді',...summaryRows().map(([k,v])=>k+': '+v),'Коментар: '+($('message').value.trim()||'Без коментаря')].join('\n');
 if(DELIVERY_ENDPOINT){sending=true;$('next').disabled=true;$('back').disabled=true;$('status').textContent='Надсилаю відповіді…';try{const payload={_subject:'Нове послання з котячої пошти 🐾',_template:'table',message:result};const response=await fetch(DELIVERY_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});const data=await response.json();if(!response.ok||!(data.success===true||data.success==='true'))throw new Error('Delivery failed');}catch{$('status').textContent='Лист поки не вдалося надіслати. Спробуй ще раз або скопіюй відповіді кнопкою нижче.';showBackup();return;}finally{sending=false;$('next').disabled=false;$('back').disabled=false;}}
 $('finishCat').className='finish-heart cat-sprite cat-'+gift;$('finishText').textContent=DELIVERY_ENDPOINT?'Відповіді надіслано. Дякую!':'Котик усе зібрав. Скопіюй відповіді та надішли їх тому, хто підготував для тебе цю сторінку.';screen('finish');burst(0,0,true);
};
function showBackup(){let button=$('backupCopy');button.hidden=false;button.onclick=async()=>{try{await navigator.clipboard.writeText(result);$('status').textContent='Відповіді скопійовано — їх можна надіслати повідомленням.';}catch{$('status').textContent=result;$('status').style.whiteSpace='pre-wrap';}};}
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(result);$('copyStatus').textContent='Скопійовано ✓';}catch{$('copyStatus').textContent=result;$('copyStatus').style.whiteSpace='pre-line';}};
$('restart').onclick=()=>{step=0;gift=null;answers.fill('');$('wishForm').reset();$('summary').replaceChildren();$('copyStatus').textContent='';$('effects').replaceChildren();clearTimeout(toastTimer);$('toast').hidden=true;screen('intro');};
// Small decorative effects never intercept controls or text selection.
let lastTrail=0;
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reducedMotion()||Date.now()-lastTrail<130)return;lastTrail=Date.now();const layer=$('effects');if(layer.childElementCount>55)return;const el=document.createElement('span');el.className='cursor-star';el.textContent='✧';el.style.left=e.clientX+'px';el.style.top=e.clientY+'px';layer.append(el);const a=el.animate([{opacity:.6,transform:'translate(0,0) scale(.8)'},{opacity:0,transform:'translate(-5px,18px) scale(.2)'}],{duration:650});a.onfinish=()=>el.remove();},{passive:true});
document.addEventListener('pointerdown',e=>{if(reducedMotion()||!e.target.closest('button')||e.target.closest('button').disabled)return;const layer=$('effects');if(layer.childElementCount>85)return;const ring=document.createElement('span');ring.className='click-ring';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';layer.append(ring);const a=ring.animate([{opacity:.7,transform:'scale(1)'},{opacity:0,transform:'scale(6)'}],{duration:480,easing:'ease-out'});a.onfinish=()=>ring.remove();},{passive:true});
