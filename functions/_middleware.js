// Cloudflare Pages Functions: protect every page and static asset.
// Configure STUDYBFA_PASSWORD as an encrypted environment variable in Cloudflare Pages.
const encoder = new TextEncoder();
const COOKIE = "studybfa_access";
const MAX_AGE = 60 * 60 * 24 * 7;
const loginHtml = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Accès privé — StudyBFA</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#eef4f8;color:#142d45;font:16px system-ui,sans-serif}.panel{width:min(92vw,390px);background:white;padding:38px;border-radius:18px;box-shadow:0 16px 50px #183d5c1a}h1{font-size:25px;margin:0 0 8px}p{color:#657589;line-height:1.5}label{display:block;margin:24px 0 8px;font-weight:600}input,button{width:100%;padding:13px;border-radius:9px;font:inherit}input{border:1px solid #c7d4df}button{margin-top:15px;border:0;background:#1768a3;color:white;font-weight:700;cursor:pointer}.error{color:#a52b2b}</style></head><body><main class="panel"><h1>StudyBFA</h1><p>Cette plateforme est actuellement privée. Saisissez le mot de passe pour continuer.</p><form method="post" action="/__studybfa_login"><label for="password">Mot de passe</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">Accéder à la plateforme</button></form><p class="error" id="error" hidden>Mot de passe incorrect.</p></main><script>if(new URLSearchParams(location.search).has("error"))document.getElementById("error").hidden=false;</script></body></html>`;
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
