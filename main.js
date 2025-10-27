const canvas=document.getElementById("canvas")
const ctx=canvas.getContext("2d")
const uican=document.getElementById("uican")
const utx=uican.getContext("2d")
const csize=1000
canvas.width=window.innerWidth
canvas.height=window.innerHeight
uican.style.top=`${window.innerHeight-500}px`
uican.style.width=window.innerWidth

const mapsize=csize*5
let user={x:Math.random()*mapsize/5,y:Math.random()*mapsize,r:0,vx:0,vy:0,br:0,rel:0,baserel:20,team:0,hp:1,rad:20,type:0,basedmg:0.08,basespd:0.7,dmgby:undefined}
let cam={x:user.x-csize/2,y:user.y-csize/2}

let jstick={lx:uican.width/4,ly:uican.height/2,rx:uican.width/4*3,ry:uican.height/2,lxx:uican.width/4,lyy:uican.height/2,rxx:uican.width/4*3,ryy:uican.height/2,ld:true,rd:true}

let shapes=[]
let bullets=[]
let tanks=[]

const botcount=15

let kill=0,death=0
let keyshow=false

const despawning=false
let chatlog=""

const usernames=["progamer420","Nobody","nyl","Itzcraft","AZZ","私は勝者だ","err","THEBIGHITTER","Death","iliketrains","sybau","4","67","qwerty","hjsjjsk","beans","TERRIFYING","Nma","theworldwelivein","Coconut","donut","wongwsskkok","Nanzz","Cecep","बिंगचिलिंग","thosewhoknow","uwu","Fragg","Gunner","STILLWATER","Stev","betterthanu","TheChosenOne","XiJinping","Flux","김정은","Redd","TheDarkLord","arachnophobic","123","CagnusMarlsen",":/","gshdhsuj","noone","goodatthisgame","Unnamed","yarrrr","Yahyaaa","topsingko","Technoblade","dream","xD","OwO","wiwiwi","iam",
  "thatoneguy","Farhan","Siti","sucipto","skibidi","tungtungtung","THE4","#","noob67","newname","nama","HORANGjawa","Путин","HITLAR","igga","aaaaaaa","dfvhikhg"
]

let teamcol=["rgb(0,170,255)","rgb(255,50,0)"]

const keyboard="qwertyuiopasdfghjklzxcvbnm"
let keys={}
const newLine=document.createElement("br")

for(let i=0;i<10;i++){
  let btn=document.createElement("button")
  btn.className="key"
  btn.innerHTML=keyboard[i]
  btn.addEventListener("touchstart",e=>{
    e.preventDefault()
    keys[keyboard[i]]=true
  })
  btn.addEventListener("touchend",e=>{
    e.preventDefault()
    keys[keyboard[i]]=false
  })
  document.getElementById("keyb1").appendChild(btn)
}
for(let i=10;i<19;i++){
  let btn=document.createElement("button")
  btn.className="key"
  btn.innerHTML=keyboard[i]
  btn.addEventListener("touchstart",e=>{
    e.preventDefault()
    keys[keyboard[i]]=true
  })
  btn.addEventListener("touchend",e=>{
    e.preventDefault()
    keys[keyboard[i]]=false
  })
  document.getElementById("keyb2").appendChild(btn)
}
for(let i=19;i<26;i++){
  let btn=document.createElement("button")
  btn.className="key"
  btn.innerHTML=keyboard[i]
  btn.addEventListener("touchstart",e=>{
    e.preventDefault()
    keys[keyboard[i]]=true
  })
  btn.addEventListener("touchend",e=>{
    e.preventDefault()
    keys[keyboard[i]]=false
  })
  document.getElementById("keyb3").appendChild(btn)
}

function tanh(x){
  return (Math.E**x-Math.E**-x)/(Math.E**x+Math.E**-x)
}

function logchat(stri){
  if(chatlog==""){
    chatlog+=stri
  }else{
    let chatsplit=chatlog.split("<br>")
    chatsplit=chatsplit.splice(-7)
    chatlog=chatsplit.join("<br>")
    chatlog+="<br>"+stri
  }
}
function uid(){
  return Math.floor(Math.random()*4294967296).toString(16).toUpperCase().padStart(8,"0")
}
function sHash(name) {
  let hash=0
  for (let i=0;i<name.length;i++) {
    hash=hash+name.charCodeAt(i)*Math.E
    hash<<7
    hash*=Math.E
    hash*=Math.PI
  }
  return hash
}
function getName(uid){
  if(uid!="USER"){
    let shufUsers=structuredClone(usernames)
    let hash=sHash(uid)*parseInt(uid,16)
    shufUsers.sort(()=>(hash*Math.PI)%1-0.5)
    return usernames[Math.floor(hash)%usernames.length]+""+sHash(uid)%999
  }else{
    return "you"
  }
}
function makePoly(x,y,r,s,rot){
  ctx.moveTo(x+Math.sin(rot)*r,y+Math.cos(rot)*r)
  for(let i=0;i<s;i++){
    ctx.lineTo(x+Math.sin(i/s*Math.PI*2+rot)*r,y+Math.cos(i/s*Math.PI*2+rot)*r)
  }
  ctx.closePath()
}
function makeBarrel(x,y,off,w,h,r,sideoff=0,tipw=0){
  ctx.moveTo(x+Math.sin(r+off+Math.PI/2)*(w/2-sideoff),y+Math.cos(r+off+Math.PI/2)*(w/2-sideoff))
  ctx.lineTo(x+Math.sin(r+off-Math.PI/2)*(w/2+sideoff),y+Math.cos(r+off-Math.PI/2)*(w/2+sideoff))
  ctx.lineTo(x+Math.sin(r+off-Math.PI/2)*((w+tipw)/2+sideoff)+Math.sin(r+off)*h,y+Math.cos(r+off-Math.PI/2)*((w+tipw)/2+sideoff)+Math.cos(r+off)*h)
  ctx.lineTo(x+Math.sin(r+off+Math.PI/2)*((w+tipw)/2-sideoff)+Math.sin(r+off)*h,y+Math.cos(r+off+Math.PI/2)*((w+tipw)/2-sideoff)+Math.cos(r+off)*h)
  ctx.closePath()
}
function makeBarrelType(x,y,type,br){
  ctx.beginPath
  switch(type){
    case 0:
      //basic (t1)
      ctx.beginPath()
      makeBarrel(x,y,0,20,40,br)
      ctx.fill()
      break
    case 1:
      //duo (t1)
      ctx.beginPath()
      makeBarrel(x,y,0,18,35,br,10)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,0,18,35,br,-10)
      ctx.fill()
      break
    case 2:
      //sniper (t1)
      ctx.beginPath()
      makeBarrel(x,y,0,18,50,br)
      ctx.fill()
      break
    case 3:
      //gatling (t1)
      ctx.beginPath()
      makeBarrel(x,y,0,18,40,br,0,15)
      ctx.fill()
      break
      
    case 4:
      //trio (t2-duo)
      ctx.beginPath()
      makeBarrel(x,y,0,18,35,br)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,0.7,18,35,br)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,-0.7,18,35,br)
      ctx.fill()
      break
    case 5:
      //cannon (t2-sniper)
      ctx.beginPath()
      makeBarrel(x,y,0,30,40,br)
      ctx.fill()
      break
    case 6:
      //cyclone (t2-gatling)
      ctx.beginPath()
      makeBarrel(x,y,0,12,40,br,0)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,0,12,35,br,15)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,0,12,35,br,-15)
      ctx.fill()
      break
    case 7: //quad (t2-duo)
      ctx.beginPath()
      makeBarrel(x,y,0,18,35,br)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,Math.PI/2,18,35,br)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,Math.PI,18,35,br)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,Math.PI*1.5,18,35,br)
      ctx.fill()
      break
    case 8:
      //shotgun (t2-sniper)
      ctx.beginPath()
      makeBarrel(x,y,0,10,30,br,0,25)
      ctx.fill()
      ctx.beginPath()
      makeBarrel(x,y,0,20,45,br)
      ctx.fill()
      break
  }
}
function getBarrelType(type){
  switch(type){
    case 0:
      return [{off:0,sideoff:0}]
    case 1:
      return [{off:0,sideoff:10},{off:0,sideoff:-10}]
    case 2:
      return [{off:0,sideoff:0}]
    case 3:
      return [{off:0,sideoff:0}]
    case 4:
      return [{off:0,sideoff:0},{off:0.7,sideoff:0},{off:-0.7,sideoff:0}]
    case 5:
      return [{off:0,sideoff:0}]
    case 6:
      return [{off:0,sideoff:0},{off:0,sideoff:15},{off:0,sideoff:-15}]
    case 7:
      return [{off:0,sideoff:0},{off:Math.PI/2,sideoff:0},{off:Math.PI,sideoff:0},{off:-Math.PI/2,sideoff:0}]
    case 8:
      return [{off:0,sideoff:0},{off:0,sideoff:0},{off:0,sideoff:0},{off:0,sideoff:0}]
  }
}
function getTypeSpecial(type){
  switch(type){
    case 0:
      return {}
    case 1:
      return {ordered:1,modrel:0.9}
    case 2:
      return {modbspeed:1.5,modrel:1.2,moddmg:1.3}
    case 3:
      return {modrel:0.6,moddmg:0.7,modinna:0.5}
    case 4:
      return {modrel:0.5,moddmg:0.7}
    case 5:
      return {modbspeed:1.7,modrel:2,moddmg:2.2,modbsize:15}
    case 6:
      return {ordered:1,modrel:0.4,modbsize:7.5,moddmg:0.7,modinna:0.3,modbspeed:1.2}
    case 7:
      return {modrel: 0.4}
    case 8:
      return {modrel:0.8,modinna:0.5,modltime:20,modbspeed:2}
  }
}
function rgbMul(color,factor){
  const rgb = color.match(/\d+/g).map(Number)
  const newRgb = rgb.map(v=>Math.min(255,v*factor))
  return `rgb(${newRgb.join(",")})`
}

class Tank{
  constructor(x,y,team,type=0){
    this.x=x
    this.y=y
    this.r=(team==0?Math.PI/2:-Math.PI/2)
    this.vx=0
    this.vy=0
    this.br=Math.random()*Math.PI*2
    this.rel=0
    this.team=team
    this.rad=20
    this.delay=0
    this.ct={x:x,y:y}
    this.rotr=Math.random()>0.5
    this.type=type
    this.basedmg=0.08
    this.basespd=0.7
    this.uid=uid()
    
    this.baserel=20
    this.hp=1
    let stop=false
    for(let i=0;i<100;i++){
      this.name=usernames[Math.floor(Math.random()*usernames.length)]
      stop=true
      tanks.forEach((t,i) => {
        if(t.name==this.name){
          stop=false
        }
      })
      if(stop){
        break
      }
    }
  }
  draw(){
    let col="white"
    col=teamcol[this.team]
    
    ctx.fillStyle=col
    ctx.font="25px Arial"
    ctx.textBaseline="top"
    ctx.textAlign="center"
    ctx.fillText(this.name,this.x-cam.x,this.y-cam.y+this.rad+8)
    
    ctx.fillStyle="gray"
    makeBarrelType(this.x-cam.x,this.y-cam.y,this.type,this.br)
    
    ctx.fillStyle=col
    ctx.strokeStyle=rgbMul(col,0.75)
    ctx.lineWidth=3
    ctx.beginPath()
    ctx.arc(this.x-cam.x,this.y-cam.y,this.rad,0,Math.PI*2)
    ctx.fill()
    ctx.stroke()
    
    if(this.hp<0.999){
      ctx.strokeStyle="rgba(255,50,50,0.5)"
      ctx.lineWidth=5
      ctx.beginPath()
      ctx.moveTo(this.x-cam.x-this.rad-20,this.y-cam.y-30)
      ctx.lineTo(this.x-cam.x+this.rad+20,this.y-cam.y-30)
      ctx.stroke()
      ctx.strokeStyle="rgba(50,255,100,0.5)"
      ctx.beginPath()
      ctx.moveTo(this.x-cam.x-this.rad-20,this.y-cam.y-30)
      ctx.lineTo(this.x-cam.x-this.rad-20+((this.rad+20)*this.hp*2),this.y-cam.y-30)
      ctx.stroke()
    }
  }
  update(){
    this.x+=this.vx
    this.y+=this.vy
    this.vx*=0.9
    this.vy*=0.9
    if(this.x<0){
      this.vx+=1
    }
    if(this.y<0){
      this.vy+=1
    }
    if(this.x>mapsize){
      this.vx-=1
    }
    if(this.y>mapsize){
      this.vy-=1
    }
    const ct=this.ct
    const dist=Math.sqrt((ct.x-this.x)**2+(ct.y-this.y)**2)
    if(this.delay<0){
      this.delay=dist/30
      const tct=this.closestEnemy()
      this.ct.x=tct.x+(Math.random()-0.5)*50
      this.ct.y=tct.y+(Math.random()-0.5)*50
      this.ct.dist=tct.dist
      this.ct.found=tct.found
      if(Math.random()<0.2){
        this.rotr=!this.rotr
      }
    }
    const da=-Math.atan2(ct.y-this.y,ct.x-this.x)+Math.PI*2.5||0
    const diff=(da-this.br+Math.PI)%(2*Math.PI)-Math.PI
    if(Math.abs(diff)>0.1&&this.ct.found){
      if(diff>0){
        this.br+=0.1
      }else{
        this.br-=0.1
      }
    }
    if(true){
      if(this.rel<2&&ct.dist<800){
        const brl=getBarrelType(this.type)
        const spc=getTypeSpecial(this.type)
        const bspeed=12*(spc.modbspeed||1)
        if(spc.ordered==1){
          const cbrl=brl[this.orderb%brl.length||0]
          const soff=(Math.random()-0.5)*(spc.modinna||0)
          bullets.push(new Bullet(this.x+Math.sin(this.br+cbrl.off)*20+Math.sin(this.br+cbrl.off-Math.PI/2)*cbrl.sideoff,this.y+Math.cos(this.br+cbrl.off)*20+Math.cos(this.br+cbrl.off-Math.PI/2)*cbrl.sideoff,this.vx+Math.sin(this.br+soff+cbrl.off)*bspeed,this.vy+Math.cos(this.br+soff+cbrl.off)*bspeed,spc.modbsize||10,this.team,this.basedmg*(spc.moddmg||1),this.name,spc.modltime||90))
          this.orderb=(this.orderb||0)+1
        }else{
          for(let i=0;i<brl.length;i++){
            const cbrl=brl[i]
            const soff=(Math.random()-0.5)*(spc.modinna||0)
            bullets.push(new Bullet(this.x+Math.sin(this.br+cbrl.off)*20+Math.sin(this.br+cbrl.off-Math.PI/2)*cbrl.sideoff,this.y+Math.cos(this.br+cbrl.off)*20+Math.cos(this.br+cbrl.off-Math.PI/2)*cbrl.sideoff,this.vx+Math.sin(this.br+soff+cbrl.off)*bspeed,this.vy+Math.cos(this.br+soff+cbrl.off)*bspeed,spc.modbsize||10,this.team,this.basedmg*(spc.moddmg||1),this.name,spc.modltime||90))
          }
        }
        this.rel=(this.baserel*(spc.ordered?1:brl.length))*(spc.modrel||1)
      }
    }
    this.rel--
    this.delay--
    
    let mx=tanh(
      (dist>500&&ct.dist<600?Math.sin(da):0)+
      (dist<300||this.hp<0.75?Math.sin(da+(this.rotr?Math.PI/2:-Math.PI/2)):0)
      )
    let my=tanh(
      (dist>500&&ct.dist<600?Math.cos(da):0)+
      (dist<400||this.hp<0.75?Math.cos(da+(this.rotr?Math.PI/2:-Math.PI/2)):0)
      )
    if(mx+my<0.001){
      mx+=Math.sin(this.r)
      my+=Math.cos(this.r)
      this.r+=Math.random()*(this.rotr?0.01:-0.01)
    }
    mx=tanh(mx)
    my=tanh(my)
    this.vx+=mx*this.basespd
    this.vy+=my*this.basespd
    this.hp=Math.min(1,this.hp+1/(30*60))
  }
  closestEnemy(){
    let cdist=(user.team!=this.team?Math.sqrt((this.x-user.x)**2+(this.y-user.y)**2):Infinity)
    let ct=(user.team!=this.team?{x:user.x,y:user.y}:{x:0,y:0})
    let found=user.team!=this.team
    tanks.forEach((t,i) => {
      if(t.team!=this.team){
        const dx=t.x-this.x
        const dy=t.y-this.y
        const dist=Math.sqrt(dx*dx+dy*dy)
        if(dist<cdist){
          cdist=dist
          ct.x=t.x
          ct.y=t.y
          found=true
        }
      }
    })
    const x=ct.x
    const y=ct.y
    return {x:x,y:y,dist:cdist,found:found}
  }
}
class Bullet{
  constructor(x,y,vx,vy,rad,team,dmg,owner,ltime){
    this.x=x
    this.y=y
    this.vx=vx
    this.vy=vy
    this.rad=rad
    this.team=team
    this.age=0
    this.dmg=dmg
    this.owner=owner
    this.ltime=ltime
  }
  draw(){
    let col="white"
    col=teamcol[this.team]
    ctx.fillStyle=col
    ctx.beginPath()
    ctx.arc(this.x-cam.x,this.y-cam.y,this.rad,0,Math.PI*2)
    ctx.fill()
  }
  update(){
    this.x+=this.vx
    this.y+=this.vy
    this.age++
    let cdist=Math.sqrt((this.x-user.x)**2+(this.y-user.y)**2)
    let ct=user
    tanks.forEach((t,i) => {
      if(t.team!=this.team){
        const dx=t.x-this.x
        const dy=t.y-this.y
        const dist=Math.sqrt(dx*dx+dy*dy)
        if(dist<cdist){
          cdist=dist
          ct=t
        }
      }
    })
    if(cdist<50&&ct.team!=this.team){
      ct.hp-=this.dmg
      ct.dmgby=this.owner
      this.age=999999
    }
  }
}
class Shape{
  constructor(x,y,s){
    this.x=x
    this.y=y
    this.s=s
    this.r=Math.random()*Math.PI*2
  }
  draw(){
    let col="white"
    switch(this.s){
      case 3:
        col="rgb(200,120,0)"
        break
      case 4:
        col="orange"
        break
    }
    ctx.fillStyle=col
    ctx.beginPath()
    makePoly(this.x-cam.x,this.y-cam.y,20,this.s,this.r)
    ctx.fill()
  }
}
for (let i=0;i<100;i++) {
  shapes.push(new Shape(Math.random()*mapsize,Math.random()*mapsize,Math.floor(Math.random()*2)+3))
}
for (let i=0;i<botcount;i++) {
  tanks.push(new Tank(Math.random()*mapsize/5+mapsize/5*4,Math.random()*mapsize*5,1,Math.floor(Math.random()*9)))
}
for (let i=0;i<botcount;i++) {
  tanks.push(new Tank(Math.random()*mapsize/5,Math.random()*mapsize*5,0,Math.floor(Math.random()*9)))
}

function drawUser(){
  ctx.fillStyle="gray"
  ctx.beginPath()
  makeBarrelType(user.x-cam.x,user.y-cam.y,user.type,user.br)
  
  const col=teamcol[user.team]
  ctx.fillStyle=col
  ctx.strokeStyle=rgbMul(col,0.75)
  ctx.lineWidth=3
  
  ctx.beginPath()
  ctx.arc(user.x-cam.x,user.y-cam.y,20,0,Math.PI*2)
  ctx.fill()
  ctx.stroke()
  
  if(user.hp<0.999){
    ctx.strokeStyle="rgba(255,50,50,0.5)"
    ctx.lineWidth=5
    ctx.beginPath()
    ctx.moveTo(user.x-cam.x-user.rad-20,user.y-cam.y-30)
    ctx.lineTo(user.x-cam.x+user.rad+20,user.y-cam.y-30)
    ctx.stroke()
    ctx.strokeStyle="rgba(50,255,100,0.5)"
    ctx.beginPath()
    ctx.moveTo(user.x-cam.x-user.rad-20,user.y-cam.y-30)
    ctx.lineTo(user.x-cam.x-user.rad-20+((user.rad+20)*user.hp*2),user.y-cam.y-30)
    ctx.stroke()
  }
}

function renderMinimap(){
  const mmsize=150
  const margin=10
  ctx.fillStyle="rgba(255,255,255,0.3)"
  ctx.fillRect(canvas.width-mmsize-margin,canvas.height-mmsize-margin,mmsize,mmsize)
  ctx.fillStyle="rgba(0,100,255,0.3)"
  ctx.fillRect(canvas.width-mmsize-margin,canvas.height-mmsize-margin,mmsize/4,mmsize)
  ctx.fillStyle="rgba(255,0,0,0.3)"
  ctx.fillRect(canvas.width-mmsize-margin+mmsize/4*3,canvas.height-mmsize-margin,mmsize/4,mmsize)
  
  ctx.strokeStyle="rgba(255,255,255,0.5)"
  ctx.lineWidth=2
  ctx.beginPath()
  ctx.moveTo(user.x/mapsize*mmsize+canvas.width-mmsize-margin,canvas.height-mmsize-margin)
  ctx.lineTo(user.x/mapsize*mmsize+canvas.width-mmsize-margin,canvas.height-margin)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(canvas.width-mmsize-margin,user.y/mapsize*mmsize+canvas.height-mmsize-margin)
  ctx.lineTo(canvas.width-margin,user.y/mapsize*mmsize+canvas.height-mmsize-margin)
  ctx.stroke()
  
  ctx.fillStyle="rgba(255,255,255,0.5)"
  ctx.font="20px Arial"
  ctx.textBaseline="bottom"
  ctx.textAlign="center"
  ctx.fillText("MINIMAP",canvas.width-margin-mmsize/2,canvas.height-mmsize-margin)
}
function renderUi(){
  utx.fillStyle="black"
  utx.clearRect(0,0,uican.width,uican.height)
  renderJoystick()
  utx.strokeStyle="rgba(255,255,255,0.1)"
  utx.lineWidth=5
  utx.beginPath()
  utx.moveTo(uican.width/2,0)
  utx.lineTo(uican.width/2,uican.height)
  utx.stroke()
}
function renderline(){
  ctx.lineWidth=1
  for(let i=-cam.x;i<canvas.width;i+=100){
    if(i+cam.x<mapsize+1){
      if(Math.floor((i+cam.x)/100)%10==0){
        ctx.strokeStyle="rgba(255,255,255,1)"
      }else{
        ctx.strokeStyle="rgba(255,255,255,0.5)"
      }
      ctx.beginPath()
      ctx.moveTo(i,0)
      ctx.lineTo(i,canvas.height)
      ctx.stroke()
    }
  }
  for(let i=-cam.y;i<canvas.height;i+=100){
    if(i+cam.y<mapsize+1){
      if(Math.floor((i+cam.y)/100)%10==0){
        ctx.strokeStyle="rgba(255,255,255,1)"
      }else{
        ctx.strokeStyle="rgba(255,255,255,0.5)"
      }
      ctx.beginPath()
      ctx.moveTo(0,i)
      ctx.lineTo(canvas.width,i)
      ctx.stroke()
    }
  }
}
function renderJoystick(){
  if(jstick.lx&&jstick.ly&&jstick.ld){
    utx.fillStyle="rgba(200,200,200,0.5)"
    utx.beginPath()
    utx.arc(jstick.lx,jstick.ly,100,0,Math.PI*2)
    utx.fill()
    if(jstick.lx&&jstick.ly){
      utx.beginPath()
      utx.arc(jstick.lxx,jstick.lyy,50,0,Math.PI*2)
      utx.fill()
    }
  }
  if(jstick.rx&&jstick.ry&&jstick.rd){
    utx.fillStyle="rgba(200,200,200,0.5)"
    utx.beginPath()
    utx.arc(jstick.rx,jstick.ry,100,0,Math.PI*2)
    utx.fill()
    if(jstick.rx&&jstick.ry){
      utx.beginPath()
      utx.arc(jstick.rxx,jstick.ryy,50,0,Math.PI*2)
      utx.fill()
    }
  }
}
function moveUser(){
  if(jstick.ld){
    const mx=(jstick.lxx-jstick.lx)||0
    const my=(jstick.lyy-jstick.ly)||0
    user.vx+=mx*0.01*user.basespd
    user.vy+=my*0.01*user.basespd
  }
  if(keys.w||keys.a||keys.s||keys.d){
    user.vx+=user.basespd*((keys.a?-1:0)+(keys.d?1:0))
    user.vy+=user.basespd*((keys.w?-1:0)+(keys.s?1:0))
  }
  if(user.x<0){
    user.vx+=1
  }
  if(user.y<0){
    user.vy+=1
  }
  if(user.x>mapsize){
    user.vx-=1
  }
  if(user.y>mapsize){
    user.vy-=1
  }
  user.x+=user.vx
  user.y+=user.vy
  user.vx*=0.9
  user.vy*=0.9
  
  if(jstick.rd){
    const da=-Math.atan2(jstick.ryy-jstick.ry,jstick.rxx-jstick.rx)+Math.PI*2.5||0
    const diff=(da-user.br+Math.PI)%(2*Math.PI)-Math.PI
    if(Math.abs(diff)>0.1){
      if(diff>0){
        user.br+=0.1
      }else{
        user.br-=0.1
      }
    }
    const jdist=Math.sqrt((jstick.rxx-jstick.rx)**2+(jstick.ryy-jstick.ry)**2)
    if(jdist>10){
      if(user.rel<0){
        const brl=getBarrelType(user.type)
        const spc=getTypeSpecial(user.type)
        const bspeed=12*(spc?.modbspeed||1)
        if(spc.ordered==1){
          const cbrl=brl[user.orderb%brl.length||0]
          const soff=(Math.random()-0.5)*(spc?.modinna||0)
          bullets.push(new Bullet(user.x+Math.sin(user.br+cbrl.off)*20+Math.sin(user.br+cbrl.off-Math.PI/2)*cbrl.sideoff,user.y+Math.cos(user.br+cbrl.off)*20+Math.cos(user.br+cbrl.off-Math.PI/2)*cbrl.sideoff,user.vx+Math.sin(user.br+soff+cbrl.off)*bspeed,user.vy+Math.cos(user.br+soff+cbrl.off)*bspeed,spc.modbsize||10,user.team,user.basedmg*(spc.moddmg||1),"you",spc.modltime||90))
          user.orderb=(user.orderb||0)+1
        }else{
          for(let i=0;i<brl.length;i++){
            const cbrl=brl[i]
            const soff=(Math.random()-0.5)*(spc?.modinna||0)
            bullets.push(new Bullet(user.x+Math.sin(user.br+cbrl.off)*20+Math.sin(user.br+cbrl.off-Math.PI/2)*cbrl.sideoff,user.y+Math.cos(user.br+cbrl.off)*20+Math.cos(user.br+cbrl.off-Math.PI/2)*cbrl.sideoff,user.vx+Math.sin(user.br+soff+cbrl.off)*bspeed,user.vy+Math.cos(user.br+soff+cbrl.off)*bspeed,spc.modbsize||10,user.team,user.basedmg*(spc.moddmg||1),"you",spc.modltime||90))
          }
        }
        user.rel=(user.baserel*(spc.ordered?1:brl.length))*(spc.modrel||1)
      }
    }
  }
}
function update(){
  moveUser()
  const cx=user.x-canvas.width/2+(jstick.rd?Math.sin(user.br)*Math.abs(jstick.rxx-jstick.rx)*2||0:0)
  const cy=user.y-canvas.height/2+(jstick.rd?Math.cos(user.br)*Math.abs(jstick.ryy-jstick.ry)*2||0:0)
  cam.x+=(cx-cam.x)*0.1
  cam.y+=(cy-cam.y)*0.1
  user.rel--
  user.hp=Math.min(1,user.hp+1/(30*60))
}
function render(){
  ctx.fillStyle="black"
  ctx.fillRect(0,0,canvas.width,canvas.height)
  update()
  renderline()
  renderMinimap()
  
  shapes.forEach((s,i) => {
    if(s.x>cam.x&&s.x<cam.x+canvas.width&&s.y>cam.y&&s.y<cam.y+canvas.height){
      s.draw()
    }
  })
  bullets.forEach((b,i) => {
    if(b.age>b.ltime){
      bullets.splice(i,1)
    }
  })
  bullets.forEach((b,i) => {
    b.update()
    if(b.x>cam.x&&b.x<cam.x+canvas.width&&b.y>cam.y&&b.y<cam.y+canvas.height){
      b.draw()
    }
  })
  tanks.forEach((t,i) => {
    if(t.hp<=0.001){
      tanks.splice(i,1)
      logchat("<t"+t.team+">"+t.name+" was killed by <t"+(t.team==0?1:0)+">"+t.dmgby)
      if(t.dmgby=="you"){
        kill++
      }
      if(t.team==0){
        tanks.push(new Tank(Math.random()*mapsize/5,Math.random()*mapsize,0,Math.floor(Math.random()*9)))
      }else{
        tanks.push(new Tank(Math.random()*mapsize/5+mapsize/5*4+canvas.width*2.5,Math.random()*mapsize,1,Math.floor(Math.random()*9)))
      }
    }
    if(despawning&&Math.sqrt((t.x-user.x)**2+(t.y-user.y)**2)>1700){
      const randr=Math.random()*Math.PI*2
      tanks.splice(i,1)
      let newt=t
      newt.x=Math.sin(randr)*1400+user.x
      newt.y=Math.cos(randr)*1400+user.y
      tanks.push(newt)
    }
  })
  tanks.forEach((t,i) => {
    t.update()
    if(t.x>cam.x-50&&t.x<cam.x+canvas.width+50&&t.y>cam.y-50&&t.y<cam.y+canvas.height+50){
      t.draw()
    }
  })
  
  drawUser()
  
  renderUi()
  ctx.fillStyle="white"
  ctx.font="30px Arial"
  ctx.textAlign="left"
  ctx.textBaseline="top"
  const chatsplit=chatlog.split("<br>")
  ctx.fillText("x:"+Math.floor(user.x)+" y:"+Math.floor(user.y),0,0)
  for(let i=0;i<chatsplit.length;i++){
    const wsplit=chatsplit[i].split(" ")
    let wordx=0
    for(let j=0;j<wsplit.length;j++){
      let word=wsplit[j]
      let col="white"
      if(word.slice(0,2)=="<t"){
        col=teamcol[word[2]]
        word=word.slice(4)
      }
      ctx.fillStyle=col
      ctx.fillText(word,wordx,30*(i+1))
      wordx+=ctx.measureText(word+" ").width
    }
  }
  ctx.fillStyle="red"
  ctx.textAlign="right"
  ctx.fillText("WORK IN PROGRESS",canvas.width,0)
  
  ctx.fillStyle="rgba(255,0,0,0.8)"
  ctx.font="20px Arial"
  ctx.fillText("Website is made on mobile.",canvas.width,30)
  ctx.fillText("Might not work perfectly on desktop.",canvas.width,50)
  ctx.font="30px Arial"
  
  ctx.fillStyle="rgba(255,255,255,0.3)"
  ctx.textAlign="center"
  ctx.fillText("Offline Mode",canvas.width/2,0)
  ctx.fillStyle="rgba(255,255,255,0.5)"
  ctx.textAlign="left"
  ctx.textBaseline="bottom"
  ctx.fillText("Kills: "+kill,0,canvas.height-30)
  ctx.fillText("Deaths: "+death,0,canvas.height)

  if(user.hp<=0.001){
    logchat("<t"+user.team+">"+"you"+" was killed by <t"+(user.team==0?1:0)+">"+user.dmgby)
    death++
    user={x:Math.random()*mapsize/5,y:Math.random()*mapsize,r:0,vx:0,vy:0,br:0,rel:0,baserel:20,team:0,hp:1,rad:20,type:Math.floor(Math.random()*9),basedmg:0.08,basespd:0.7}
  }
  
  document.getElementById("keyb").style.display=(keyshow?"block":"none")
  
  requestAnimationFrame(render)
}
render()

function tapPos(event) {
  const rect=canvas.getBoundingClientRect()
  let x
  let y
  if(event.touches) {
    x=event.touches[0].clientX-rect.left
    y=event.touches[0].clientY-rect.top
  }else{
    x=event.clientX-rect.left
    y=event.clientY-rect.top
  }
  return{x:x+camx,y:y+camy}
}
uican.addEventListener('touchstart',(e) =>{
  e.preventDefault()
  let touchl=null,touchr=null
  if(e.touches[0].clientX-uican.offsetLeft<uican.width/2){
    touchl=e.touches[0]
    touchr=e.touches[1]
  }else{
    touchl=e.touches[1]
    touchr=e.touches[0]
  }
  if(touchl&&!jstick.ld){
    const x=touchl.clientX-uican.offsetLeft
    const y=touchl.clientY-uican.offsetTop
    jstick.lx=x
    jstick.ly=y
    jstick.lxx=x
    jstick.lyy=y
    jstick.ld=true
  }
  if(touchr&&!jstick.rd){
    const x=touchr.clientX-uican.offsetLeft
    const y=touchr.clientY-uican.offsetTop
    jstick.rx=x
    jstick.ry=y
    jstick.rd=true
  }
})
uican.addEventListener('touchmove',(e) =>{
  e.preventDefault()
  let touchl=null,touchr=null
  if(e.touches[0].clientX-uican.offsetLeft<uican.width/2){
    touchl=e.touches[0]
    touchr=e.touches[1]
  }else{
    touchl=e.touches[1]
    touchr=e.touches[0]
  }
  if(touchl){
    const x=touchl.clientX-uican.offsetLeft
    const y=touchl.clientY-uican.offsetTop
    const dx=x-jstick.lx
    const dy=y-jstick.ly
    const dist=Math.max(1,Math.sqrt(dx*dx+dy*dy)/100)
    jstick.lxx=dx/dist+jstick.lx
    jstick.lyy=dy/dist+jstick.ly
    if(x>uican.width/2-50){
      jstick.ld=false
    }
  }
  if(touchr){
    const x=touchr.clientX-uican.offsetLeft
    const y=touchr.clientY-uican.offsetTop
    const dx=x-jstick.rx
    const dy=y-jstick.ry
    const dist=Math.max(1,Math.sqrt(dx*dx+dy*dy)/100)
    jstick.rxx=dx/dist+jstick.rx
    jstick.ryy=dy/dist+jstick.ry
    if(x<uican.width/2+50){
      jstick.rd=false
    }
  }
})
uican.addEventListener('touchend',(e)=> {
  e.preventDefault()
  let touchl=null,touchr=null
  if(e.changedTouches[0].clientX-uican.offsetLeft<uican.width/2){
    touchl=e.changedTouches[0]
    touchr=e.changedTouches[1]
  }else{
    touchl=e.changedTouches[1]
    touchr=e.changedTouches[0]
  }
  if(touchl)jstick.ld=false
  if(touchr)jstick.rd=false
})

document.addEventListener("keydown",e=> keys[e.key]=true)
document.addEventListener("keyup",e=> keys[e.key]=false)
document.getElementById("keyshow").addEventListener("click",()=>keyshow=!keyshow)
