// Cloudflare Pages Functions: protect every page and static asset.
// Configure STUDYBFA_PASSWORD as an encrypted environment variable in Cloudflare Pages.
const encoder = new TextEncoder();
const COOKIE = "studybfa_access";
const MAX_AGE = 60 * 60 * 24 * 7;
const loginHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#080f1b"><title>Accès privé — StudyBFA</title><style>
:root{color-scheme:dark}*{box-sizing:border-box}html{min-height:100%}body{margin:0;min-height:100vh;min-height:100dvh;display:grid;place-items:center;overflow-x:hidden;background:radial-gradient(ellipse 65% 55% at 50% 42%,#182b40 0%,#0d1929 49%,#070e19 100%);color:#f1f0e9;font-family:"Times New Roman",Times,serif}
body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(#b8d8eb09 1px,transparent 1px),linear-gradient(90deg,#b8d8eb09 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(ellipse at center,#000 10%,transparent 75%)}
body:after{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 42%,transparent 5%,#03081166 100%)}
.shell{position:relative;z-index:1;width:min(92vw,460px);padding:35px 0;text-align:center}.crest{display:inline-grid;place-items:center;width:56px;height:56px;margin-bottom:22px;border:1px solid #b7c8d14d;border-radius:16px;background:linear-gradient(145deg,#ffffff14,#ffffff04);box-shadow:0 0 40px #9fd9ff12;color:#d4e9ee;font-size:27px;letter-spacing:-2px}
.eyebrow{font:600 10px/1.4 system-ui,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#9bb7c9;margin:0 0 15px}.panel{position:relative;overflow:hidden;text-align:left;padding:43px 42px 39px;border:1px solid #9abbd038;border-radius:22px;background:linear-gradient(145deg,#1d3043e8,#0c1929f5);box-shadow:0 24px 90px #0008,0 1px 0 #ffffff14 inset;backdrop-filter:blur(18px)}.panel:before{content:"";position:absolute;left:16%;right:16%;top:0;height:1px;background:linear-gradient(90deg,transparent,#d4e5df99,transparent)}
h1{font-size:clamp(34px,7vw,44px);font-weight:400;letter-spacing:-1px;line-height:1.08;margin:0 0 15px}.lead{font-size:17px;line-height:1.65;color:#b6c6d3;margin:0 0 31px}.line{height:1px;background:linear-gradient(90deg,#b7c6d036,transparent);margin-bottom:28px}label{display:block;margin:0 0 11px;color:#e0e9ed;font-size:15px;letter-spacing:.2px}input{display:block;width:100%;height:53px;padding:0 17px;border:1px solid #9db7c74a;border-radius:9px;background:#071321b8;color:#fff;font:19px "Times New Roman",serif;outline:none;transition:border-color .2s,box-shadow .2s}input:focus{border-color:#c1dce8;box-shadow:0 0 0 3px #95d3f11c}button{width:100%;height:53px;margin-top:17px;border:1px solid #d5e8eb70;border-radius:9px;background:linear-gradient(135deg,#d9e6e6,#a7c3d1);color:#11253a;font:600 16px "Times New Roman",serif;letter-spacing:.3px;cursor:pointer;transition:transform .2s,filter .2s}button:hover{filter:brightness(1.08);transform:translateY(-1px)}button:focus-visible{outline:3px solid #fff;outline-offset:3px}.error{color:#ffb9b9;font:14px system-ui,sans-serif;margin:15px 0 0}.footer{font:11px/1.6 system-ui,sans-serif;letter-spacing:1.5px;color:#8ba1b2;text-transform:uppercase;margin:26px 0 0}.spark{display:inline-block;width:5px;height:5px;margin:0 10px 2px;border-radius:50%;background:#a8c9d3;box-shadow:0 0 12px #a8c9d3}
@media(max-width:480px){.panel{padding:34px 26px}.shell{padding:24px 0}.crest{margin-bottom:17px}}@media(prefers-reduced-motion:reduce){button{transition:none}}
</style></head><body><main class="shell"><div class="crest" aria-hidden="true">S</div><p class="eyebrow">Espace académique privé</p><section class="panel"><h1>Bienvenue sur<br>StudyBFA<span style="color:#a7c6d1">.</span></h1><p class="lead">Un espace dédié à l'apprentissage et à la réussite. Veuillez vous identifier pour poursuivre.</p><div class="line"></div><form method="post" action="/__studybfa_login"><label for="password">Mot de passe d'accès</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Saisissez votre mot de passe" required autofocus><button type="submit">Accéder à la plateforme &nbsp;→</button></form><p class="error" id="error" role="alert" hidden>Mot de passe incorrect. Veuillez réessayer.</p></section><p class="footer">StudyBFA <span class="spark"></span> Accès réservé</p></main><script>if(new URLSearchParams(location.search).has("error"))document.getElementById("error").hidden=false;</script></body></html>`;
function b64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\\+/g,"-").replace(/\\//g,"_").replace(/=+$/,""); }
async function signature(value, secret) {
  const key = await crypto.subtle.importKey("raw",encoder.encode(secret),"HMAC",{hash:"SHA-256"},false,["sign"]);
  return b64(await crypto.subtle.sign("HMAC",key,encoder.encode(value)));
}
function equal(a,b) {
  const aa=encoder.encode(a),bb=encoder.encode(b);
  let diff=aa.length^bb.length;
  for(let i=0;i<Math.max(aa.length,bb.length);i++) diff|=(aa[i]||0)^(bb[i]||0);
  return diff===0;
}
function headers(extra={}) { return {"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow","X-Content-Type-Options":"nosniff",...extra}; }
export async function onRequest(context) {
  const {request,env,next}=context;
  const secret=env.STUDYBFA_PASSWORD;
  if(!secret) return new Response("StudyBFA access is not configured. Set STUDYBFA_PASSWORD in Cloudflare Pages environment variables.",{status:503,headers:headers()});
  const url=new URL(request.url);
  if(url.pathname==="/__studybfa_login" && request.method==="POST") {
    const form=await request.formData().catch(()=>null);
    const submitted=String(form?.get("password")||"");
    if(!equal(submitted,secret)) return Response.redirect(url.origin+"/?error=1",303);
    const expires=Math.floor(Date.now()/1000)+MAX_AGE;
    const payload=String(expires);
    const token=payload+"."+await signature(payload,secret);
    return new Response(null,{status:303,headers:headers({"Location":url.origin+"/","Set-Cookie":COOKIE+"="+token+"; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age="+MAX_AGE})});
  }
  const raw=request.headers.get("Cookie")||"";
  const cookie=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="))?.slice(COOKIE.length+1)||"";
  const parts=cookie.split(".");
  if(parts.length===2 && /^\\d+$/.test(parts[0]) && Number(parts[0])>Date.now()/1000 && equal(parts[1],await signature(parts[0],secret))) {
    const response=await next();
    const h=new Headers(response.headers);
    h.set("X-Robots-Tag","noindex, nofollow");
    h.set("Cache-Control","private, no-store");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});
  }
  if(request.method!=="GET" && request.method!=="HEAD") return new Response("Unauthorized",{status:401,headers:headers()});
  return new Response(loginHtml,{status:200,headers:headers({"Content-Type":"text/html; charset=utf-8"})});
}
