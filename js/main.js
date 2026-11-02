(function(){
'use strict';
var D=window.CA_DATA,$=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var body=document.body,root=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
var mob=innerWidth<820;
var X=mob?0.34:1;           // horizontal spread
var MS=mob?0.5:1;           // mobile content scale
var PERSP=mob?760:1000;
if(reduce) root.classList.add('flat');
$('#stage').style.perspective=PERSP+'px';
var ID=D.identity,S={};D.sections.forEach(function(s){S[s.order]=s;});
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function pad(n){return (n<10?'0':'')+n;}

/* camera path: one continuous curved flight (x/y offsets as a function of depth) */
function pathX(d){return (Math.sin(d/8200)*520+Math.sin(d/3100+1.3)*180)*(mob?.25:1);}
function pathY(d){return Math.sin(d/6400+.6)*90*(mob?.4:1);}

var world=$('#world'),cam=$('#cam'),items=[];
function add(html,o){
  var el=document.createElement('div');el.className='it'+(o.cls?' '+o.cls:'');
  el.innerHTML='<div class="c">'+html+'</div>';world.appendChild(el);
  var free=o.fx===0;
  var it={el:el,z0:o.z,x:(o.x||0)*(free?1:X),y:(o.y||0)*(mob&&!free?.7:1),z:Zc(o.z),rx:o.rx||0,ry:(o.ry||0)*(mob?.4:1),rz:o.rz||0,
    s:(o.s||1)*(free?1:MS),par:o.par||0,nv:o.nv!=null?o.nv:null,nf:o.nf||0,far:o.far||(mob?3000:5000),sec:o.sec||0,nofog:o.nofog||0};
  if(o.ms!=null&&mob) it.s=o.ms;
  var pz=o.pathAt!=null?Zc(o.pathAt):it.z;it.px=pathX(-pz);it.py=pathY(-pz);
  it.op=/\bop\b/.test(el.className);it.deco=/\bdeco\b/.test(el.className);
  items.push(it);return it;
}
var seed=7;function sr(){seed=(seed*16807)%2147483647;return seed/2147483647}

/* ---------- shared components ---------- */
function shot(im,w,o){o=o||{};
  var cap=im.id+' · '+(im.platform||'')+' · '+im.name;
  return '<button class="shot'+(o.cls?' '+o.cls:'')+'" type="button" style="width:'+w+'px" data-src="assets/img/'+im.file+'.jpg" data-cap="'+esc(cap)+'" data-wide="'+(im.width>im.height*1.2?1:0)+'" aria-label="查看原图：'+esc(im.name)+'">'+
    '<span class="frame"><img src="assets/thumb/'+im.file+'.jpg" alt="'+esc(im.alt||im.name)+'" loading="lazy" decoding="async" width="'+w+'" height="'+Math.round(w*im.height/im.width)+'"></span>'+
    (o.nolab?'':'<span class="lab"><span class="mono"><b>'+im.id+'</b> '+esc(im.platform||'')+'</span><span class="nm">'+esc(im.name)+'</span></span>')+'</button>';
}
function head(s,o){o=o||{};
  return '<header class="sh'+(o.right?' r':'')+'"><div class="sh-top mono"><span class="sh-n">'+pad(s.order)+'</span><span>'+esc(s.titleEn)+'</span><span class="sh-g">'+esc(s.group)+'</span></div>'+
    '<h3>'+esc(s.title)+'</h3><p>'+esc(s.description)+'</p><div class="sh-st mono">'+esc(s.status)+'</div></header>';
}
function gate(n,roman,title,secs,o){
  return '<div class="gate"><div class="g-k mono">ACT '+roman+' &nbsp;·&nbsp; '+secs.map(function(k){return pad(k)}).join(' — ')+'</div>'+
    '<div class="g-t"><b>'+title.charAt(0)+'</b>'+title.slice(1)+'</div>'+
    '<ol class="g-i">'+secs.map(function(k){return '<li><span class="mono">'+pad(k)+'</span>'+esc(S[k].title)+'</li>'}).join('')+'</ol></div>';
}
var SEC_AT=[];   // [depth, sectionOrder]
var ZC=.72;function Zc(z){return z>-1500?z:-1500+(z+1500)*ZC;}
function mark(d,k){SEC_AT.push([-Zc(-d),k]);}

/* ---------- OPENING ---------- */
add('<div class="o-en">CHEN AN</div>',{z:-1500,y:-30,far:9000,cls:'dd op',ms:.42});
add('<div class="o-kick mono">'+esc(ID.name)+' · PORTFOLIO · '+esc(ID.year)+'</div>',{z:-1100,y:-300,far:9000,cls:'op',ms:.8});
add('<div class="o-title"><div class="o-sub">'+esc(ID.title.split('\n')[0])+' · '+esc(ID.title.split('\n')[1])+'</div><div class="o-desc">'+esc(ID.subtitle)+'</div></div>',{z:-300,y:mob?230:270,far:9000,ms:.6,cls:'op'});
add('<div class="o-year mono">'+esc(ID.year)+'</div>',{z:120,x:-560,y:-250,far:9000,cls:'dd op'});
add('<div class="o-year mono">12 栏 · 34 张原图</div>',{z:60,x:540,y:270,far:9000,cls:'dd op',s:.6});

/* ---------- ambient decor: sparse embers + far act numerals ---------- */
for(var q=0;q<16;q++){var qs=4+sr()*10;
  add('<i class="mote" style="width:'+qs+'px;height:'+qs+'px"></i>',{x:(sr()-.5)*1800,y:(sr()-.5)*1100,z:300-sr()*2600,fx:0,far:9000,cls:'deco dd'});}
for(var i=0;i<20;i++){var z=-3000-i*3200-sr()*900,sz=50+sr()*170;
  add('<div class="bokeh'+(sr()>.55?' w':'')+'" style="width:'+sz+'px;height:'+sz+'px"></div>',{x:(sr()-.5)*2800,y:(sr()-.5)*1500,z:z,fx:0,cls:'deco dd'});}

/* ================= ACT I · 定位 ================= */
var A1=2400;
add('<div class="numeral">I</div>',{z:-A1-1400,pathAt:-A1,y:-20,cls:'dd num',par:0,s:2,ms:1,far:8500,nofog:1,nv:-300,nf:900});
add(gate(1,'I','定位',[1,2]),{nofog:1,nv:-250,nf:650,z:-A1,far:3600,ms:.55});
mark(0,0);mark(1500,1);

// 01 · phones in a gentle corridor, alternating, facing the path
var s1=S[1],z1=-4100;
add(head(s1),{far:2200,nv:60,nf:760,z:z1-500,x:-700,y:-60,ry:16,ms:.62});
s1.images.forEach(function(im,i){var side=i%2?1:-1;
  add('<div class="phone-w">'+shot(im,300,{cls:'phone'})+'<div class="ph-meta mono"><span>'+im.id+'</span><span>'+esc(im.platform)+'</span></div></div>',
    {z:z1-800-i*640,x:side*(330+(i%3)*60),y:(i%3-1)*40,ry:-side*22,ms:.62});
});
add('<div class="rule-v"></div>',{z:z1-600,x:0,y:420,fx:0,cls:'deco dd'});

// 02 · audience: specimen prints + big figures
var s2=S[2],z2=-10800;mark(9800,2);
add(head(s2,{right:1}),{nv:60,nf:760,z:z2,x:300,y:-20,ry:-14,ms:.62});
var H=s2.highlights||[];
function fig(h,big){var v=h.value,m=v.match(/^([^\d]*?)\s*([\d.–]+)(.*)$/);
  return '<div class="fig'+(big?' big':'')+'"><div class="fig-k mono">'+esc(h.label)+'</div>'+
    (m&&m[2]?'<div class="fig-v">'+(m[1]?'<span class="pre">'+esc(m[1])+'</span>':'')+esc(m[2])+'<span class="u">'+esc(m[3])+'</span></div>':'<div class="fig-v word">'+esc(v)+'</div>')+
    '<div class="fig-n">'+esc(h.detail)+'</div></div>';}
add(shot(s2.images[0],780),{z:z2-1500,x:-300,y:-10,ry:12,rz:-1,ms:.42});
add(fig(H[0]),{z:z2-1050,x:420,y:-190,ms:.4});
add(fig(H[1]),{z:z2-1250,x:400,y:150,ms:.4});
add(shot(s2.images[1],460,{cls:'tall'}),{z:z2-3200,x:330,y:30,ry:-14,rz:1,ms:.5});
add(fig(H[2],1),{z:z2-2750,x:-380,y:-20,ms:.4});
add(shot(s2.images[2],960),{z:z2-4700,x:-120,y:-90,ry:8,ms:.36});
add(fig(H[3]),{z:z2-4250,x:280,y:220,ms:.4});

/* ================= ACT II · 研究 ================= */
var A2=18600;mark(A2-1700,0.2);
add('<div class="numeral">II</div>',{z:-A2-1500,pathAt:-A2,y:-20,cls:'dd num',par:0,s:2,ms:1,far:8500,nofog:1,nv:-300,nf:900});
add(gate(2,'II','研究',[3,4,5]),{nofog:1,nv:-250,nf:650,z:-A2,far:3600,ms:.55});

// evidence wall A (03 + 04): two tables pinned on a dark board, red thread between pins
var zA=-21600;mark(20200,3);
var w3=S[3].images[0],w4=S[4].images[0];
add(head(S[3]),{far:2200,nv:60,nf:760,z:zA+700,x:-640,y:-260,ry:18,ms:.55});
add('<div class="wall" style="width:2300px;height:1350px">'+
  '<div class="w-grid"></div>'+
  '<svg class="thread" viewBox="0 0 2300 1350" preserveAspectRatio="none"><path d="M560 92 C 900 260, 1200 560, 1540 668"/><path d="M1540 668 C 1700 900, 1500 1100, 1180 1210"/><circle cx="560" cy="92" r="9"/><circle cx="1540" cy="668" r="9"/><circle cx="1180" cy="1210" r="6"/></svg>'+
  '<div class="pin" style="left:80px;top:80px;transform:rotate(-1.6deg)">'+shot(w3,1000)+'</div>'+
  '<div class="pin" style="left:1040px;top:650px;transform:rotate(1.2deg)">'+shot(w4,1000)+'</div>'+
  '<div class="w-tag mono" style="left:1160px;top:1200px">'+pad(3)+' → '+pad(4)+'</div>'+
  '</div>',{z:zA-900,x:120,y:20,s:2.857,ms:.857,nofog:1,far:4800,nv:-650,nf:260});
add(head(S[4]),{nv:60,nf:760,z:zA-500,x:-820,y:300,ry:20,ms:.55});mark(22400,4);

// evidence wall B (05): four breakdown sheets as a dossier, threaded 01→04
var zB=-26600,s5=S[5];mark(24800,5);
add(head(s5),{nv:60,nf:760,z:zB+600,x:780,y:-250,ry:-18,ms:.55,cls:'r'});
var pos=[[60,60,-2],[1180,20,1.5],[120,800,1],[1220,760,-1.2]];
add('<div class="wall dossier" style="width:2300px;height:1600px"><div class="w-grid"></div>'+
  '<svg class="thread" viewBox="0 0 2300 1600" preserveAspectRatio="none"><path d="M540 70 C 800 30, 1300 10, 1660 30"/><path d="M1660 30 C 1500 400, 900 600, 600 810"/><path d="M600 810 C 900 900, 1400 700, 1700 770"/>'+
  pos.map(function(p,i){return '<circle cx="'+(p[0]+480)+'" cy="'+(p[1]+10)+'" r="9"/>'}).join('')+'</svg>'+
  s5.images.map(function(im,i){var p=pos[i];return '<div class="pin" style="left:'+p[0]+'px;top:'+p[1]+'px;transform:rotate('+p[2]+'deg)"><span class="pin-no mono">'+pad(i+1)+'</span>'+shot(im,960)+'</div>'}).join('')+
  '</div>',{z:zB-1100,x:-300,y:10,s:2.857,ms:.857,nofog:1,far:5000,nv:-650,nf:260});

/* ================= ACT III · 创作 ================= */
var A3=29900;mark(A3-1700,0.3);
add('<div class="numeral">III</div>',{z:-A3-1500,pathAt:-A3,y:-20,cls:'dd num',par:0,s:2,ms:1,far:8500,nofog:1,nv:-300,nf:900});
add(gate(3,'III','创作',[6,7,8]),{nofog:1,nv:-250,nf:650,z:-A3,far:3600,ms:.55});

// 06 · film strip of four works, laid diagonally into depth
var s6=S[6],z6=-32700;mark(31400,6);
add(head(s6),{far:2200,nv:60,nf:760,z:z6-200,x:-720,y:-250,ry:20,ms:.55});
var FW=360,ang=32,ca=Math.cos(ang*Math.PI/180),sa=Math.sin(ang*Math.PI/180);
var LB={likes:'点赞',comments:'评论',saves:'收藏',shares:'分享'};
s6.images.forEach(function(im,i){
  var m=im.metrics||{};
  add('<div class="film"><div class="sprock"></div>'+shot(im,FW-40,{cls:'cell',nolab:1})+'<div class="sprock"></div>'+
      '<div class="f-cap"><div class="mono f-no">'+im.id+' · '+esc(im.publishedAt||'')+'</div><div class="f-t">'+esc(im.name)+'</div>'+
      '<dl>'+['likes','comments','saves','shares'].map(function(k){return m[k]?'<div><dt class="mono">'+LB[k]+'</dt><dd>'+esc(m[k])+'</dd></div>':''}).join('')+'</dl></div></div>',
    {z:z6-900-i*FW*sa*1.02,x:-60+i*FW*ca*1.02,y:-10,ry:-ang,ms:.62,far:4600,nv:-250,nf:450});
});
var hero=s6.images[0];
add('<div class="hero-m"><div class="mono">'+LB.likes+' · '+esc(hero.shortName||hero.name)+'</div><b>'+esc(hero.metrics.likes)+'</b></div>',{z:z6-2300,x:-520,y:200,ry:14,ms:.5});

// 07 · light table: the long analysis sheet over a glowing table, case index alongside
var s7=S[7],z7=-37300;mark(36100,7);
add('<div class="table-glow"></div>',{z:z7-1100,x:-200,y:520,rx:84,fx:0,s:mob?3:8,cls:'dd',far:5200});
add(head(s7,{right:1}),{nv:60,nf:760,z:z7+200,x:560,y:-240,ry:-18,ms:.55});
add(shot(s7.images[0],1000,{cls:'sheet'}),{z:z7-1100,x:-260,y:80,rx:-8,ry:6,ms:.3,far:3000});
add('<ol class="cases">'+(s7.caseTitles||[]).map(function(t,i){return '<li><span class="mono">CASE '+pad(i+1)+'</span>'+esc(t)+'</li>'}).join('')+'</ol>',{z:z7-500,x:760,y:160,ry:-16,ms:.45});

// 08 · asset library: three transparencies fanned on the table
var s8=S[8],z8=-43000;mark(41600,8);
add(head(s8),{nv:60,nf:760,z:z8+300,x:-600,y:-220,ry:18,ms:.55});
s8.images.forEach(function(im,i){
  add(shot(im,760,{cls:'slide'}),{z:z8-800-i*380,x:(i-1)*330,y:60+(i-1)*-30,rz:(i-1)*5,ry:(1-i)*6,ms:.4});
});

/* ================= ACT IV · 沉淀 ================= */
var A4=47600;mark(A4-1700,0.4);
add('<div class="numeral">IV</div>',{z:-A4-1500,pathAt:-A4,y:-20,cls:'dd num',par:0,s:2,ms:1,far:8500,nofog:1,nv:-300,nf:900});
add(gate(4,'IV','沉淀',[9,10,11,12]),{nofog:1,nv:-250,nf:650,z:-A4,far:3600,ms:.55});

// 09 · timeline: a long axis line threading through, the timeline print on it
var s9=S[9],z9=-50200;mark(48900,9);
add('<div class="axis"></div>',{z:z9-700,y:330,fx:0,cls:'dd',far:5000});
add(head(s9),{far:2200,nv:60,nf:760,z:z9+200,x:-560,y:-230,ry:18,ms:.55});
add(shot(s9.images[0],1100),{z:z9-900,x:80,y:20,ry:-6,ms:.32});

// 10 · methods: archive stack of three sheets, receding like drawer files
var s10=S[10],z10=-54200;mark(52800,10);
add(head(s10,{right:1}),{nv:60,nf:760,z:z10+200,x:600,y:-230,ry:-18,ms:.55});
s10.images.forEach(function(im,i){
  add('<div class="file"><span class="tab mono">'+esc(im.platform)+'</span>'+shot(im,820)+'</div>',{z:z10-800-i*520,x:-220+i*90,y:20-i*40,ry:10,rz:-1+i*.6,ms:.4});
});

// 11 · knowledge constellation
var s11=S[11],z11=-58600;mark(57000,11);
add(head(s11),{nv:60,nf:760,z:z11+300,x:-640,y:-220,ry:18,ms:.55});
add('<svg class="const" viewBox="0 0 1800 1000"><path d="M300 300 L900 180 L1500 420 L1100 800 L520 760 Z M900 180 L1100 800 M300 300 L1100 800"/>'+
  [[300,300],[900,180],[1500,420],[1100,800],[520,760],[700,480],[1300,620]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="5"/>'}).join('')+'</svg>',{z:z11-1700,y:0,fx:0,cls:'dd',far:5000,s:mob?.6:1.3});
var kp=[[-380,-170,-900,10],[420,-40,-1350,-10],[-140,240,-1800,6]];
s11.images.forEach(function(im,i){var p=kp[i];add(shot(im,780,{cls:'node'}),{z:z11+p[2],x:p[0],y:p[1],ry:p[3],ms:.38});});

// 12 · AI tools: a dock of three instruments arranged on an arc
var s12=S[12],z12=-63000;mark(61400,12);
add(head(s12,{right:1}),{nv:60,nf:760,z:z12+300,x:620,y:-240,ry:-18,ms:.55});
var tp=[[-520,-20,-900,22,640],[30,40,-1300,0,420],[540,-30,-1000,-22,600]];
s12.images.forEach(function(im,i){var p=tp[i];add(shot(im,p[4],{cls:'tool'}),{z:z12+p[2],x:p[0],y:p[1],ry:p[3],ms:.4,nv:-650,nf:300});});

/* ================= ENDING ================= */
var AE=67000;mark(AE-1800,13);
add('<div class="fin"><div class="mono fin-k">'+esc(ID.nameEn)+' · '+esc(ID.year)+'</div><div class="fin-t">'+esc(ID.name)+'</div><div class="fin-s">'+esc(ID.title.replace('\n',' · '))+'</div><p>'+esc(ID.description)+'</p>'+
  '<ol class="toc">'+D.sections.map(function(s){return '<li data-sec="'+s.order+'"><span class="mono">'+pad(s.order)+'</span>'+esc(s.title)+'</li>'}).join('')+'</ol>'+
  '<button class="top mono" type="button" id="toTop">回到开头 ↑</button></div>',{z:-AE,far:3200,nofog:1,ms:.5});

var C_=function(d){return -Zc(-d)};var END=C_(AE)-(mob?640:860), K=2.4;
var acts=[[0,'封面','—'],[1500,'I','定位'],[C_(A2)-1300,'II','研究'],[C_(A3)-1300,'III','创作'],[C_(A4)-1300,'IV','沉淀'],[C_(AE)-1400,'FIN','终']];
var actStart={'1':1700,'2':C_(A2)-1000,'3':C_(A3)-1000,'4':C_(A4)-1000};
var secStart={};SEC_AT.forEach(function(r){if(r[1]>=1&&r[1]<=12&&!(r[1] in secStart))secStart[r[1]]=r[0]+600;});
/* ---------- camera engine ---------- */
var camZ=0,target=0,openOffset=0,mx=0,my=0,smx=0,smy=0,lastT=0;
var scroller=$('#scroller');
function layout(){ scroller.style.height=(reduce?0:Math.round(END/K+innerHeight))+'px'; }
layout();
function place(it,dx){
  it.el.style.transform='translate3d('+(it.x+it.px+(dx||0))+'px,'+(it.y+it.py)+'px,'+it.z+'px) rotateX('+it.rx+'deg) rotateY('+it.ry+'deg) rotateZ('+it.rz+'deg) scale('+it.s+')';
}
items.forEach(function(it){place(it);});
var depthNo=$('#depthNo'),depthBar=$('#depthBar'),actSub=$('#actSub'),actNo=$('#actNo'),secNo=$('#secNo'),flash=$('#flash'),navLinks=$$('[data-go]');
var curAct=-1,curSec=-1;
function frame(t){
  var dt=Math.min(.1,((t||0)-lastT)/1000)||.016;lastT=t||0;
  target=openOffset+scrollY*K;
  camZ+= (target-camZ)*(1-Math.exp(-dt*5.5));
  if(Math.abs(target-camZ)<.05) camZ=target;
  smx+=(mx-smx)*.06; smy+=(my-smy)*.06;
  var cxp=pathX(camZ),cyp=pathY(camZ),yaw=Math.atan((pathX(camZ+400)-cxp)/400)*57.3*.6;
  cam.style.transform=(opened?'':'scale('+(1+P*.08).toFixed(4)+') ')+'rotateX('+(-smy*3).toFixed(3)+'deg) rotateY('+(smx*4-yaw).toFixed(3)+'deg)';
  world.style.transform='translate3d('+(-cxp).toFixed(1)+'px,'+(-cyp).toFixed(1)+'px,'+camZ.toFixed(1)+'px)';
  for(var i=0;i<items.length;i++){
    var it=items[i],d=it.z+camZ;
    var NV=it.nv!=null?it.nv:PERSP*.55,NF=it.nf||PERSP*.55;var vis=d<NV&&d>-it.far;
    if(!vis){ if(!it.off){it.el.classList.add('off');it.off=true;} continue; }
    if(it.off){it.el.classList.remove('off');it.off=false;}
    var o=Math.min(1,(d+it.far)/(it.far*.4))*Math.min(1,(NV-d)/NF);
    if(it.op) {if(opened) o*=Math.max(0,1-(camZ-140)/500);} else if(!it.deco){o*=REV;if(d<-1500&&!it.nofog)o*=Math.max(.0,1-(-d-1500)/2600);}
    var hit=o>.55&&d>-2400&&d<PERSP*.3; if(hit!==it.hit){it.hit=hit;it.el.classList.toggle('hit',hit);}
    o=Math.round(o*50)/50;if(o!==it.o){it.o=o;it.el.style.opacity=o;}
    if(it.op&&!opened){var sp=1+P*P*.5;it.el.style.transform='translate3d('+(it.x*sp+it.px)+'px,'+(it.y+it.py)+'px,'+(it.z+P*P*260*(it.z<-800?-1:1))+'px) scale('+it.s+')';it.sp=1;}
    else if(it.sp){it.sp=0;place(it);}
    if(it.par){ place(it,camZ*it.par*.1); }
  }
  var p=Math.max(0,Math.min(1,camZ/END));
  depthNo.textContent=String(Math.round(p*100)).padStart(3,'0')+'%';
  depthBar.style.transform='scaleX('+p.toFixed(4)+')';
  var a=0;acts.forEach(function(r,j){if(camZ>=r[0])a=j;});
  if(a!==curAct){curAct=a;actNo.textContent=acts[a][1];actSub.textContent=acts[a][2];
    navLinks.forEach(function(l){l.classList.toggle('live',l.dataset.go===String(a));});}
  var sc=0;SEC_AT.forEach(function(r){if(camZ>=r[0])sc=r[1];});
  if(sc!==curSec){curSec=sc;secNo.textContent=(sc>=1&&sc<=12)?pad(sc)+' / 12 · '+S[sc].title:'— / 12';}
  requestAnimationFrame(frame);
}
if(!reduce) requestAnimationFrame(frame);
else items.forEach(function(it){it.el.style.transform='none';});
addEventListener('resize',function(){layout();});
if(fine&&!reduce) addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});

/* ---------- sound ---------- */
var soundOn=false,ac=null;
function play(n){if(!soundOn)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var t=ac.currentTime,g=ac.createGain();g.connect(ac.destination);
  if(n==='whoosh'){var len=1.6,buf=ac.createBuffer(1,ac.sampleRate*len,ac.sampleRate),d=buf.getChannelData(0);for(var i=0;i<d.length;i++){var x=i/d.length;d[i]=(Math.random()*2-1)*Math.sin(Math.PI*x)*Math.pow(1-x,1.5);}
    var s=ac.createBufferSource();s.buffer=buf;var f=ac.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(1800,t+1.2);f.Q.value=.8;s.connect(f);f.connect(g);g.gain.value=.35;s.start(t);var len=n==='burst'?.9:.12,buf=ac.createBuffer(1,ac.sampleRate*len,ac.sampleRate),d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,n==='burst'?2.5:6);
    var s=ac.createBufferSource();s.buffer=buf;var f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=n==='burst'?900:2400;s.connect(f);f.connect(g);g.gain.value=n==='burst'?.55:.25;s.start(t);
    if(n==='burst'){var o=ac.createOscillator(),og=ac.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(38,t+.8);og.gain.setValueAtTime(.5,t);og.gain.exponentialRampToValueAtTime(.001,t+.9);o.connect(og);og.connect(ac.destination);o.start(t);o.stop(t+.95);}}
  else{var o2=ac.createOscillator();o2.type='sine';o2.frequency.setValueAtTime(660,t);o2.frequency.exponentialRampToValueAtTime(440,t+.12);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o2.connect(g);o2.start(t);o2.stop(t+.22);}
}catch(e){}}
$('#soundBtn').addEventListener('click',function(){soundOn=!soundOn;this.setAttribute('aria-pressed',soundOn);this.textContent='声音 '+(soundOn?'ON':'OFF');play('tick');});

/* ---------- cursor ---------- */
var cur=$('#cursor'),ring=$('#ring'),cLabel=$('#cLabel'),C=289,cx=innerWidth/2,cy=innerHeight/2,px=cx,py=cy;
if(fine){
  body.classList.add('has-cursor');
  addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;});
  (function l(){cx+=(px-cx)*.25;cy+=(py-cy)*.25;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(l);})();
}
function setRing(p){ring.style.strokeDashoffset=C*(1-p);}
function mode(m,label){cur.classList.remove('big','view');setRing(0);if(m){cur.classList.add(m);cLabel.innerHTML=label;}else cLabel.innerHTML='';}

/* ---------- opening: hold to focus & enter ---------- */
var REV=reduce?1:0,opened=false,P=0,holding=false,hum=null,HOLD=1200,lastH=0;
var bloom=$('#bloom'),veil=$('#veil'),hring=$('#hring'),hrc=$('#hrc'),pfill=$('#pfill');
function setP(p){P=p;setRing(p);openOffset=reduce?0:p*p*420;
  var q=p>0?.4+p*.6:0;bloom.style.opacity=q.toFixed(3);bloom.style.transform='translate(-50%,-50%) scale('+(p>0?.45+p*1.1:.25).toFixed(3)+')';
  veil.style.opacity=(.35*(1-p)).toFixed(3);hrc.style.strokeDashoffset=(1-p)*302;pfill.style.transform='scaleX('+p.toFixed(3)+')';
  hring.style.opacity=(holding||p>0)&&!opened?1:0;}
function humStart(){if(!soundOn)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();
  o.type='sine';o.frequency.value=55;o2.type='triangle';o2.frequency.value=110.6;f.type='lowpass';f.frequency.value=380;
  o.connect(f);o2.connect(f);f.connect(g);g.connect(ac.destination);g.gain.value=0;o.start();o2.start();hum={o:o,o2:o2,g:g,f:f};}catch(e){}}
function humSet(p){if(!hum)return;var t=ac.currentTime;hum.g.gain.setTargetAtTime(p*.16,t,.06);hum.o.frequency.setTargetAtTime(55+p*30,t,.08);hum.o2.frequency.setTargetAtTime(110.6+p*60,t,.08);hum.f.frequency.setTargetAtTime(380+p*900,t,.08);}
function humStop(){if(!hum)return;var h=hum;hum=null;var t=ac.currentTime;h.g.gain.setTargetAtTime(0,t,.25);setTimeout(function(){try{h.o.stop();h.o2.stop();}catch(e){}},1500);}
function tick(t){
  var dt=Math.min(200,t-(lastH||t));lastH=t;
  var p=holding?Math.min(1,P+dt/HOLD):Math.max(0,P-dt/(HOLD*.55));
  setP(p);humSet(P);
  if(P>=1){unlock();return;}
  if(holding||P>0)requestAnimationFrame(tick);else{lastH=0;humStop();}
}
function startHold(e){if(opened)return;if(e){hring.style.left=e.clientX+'px';hring.style.top=e.clientY+'px';}var was=holding||P>0;holding=true;body.classList.add('holding');if(!hum)humStart();if(!was){lastH=0;requestAnimationFrame(tick);}}
var hT='',hT0=0;function endHold(){if(opened||!holding)return;if(hT==='touch'&&performance.now()-hT0<350){unlock();return;}holding=false;body.classList.remove('holding');if(!P)setP(0);}
function unlock(){
  if(opened)return;opened=true;holding=false;setRing(1);mode(null);humStop();play('whoosh');
  body.classList.remove('holding');body.classList.add('opened');setP(1);hring.style.opacity=0;flash.style.transition='opacity .1s';flash.style.opacity=.18;setTimeout(function(){flash.style.transition='opacity 1.2s';flash.style.opacity=0;},110);
  var from=openOffset,to=reduce?0:1700,t0=performance.now(),dur=2300;
  (function an(t){var k=Math.min(1,(t-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;openOffset=from+(to-from)*e;REV=Math.min(1,Math.max(0,(k-.25)/.5));
    if(k<1)requestAnimationFrame(an);else{body.classList.remove('locked');var o=openOffset;openOffset=0;scrollTo(0,o/K);setRing(0);}})(t0);
  if(reduce){openOffset=0;body.classList.remove('locked');}
}
function skip(e){return e.target.closest&&e.target.closest('.nav,.lb,.sound')}
addEventListener('pointerdown',function(e){
  if(opened||skip(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;
  e.preventDefault();hT=e.pointerType;hT0=performance.now();startHold(e);
},{passive:false});
['pointerup','pointercancel','blur'].forEach(function(ev){addEventListener(ev,endHold);});
document.addEventListener('mouseleave',endHold);
addEventListener('pointermove',function(e){if(!opened&&e.pointerType==='mouse'&&!cur.classList.contains('big')){mode('big','按住进入<br>HOLD TO ENTER');}});

addEventListener('keydown',function(e){if(!opened&&(e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();startHold();}});addEventListener('keyup',function(e){if(e.key==='Enter'||e.key===' ')endHold();});
if(reduce){mode(null);unlock();}

/* ---------- lightbox (single click / tap) ---------- */
var lb=$('#lb'),lbImg=$('#lbImg'),lbScroll=$('#lbScroll'),last=null;
function openLB(btn,x,y){
  last=btn;play('tick');
  lb.style.setProperty('--cx',(x||innerWidth/2)+'px');lb.style.setProperty('--cy',(y||innerHeight/2)+'px');
  lbImg.src=btn.dataset.src;lbImg.alt=btn.dataset.cap;
  var parts=btn.dataset.cap.split(' · ');
  $('#lbCap').innerHTML='原图 · <b>'+parts[0]+'</b> · '+parts.slice(1).join(' · ');
  lbScroll.classList.toggle('wide',btn.dataset.wide==='1');lbScroll.scrollTop=0;
  lb.hidden=false;body.style.overflow='hidden';mode('big','关闭 · ESC<br>滚动查看');$('#lbClose').focus();
}
function closeLB(){if(lb.hidden)return;lb.hidden=true;body.style.overflow='';lbImg.removeAttribute('src');mode(null);last&&last.focus({preventScroll:true});}
$('#lbClose').addEventListener('click',closeLB);
lb.addEventListener('click',function(e){if(e.target===lbScroll)closeLB();});
addEventListener('keydown',function(e){if(e.key==='Escape')closeLB();});
lb.addEventListener('pointerleave',function(){mode(null);});
lb.addEventListener('pointerenter',function(){mode('big','关闭 · ESC<br>滚动查看');});
$$('[data-src]').forEach(function(b){
  b.addEventListener('click',function(e){if(!opened)return;openLB(b,e.clientX,e.clientY);});
  b.addEventListener('pointerenter',function(e){if(opened&&e.pointerType==='mouse')mode('view','点击查看<br>VIEW');});
  b.addEventListener('pointerleave',function(){if(opened)mode(null);});
});

/* ---------- nav ---------- */
function go(z){scrollTo({top:Math.max(0,z/K),behavior:reduce?'auto':'smooth'});}
$$('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(!opened)return;
  if(reduce){var el=$$('.gate')[+a.dataset.go-1];el&&el.scrollIntoView();return;}go(actStart[a.dataset.go]);});});
$('.brand').addEventListener('click',function(e){e.preventDefault();if(opened)go(0);});
var tt=$('#toTop');tt&&tt.addEventListener('click',function(){if(reduce)scrollTo(0,0);else go(actStart['1']);});
$$('.toc li').forEach(function(li){li.addEventListener('click',function(){if(!reduce)go(secStart[li.dataset.sec]);});});
})();
