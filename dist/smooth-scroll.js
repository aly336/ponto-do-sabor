// Local Lenis 1.3.27. Native document scrolling remains the source of truth.
export const SCROLL_SETTINGS = Object.freeze({
  lerp: .1,
  wheelMultiplier: 1,
  nativeResumeDelay: 220,
  preventSelector: '[data-native-scroll], dialog, [role="dialog"], input, textarea, select, [contenteditable="true"]'
});

const registry = Symbol.for('ponto-do-sabor.smooth-scroll');
const isInstance = value => typeof value?.scrollTo === 'function' && typeof value?.raf === 'function';

export function initSmoothScroll({signal} = {}) {
  if(window[registry])return window[registry];
  const lifetime = new AbortController();
  const on = (target,type,fn,options={}) => target.addEventListener(type,fn,{...options,signal:lifetime.signal});
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let instance = null, owned = false, enabled = true, disposed = false;
  let LenisConstructor, resumeTimer = 0, nativePending = false;
  const borrowed = isInstance(window.lenis) ? window.lenis : null;
  const borrowedOptions = borrowed ? {...borrowed.options} : null;
  let pointerFocus = false;
  const root = document.documentElement;

  function drop() {
    if(instance && owned)instance.destroy();
    else if(instance){instance.options.smoothWheel=false;instance.options.syncTouch=false;instance.scrollTo(window.scrollY,{immediate:true,force:true});}
    instance = null;owned = false;
    root.dataset.smoothScroll = 'native';
  }
  function eligible() {
    return enabled && !disposed && !reduce.matches && fine.matches && !document.hidden &&
      typeof ResizeObserver === 'function' && !document.querySelector('dialog[open]') &&
      ![...document.querySelectorAll('[aria-modal="true"]')].some(el=>!el.hidden && getComputedStyle(el).display!=='none' && getComputedStyle(el).visibility!=='hidden') &&
      !['hidden','clip'].includes(getComputedStyle(root).overflowY) &&
      !['hidden','clip'].includes(getComputedStyle(document.body).overflowY);
  }
  function update() {
    if(disposed)return;
    if(!eligible() || nativePending){drop();return;}
    if(instance || !LenisConstructor)return;
    if(borrowed){
      instance=borrowed;owned=false;
      Object.assign(instance.options,{smoothWheel:true,syncTouch:false,anchors:false,lerp:SCROLL_SETTINGS.lerp,respectReducedMotion:true,allowNestedScroll:true});
    }
    else {
      instance = new LenisConstructor({
        wrapper: window,
        content: document.documentElement,
        autoRaf: true,
        autoResize: true,
        smoothWheel: true,
        syncTouch: false,
        lerp: SCROLL_SETTINGS.lerp,
        wheelMultiplier: SCROLL_SETTINGS.wheelMultiplier,
        anchors: false, // below: preserve hash, history, keyboard and focus
        allowNestedScroll: true,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
        prevent: node => node.matches?.(SCROLL_SETTINGS.preventSelector) || false
      });
      owned = true;
    }
    root.dataset.smoothScroll = 'lenis';
  }
  function resumeLater() {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(()=>{nativePending=false;update();},SCROLL_SETTINGS.nativeResumeDelay);
  }
  // Destroying our instance cancels inertia without writing a new position.
  // The browser can finish keyboard, focus, touch, history or API scrolling.
  function handoffNative() {
    if(disposed)return;
    if(instance && !owned)instance.scrollTo(window.scrollY,{immediate:true});
    drop();nativePending=true;resumeLater();
  }
  function focusDestination(target) {
    if(!target.isConnected)return;
    const temporary = !target.hasAttribute('tabindex');
    if(temporary)target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    if(temporary)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true,signal:lifetime.signal});
  }
  on(document,'click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    const anchor = event.target.closest?.('a[href]');
    if(!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target!=='_self'))return;
    const url = new URL(anchor.href,location.href);
    if(url.origin!==location.origin || url.pathname!==location.pathname || url.search!==location.search || !url.hash)return;
    let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
    const target=document.getElementById(id);if(!target)return;
    if(!instance || event.detail===0){handoffNative();return;}
    event.preventDefault();
    if(location.hash!==url.hash)history.pushState(history.state,'',url.hash);
    const active=instance;
    active.scrollTo(target,{onComplete:()=>{if(instance===active)focusDestination(target);}});
  });
  on(document,'pointerdown',()=>{pointerFocus=true;},{capture:true});
  on(document,'pointerup',()=>{pointerFocus=false;},{capture:true});
  on(document,'pointercancel',()=>{pointerFocus=false;},{capture:true});
  on(document,'keydown',event=>{
    pointerFocus=false;
    if(['Tab','ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))handoffNative();
  },{capture:true});
  on(document,'focusin',event=>{
    const anchor=event.target.closest?.('a[href]');
    if(pointerFocus && anchor && instance){
      const url=new URL(anchor.href,location.href);
      if(url.origin===location.origin && url.pathname===location.pathname && url.search===location.search && url.hash){
        instance.scrollTo(window.scrollY,{immediate:true});return;
      }
    }
    handoffNative();
  },{capture:true});
  on(window,'touchstart',handoffNative,{passive:true});
  on(window,'popstate',handoffNative);
  on(window,'hashchange',handoffNative);
  on(window,'scroll',event=>{
    if(event.target!==document && event.target!==window)return;
    if(instance?.isScrolling==='smooth' && Math.abs(window.scrollY-instance.animatedScroll)>2)handoffNative();
    else if(nativePending)resumeLater();
  },{passive:true,capture:true});

  // Cancel our inertia before a native API starts its own animation. Waiting
  // for a scroll event is too late: Lenis could write in the same frame and
  // cancel the browser's smooth scroll. Restore every bridge on teardown.
  const bridges=[];
  function bridge(owner,key,handler){
    const descriptor=Object.getOwnPropertyDescriptor(owner,key);
    const original=owner[key];
    const wrapped=function(...args){handler(args);return Reflect.apply(original,this,args);};
    owner[key]=wrapped;
    bridges.push(()=>{if(owner[key]===wrapped){if(descriptor)Object.defineProperty(owner,key,descriptor);else delete owner[key];}});
  }
  function externalWindowScroll(args){
    if(!instance)return;
    const options=args[0];
    const ownWrite=options && typeof options==='object' && options.behavior==='instant' &&
      Math.abs(Number(options.top)-instance.animatedScroll)<.01;
    if(!ownWrite)handoffNative();
  }
  bridge(window,'scrollTo',externalWindowScroll);
  bridge(window,'scroll',externalWindowScroll);
  bridge(window,'scrollBy',()=>{if(instance)handoffNative();});
  bridge(Element.prototype,'scrollIntoView',()=>{if(instance)handoffNative();});
  on(reduce,'change',update);on(fine,'change',update);
  on(document,'visibilitychange',()=>{if(document.hidden){clearTimeout(resumeTimer);drop();}else{nativePending=false;update();}});
  on(window,'pagehide',()=>{clearTimeout(resumeTimer);drop();});
  on(window,'pageshow',()=>{nativePending=false;update();});

  // Observe modal/open and root overflow changes, never animated descendants'
  // style attributes. Nested content itself is handled by Lenis.
  let overflowObserver, dialogObserver, treeObserver;
  const watched=new WeakSet();
  function watchDialogs() {
    document.querySelectorAll('dialog, [role="dialog"], [aria-modal]').forEach(dialog=>{
      if(watched.has(dialog))return;watched.add(dialog);
      dialogObserver.observe(dialog,{attributes:true,attributeFilter:['open','aria-modal','hidden','style','class']});
    });
    update();
  }
  if(typeof MutationObserver==='function'){
    overflowObserver=new MutationObserver(update);
    overflowObserver.observe(root,{attributes:true,attributeFilter:['style','class']});
    overflowObserver.observe(document.body,{attributes:true,attributeFilter:['style','class']});
    dialogObserver=new MutationObserver(watchDialogs);
    dialogObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['open','aria-modal','role','hidden']});
    treeObserver=new MutationObserver(watchDialogs);
    treeObserver.observe(document.body,{childList:true,subtree:true});
    watchDialogs();
  }
  const controller={
    get instance(){return instance;},
    get disposed(){return disposed;},
    setEnabled(value){enabled=!!value;if(!enabled){clearTimeout(resumeTimer);nativePending=false;}update();},
    destroy(){
      if(disposed)return;disposed=true;clearTimeout(resumeTimer);drop();
      overflowObserver?.disconnect();dialogObserver?.disconnect();treeObserver?.disconnect();
      bridges.reverse().forEach(restore=>restore());
      if(borrowed)Object.assign(borrowed.options,borrowedOptions);
      lifetime.abort();delete window[registry];
    },
    ready:null
  };
  window[registry]=controller;
  if(signal?.aborted){controller.destroy();controller.ready=Promise.resolve(controller);return controller;}
  signal?.addEventListener('abort',()=>controller.destroy(),{once:true});
  controller.ready=import('./vendor/lenis.mjs').then(module=>{
    LenisConstructor=module.default;update();return controller;
  }).catch(()=>{root.dataset.smoothScroll='native';return controller;});
  return controller;
}
