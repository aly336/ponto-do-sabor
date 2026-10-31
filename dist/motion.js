const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function ribbonRepeats(phraseWidth,viewportWidth){
  if(!Number.isFinite(phraseWidth)||phraseWidth<1||!Number.isFinite(viewportWidth)||viewportWidth<1)return 1;
  return Math.ceil(viewportWidth/phraseWidth)+1;
}
export function pointerPosition(x,y,rect){
  if(!rect.width||!rect.height)return{x:0,y:0};
  return{x:clamp((x-rect.left)/rect.width*2-1,-1,1),y:clamp((y-rect.top)/rect.height*2-1,-1,1)};
}
export function sceneProgress(position,start,end){
  return end>start?clamp((position-start)/(end-start),0,1):0;
}
export function heroPointerPose(point){
  const x=clamp(point.x,-1,1),y=clamp(point.y,-1,1);
  return{x:x*3,y:y*2,rotateX:-y*.25,rotateY:x*.35};
}

// Two equal groups, each wider than the viewport, prevent a blank tail at the
// end of the loop. Recompute after local fonts load and the viewport changes.
export function createRibbonLoop(root,{signal}={}){
  const viewport=root.querySelector('.ribbon-window');
  const track=root.querySelector('.ribbon-track');
  const phrase=root.querySelector('.ribbon-phrase').cloneNode(true);
  let frame=0,last='';
  function rebuild(){
    frame=0;
    const first=track.firstElementChild;
    const sample=first?.querySelector('.ribbon-phrase');
    const phraseWidth=sample?.getBoundingClientRect().width||0;
    const width=viewport.clientWidth;
    if(!phraseWidth||!width)return;
    const count=ribbonRepeats(phraseWidth,width),key=`${width}:${phraseWidth}:${count}`;
    if(last===key)return;last=key;
    const group=document.createElement('div');group.className='ribbon-group';
    for(let index=0;index<count;index++){
      const copy=phrase.cloneNode(true);
      if(index>0)copy.setAttribute('aria-hidden','true');
      group.append(copy);
    }
    const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');
    track.replaceChildren(group,duplicate);
    track.style.setProperty('--ribbon-duration',`${Math.max(18,count*phraseWidth/62)}s`);
    root.classList.add('ribbon-ready');
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(rebuild);};
  let observer;
  if(typeof ResizeObserver==='function'){observer=new ResizeObserver(schedule);observer.observe(viewport);}
  else window.addEventListener('resize',schedule,{passive:true,signal});
  document.fonts?.ready.then(()=>{if(!signal?.aborted)schedule();});
  schedule();
  signal?.addEventListener('abort',()=>{observer?.disconnect();cancelAnimationFrame(frame);},{once:true});
  return {refresh:schedule};
}

// Read geometry on resize/content change; animation frames write transforms
// only. Pointer travel is intentionally limited to 3px and 0.35 degrees.
export function createAmbientMotion({root,isPaused,reduce,fine,signal}){
  const background=root.querySelector('.hero-kitchen-layer');
  const food=root.querySelector('.parallax-layer');
  const table=root.querySelector('.hero-table');
  const title=root.querySelector('.hero-title');
  const slogan=root.querySelector('.hero-message');
  const photos=[...document.querySelectorAll('.photo-drift')];
  const story=document.querySelector('.story-section');
  const storyPhoto=story.querySelector('.story-drift');
  const beats=[...story.querySelectorAll('.story-beat')];
  const meter=story.querySelector('.story-meter-fill');
  const filmStage=document.querySelector('.film-stage');
  const filmMedia=document.querySelector('.film-media');
  const visit=document.querySelector('.visit-section');
  const visitPoster=document.querySelector('.visit-poster-drift');
  const footer=document.querySelector('.footer');
  const footerName=document.querySelector('.footer-name');
  const moving=[background,food,table,title,slogan,...photos,storyPhoto,filmMedia,visitPoster,footerName];
  let geometry,geometryDirty=true,frame=0,lastTime=0;
  let target={x:0,y:0},current={x:0,y:0},velocity={x:0,y:0};
  const measure=()=>{
    const sy=window.scrollY;
    const rect=root.getBoundingClientRect();
    const sr=story.getBoundingClientRect();
    const bounds=el=>{const r=el.getBoundingClientRect();return{y:r.top+sy,height:r.height};};
    geometry={hero:{left:rect.left,y:rect.top+sy,width:rect.width,height:rect.height},story:{y:sr.top+sy,height:sr.height},film:bounds(filmStage),visit:bounds(visit),footer:bounds(footer),photos:photos.map(el=>{const r=el.parentElement.getBoundingClientRect();return{el,y:r.top+sy,height:r.height};}),beats:beats.map(el=>{const r=el.getBoundingClientRect();return{el,y:r.top+sy,height:r.height};})};
    geometryDirty=false;
  };
  function reset(){
    cancelAnimationFrame(frame);frame=0;lastTime=0;
    target={x:0,y:0};current={x:0,y:0};velocity={x:0,y:0};
    moving.forEach(el=>el?.style.removeProperty('transform'));
  }
  function draw(now){
    frame=0;
    if(isPaused()||reduce.matches||document.hidden){reset();return;}
    if(geometryDirty||!geometry)measure();
    const sy=window.scrollY,vh=innerHeight,h=geometry.hero;
    const heroVisible=sy<h.y+h.height&&sy+vh>h.y;
    if(!heroVisible||!fine.matches){target={x:0,y:0};}
    const dt=Math.min(.032,Math.max(.001,(now-(lastTime||now-16.67))/1000));lastTime=now;
    for(const axis of ['x','y']){
      velocity[axis]+=((target[axis]-current[axis])*100-velocity[axis]*10)*dt;
      current[axis]=clamp(current[axis]+velocity[axis]*dt,-1.12,1.12);
    }
    const {x,y}=current;
    const progress=sceneProgress(sy,h.y,h.y+h.height);
    if(heroVisible){
      const pose=heroPointerPose({x,y});
      background.style.transform=`translate3d(0,${progress*12}px,0) scale(1.035)`;
      food.style.transform=`translate3d(0,${-progress*16}px,0)`;
      table.style.transform=`perspective(1200px) translate3d(${pose.x}px,${pose.y}px,0) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg)`;
      title.style.removeProperty('transform');slogan.style.removeProperty('transform');
    }
    for(const item of geometry.photos){
      if(item.y<sy+vh+80&&item.y+item.height>sy-80){
        const p=sceneProgress(sy+vh,item.y,item.y+item.height+vh);
        item.el.style.transform=`translate3d(0,${(p-.5)*36}px,0) scale(1.085)`;
      }
    }
    const fp=sceneProgress(sy+vh,geometry.film.y,geometry.film.y+geometry.film.height+vh);
    if(geometry.film.y<sy+vh&&geometry.film.y+geometry.film.height>sy)filmMedia.style.transform=`translate3d(0,${(fp-.5)*24}px,0)`;
    const vp=sceneProgress(sy+vh,geometry.visit.y,geometry.visit.y+geometry.visit.height+vh);
    if(geometry.visit.y<sy+vh&&geometry.visit.y+geometry.visit.height>sy){
      if(visitPoster.matches(':hover,:focus-within'))visitPoster.style.removeProperty('transform');
      else visitPoster.style.transform=`translate3d(0,${(.5-vp)*32}px,0) rotate(${(.5-vp)*3}deg)`;
    }
    const end=sceneProgress(sy+vh,geometry.footer.y,geometry.footer.y+geometry.footer.height);
    if(end>0)footerName.style.transform=`translate3d(0,${(1-end)*32}px,0)`;
    const s=geometry.story;
    const sp=sceneProgress(sy+vh*.35,s.y,s.y+s.height-vh*.25);
    if(s.y<sy+vh&&s.y+s.height>sy){
      storyPhoto.style.transform=`translate3d(0,${(sp-.5)*28}px,0) scale(1.055) rotate(${(sp-.5)*1.2}deg)`;
      meter.style.transform=`scaleX(${sp})`;
      let active=0;
      geometry.beats.forEach((beat,index)=>{if(sy+vh*.55>=beat.y)active=index;});
      beats.forEach((beat,index)=>beat.classList.toggle('is-current',index===active));
    }
    const unsettled=Math.abs(target.x-current.x)+Math.abs(target.y-current.y)+Math.abs(velocity.x)+Math.abs(velocity.y)>.008;
    if(unsettled&&heroVisible&&fine.matches)frame=requestAnimationFrame(draw);else lastTime=0;
  }
  const schedule=()=>{if(!frame&&!signal?.aborted)frame=requestAnimationFrame(draw);};
  const refresh=()=>{geometryDirty=true;schedule();};
  root.addEventListener('pointermove',event=>{
    if(!fine.matches||reduce.matches||isPaused()||event.pointerType!=='mouse')return;
    if(!geometry)measure();
    const h=geometry.hero;
    target=pointerPosition(event.clientX,event.clientY,{left:h.left,top:h.y-window.scrollY,width:h.width,height:h.height});
    schedule();
  },{passive:true,signal});
  root.addEventListener('pointerleave',()=>{target={x:0,y:0};schedule();},{passive:true,signal});
  root.addEventListener('focusin',()=>{reset();refresh();},{signal});
  window.addEventListener('scroll',schedule,{passive:true,signal});
  window.addEventListener('resize',refresh,{passive:true,signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();else refresh();},{signal});
  fine.addEventListener('change',()=>{reset();refresh();},{signal});
  let observer;
  if(typeof ResizeObserver==='function'){observer=new ResizeObserver(refresh);observer.observe(document.querySelector('main'));}
  document.fonts?.ready.then(()=>{if(!signal?.aborted)refresh();});
  signal?.addEventListener('abort',()=>{reset();observer?.disconnect();},{once:true});
  refresh();
  return {refresh,reset};
}
