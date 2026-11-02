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
function pathX(d){return 0;}
function pathY(d){return 0;}

var world=$('#world'),cam=$('#cam'),items=[];
function add(html,o){
  var el=document.createElement('div');el.className='it'+(o.cls?' '+o.cls:'');
  el.innerHTML='<div class="c">'+html+'</div>';world.appendChild(el);
  var free=o.fx===0;
  var it={el:el,z0:o.z,x:(o.x||0)*(free?1:X),y:(o.y||0)*(mob&&!free?.7:1),z:o.raw?o.z:Zc(o.z),rx:o.rx||0,ry:(o.ry||0)*(mob?.4:1),rz:o.rz||0,
    s:(o.s||1)*(free?1:MS),par:o.par||0,nv:o.nv!=null?o.nv:null,nf:o.nf||0,far:o.far||(mob?3000:5000),sec:o.sec||0,nofog:o.nofog||0};
  if(o.ms!=null&&mob) it.s=o.ms;
  var pz=o.pathAt!=null?Zc(o.pathAt):it.z;it.px=pathX(-pz);it.py=pathY(-pz);
  it.op=/\bop\b/.test(el.className);it.en=/o-en/.test(html);it.deco=/\bdeco\b/.test(el.className);
  items.push(it);return it;
}
var seed=7;function sr(){seed=(seed*16807)%2147483647;return seed/2147483647}

/* ---------- shared components ---------- */
function shot(im,w,o){o=o||{};
  var cap=im.id+' · '+(im.platform||'')+' · '+im.name;
  return '<button class="shot'+(o.cls?' '+o.cls:'')+'" type="button" style="width:'+w+'px" data-src="assets/img/'+im.file+'.jpg" data-cap="'+esc(cap)+'" data-wide="'+(im.width>im.height*1.2?1:0)+'" aria-label="查看原图：'+esc(im.name)+'">'+
    '<span class="frame" data-no="'+im.id+'"><img src="assets/thumb/'+im.file+'.jpg" alt="'+esc(im.alt||im.name)+'" loading="lazy" decoding="async" width="'+w+'" height="'+Math.round(w*im.height/im.width)+'"></span>'+
    (o.nolab?'':'<span class="lab"><span class="mono"><b>'+im.id+'</b> '+esc(im.platform||'')+'</span><span class="nm">'+esc(im.name)+'</span></span>')+'</button>';
}
function head(s,o){o=o||{};
  return '<header class="sh'+(o.right?' r':'')+'"><div class="sh-top mono"><span class="sh-n">'+pad(s.order)+'</span><span>'+esc(s.titleEn)+'</span><span class="sh-g">'+esc(s.group)+'</span></div>'+
    '<h3>'+esc(s.title)+'</h3><p>'+esc(s.description)+'</p><div class="sh-st mono">'+esc(s.status)+'</div></header>';
}
var QUOTE={1:'记录粉丝与观众特征。',2:'财经类竞品帐号对照，收录帐号信息、内容定位与互动指标。',3:'四个作品的选题、受众、观看收益、可能行动、开头与文案结构分析。',4:'帐号增长与代表作品的阶段记录'};
function gate(n,roman,title,secs,o){var q=QUOTE[n];
  return '<div class="gate"><div class="g-k mono">ACT '+roman+' &nbsp;·&nbsp; '+secs.map(function(k){return pad(k)}).join(' — ')+'</div>'+
    '<div class="g-t"><b>'+title.charAt(0)+'</b>'+title.slice(1)+'</div>'+
    '<div class="g-q">'+q.split('').map(function(c,i){return '<span style="--i:'+i+'">'+esc(c)+'</span>'}).join('')+'</div>'+'<ol class="g-i">'+secs.map(function(k){return '<li><span class="mono">'+pad(k)+'</span>'+esc(S[k].title)+'</li>'}).join('')+'</ol></div>';
}
var SEC_AT=[],GATES=[];   // [depth, sectionOrder]
var ZC=.72,SH=1700;function Zc(z){return z>-1500?z:-1500-SH+(z+1500)*ZC;}
function mark(d,k){SEC_AT.push([-Zc(-d),k]);}

/* ---------- OPENING ---------- */
add('<div class="o-en">'+'CHEN AN'.split('').map(function(ch,i){var c=i-3,ang=(c===0?-90:(c<0?180:0))+(c*7);return '<span style="--dx:'+(c*38+(c===0?0:(c<0?-30:30)))+'vw;--dy:'+((i%2?-1:1)*(14+Math.abs(c)*6))+'vh;--r:'+(c*14)+'deg">'+(ch===' '?'&nbsp;':ch)+'</span>'}).join('')+'</div>',{z:-1500,y:-30,far:9000,cls:'dd op',ms:.42});
add('<div class="o-kick mono">'+esc(ID.name)+' · PORTFOLIO · '+esc(ID.year)+'</div>',{z:-1100,y:-300,far:9000,cls:'op',ms:.8});
add('<div class="o-title"><div class="o-sub">'+esc(ID.title.split('\n')[0])+' · '+esc(ID.title.split('\n')[1])+'</div><div class="o-desc">'+esc(ID.subtitle)+'</div></div>',{z:-300,y:mob?230:270,far:9000,ms:.6,cls:'op'});
add('<div class="o-year mono">'+esc(ID.year)+'</div>',{z:120,x:-560,y:-250,far:9000,cls:'dd op'});
add('<div class="o-year mono">12 栏 · 34 张原图</div>',{z:60,x:540,y:270,far:9000,cls:'dd op',s:.6});

/* ---------- ambient decor: sparse embers + far act numerals ---------- */
for(var q=0;q<16;q++){var qs=4+sr()*10;
  add('<i class="mote" style="width:'+qs+'px;height:'+qs+'px"></i>',{x:(sr()-.5)*1800,y:(sr()-.5)*1100,z:300-sr()*2600,fx:0,far:9000,cls:'deco dd'});}
for(var i=0;i<20;i++){var z=-3000-i*3200-sr()*900,sz=50+sr()*170;
  add('<div class="bokeh'+(sr()>.55?' w':'')+'" style="width:'+sz+'px;height:'+sz+'px"></div>',{x:(sr()-.5)*2800,y:(sr()-.5)*1500,z:z,fx:0,cls:'deco dd'});}

/* ---------- INDEX: the first composed scene after unlock ---------- */
var IDX=[['I','定位',[1,2]],['II','研究',[3,4,5]],['III','创作',[6,7,8]],['IV','沉淀',[9,10,11,12]]];
add('<nav class="idx" aria-label="目录"><div class="idx-h"><span class="mono">CONTENTS · 目录</span><b>'+esc(ID.name)+'</b><i class="mono">'+esc(ID.nameEn)+' · '+esc(ID.year)+'</i></div><div class="idx-g">'+
  IDX.map(function(a,j){return '<section class="idx-c" style="--j:'+j+'"><button class="idx-a" type="button" data-act="'+(j+1)+'"><span class="mono">ACT</span><em>'+a[0]+'</em><b>'+a[1]+'</b></button><ol>'+
    a[2].map(function(k){return '<li><button type="button" data-sec="'+k+'"><span class="mono">'+pad(k)+'</span><b>'+esc(S[k].title)+'</b><i class="mono">'+esc(S[k].titleEn||'')+'</i></button></li>'}).join('')+'</ol></section>'}).join('')+
  '</div><div class="idx-f mono">点击任一栏目直达 · 或继续滚动进入</div></nav>',{raw:1,z:-2700,far:2600,nofog:1,nv:250,nf:700,s:1.2,ms:.42}).idx=1;

/* ================= ACT I · 定位 ================= */
var A1=2400;
add('<div class="numeral">I</div>',{z:-A1-1400,pathAt:-A1,y:-20,cls:'dd num',par:0,s:2,ms:1,far:2600,nofog:1,nv:-300,nf:900});
GATES.push(add(gate(1,'I','定位',[1,2]),{nofog:1,nv:-250,nf:650,z:-A1,far:1900,ms:.55}));
mark(0,0);SEC_AT.push([-Zc(-A1)-400,1]);

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
add(head(s2),{nv:60,nf:760,z:z2,x:-480,y:-330,ry:12,ms:.62});
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
GATES.push(add(gate(2,'II','研究',[3,4,5]),{nofog:1,nv:-250,nf:650,z:-A2,far:3600,ms:.55}));

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
GATES.push(add(gate(3,'III','创作',[6,7,8]),{nofog:1,nv:-250,nf:650,z:-A3,far:3600,ms:.55}));

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
  add(shot(im,560,{cls:'slide'}),mob?{z:z8-900-i*900,x:(i%2?1:-1)*110,fx:0,y:40,rz:(i-1)*2,ms:.42}:{z:z8-900-Math.abs(i-1)*-160,x:(i-1)*700,y:60+(i-1)*-30,rz:(i-1)*3,ry:(1-i)*8});
});

/* ================= ACT IV · 沉淀 ================= */
var A4=47600;mark(A4-1700,0.4);
add('<div class="numeral">IV</div>',{z:-A4-1500,pathAt:-A4,y:-20,cls:'dd num',par:0,s:2,ms:1,far:8500,nofog:1,nv:-300,nf:900});
GATES.push(add(gate(4,'IV','沉淀',[9,10,11,12]),{nofog:1,nv:-250,nf:650,z:-A4,far:3600,ms:.55}));

// 09 · timeline: a long axis line threading through, the timeline print on it
var s9=S[9],z9=-50200;mark(48900,9);
add('<div class="axis"></div>',{z:z9-700,y:330,fx:0,cls:'dd',far:5000});
add(head(s9),{far:2200,nv:60,nf:760,z:z9+200,x:-560,y:-230,ry:18,ms:.55});
add(shot(s9.images[0],1100),{z:z9-900,x:80,y:20,ry:-6,ms:.32});

// 10 · methods: archive stack of three sheets, receding like drawer files
var s10=S[10],z10=-54200;mark(52800,10);
add(head(s10,{right:1}),{nv:60,nf:760,z:z10+200,x:600,y:-230,ry:-18,ms:.55});
s10.images.forEach(function(im,i){
  add('<div class="file"><span class="tab mono">'+esc(im.platform)+'</span>'+shot(im,560)+'</div>',mob?{z:z10-900-i*900,x:(i%2?1:-1)*120,fx:0,y:30,ry:0,rz:(i-1)*2,ms:.42}:{z:z10-950-Math.abs(i-1)*120,x:(i-1)*760,y:40+Math.abs(i-1)*50,ry:(1-i)*10,rz:(i-1)*4,s:.92});
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
  '<button class="top mono" type="button" id="toTop">回到目录 ↑</button></div>',{z:-AE,far:3200,nofog:1,ms:.5});

var C_=function(d){return -Zc(-d)};var END=C_(AE)-(mob?640:860), K=2.4;
var acts=[[0,'—','目录'],[-Zc(-A1)-1300,'I','定位'],[C_(A2)-1300,'II','研究'],[C_(A3)-1300,'III','创作'],[C_(A4)-1300,'IV','沉淀'],[C_(AE)-1400,'FIN','终']];
var actStart={'1':-Zc(-A1)-900,'2':C_(A2)-1000,'3':C_(A3)-1000,'4':C_(A4)-1000};
var secStart={};SEC_AT.forEach(function(r){if(r[1]>=1&&r[1]<=12&&!(r[1] in secStart))secStart[r[1]]=r[0]+600;});
/* ---------- camera engine ---------- */
var camZ=0,target=0,openOffset=0,mx=0,my=0,smx=0,smy=0,lastT=0;
var scroller=$('#scroller'),busyOpen=false,rH=0;
function layout(){var rr=$('#ruler');rH=rr?rr.offsetHeight:0; scroller.style.height=(reduce?0:Math.round(END/K+innerHeight))+'px'; }
layout();
function place(it,dx){
  it.el.style.transform='translate3d('+(it.x+it.px+(dx||0))+'px,'+(it.y+it.py)+'px,'+it.z+'px) rotateX('+(it.rx*(1-(it.fw||0)))+'deg) rotateY('+(it.ry*(1-(it.fw||0)))+'deg) rotateZ('+(it.rz*(1-(it.fw||0)))+'deg) scale('+it.s+')';
}
items.forEach(function(it){place(it);});
window.__ca={items:items,jump:function(z){scrollTo(0,z/K);target=z;camZ=z;}};
var depthNo=$('#depthNo'),depthBar=$('#depthBar'),actSub=$('#actSub'),actNo=$('#actNo'),secNo=$('#secNo'),flash=$('#flash'),navLinks=$$('[data-go]');
var curAct=-1,curSec=-1;
/* ---------- best views: every image gets a dwell where it faces camera, others dim ---------- */
var FOC=[],fcur=null,fW=0,fxo=0,fyo=0;
function buildFocus(){if(reduce)return;FOC=[];
  var wt=world.style.transform,ct=cam.style.transform;world.style.transform='none';cam.style.transform='none';
  var saved=items.map(function(it){var t=it.el.style.transform;it.el.style.transform='none';return t;});
  var vw=innerWidth,vh=innerHeight;
  items.forEach(function(it,ii){var c=it.el.firstChild,cr=c.getBoundingClientRect(),ccx=cr.left+cr.width/2,ccy=cr.top+cr.height/2,shs=$$('.shot',it.el);
    shs.forEach(function(b){var fr=b.querySelector('.frame').getBoundingClientRect(),fw=fr.width*it.s,fh=fr.height*it.s;
      var k=fh>fw*1.9?Math.min(.5*vw/fw,1.25*vh/fh):Math.min((mob?.84:.6)*vw/fw,(mob?.6:.7)*vh/fh);k=Math.min(k,1.5);
      var d=PERSP-PERSP/k;d=Math.min(d,PERSP*.3,(it.nv!=null?it.nv:PERSP*.55)-120);
      FOC.push({b:b,it:it,ox:(fr.left+fr.width/2-ccx)*it.s,oy:(fr.top+fr.height/2-ccy)*it.s,single:shs.length===1,cz:d-it.z});});});
  items.forEach(function(it,i){it.el.style.transform=saved[i];});world.style.transform=wt;cam.style.transform=ct;
  FOC.sort(function(a,b){return a.cz-b.cz;});
  var GAP=340,gs=[[FOC[0]]];for(var i=1;i<FOC.length;i++){var g=gs[gs.length-1];if(FOC[i].cz-g[g.length-1].cz<GAP)g.push(FOC[i]);else gs.push([FOC[i]]);}
  gs.forEach(function(g){if(g.length<2)return;g.sort(function(a,b){return (a.it.x+a.ox)-(b.it.x+b.ox)||(a.oy-b.oy);});var m=g.reduce(function(s,f){return s+f.cz},0)/g.length,base=m-(g.length-1)*GAP/2;
    g.forEach(function(f,i){var lim=Math.min(PERSP*.25,(f.it.nv!=null?f.it.nv:PERSP*.55)-150)-f.it.z-i*GAP;if(base>lim)base=lim;});g.forEach(function(f,i){f.cz=base+i*GAP;});});
  FOC.sort(function(a,b){return a.cz-b.cz;});
  FOC.forEach(function(f,i){var g1=i?f.cz-FOC[i-1].cz:900,g2=i<FOC.length-1?FOC[i+1].cz-f.cz:900;f.W=Math.max(120,Math.min(520,g1*.5,g2*.5));});
  window.__ca.focus=FOC.map(function(f){return {src:f.b.dataset.src,cz:f.cz,raw:f.cz}});
}
/* plateau mapping: scroll keeps moving, camera eases into each best view and lingers */
function dwell(z){for(var i=0;i<FOC.length;i++){var f=FOC[i],u=z-f.cz;if(Math.abs(u)<f.W)return f.cz+u-(f.W/(2*Math.PI))*Math.sin(2*Math.PI*u/f.W);}return z;}
/* act transitions: sideways tracking + yaw */
var ACTZ=[A1,A2,A3,A4].map(function(a,j){return [C_(a)-1700,C_(a)+500,j%2?-1:1];});
function actSwing(z){for(var i=0;i<ACTZ.length;i++){var r=ACTZ[i];if(z>r[0]&&z<r[1]){var k=(z-r[0])/(r[1]-r[0]);return r[2]*Math.sin(Math.PI*k);}}return 0;}
/* key light per act */
var keys=$$('.key i'),KZ=[[-1,0],[C_(A2)-1800,1],[C_(A3)-1800,2],[C_(A4)-1800,3]];
function keyW(z){var w=[0,0,0,0];for(var i=KZ.length-1;i>=0;i--){if(z>=KZ[i][0]){var k=Math.min(1,(z-KZ[i][0])/1600);w[KZ[i][1]]=k;if(i>0)w[KZ[i-1][1]]=1-k;break;}}return w;}
/* count-up numbers */
var CU=$$('.fig-v,.hero-m b,.film dd').map(function(el){var tn=[];(function walk(n){[].forEach.call(n.childNodes,function(c){if(c.nodeType===3&&/\d/.test(c.nodeValue))tn.push({n:c,v:c.nodeValue});else if(c.nodeType===1&&!c.classList.contains('u'))walk(c);});})(el);return {el:el,it:null,tn:tn,done:0};});
CU.forEach(function(c){c.it=items.filter(function(it){return it.el.contains(c.el)})[0];});
function countUp(c){c.done=1;var t0=performance.now();c.tn.forEach(function(t){t.n.nodeValue=t.v.replace(/\d[\d,]*(\.\d+)?/g,function(m){return m.replace(/\d/g,'0')});});
  (function f(t){var k=Math.min(1,(t-t0)/1300),e=1-Math.pow(1-k,3);
    c.tn.forEach(function(x){x.n.nodeValue=x.v.replace(/\d[\d,]*(\.\d+)?/g,function(m){var dec=(m.split('.')[1]||'').length,num=parseFloat(m.replace(/,/g,''))*e,s=num.toFixed(dec);if(m.indexOf(',')>=0)s=Number(s).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});return s;});});
    if(k<1)requestAnimationFrame(f);else c.tn.forEach(function(x){x.n.nodeValue=x.v;});})(t0);}
/* right-side progress ruler */
var ruler=$('#ruler'),rMark=$('#rMark');
if(ruler){var rh='';for(var k=1;k<=12;k++){rh+='<button type="button" class="r-t" data-rs="'+k+'" style="top:'+(Math.min(1,secStart[k]/END)*100).toFixed(2)+'%"><span class="mono">'+pad(k)+'</span></button>';}
  [[A1,'I'],[A2,'II'],[A3,'III'],[A4,'IV']].forEach(function(a){rh+='<i class="r-a mono" style="top:'+(Math.min(1,C_(a[0])/END)*100).toFixed(2)+'%">'+a[1]+'</i>';});
  ruler.insertAdjacentHTML('beforeend',rh);
  $$('[data-rs]',ruler).forEach(function(b){b.addEventListener('click',function(){if(opened)go(secStart[b.dataset.rs]);});});}

function frame(t){
  var dt=Math.min(.1,((t||0)-lastT)/1000)||.016;lastT=t||0;
  var raw=openOffset+scrollY*K;target=opened&&!busyOpen?dwell(raw):raw;
  camZ+= (target-camZ)*(1-Math.exp(-dt*3.6));
  if(Math.abs(target-camZ)<.05) camZ=target;
  smx+=(mx-smx)*.06; smy+=(my-smy)*.06;
  var cxp=pathX(camZ),cyp=pathY(camZ),yaw=Math.atan((pathX(camZ+400)-cxp)/400)*57.3*.6;
  /* focus weight */
  var nf=null,nw=0;if(opened){for(var j=0;j<FOC.length;j++){var f=FOC[j],u=Math.abs(camZ-f.cz);if(u<f.W*1.1){var ww=1-u/(f.W*1.1);ww=ww*ww*(3-2*ww);if(ww>nw){nw=ww;nf=f;}}}}
  if(nf!==fcur){if(fcur){fcur.b.classList.remove('fx');if(fcur.single){fcur.it.fw=0;place(fcur.it);}}fcur=nf;if(nf)nf.b.classList.add('fx');body.classList.toggle('focusing',!!nf);}
  fW=nw;
  var tx=0;
  var gx=0,gy=0;if(fcur){gx=(fcur.it.x+fcur.it.px+fcur.ox-cxp)*fW;gy=(fcur.it.y+fcur.it.py+fcur.oy-cyp)*fW;if(fcur.single&&Math.abs((fcur.it.fw||0)-fW)>.01){fcur.it.fw=fW;place(fcur.it);}}
  fxo+=(gx-fxo)*(1-Math.exp(-dt*2.2));fyo+=(gy-fyo)*(1-Math.exp(-dt*2.2));
  var pr=1-fW*.7;
  cam.style.transform=(opened?'':'scale('+(1+P*.08).toFixed(4)+') ')+'rotateX('+(-smy*3*pr).toFixed(3)+'deg) rotateY('+(smx*4*pr).toFixed(3)+'deg)';
  world.style.transform='translate3d('+(-cxp-fxo+tx).toFixed(1)+'px,'+(-cyp-fyo).toFixed(1)+'px,'+camZ.toFixed(1)+'px)';
  if(keys.length){var kw=keyW(camZ);for(var q2=0;q2<4;q2++){var kv=Math.round(kw[q2]*40)/40;if(keys[q2].__o!==kv){keys[q2].__o=kv;keys[q2].style.opacity=kv;}}}
  for(var i=0;i<items.length;i++){
    var it=items[i],d=it.z+camZ;
    var NV=it.nv!=null?it.nv:PERSP*.55,NF=it.nf||PERSP*.55;var vis=d<NV&&d>-it.far;
    if(!vis){ if(!it.off){it.el.classList.add('off');it.off=true;} continue; }
    if(it.off){it.el.classList.remove('off');it.off=false;}
    var o=Math.min(1,(d+it.far)/(it.far*.4))*Math.min(1,(NV-d)/NF);
    if(it.op) {if(opened) o*=it.en?Math.max(0,1-(camZ-700)/700):Math.max(0,1-(camZ-140)/500);} else if(!it.deco){o*=REV;if(d<-1500&&!it.nofog)o*=Math.max(.0,1-(-d-1500)/2600);}
    if(opened&&!it.deco&&!/\bnum\b/.test(it.el.className))for(var g3=0;g3<GATES.length;g3++){var G=GATES[g3];if(it===G||it.z>=G.z)continue;var dg=G.z+camZ;if(dg>-2700&&dg<-250){var gw=Math.min(1,(dg+2700)/500,(-250-dg)/300);o*=1-.88*gw;}}
    if(opened&&it.idx&&camZ>IDXZ+80)o*=Math.max(0,1-(camZ-IDXZ-80)/300);
    if(opened&&!it.idx&&!it.deco&&!it.op&&camZ<IDXZ+900)o*=Math.max(0,Math.min(1,(camZ-IDXZ-250)/650));
    if(fcur&&fW>.05&&!it.deco&&it!==fcur.it){o*= it.z>fcur.it.z+40?Math.max(0,1-fW*1.6):1-fW*.72;}
    var isF=fcur&&it===fcur.it&&fW>.3;if(isF)o=Math.max(o,.98);
    var lv=d>-1900&&d<NV;if(lv!==it.lv){it.lv=lv;it.el.classList.toggle('live',lv);}
    var hit=isF||(o>.55&&d>-2400&&d<PERSP*.3&&!(fcur&&fW>.3)); if(hit!==it.hit){it.hit=hit;it.el.classList.toggle('hit',hit);}
    o=Math.round(o*50)/50;if(o!==it.o){it.o=o;it.el.style.opacity=o;}
    if(it.op&&!opened){var sp=1+P*P*.5;it.el.style.transform='translate3d('+(it.x*sp+it.px)+'px,'+(it.y+it.py)+'px,'+(it.z+P*P*260*(it.z<-800?-1:1))+'px) scale('+it.s+')';it.sp=1;}
    else if(it.sp){it.sp=0;place(it);}
    if(it.par){ place(it,camZ*it.par*.1); }
  }
  for(var c2=0;c2<CU.length;c2++){var cu=CU[c2];if(!cu.done&&cu.it&&cu.it.hit)countUp(cu);}
  var p=Math.max(0,Math.min(1,camZ/END));if(rMark)rMark.style.transform='translateY('+(p*rH).toFixed(1)+'px)';
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
addEventListener('resize',function(){layout();buildFocus();});
if(!reduce){buildFocus();addEventListener('load',buildFocus);}
if(fine&&!reduce) addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;});

/* ---------- sound ---------- */
var soundOn=false,ac=null,mg=null,bed=null,touched=false;
function AC(){try{if(!ac){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();mg=ac.createGain();mg.gain.value=0;mg.connect(ac.destination);}
  if(ac.state!=='running'&&ac.resume)ac.resume();}catch(e){}return ac;}
function OUT(){return mg;}
function bedStart(){if(bed||!ac)return;try{var g=ac.createGain(),f=ac.createBiquadFilter(),o=ac.createOscillator(),o2=ac.createOscillator(),l=ac.createOscillator(),lg=ac.createGain();
  o.type='sine';o.frequency.value=73.4;o2.type='sine';o2.frequency.value=110.2;f.type='lowpass';f.frequency.value=420;l.frequency.value=.08;lg.gain.value=.012;l.connect(lg);lg.connect(g.gain);
  g.gain.value=.028;o.connect(f);o2.connect(f);f.connect(g);g.connect(mg);o.start();o2.start();l.start();bed={g:g};}catch(e){}}
function setSound(on){touched=true;soundOn=on;var b=$('#soundBtn');b.setAttribute('aria-pressed',on);b.textContent='声音 '+(on?'ON':'OFF');
  if(on){if(AC()){bedStart();mg.gain.cancelScheduledValues(ac.currentTime);mg.gain.setTargetAtTime(1,ac.currentTime,.15);}}
  else if(ac){mg.gain.setTargetAtTime(0,ac.currentTime,.08);}}
window.__ca.audio=function(){return ac?ac.state:'none'};
function noise(len,shape){var buf=ac.createBuffer(1,ac.sampleRate*len|0,ac.sampleRate),d=buf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*shape(i/d.length);var b=ac.createBufferSource();b.buffer=buf;return b;}
function play(n){if(!soundOn||!AC())return;try{var t=ac.currentTime,g=ac.createGain();g.connect(OUT());
  if(n==='whoosh'){var s=noise(1.8,function(x){return Math.sin(Math.PI*Math.min(1,x*3))*Math.pow(1-x,1.6)}),f=ac.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(260,t+1.6);f.Q.value=.7;s.connect(f);f.connect(g);g.gain.value=.4;s.start(t);}
  else if(n==='burst'){var s=noise(.9,function(x){return Math.pow(1-x,3)}),f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=1200;s.connect(f);f.connect(g);g.gain.value=.6;s.start(t);
    var o=ac.createOscillator(),og=ac.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(34,t+.9);og.gain.setValueAtTime(.7,t);og.gain.exponentialRampToValueAtTime(.001,t+1);o.connect(og);og.connect(OUT());o.start(t);o.stop(t+1.05);}
  else{var o2=ac.createOscillator();o2.type='sine';o2.frequency.setValueAtTime(660,t);o2.frequency.exponentialRampToValueAtTime(440,t+.12);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o2.connect(g);o2.start(t);o2.stop(t+.22);}
}catch(e){}}
$('#soundBtn').addEventListener('pointerdown',function(e){e.stopPropagation();});$('#soundBtn').addEventListener('click',function(e){e.stopPropagation();setSound(!soundOn);play('tick');});

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
var IDXZ=mob?2000:1950;
/* warp canvas: converging lines during hold, radial hyperspace streaks on unlock */
var wc=document.createElement('canvas');wc.className='warp';wc.setAttribute('aria-hidden','true');body.appendChild(wc);var wx=wc.getContext('2d'),WW=0,WH=0,stars=[],wOn=0;
function wsize(){WW=wc.width=innerWidth;WH=wc.height=innerHeight;}wsize();addEventListener('resize',wsize);
for(var w=0;w<(mob?150:260);w++){var an=Math.random()*6.283,rr=.08+Math.pow(Math.random(),.7);stars.push({a:an,r:rr,z:.2+Math.random()*.8,red:Math.random()<.32,w:.6+Math.random()*1.6});}
function wshow(v){if(v!==wOn){wOn=v;wc.style.opacity=v?1:0;}}
function warpHold(p){if(reduce||opened)return;wshow(p>0?1:0);if(!p){wx.clearRect(0,0,WW,WH);return;}
  var cx=WW/2,cy=WH/2,R=Math.hypot(cx,cy),tt=performance.now()/1000;wx.clearRect(0,0,WW,WH);wx.globalCompositeOperation='lighter';
  var n=Math.floor(stars.length*Math.min(1,p*1.3));
  for(var i=0;i<n;i++){var s=stars[i],ph=((tt*(.35+s.z*.6)+s.r)%1),r0=R*(1-ph)*(1.05-p*.25),len=R*.05*(.4+p*1.4)*s.z,ca=Math.cos(s.a+p*.25),sa=Math.sin(s.a+p*.25);
    wx.strokeStyle=s.red?'rgba(232,74,44,'+(p*.5*ph).toFixed(3)+')':'rgba(245,236,220,'+(p*.32*ph).toFixed(3)+')';wx.lineWidth=s.w*.8;
    wx.beginPath();wx.moveTo(cx+ca*r0,cy+sa*r0);wx.lineTo(cx+ca*Math.max(0,r0-len),cy+sa*Math.max(0,r0-len));wx.stroke();}
  wx.globalCompositeOperation='source-over';}
function warpBurst(){if(reduce)return;wshow(1);var t0=performance.now(),D=1900,cx=WW/2,cy=WH/2,R=Math.hypot(cx,cy);
  (function f(t){var k=Math.min(1,(t-t0)/D);wx.clearRect(0,0,WW,WH);wx.globalCompositeOperation='lighter';
    var sp=k<.18?k/.18:1,fade=k<.4?1:Math.max(0,1-(k-.4)/.6),tr=Math.pow(k,.55);
    if(k<.25){var g=wx.createRadialGradient(cx,cy,0,cx,cy,R*(.2+k*3));g.addColorStop(0,'rgba(255,240,225,'+(.9*(1-k/.25))+')');g.addColorStop(.25,'rgba(232,74,44,'+(.5*(1-k/.25))+')');g.addColorStop(1,'rgba(232,74,44,0)');wx.fillStyle=g;wx.fillRect(0,0,WW,WH);}
    for(var i=0;i<stars.length;i++){var s=stars[i],head=R*(s.r*.2+tr*(1.05+s.z*1.5)),len=R*(.08+.6*sp*s.z)*(1-k*.4),tail=Math.max(0,head-len),ca=Math.cos(s.a),sa=Math.sin(s.a);
      if(tail>R*1.1)continue;var al=fade*(.35+.65*s.z);
      wx.strokeStyle=s.red?'rgba(232,74,44,'+al.toFixed(3)+')':'rgba(250,242,230,'+(al*.85).toFixed(3)+')';wx.lineWidth=s.w*(1+s.z*1.8*sp);
      wx.beginPath();wx.moveTo(cx+ca*tail,cy+sa*tail);wx.lineTo(cx+ca*head,cy+sa*head);wx.stroke();}
    wx.globalCompositeOperation='source-over';
    if(k<1)requestAnimationFrame(f);else{wx.clearRect(0,0,WW,WH);wshow(0);}})(t0);}
var REV=reduce?1:0,opened=false,P=0,holding=false,hum=null,HOLD=1200,lastH=0;
var bloom=$('#bloom'),veil=$('#veil'),hring=$('#hring'),hrc=$('#hrc'),pfill=$('#pfill');
function setP(p){P=p;setRing(p);openOffset=reduce?0:p*p*420;
  var q=p>0?.4+p*.6:0;bloom.style.opacity=q.toFixed(3);var jx=(Math.random()-.5)*p*p*14,jy=(Math.random()-.5)*p*p*14;bloom.style.transform='translate(calc(-50% + '+jx.toFixed(1)+'px),calc(-50% + '+jy.toFixed(1)+'px)) scale('+(p>0?.45+p*1.1:.25).toFixed(3)+')';warpHold(p);
  veil.style.opacity=(.35*(1-p)).toFixed(3);hrc.style.strokeDashoffset=(1-p)*302;pfill.style.transform='scaleX('+p.toFixed(3)+')';
  hring.style.opacity=(holding||p>0)&&!opened?1:0;}
function humStart(){if(!soundOn||!AC())return;try{var o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),f=ac.createBiquadFilter();
  o.type='sine';o.frequency.value=55;o2.type='triangle';o2.frequency.value=110.6;f.type='lowpass';f.frequency.value=380;
  o.connect(f);o2.connect(f);f.connect(g);g.connect(OUT());g.gain.value=0;o.start();o2.start();hum={o:o,o2:o2,g:g,f:f};}catch(e){}}
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
  if(opened)return;opened=true;holding=false;setRing(1);mode(null);humStop();play('burst');play('whoosh');warpBurst();
  body.classList.remove('holding');body.classList.add('opened');setP(1);hring.style.opacity=0;flash.style.transition='none';flash.style.opacity=.75;requestAnimationFrame(function(){requestAnimationFrame(function(){flash.style.transition='opacity .55s ease-out';flash.style.opacity=0;});});
  setTimeout(function(){body.classList.add('idx-on');},reduce?0:650);
  var from=openOffset,to=reduce?0:IDXZ,t0=performance.now(),dur=1700;
  if(!reduce)(function an(t){var k=Math.min(1,(t-t0)/dur),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;openOffset=from+(to-from)*e;REV=Math.min(1,Math.max(0,(k-.25)/.5));
    if(k<1)requestAnimationFrame(an);else{body.classList.remove('locked');var o=openOffset;openOffset=0;scrollTo(0,o/K);setRing(0);}})(t0);
  if(reduce){openOffset=0;body.classList.remove('locked');}
}
function skip(e){return e.target.closest&&e.target.closest('.nav,.lb,.sound')}
addEventListener('pointerdown',function(e){
  if(opened||skip(e))return;if(e.pointerType==='mouse'&&e.button!==0)return;
  if(!touched)setSound(true);else if(soundOn)AC();e.preventDefault();hT=e.pointerType;hT0=performance.now();startHold(e);
},{passive:false});
['pointerup','pointercancel','blur'].forEach(function(ev){addEventListener(ev,endHold);});
document.addEventListener('mouseleave',endHold);
addEventListener('pointermove',function(e){if(!opened&&e.pointerType==='mouse'&&!cur.classList.contains('big')){mode('big','按住进入<br>HOLD TO ENTER');}});

addEventListener('keydown',function(e){if(!opened&&(e.key==='Enter'||e.key===' ')&&!e.repeat){if(!touched)setSound(true);e.preventDefault();startHold();}});addEventListener('keyup',function(e){if(e.key==='Enter'||e.key===' ')endHold();});
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
  if(reduce){var el=$$('.gate')[+a.dataset.go-1];el&&scrollTo(0,el.getBoundingClientRect().top+scrollY-90);return;}go(actStart[a.dataset.go]);});});
$('.brand').addEventListener('click',function(e){e.preventDefault();if(opened)go(0);});
var tt=$('#toTop');tt&&tt.addEventListener('click',function(){if(reduce)scrollTo(0,0);else go(IDXZ);});
function flatGo(k){var h=$$('.world h3').filter(function(e){return e.textContent===S[k].title})[0];h&&scrollTo(0,h.getBoundingClientRect().top+scrollY-90);}
$$('.idx [data-sec]').forEach(function(b){b.addEventListener('click',function(){play('tick');if(reduce)flatGo(+b.dataset.sec);else go(secStart[b.dataset.sec]);});});
$$('.idx [data-act]').forEach(function(b){b.addEventListener('click',function(){play('tick');var a=b.dataset.act;if(reduce)flatGo(IDX[a-1][2][0]);else go(actStart[a]);});});
})();
