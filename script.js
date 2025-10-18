import {nameWebsite , password , letterText , wishRandomText , mainWishText , messengerLink} from './CONFIG.js';
document.title = nameWebsite;
// window.alert(`Kích thước màn hình: ${innerWidth}x${innerHeight}`)
// Scene 1: Password ---------------------------------------------------
let enteredPassword = '';
var SceneActive = document.querySelector('.scene.active').id;

function pressKey(num) {
    if (enteredPassword.length < 4) {
        enteredPassword += num;
        updateDisplay();
        createBalloon();
    }
}
window.pressKey = pressKey;
function deleteKey() {
    enteredPassword = enteredPassword.slice(0, -1);
    updateDisplay();
}
window.deleteKey = deleteKey;
function updateDisplay() {
    const display = document.getElementById('passwordDisplay');
    display.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        if (i < enteredPassword.length) {
            display.innerHTML += '<span></span>';
        } else {
            display.innerHTML += '<span style="background: transparent; border: 2px solid #ffb3d9;"></span>';
        }
    }
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    balloon.textContent = ['🎈', '🎉', '💕', '✨', '🎊'][Math.floor(Math.random() * 5)];
    
    const rect = document.querySelector('.password-box').getBoundingClientRect();
    balloon.style.left = (rect.left + rect.width / 2) + 'px';
    balloon.style.top = (rect.top + rect.height / 2) + 'px';
    balloon.style.transform = `translateX(${(Math.random() - 0.5) * 100}px)`;
    
    document.body.appendChild(balloon);
    setTimeout(() => balloon.remove(), 4000);
}

function checkPassword() {
    const errorMsg = document.getElementById('errorMsg');
    
    if (enteredPassword === password) {
        errorMsg.style.display = 'none';
        nextScene();
    } else {
        errorMsg.style.display = 'block';
        enteredPassword = '';
        updateDisplay();
    }
}
window.checkPassword = checkPassword;

function nextScene() {
    const scenes = document.querySelectorAll('.scene');
    const currentActive = document.querySelector('.scene.active');
    const nextIndex = Array.from(scenes).indexOf(currentActive) + 1;
    const background = document.querySelector('.background')
    if (background) {
        background.style.display = 'none'
    }
    currentActive.classList.remove('active');
    if (nextIndex < scenes.length) {
        scenes[nextIndex].classList.add('active');
    }
    SceneActive = document.querySelector('.scene.active').id;
}
window.nextScene = nextScene;

// Scene 2 -----------------------------------------------------------
const scene2 = document.getElementById('scene2')
const napPhongBi = document.querySelector('.nap') 
const thu = document.querySelector('.thu')
const button = thu.querySelector('.card-nav')
for (let i = 0; i < 3; i++) {
    console.log(letterText[`line${i+1}`]);
    const para = document.createElement('p')
    para.textContent = letterText[`line${i+1}`]
    thu.insertBefore(para, button)
}

napPhongBi.addEventListener('click', function() {
    this.classList.toggle('open')
    thu.classList.toggle('open')
})
let isLetterClick = false
thu.addEventListener('click', function() {
    if (!isLetterClick) {
      const background = document.createElement('div')
        background.classList.add('background')
        document.body.appendChild(background)
        requestAnimationFrame(() => {
            background.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
        })
        background.appendChild(thu)  
        isLetterClick = true
    }
})
// Scene 3------------------------------------------------------------
// fireworksCanvas
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const rockets = [];
const particles = [];

class Rocket {
    constructor(x, targetY, color, type) {
    this.x = x;
    this.y = canvas.height;
    this.targetY = targetY;
    this.color = color;
    this.type = type;
    this.speed = -(Math.random() * 6 + 8);
    this.vx = (Math.random() - 0.5) * 1.5;
    }

    update() {
    this.y += this.speed;
    this.x += this.vx;
    this.speed += 0.15;
    if (this.speed >= 0) {
        createExplosion(this.x, this.y, this.color, this.type);
        return false;
    }
    return true;
    }

    draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.color}, 100%, 70%)`;
    ctx.fill();
    }
}

class Particle {
    constructor(x, y, color, vx, vy, type) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.alpha = 1;
    this.size = Math.random() * 2 + 1;
    this.life = 80 + Math.random() * 40;
    this.type = type;
    }

    update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.alpha -= 0.012;
    this.life--;
    if (this.type === "colorShift") {
        this.color = (this.color + 2) % 360; // đổi màu liên tục
    }
    return this.life > 0 && this.alpha > 0;
    }

    draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.color}, 100%, 60%, ${this.alpha})`;
    ctx.fill();
    }
}

// 💥 Các loại pháo hoa
function createExplosion(x, y, color, type) {
    const count = 60 + Math.random() * 40;

    if (type === "heart") {
    // 💖 Pháo hình trái tim (đầu nhọn hướng xuống)
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const r = 10 * (1 - Math.sin(angle)) * 8;
        const vx = Math.cos(angle) * (r / 25);
        const vy = -Math.sin(angle) * (r / 25); // 🔁 Đảo dấu để đầu nhọn hướng xuống
        particles.push(new Particle(x, y, color, vx, vy, type));
    }
    } 
    else if (type === "colorShift") {
    // 🌈 Pháo đổi màu liên tục
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 4 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, color, vx, vy, "colorShift"));
    }
    } 
    else {
    // 🎆 Pháo tròn cổ điển
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 4 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, color, vx, vy, "normal"));
    }
    }
}

function launchRocket() {
    const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const targetY = Math.random() * canvas.height * 0.5 + 100;
    const color = Math.random() * 360;

    const types = ["normal", "heart", "colorShift"];
    const type = types[Math.floor(Math.random() * types.length)];
    rockets.push(new Rocket(x, targetY, color, type));
}

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = rockets.length - 1; i >= 0; i--) {
    if (!rockets[i].update()) rockets.splice(i, 1);
    else rockets[i].draw();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) particles.splice(i, 1);
    else particles[i].draw();
    }

    requestAnimationFrame(loop);
}

// 🚀 Tự động bắn pháo
setInterval(launchRocket, 800);
loop();
updateDisplay();
// Main wish content 
const wishesContainer = document.querySelector('.wishes-container')
for (let i = 0; i < 3; i++) {
    const text = mainWishText[`line${i+1}`]
    const div = document.createElement('div')
    div.classList.add("wish-text")
    div.textContent = text
    wishesContainer.appendChild(div)
}
// Wish random
const wishRandom = document.querySelector('.wish-random')
const windowWidth = window.innerWidth
console.log(windowWidth);
function animateWishes() {
    if (SceneActive !== 'scene3') {
        setTimeout(animateWishes, 1500);
        return;
    }
    const randomText = document.createElement('div');
    randomText.classList.add('wish-text');
    wishRandom.appendChild(randomText);
    const text = wishRandomText[Math.floor(Math.random() * wishRandomText.length)];
    randomText.textContent = text;
    
    randomText.style.animation = 'randomWishMove 6s linear forwards';
    const left =  Math.random() * (windowWidth - 200) + 100;
    console.log(left);
    randomText.style.left = left + 'px';
    setTimeout(animateWishes, 1500);
    randomText.addEventListener('animationend', () => {
        {
        randomText.remove();
        }
    });
}
animateWishes();

const candles = document.querySelectorAll('.candle');
const happyBirthday = document.querySelector('.happyBirthday');
let numberOfBlownCandles = 3;
candles.forEach((candle, index) => {
    candle.addEventListener('click', () => {
        if (candle.classList.contains('blown')) {
            return;
        }
        candle.classList.add('blown');
        const flame = candle.querySelector('.candle-flame');
        setTimeout(() => {
            flame.style.animation = 'none';
        }, 500)
        numberOfBlownCandles--;      
        if (numberOfBlownCandles == 0) {
            console.log('All candles blown!');
            const para = document.querySelector('.cake-container p');
            para.classList.add('hide')
            happyBirthday.classList.add('floating')
        }
    })
});
happyBirthday.addEventListener('click', () => {
    window.location = messengerLink;
})
