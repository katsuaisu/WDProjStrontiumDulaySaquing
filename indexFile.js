(function createParticles(){
const particleLayer=document.getElementById('particles');
const pastelColors=['#fff7ff','#dff8ff','#fbe7f2','#fef0c7','#e9dcff'];
const pixelColors=['#fff','#ffd6f0','#e7f4ff','#ffd9b6'];
const rnd=(a,b)=>Math.random()*(b-a)+a;

for(let i=0;i<18;i++){
const p=document.createElement('div');
p.className='particle';
const size=rnd(8,42);
p.style.width=size+'px';
p.style.height=size+'px';
p.style.left=rnd(-10,110)+'%';
p.style.top=rnd(0,100)+'%';
p.style.background=pastelColors[Math.floor(Math.random()*pastelColors.length)];
p.style.opacity=0;
p.style.filter='blur('+rnd(1,6)+'px)';
particleLayer.appendChild(p);
animateSoft(p,i);
}

for(let i=0;i<26;i++){
const px=document.createElement('div');
px.className='pixel';
const size=Math.floor(rnd(6,14));
px.style.width=size+'px';
px.style.height=size+'px';
px.style.left=rnd(0,100)+'%';
px.style.top=rnd(0,100)+'%';
px.style.background=pixelColors[Math.floor(Math.random()*pixelColors.length)];
px.style.opacity=0;
particleLayer.appendChild(px);
animatePixel(px,i);
}
function animateSoft(el,seed){
const delay=(seed%7)*160;
const duration=rnd(6000,14000);
el.animate([{opacity:0,transform:`translateY(0)scale(0.8)`},{opacity:rnd(0.35,0.85),transform:`translateY(-${rnd(6,40)}px)scale(${rnd(0.9,1.15)})`},{opacity:0,transform:`translateY(-${rnd(40,90)}px)scale(${rnd(1.05,1.3)})`}],{duration:duration,iterations:Infinity,delay:delay+rnd(0,800),easing:'cubic-bezier(.2,.8,.2,1)'});
}
function animatePixel(el,seed){
const delay=(seed%5)*120;
const duration=rnd(2800,5400);
const dirX=(Math.random()>0.5?1:-1);
const drift=rnd(8,60)*dirX;
el.animate([{opacity:0,transform:`translate(0px,0px)scale(1)`},{opacity:rnd(0.5,0.95),transform:`translate(${drift}px,-${rnd(6,40)}px)scale(${rnd(0.9,1.35)})rotate(${rnd(-30,30)}deg)`},{opacity:0,transform:`translate(${drift*1.2}px,-${rnd(36,120)}px)scale(${rnd(1.1,1.6)})rotate(${rnd(-60,60)}deg)`}],{duration:duration,iterations:Infinity,delay:delay+rnd(0,400),easing:'cubic-bezier(.2,.8,.2,1)'});
}
})();

const logo = document.getElementById("logo");
logo.style.position = "absolute";
logo.style.top = "20px";
logo.style.right = "20px";
logo.style.width = "100px";

const image = document.getElementById("characterSprite");
const bonusLetter = document.querySelector(".clickHere");

let replacePng = true;

bonusLetter.addEventListener("click", function(event)
{
    if(replacePng)
    {
        image.src = "assets/photoOfMe.png"
    }
    else
    {
        image.src = "assets/chiksomething.png"
    }
    replacePng = !replacePng;
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            
            el.style.cursor = "url('assets/cursorMomonga2.png'), pointer";
        });
        el.addEventListener('mouseleave', () => {
          
            el.style.cursor = "url('assets/cursorMomonga.png'), auto";
        });
    });
    
    document.body.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            document.body.style.cursor = 'auto';
        }
    }, true);
});