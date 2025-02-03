"use strict";

// Set up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const w = canvas.width;
const h = canvas.height;

const hue = 217;
const stars = [];
let count = 0;
const maxStars = 1400;

// Cache gradient
const canvas2 = document.createElement('canvas');
const ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
const half = canvas2.width / 2;
const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#fff');
gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
gradient2.addColorStop(1, 'transparent');
ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);
ctx2.fill();

// Helper functions
const random = (min, max) => {
  if (max === undefined) [min, max] = [0, min];
  if (min > max) [min, max] = [max, min];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const maxOrbit = (x, y) => {
  const max = Math.max(x, y);
  return Math.round(Math.sqrt(max * max + max * max)) / 2;
};

// Star class
class Star {
  constructor() {
    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 1000000;
    this.alpha = random(2, 10) / 10;
    count++;
    stars[count] = this;
  }

  draw() {
    const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
    const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
    const twinkle = random(20);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }
}

// Create stars
for (let i = 0; i < maxStars; i++) {
  new Star();
}

// Animation loop
const animation = () => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 1; i < stars.length; i++) {
    stars[i].draw();
  }

  window.requestAnimationFrame(animation);
};

animation();