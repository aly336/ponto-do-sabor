import { buildInquiry, createWhatsAppURL, normalizeQuantity } from './menu.js';
import { createRibbonLoop, createAmbientMotion } from './motion.js';
import { initSmoothScroll } from './smooth-scroll.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const lifecycle = new AbortController();
const listen = (target,type,fn,options={}) => target.addEventListener(type,fn,{...options,signal:lifecycle.signal});
document.body.classList.add('has-script');

// The static document already contains real contact links and readable content.
const navToggle=$('.nav-toggle'), nav=$('#navigation');
navToggle.hidden=false;
nav.classList.add('js-collapsed');
function closeNav(restoreFocus=false){
  navToggle.setAttribute('aria-expanded','false');
  navToggle.setAttribute('aria-label','Abrir navegação');
  nav.classList.add('js-collapsed');
  if(restoreFocus)navToggle.focus();
}
listen(navToggle,'click',()=>{
  const open=navToggle.getAttribute('aria-expanded')!=='true';
  navToggle.setAttribute('aria-expanded',String(open));
  navToggle.setAttribute('aria-label',open?'Fechar navegação':'Abrir navegação');
  nav.classList.toggle('js-collapsed',!open);
});
listen(nav,'click',event=>{if(event.target.closest('a'))closeNav();});
listen(document,'keydown',event=>{if(event.key==='Escape'&&navToggle.getAttribute('aria-expanded')==='true')closeNav(true);});
listen(document,'pointerdown',event=>{if(!nav.contains(event.target)&&!navToggle.contains(event.target))closeNav();});
listen(document,'focusin',event=>{if(!nav.contains(event.target)&&!navToggle.contains(event.target))closeNav();});

// A selection is a request for information, never a confirmed purchase.
const chosen=new Map();
const articles=$$('.product');
const filters=$$('.filters button');
const inquiry=$('.inquiry');
const menuStatus=$('#menu-status');
$('.filters').hidden=false;
filters.forEach(button=>listen(button,'click',()=>{
  const category=button.dataset.filter;
  filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  articles.forEach(article=>{article.hidden=category!=='todos'&&article.dataset.category!==category;});
  $('#produtos').classList.toggle('is-filtered',category!=='todos');
  menuStatus.textContent=`${articles.filter(item=>!item.hidden).length} opções exibidas.`;
}));
const selectionButtons=new Map();
articles.forEach(article=>{
  const anchor=article.querySelector('.select-item');
  const button=document.createElement('button');
  button.className=anchor.className;
  button.type='button';
  button.innerHTML=anchor.innerHTML;
  button.setAttribute('aria-pressed','false');
  button.setAttribute('aria-label',`Selecionar ${article.dataset.name} para consulta`);
  anchor.replaceWith(button);
  selectionButtons.set(article.dataset.item,button);
  listen(button,'click',()=>{
    const key=article.dataset.item;
    if(chosen.has(key))chosen.delete(key);
    else chosen.set(key,{name:article.dataset.name,quantity:1});
    renderInquiry();
    menuStatus.textContent=chosen.has(key)?`${article.dataset.name} incluído na consulta.`:`${article.dataset.name} removido da consulta.`;
  });
});
function updateInquiryLink(){
  $('#inquiry-link').href=createWhatsAppURL(buildInquiry([...chosen.values()],$('#service-mode').value));
}
function renderInquiry(){
  inquiry.hidden=chosen.size===0;
  $('#inquiry-summary').textContent=`${chosen.size} ${chosen.size===1?'opção selecionada':'opções selecionadas'}. A equipe confirma os valores e a disponibilidade.`;
  const fragment=document.createDocumentFragment();
  for(const [key,item] of chosen){
    const row=document.createElement('div');row.className='inquiry-row';
    const label=document.createElement('label');label.htmlFor=`quantity-${key}`;label.textContent=item.name;
    const input=document.createElement('input');input.id=label.htmlFor;input.type='number';input.min='1';input.max='20';input.step='1';input.value=String(item.quantity);input.setAttribute('aria-label',`Quantidade para consultar: ${item.name}`);
    input.addEventListener('change',()=>{item.quantity=normalizeQuantity(input.value);input.value=String(item.quantity);updateInquiryLink();},{signal:lifecycle.signal});
    row.append(label,input);fragment.append(row);
  }
  $('#inquiry-items').replaceChildren(fragment);
  for(const [key,button] of selectionButtons){
    const selected=chosen.has(key);
    button.setAttribute('aria-pressed',String(selected));
    button.querySelector('span').textContent=selected?'Escolhido':'Consultar';
    button.querySelector('use').setAttribute('href',selected?'#check':'#plus');
  }
  updateInquiryLink();
}
listen($('#service-mode'),'change',updateInquiryLink);
listen($('.clear-inquiry'),'click',()=>{
  chosen.clear();
  const firstVisible=articles.find(article=>!article.hidden);
  renderInquiry();
  if(firstVisible)selectionButtons.get(firstVisible.dataset.item).focus();
  menuStatus.textContent='Escolha limpa.';
});

// Accessible two-face detail: the faces have no controls; the button is stable.
const flip=$('.flip-toggle'),card=$('.flavor-card');
flip.hidden=false;
listen(flip,'click',()=>{
  const flipped=flip.getAttribute('aria-pressed')!=='true';
  card.classList.toggle('is-flipped',flipped);
  flip.setAttribute('aria-pressed',String(flipped));
  flip.querySelector('span').textContent=flipped?'Voltar para a feijoada':'Ver os acompanhamentos';
  const front=$('.flavor-front'),back=$('.flavor-back');
  front.setAttribute('aria-hidden',String(flipped));front.inert=flipped;
  back.setAttribute('aria-hidden',String(!flipped));back.inert=!flipped;
});

let paused=reduce.matches;
const pauseButton=$('.motion-toggle');pauseButton.hidden=false;
const activeAnimations=new Map();
const played=new WeakSet();
let motionObserver;
function finishMotion(element){
  activeAnimations.get(element)?.cancel();activeAnimations.delete(element);
  motionObserver?.unobserve(element);played.add(element);
}
function showAll(){
  activeAnimations.forEach(animation=>animation.cancel());activeAnimations.clear();
}
function playEntrance(element){
  if(played.has(element)||reduce.matches||paused)return;
  played.add(element);
  const type=element.dataset.motion;
  const siblings=[...element.parentElement.children].filter(node=>node.hasAttribute('data-motion'));
  const delay=Math.min(240,Math.max(0,siblings.indexOf(element))*80);
  // The transient class is added only after intersection. Removing it always
  // restores the visible base, including interruption by focus or pointer.
  element.style.setProperty('--enter-delay',`${delay}ms`);
  element.classList.add('is-entering');
  activeAnimations.set(element,{cancel(){element.classList.remove('is-entering');element.style.removeProperty('--enter-delay');}});
}
listen(document,'animationend',event=>{
  if(event.target.classList.contains('is-entering')){
    activeAnimations.get(event.target)?.cancel();activeAnimations.delete(event.target);
  }
});
if(typeof window.IntersectionObserver==='function'){
  motionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>=.2){
        motionObserver.unobserve(entry.target);
        if(entry.target.contains(document.activeElement)||entry.target.matches(':hover'))played.add(entry.target);
        else playEntrance(entry.target);
      }
    });
  },{threshold:.2});
  $$('[data-motion]').forEach(element=>motionObserver.observe(element));
}
const cancelInteractedMotion=event=>{
  let target=event.target;
  while(target&&target!==document){if(target.hasAttribute?.('data-motion'))finishMotion(target);target=target.parentElement;}
};
listen(document,'focusin',cancelInteractedMotion);
listen(document,'pointerdown',cancelInteractedMotion,{passive:true});

// Native scroll, layered cursor response and a measured seamless phrase loop.
const ribbon=createRibbonLoop($('.ribbon'),{signal:lifecycle.signal});
const ambient=createAmbientMotion({root:$('.hero'),isPaused:()=>paused,reduce,fine,signal:lifecycle.signal});
const smoothScroll=initSmoothScroll({signal:lifecycle.signal});
const magnetic=$('.magnetic');
listen(magnetic,'pointermove',event=>{
  if(!fine.matches||reduce.matches||paused||event.pointerType!=='mouse')return;
  const rect=magnetic.getBoundingClientRect();
  magnetic.style.setProperty('--magnet-x',`${Math.max(-2,Math.min(2,(event.clientX-rect.left-rect.width/2)*.025))}px`);
  magnetic.style.setProperty('--magnet-y',`${Math.max(-2,Math.min(2,(event.clientY-rect.top-rect.height/2)*.025))}px`);
});
function resetMagnet(){magnetic.style.setProperty('--magnet-x','0px');magnetic.style.setProperty('--magnet-y','0px');}
listen(magnetic,'pointerleave',resetMagnet);listen(magnetic,'focus',resetMagnet);

// Photograph-based film: silent, optional and paused outside its scene.
const film=$('#food-film'),filmToggle=$('.film-toggle');
let filmVisible=false,filmManuallyPaused=false;
filmToggle.hidden=false;
function syncFilmButton(){
  const playing=!film.paused&&!film.ended;
  filmToggle.setAttribute('aria-pressed',String(playing));
  filmToggle.setAttribute('aria-label',playing?'Pausar clipe ilustrativo':'Reproduzir clipe ilustrativo');
  filmToggle.querySelector('span').textContent=playing?'Pausar':'Reproduzir';
  filmToggle.querySelector('use').setAttribute('href',playing?'#pause':'#play');
}
function autoFilm(){
  if(filmVisible&&!paused&&!reduce.matches&&!filmManuallyPaused&&!navigator.connection?.saveData&&!document.hidden){film.play().catch(syncFilmButton);}
  else film.pause();
}
let filmObserver;
if(typeof window.IntersectionObserver==='function'){
  filmObserver=new IntersectionObserver(entries=>{filmVisible=entries[0].isIntersecting;autoFilm();},{threshold:.2});
  filmObserver.observe(film);
}
listen(filmToggle,'click',()=>{
  if(film.paused){filmManuallyPaused=false;film.play().catch(()=>{filmToggle.querySelector('span').textContent='Tentar de novo';});}
  else{filmManuallyPaused=true;film.pause();}
});
listen(film,'play',syncFilmButton);listen(film,'pause',syncFilmButton);listen(film,'ended',syncFilmButton);
listen(document,'visibilitychange',()=>{if(document.hidden)film.pause();else autoFilm();});
function syncPause(){
  document.body.classList.toggle('motion-paused',paused);
  pauseButton.setAttribute('aria-pressed',String(paused));
  pauseButton.setAttribute('aria-label',paused?'Retomar animações':'Pausar animações');
  pauseButton.querySelector('.sr-only').textContent=paused?'Retomar animações':'Pausar animações';
  pauseButton.querySelector('use').setAttribute('href',paused?'#play':'#pause');
  if(paused){showAll();resetMagnet();}
  if(paused||reduce.matches)ambient.reset();else ambient.refresh();
  smoothScroll.setEnabled(!paused);
  autoFilm();
}
listen(pauseButton,'click',()=>{paused=!paused;syncPause();});
listen(reduce,'change',()=>{paused=reduce.matches;showAll();syncPause();});
syncPause();
listen(window,'pagehide',event=>{
  showAll();film.pause();
  if(!event.persisted){motionObserver?.disconnect();filmObserver?.disconnect();lifecycle.abort();}
});
