// window.addEventListener("resize", resizeCanvas, false);
//         window.addEventListener("DOMContentLoaded", onLoad, false);
        
//         window.requestAnimationFrame = 
//             window.requestAnimationFrame       || 
//             window.webkitRequestAnimationFrame || 
//             window.mozRequestAnimationFrame    || 
//             window.oRequestAnimationFrame      || 
//             window.msRequestAnimationFrame     || 
//             function (callback) {
//                 window.setTimeout(callback, 1000/60);
//             };
        
//         var canvas, ctx, w, h, particles = [], probability = 0.04,
//             xPoint, yPoint;
        
        
        
        
        
//         function onLoad() {
//             canvas = document.getElementById("canvas");
//             ctx = canvas.getContext("2d");
//             resizeCanvas();
            
//             window.requestAnimationFrame(updateWorld);
//         } 
        
//         function resizeCanvas() {
//             if (!!canvas) {
//                 w = canvas.width = window.innerWidth;
//                 h = canvas.height = window.innerHeight;
//             }
//         } 
        
//         function updateWorld() {
//             update();
//             paint();
//             window.requestAnimationFrame(updateWorld);
//         } 
        
//         function update() {
//             if (particles.length < 500 && Math.random() < probability) {
//                 createFirework();
//             }
//             var alive = [];
//             for (var i=0; i<particles.length; i++) {
//                 if (particles[i].move()) {
//                     alive.push(particles[i]);
//                 }
//             }
//             particles = alive;
//         } 
        
//         function paint() {
//             ctx.globalCompositeOperation = 'source-over';
//             ctx.fillStyle = "rgba(0,0,0,0.2)";
//             ctx.fillRect(0, 0, w, h);
//             ctx.globalCompositeOperation = 'lighter';
//             for (var i=0; i<particles.length; i++) {
//                 particles[i].draw(ctx);
//             }
//         } 
        
//         function createFirework() {
//             xPoint = Math.random()*(w-200)+100;
//             yPoint = Math.random()*(h-200)+100;
//             var nFire = Math.random()*50+100;
//             var c = "rgb("+(~~(Math.random()*200+55))+","
//                  +(~~(Math.random()*200+55))+","+(~~(Math.random()*200+55))+")";
//             for (var i=0; i<nFire; i++) {
//                 var particle = new Particle();
//                 particle.color = c;
//                 var vy = Math.sqrt(25-particle.vx*particle.vx);
//                 if (Math.abs(particle.vy) > vy) {
//                     particle.vy = particle.vy>0 ? vy: -vy;
//                 }
//                 particles.push(particle);
//             }
//         } 
        
//         function Particle() {
//             this.w = this.h = Math.random()*4+1;
            
//             this.x = xPoint-this.w/2;
//             this.y = yPoint-this.h/2;
            
//             this.vx = (Math.random()-0.5)*10;
//             this.vy = (Math.random()-0.5)*10;
            
//             this.alpha = Math.random()*.5+.5;
            
//             this.color;
//         } 
        
//         Particle.prototype = {
//             gravity: 0.05,
//             move: function () {
//                 this.x += this.vx;
//                 this.vy += this.gravity;
//                 this.y += this.vy;
//                 this.alpha -= 0.01;
//                 if (this.x <= -this.w || this.x >= screen.width ||
//                     this.y >= screen.height ||
//                     this.alpha <= 0) {
//                         return false;
//                 }
//                 return true;
//             },
//             draw: function (c) {
//                 c.save();
//                 c.beginPath();
                
//                 c.translate(this.x+this.w/2, this.y+this.h/2);
//                 c.arc(0, 0, this.w, 0, Math.PI*2);
//                 c.fillStyle = this.color;
//                 c.globalAlpha = this.alpha;
                
//                 c.closePath();
//                 c.fill();
//                 c.restore();
//             }
//         }
const Y_AXIS = 1;
const X_AXIS = 2;
let canvas;
let fireworks = [];
let star = [];

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  this.preStar();
}

function setup() {
  // ????????????????????????
  background(0);
  let canvas = document.getElementById('firework');
  let ctx = canvas.getContext('2d');
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  colorMode(RGB);
  frameRate(60);
  this.preStar();
}

function draw() {
  // ??????????????????
  setGradient(0, 0, width, height, color(0, 0, 0), color(24, 32, 72), Y_AXIS);
  noStroke();

  // ????????????
  this.drawStar();

  // ???????????????????????????????????????
  if (0 === frameCount % 100) {
    // ???????????????????????????
    let speed = random(10, 30);
    fireworks.push(new FireWork(random(width), height, 0, speed, 0.98));
  }

  for (let fw of fireworks) {
    // ??????????????????????????????????????????????????????????????????????????????
    if (2 === fw.getType || 30000 < fw.getFrame) {
      fireworks = fireworks.filter((n) => n !== fw);
      continue;
    }

    // ????????????????????????????????????????????????
    fw.fire();
  }
}

class FireWork {
  // ????????????
  constructor(x, y, vx, vy, gv) {
    // ???????????????????????????
    this.frame = 0;
    this.type = 0;
    this.next = 0;
    // ????????????
    this.r = random(155) + 80;
    this.g = random(155) + 80;
    this.b = random(155) + 80;
    this.a = 255;

    // ????????????
    this.x = x;
    this.y = y;

    // ???????????????
    this.w = random(10, 5);

    // ?????????????????????
    this.maxHeight = random(height / 6, height / 2);
    this.fireHeight = height - this.maxHeight;

    // ??????
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;

    // ?????????????????????
    this.afterImages = [];
    // ???????????????
    this.explosions = [];

    // ??????????????????????????????????????????
    this.exDelay = random(10, 40);
    // ??????????????????
    this.large = random(5, 15);
    // ??????????????????
    this.ball = random(20, 100);
    // ????????????????????????????????????
    this.exEnd = random(20, 40);
    // ?????????????????????
    this.exStop = 0.96;
  }

  get getFrame() {
    return this.frame;
  }

  get getType() {
    return this.type;
  }

  // ????????????????????????
  fire() {
    // 0:???????????????????????? 1:??????
    switch (this.type) {
      case 0:
        this.rising();
        break;
      case 1:
        this.explosion();
        break;
    }
  }

  // ?????????????????????????????????
  rising() {
    // ??????????????????????????????
    if (this.y * 0.8 < this.maxHeight) {
      this.a = this.a - 6;
    }

    // ?????????????????????????????????
    this.x += this.vx;
    this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);

    // ???????????????
    this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));
    for (let ai of this.afterImages) {
      if (ai.getAlpha <= 0) {
        this.afterImages = this.afterImages.filter((n) => n !== ai);
        continue;
      }
      ai.rsImage();
    }

    // ??????????????????
    this.update(this.x, this.y, this.w);

    // ????????????????????????????????????????????????????????????
    if (0 == this.afterImages.length) {
      if (0 === this.next) {
        // ??????????????????????????????????????????
        this.next = this.frame + Math.round(this.exDelay);
      } else if (this.next === this.frame) {
        // ??????????????????
        for (let i = 0; i < this.ball; i++) {
          // ???????????????
          let r = random(0, 360);
          // ??????????????????????????????????????????
          let s = random(0.1, 0.9);
          let vx = Math.cos((r * Math.PI) / 180) * s * this.large;
          let vy = Math.sin((r * Math.PI) / 180) * s * this.large;
          this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop));
          // ?????????????????????????????????????????????????????????
          let cr = random(0, 360);
          let cs = random(0.9, 1);
          let cvx = Math.cos((cr * Math.PI) / 180) * cs * this.large;
          let cvy = Math.sin((cr * Math.PI) / 180) * cs * this.large;
          this.explosions.push(new FireWork(this.x, this.y, cvx, cvy, this.exStop));
        }
        this.a = 255;
        this.type = 1;
      }
    }
  }

  // ???????????????????????????
  explosion() {
    for (let ex of this.explosions) {
      ex.frame++;
      // ??????????????????????????????????????????????????????
      if (2 === ex.getType) {
        this.explosions = this.explosions.filter((n) => n !== ex);
        continue;
      }

      // ???????????????
      if (0 === Math.round(random(0, 32))) {
        ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a));
      }

      for (let ai of ex.afterImages) {
        if (ai.getAlpha < 0) {
          ex.afterImages = ex.afterImages.filter((n) => n !== ai);
          continue;
        }
        ai.exImage();
      }

      // ???????????????
      this.update(ex.x, ex.y, ex.w, ex.a);
      ex.x += ex.vx;
      ex.y += ex.vy;
      ex.vx = ex.vx * ex.gv;
      ex.vy = ex.vy * ex.gv;
      ex.vy = ex.vy + ex.gv / 30;
      if (this.exEnd < ex.frame) {
        ex.w -= 0.1;
        ex.a = ex.a - 4;
        if (ex.a < 0 && 0 === ex.afterImages.length) {
          ex.type = 2;
        }
      }
    }
  }

  // ?????????????????????
  update(x, y, w, a) {
    this.frame++;
    if (0 < this.a) {
      let c = color(this.r, this.g, this.b);
      c.setAlpha(a);
      fill(c);
      ellipse(x, y, w, w);
    }
  }
}

// ????????????????????????
class Afterimage {
  constructor(r, g, b, x, y, w, a) {
    this.frame = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.w = w;
    this.a = a;
    this.vx = random(-0.24, 0.24);
    this.vy = random(0.2, 0.8);
    this.vw = random(0.05, 0.2);
  }

  get getAlpha() {
    return this.a;
  }

  // ???????????????
  rsImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 4;
      this.g += 4;
      this.b += 4;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 4;
    }
  }

  // ?????????
  exImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 2.5;
      this.g += 2.5;
      this.b += 2.5;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 1.5;
    }
  }

  update(r, g, b, x, y, w, a) {
    this.frame++;
    let c = color(r, g, b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

// ??????????????????????????????
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// ????????????
function preStar() {
  star = [];
  for (let i = 0; i < 100; i++) {
    star.push([random(width), random(height / 2), random(1, 4)]);
  }
}

// ????????????
function drawStar() {
  // ????????????
  for (let s of star) {
    let c = color(random(150, 255), random(150, 255), 255);
    c.setAlpha(random(150, 200));
    fill(c);
    ellipse(s[0], s[1], s[2], s[2]);
  }
}