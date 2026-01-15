/* PATCH: lock scroll fuerte cuando se abre el cuadro .details */
(function(){
  let _lockY=0;
  function lockBody(){
    if(document.body.classList.contains('no-scroll')) return;
    _lockY = window.scrollY || 0;
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    document.body.style.top = (-_lockY)+'px';
  }
  function unlockBody(){
    if(!document.body.classList.contains('no-scroll')) return;
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
    const y = -parseInt(document.body.style.top||'0',10) || 0;
    document.body.style.top='';
    window.scrollTo(0,_lockY||y||0);
  }
  document.addEventListener('click', (e)=>{
    if(e.target.closest('.card')){
      setTimeout(()=>{ if(document.querySelector('.card.open')) lockBody(); },0);
    }
    if(e.target.closest('.details-close')){
      setTimeout(()=>{ if(!document.querySelector('.card.open')) unlockBody(); },0);
    }
  }, true);
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape'){
      setTimeout(()=>{ if(!document.querySelector('.card.open')) unlockBody(); },0);
    }
  }, true);
  const mo=new MutationObserver(()=>{ if(!document.querySelector('.card.open')) unlockBody(); });
  mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
})();