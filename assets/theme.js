(function(){
  var key='studybfa-theme';
  function preferred(){try{var v=localStorage.getItem(key);if(v==='dark'||v==='light')return v;}catch(e){}return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  function set(t){document.documentElement.setAttribute('data-theme',t);document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.textContent=t==='dark'?'☀ Mode clair':'☾ Mode sombre';b.setAttribute('aria-label',t==='dark'?'Activer le mode clair':'Activer le mode sombre');b.setAttribute('aria-pressed',String(t==='dark'));});}
  set(preferred());
  document.addEventListener('DOMContentLoaded',function(){set(document.documentElement.getAttribute('data-theme'));document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){var t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';set(t);try{localStorage.setItem(key,t);}catch(e){}});});});
})();