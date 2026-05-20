/**
 * 雙溪雲教授社團之皮克敏社員牆 - 核心邏輯
 * 語言：繁體中文
 */

// 1. 社員照片與基本資訊定義
const MEMBER_DATA = [
    { filename: "101-09-邱苡庭.png", name: "邱苡庭", role: "社員 (101-09)", type: "red" },
    { filename: "104-07-吳宣.png", name: "吳宣", role: "社員 (104-07)", type: "yellow" },
    { filename: "105-04-簡祥典.png", name: "簡祥典", role: "社員 (105-04)", type: "blue" },
    { filename: "201-02-阮得銘.png", name: "阮得銘", role: "社員 (201-02)", type: "purple" },
    { filename: "201-05-張家睿.png", name: "張家睿", role: "社長 (201-05)", type: "white" },
    { filename: "203-03-莊竤喆.png", name: "莊竤喆", role: "社員 (203-03)", type: "glow" },
    { filename: "801-01-連姷溱.png", name: "連姷溱", role: "社員 (801-01)", type: "red" },
    { filename: "801-03-郭宸希.png", name: "郭宸希", role: "副社長 (801-03)", type: "yellow" },
    { filename: "801-07-田竣翔.png", name: "田竣翔", role: "副社長 (801-07)", type: "blue" },
    { filename: "801-15-邱妤虹.png", name: "邱妤虹", role: "社員 (801-15)", type: "purple" },
    { filename: "802-17-柯建良.png", name: "柯建良", role: "社員 (802-17)", type: "white" },
    { filename: "803-12-陳俊安.png", name: "陳俊安", role: "社員 (803-12)", type: "glow" },
    { filename: "901-05-連聖雯.png", name: "連聖雯", role: "社員 (901-05)", type: "red" },
    { filename: "901-09-簡亦婷.png", name: "簡亦婷", role: "社員 (901-09)", type: "yellow" },
    { filename: "901-16-楊承霖.png", name: "楊承霖", role: "社員 (901-16)", type: "blue" },
    { filename: "902-08-劉心梅.png", name: "劉心梅", role: "社員 (902-08)", type: "purple" },
    { filename: "教務處-註冊組-邱俐瑜.png", name: "邱俐瑜", role: "指導老師 (教務處-註冊組)", type: "glow" }
];

// 皮克敏屬性資料庫
const PIKMIN_TYPES = {
    red: { label: "紅皮克敏", ability: "不怕火之域、搬運能力強", strength: 2, speed: 4, resist: 9, colorCode: "#ff3b30", flavor: "熱情如火的紅皮克敏！在火之域中如魚得水，特別擅長處理繁重的搬運工作。" },
    yellow: { label: "黃皮克敏", ability: "能被丟得特別高，可搬運炸彈", strength: 1.5, speed: 5, resist: 6, colorCode: "#ffcc00", flavor: "充滿電力的黃皮克敏！大大的耳朵讓牠們能飛得更高，在搬運與探索上有獨特優勢。" },
    blue: { label: "藍皮克敏", ability: "不怕水之池、擅長游泳與水中搬運", strength: 1.5, speed: 4.5, resist: 8, colorCode: "#007aff", flavor: "如水般沉穩的藍皮克敏！能在水之池中自由穿梭，保護其他落水的夥伴。" },
    purple: { label: "紫皮克敏", ability: "體重與力量是常人 10 倍，速度稍慢", strength: 10, speed: 2.5, resist: 7, colorCode: "#af52de", flavor: "重量級的紫皮克敏！一隻就能頂替十隻普通皮克敏的搬運力量，是隊伍中的大力士。" },
    white: { label: "白皮克敏", ability: "速度極快，能發現地底隱藏寶物", strength: 1, speed: 9, resist: 5, colorCode: "#ffffff", flavor: "身手敏捷的白皮克敏！個子雖小但跑得飛快，紅色的眼睛彷彿能看穿一切寶物的秘密。" },
    glow: { label: "發光皮克敏", ability: "夜晚或陰影中戰鬥力加倍、會漂浮", strength: 1.8, speed: 6, resist: 7, colorCode: "#4cd964", flavor: "神祕發光的發光皮克敏！在夜晚會散發出螢光綠，飄浮前進，擁有神奇的防禦結界。" }
};

// 寶物類型定義 (Font Awesome 圖示)
const TREASURE_TYPES = [
    { icon: "fa-apple-whole", color: "#ff2d55", weight: 3, name: "甜美草莓", score: 100 },
    { icon: "fa-cookie-bite", color: "#c68a4c", weight: 5, name: "美味餅乾", score: 200 },
    { icon: "fa-gem", color: "#5ac8fa", weight: 10, name: "璀璨藍寶石", score: 500 },
    { icon: "fa-coins", color: "#ffcc00", weight: 8, name: "古老金幣", score: 350 },
    { icon: "fa-graduation-cap", color: "#5856d6", weight: 15, name: "雲教授的魔導帽", score: 1000 },
    { icon: "fa-floppy-disk", color: "#8e8e93", weight: 6, name: "古董磁碟片", score: 300 }
];

// 2. 音效合成器 (Web Audio API)
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterVolume = 0.4;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    setVolume(val) {
        this.masterVolume = val;
    }

    // 播放「嗶嗶」哨音 (Whistle)
    playWhistle() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // 兩個音階的哨子聲
        this.beep(880, 0.08, now);
        this.beep(880, 0.08, now + 0.1);
        this.beep(1200, 0.25, now + 0.2);
    }

    beep(freq, duration, time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(this.masterVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
    }

    // 播放「啵」拔起聲 (Pluck)
    playPluck() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // 快速頻率滑音
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        
        gain.gain.setValueAtTime(this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
    }

    // 播放「咻-啪嘰」投擲與落地聲
    playThrow() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // 拋出時向上滑音
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playLand() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        // 落地時的低頻彈跳聲
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        
        gain.gain.setValueAtTime(this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // 播放「驚慌」溺水/著火叫聲
    playPanic() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        // 快速上下起伏的高頻警報聲
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.05);
        osc.frequency.linearRampToValueAtTime(800, now + 0.1);
        
        gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // 播放「得分」成功搬運聲
    playScore() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // 歡樂的大三和弦滑音
        this.beep(523.25, 0.08, now); // C5
        this.beep(659.25, 0.08, now + 0.08); // E5
        this.beep(783.99, 0.08, now + 0.16); // G5
        this.beep(1046.50, 0.25, now + 0.24); // C6
    }
}

const sounds = new SoundEngine();

// 3. 遊戲狀態變數
const state = {
    score: 0,
    isNight: false,
    whistleActive: false,
    selectedPikmin: null, // 用於投擲預備
    followMode: false,    // 是否正處於吹哨跟隨模式
    guyX: 100,            // 吉祥物 X (左下角)
    guyY: window.innerHeight - 150, // 吉祥物 Y
    pikminCount: 0,
    pluckedCount: 0
};

// 全域實體陣列
let pikmins = [];
let sprouts = [];
let treasures = [];
let particles = [];

// 4. 初始化與 DOM 綁定
document.addEventListener("DOMContentLoaded", () => {
    // 獲取 DOM 節點
    const overlay = document.getElementById("start-overlay");
    const btnEnter = document.getElementById("btn-enter");
    const bgMusic = document.getElementById("bg-music");
    const btnMusicToggle = document.getElementById("btn-music-toggle");
    const volumeSlider = document.getElementById("volume-slider");
    const btnDayNight = document.getElementById("btn-day-night");
    const btnPluckAll = document.getElementById("btn-pluck-all");
    const btnSpawnTreasure = document.getElementById("btn-spawn-treasure");
    const guy = document.getElementById("liyu-chill-guy");
    const scoreVal = document.getElementById("score-val");
    const countVal = document.getElementById("pikmin-count-val");
    const stage = document.getElementById("game-stage");
    
    // 初始化吉祥物位置 (調整初始高度以對應 140px 的吉祥物)
    state.guyX = 80;
    state.guyY = window.innerHeight - 200;
    updateGuyPosition();

    // 4.0A 華麗滑鼠星塵軌跡特效
    stage.addEventListener("mousemove", (e) => {
        if (Math.random() < 0.15) {
            const p = document.createElement("div");
            p.className = "trail-particle";
            p.style.left = `${e.clientX}px`;
            p.style.top = `${e.clientY}px`;
            
            const colors = ["#38bdf8", "#0ea5e9", "#ffcc00", "#ff3b30", "#4cd964", "#af52de"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.background = randomColor;
            p.style.boxShadow = `0 0 8px ${randomColor}, 0 0 16px ${randomColor}`;
            
            const size = 5 + Math.random() * 7;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            
            stage.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    });

    // 4.0B 背景發光精靈孢子飄浮特效
    setInterval(() => {
        if (document.hidden) return;
        const sp = document.createElement("div");
        sp.className = "bg-spore";
        sp.style.left = `${Math.random() * 100}%`;
        sp.style.bottom = `-20px`;
        
        const size = 3 + Math.random() * 5;
        sp.style.width = `${size}px`;
        sp.style.height = `${size}px`;
        
        stage.appendChild(sp);
        setTimeout(() => sp.remove(), 12000);
    }, 500);

    // 4.1 點擊進入花園 (解決音樂與音效安全策略)
    btnEnter.addEventListener("click", () => {
        sounds.init();
        overlay.classList.add("hide");
        
        // 播放背景音樂
        bgMusic.volume = volumeSlider.value;
        bgMusic.play().then(() => {
            document.getElementById("music-player").classList.add("playing");
            btnMusicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }).catch(err => console.log("音樂播放受阻：", err));
        
        // 產生初始的 17 位成員嫩芽
        spawnSprouts();
        
        // 啟動主迴圈
        requestAnimationFrame(updateLoop);
    });

    // 4.2 背景音樂開關與音量控制
    btnMusicToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            document.getElementById("music-player").classList.add("playing");
            btnMusicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            bgMusic.pause();
            document.getElementById("music-player").classList.remove("playing");
            btnMusicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        bgMusic.volume = val;
        sounds.setVolume(val);
        if (val === 0) {
            btnMusicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
            btnMusicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
    });

    // 4.3 日夜模式切換
    btnDayNight.addEventListener("click", () => {
        state.isNight = !state.isNight;
        if (state.isNight) {
            document.body.classList.add("night-mode");
            btnDayNight.innerHTML = '<i class="fa-solid fa-sun text-gold"></i>';
            btnDayNight.title = "切換為白天";
        } else {
            document.body.classList.remove("night-mode");
            btnDayNight.innerHTML = '<i class="fa-solid fa-moon"></i>';
            btnDayNight.title = "切換為夜晚";
        }
    });

    // 4.4 一鍵拔出所有成員
    btnPluckAll.addEventListener("click", () => {
        sounds.init();
        if (sprouts.length === 0) return;
        
        // 複製一份陣列來遍歷，避免拔出時修改陣列長度造成問題
        const currentSprouts = [...sprouts];
        currentSprouts.forEach((sprout, index) => {
            setTimeout(() => {
                pluckSprout(sprout);
            }, index * 100);
        });
    });

    // 4.5 召喚寶物
    btnSpawnTreasure.addEventListener("click", () => {
        sounds.init();
        spawnRandomTreasure();
    });

    // 4.6 吉祥物拖曳與哨音系統 (Pointer Events)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let hasMoved = false;

    guy.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        sounds.init();
        isDragging = true;
        hasMoved = false;
        
        // 記錄起點，相對於吉祥物目前位置
        dragStartX = e.clientX - state.guyX;
        dragStartY = e.clientY - state.guyY;
        
        guy.setPointerCapture(e.pointerId);
    });

    guy.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        hasMoved = true;
        
        let newX = e.clientX - dragStartX;
        let newY = e.clientY - dragStartY;
        
        // 限制在舞台邊界內 (考慮大兩倍的吉祥物寬高 140px)
        newX = Math.max(10, Math.min(window.innerWidth - 150, newX));
        newY = Math.max(80, Math.min(window.innerHeight - 150, newY));
        
        state.guyX = newX;
        state.guyY = newY;
        updateGuyPosition();
    });

    guy.addEventListener("pointerup", (e) => {
        if (!isDragging) return;
        isDragging = false;
        guy.releasePointerCapture(e.pointerId);
        
        // 如果沒有明顯移動，視為點擊，觸發吹哨子
        if (!hasMoved) {
            triggerWhistle();
        }
    });

    // 雙擊背景可以投擲當前選中的皮克敏，單擊背景產生寶物
    stage.addEventListener("click", (e) => {
        // 如果點擊的是按鈕或互動元素，不要觸發
        if (e.target.closest("button") || e.target.closest(".glass-panel") || e.target.closest(".draggable-guy") || e.target.closest(".pikmin-entity") || e.target.closest(".treasure-entity")) {
            return;
        }

        sounds.init();
        
        // 如果有選中準備投擲的皮克敏
        if (state.selectedPikmin) {
            throwPikmin(state.selectedPikmin, e.clientX, e.clientY);
            state.selectedPikmin = null;
            document.body.style.cursor = "default";
        } else {
            // 在點擊位置召喚寶物
            spawnTreasureAt(e.clientX, e.clientY);
        }
    });

    // 視窗大小改變時更新邊界
    window.addEventListener("resize", () => {
        state.guyY = Math.min(state.guyY, window.innerHeight - 80);
        updateGuyPosition();
    });
});

// 更新吉祥物位置
function updateGuyPosition() {
    const guy = document.getElementById("liyu-chill-guy");
    if (guy) {
        guy.style.left = `${state.guyX}px`;
        guy.style.top = `${state.guyY}px`;
    }
}

// 5. 哨音系統 (Whistle)
function triggerWhistle() {
    if (state.whistleActive) return;
    state.whistleActive = true;
    
    // 撥放嗶嗶聲
    sounds.playWhistle();
    
    // 啟動哨音光環動畫
    const ring = document.querySelector(".whistle-glow");
    ring.classList.add("active");
    
    // 取得哨子中心點 (吉祥物中心，寬高 140px 故中心點 +70)
    const whistleCenterX = state.guyX + 70;
    const whistleCenterY = state.guyY + 70;

    // 定期偵測是否有皮克敏在擴散的哨音範圍內
    const whistleRadius = 200; // 最大擴散半徑
    
    pikmins.forEach(p => {
        // 計算距離
        const dx = p.x - whistleCenterX;
        const dy = p.y - whistleCenterY;
        const dist = Math.hypot(dx, dy);
        
        // 如果在半徑內，招募進隊伍
        if (dist <= whistleRadius) {
            setTimeout(() => {
                p.status = "follow";
                p.targetTreasure = null;
                // 產生小音樂音符粒子
                createNotesParticles(p.x, p.y);
            }, dist * 1.5); // 隨光環擴散時間漸次招募
        }
    });

    // 設定跟隨模式開啟
    state.followMode = true;

    // 動畫結束後移除 active class
    setTimeout(() => {
        ring.classList.remove("active");
        state.whistleActive = false;
    }, 600);
}

// 6. 生成嫩芽 (Seed Spawning)
function spawnSprouts() {
    const stage = document.getElementById("game-stage");
    
    // 清除現有
    document.querySelectorAll(".pikmin-sprout").forEach(el => el.remove());
    sprouts = [];
    
    // 計算每棵嫩芽的位置，使其分佈均勻好看
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    
    MEMBER_DATA.forEach((member, i) => {
        // 隨機在舞台中下部生成位置 (避開邊界與危險區)
        const x = 100 + Math.random() * (stageWidth - 250);
        const y = 300 + Math.random() * (stageHeight - 450);
        
        // 建立 DOM 元素
        const el = document.createElement("div");
        el.className = "pikmin-sprout";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.title = `這是一棵嫩芽，點擊拔出社員 ${member.name}！`;
        
        // 嫩芽內部的綠葉與泥土
        el.innerHTML = `
            <div class="pikmin-plant">
                <div class="plant-stem"></div>
                <div class="plant-leaf"></div>
            </div>
            <div class="sprout-dirt"></div>
        `;
        
        stage.appendChild(el);
        
        const sproutData = {
            id: i,
            x: x,
            y: y,
            element: el,
            memberInfo: member
        };
        
        // 點擊拔出
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            pluckSprout(sproutData);
        });
        
        sprouts.push(sproutData);
    });

    updateCounters();
}

// 7. 拔出皮克敏 (Pluck Sprout)
function pluckSprout(sprout) {
    // 從 sprouts 陣列中移除
    const index = sprouts.indexOf(sprout);
    if (index === -1) return;
    sprouts.splice(index, 1);
    
    // 移除嫩芽 DOM
    if (sprout.element && sprout.element.parentNode) {
        sprout.element.parentNode.removeChild(sprout.element);
    }
    
    // 播放音效
    sounds.playPluck();
    
    // 產生泥土噴濺粒子
    createDirtParticles(sprout.x + 12, sprout.y + 35);
    
    // 產生皮克敏社員實體
    spawnPikmin(sprout.memberInfo, sprout.x, sprout.y);
    
    // 增加分數
    addScore(50);
    
    state.pluckedCount++;
    updateCounters();

    // 如果全部拔出，顯示鼓勵提示
    if (sprouts.length === 0) {
        const hint = document.getElementById("instruction-hint");
        hint.innerHTML = '<span class="hint-text text-green"><i class="fa-solid fa-star"></i> 太棒了！所有皮克敏社員已全數拔出！現在可以派他們去搬運寶物了！</span>';
    }
}

// 8. 產生皮克敏實體 (Spawn Pikmin)
function spawnPikmin(memberInfo, x, y) {
    const stage = document.getElementById("game-stage");
    
    // 建立皮克敏 DOM
    const el = document.createElement("div");
    el.className = `pikmin-entity type-${memberInfo.type}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    // 職稱顯示判定
    let displayName = memberInfo.name;
    if (memberInfo.name === "邱俐瑜") {
        displayName += " (指導老師)";
    } else if (memberInfo.name === "張家睿") {
        displayName += " (社長)";
    } else if (memberInfo.name === "田竣翔" || memberInfo.name === "郭宸希") {
        displayName += " (副社長)";
    }
    
    el.innerHTML = `
        <div class="pikmin-avatar">
            <img src="member/${memberInfo.filename}" alt="${memberInfo.name}" draggable="false">
        </div>
        <div class="pikmin-label">${displayName}</div>
    `;
    
    stage.appendChild(el);
    
    const pikminData = {
        id: memberInfo.filename,
        name: memberInfo.name,
        type: memberInfo.type,
        info: memberInfo,
        element: el,
        // 物理屬性
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: x,
        targetY: y,
        // 行為狀態機：'idle' (閒逛), 'follow' (跟隨), 'carry' (搬運), 'thrown' (被丟), 'drowning' (落水), 'onfire' (著火)
        status: 'idle',
        targetTreasure: null,
        panicTimer: 0,
        // 動畫微調
        waddleTime: Math.random() * 100,
        jumpOffset: 0,
        gravityY: 0
    };

    // 點擊事件：單擊選中準備投擲 / 雙擊開啟個人卡片
    let lastClickTime = 0;
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        sounds.init();
        
        const now = Date.now();
        if (now - lastClickTime < 300) {
            // 雙擊：開啟卡片
            showMemberModal(memberInfo);
        } else {
            // 單擊：選中準備投擲
            selectPikminForThrow(pikminData);
        }
        lastClickTime = now;
    });
    
    pikmins.push(pikminData);
    updateCounters();
}

// 選中皮克敏準備投擲
function selectPikminForThrow(pikmin) {
    // 清除之前選中的
    if (state.selectedPikmin) {
        state.selectedPikmin.element.classList.remove("selected");
    }
    
    state.selectedPikmin = pikmin;
    pikmin.element.classList.add("selected");
    
    // 改變鼠標指針提示投擲
    document.body.style.cursor = "crosshair";
    
    // 修改提示文字
    const hint = document.getElementById("instruction-hint");
    hint.innerHTML = `<span class="hint-text"><i class="fa-solid fa-bullseye"></i> 投擲模式：點擊畫面上任意位置，將 <b>${pikmin.name}</b> 丟過去！</span>`;
}

// 投擲皮克敏
function throwPikmin(pikmin, targetX, targetY) {
    pikmin.element.classList.remove("selected");
    
    // 物理初始計算：建立拋物線
    pikmin.status = 'thrown';
    pikmin.x = pikmin.x;
    pikmin.y = pikmin.y;
    
    // 計算水平距離與垂直發射速度
    const dx = targetX - pikmin.x;
    const dy = targetY - pikmin.y;
    const distance = Math.hypot(dx, dy);
    
    // 黃皮克敏丟得特別高/遠
    const throwHeightFactor = (pikmin.type === 'yellow') ? 1.5 : 1.0;
    
    // 設定拋物線初速度
    const timeToTarget = 30; // 30 影格完成飛行
    pikmin.vx = dx / timeToTarget;
    
    // 物理初速公式：vy = dy / t - 0.5 * g * t
    const gravity = 0.5; // 每影格重力
    pikmin.vy = (dy / timeToTarget) - (0.5 * gravity * timeToTarget * throwHeightFactor);
    pikmin.gravityY = gravity * throwHeightFactor;
    
    // 目標落地點
    pikmin.targetX = targetX;
    pikmin.targetY = targetY;
    pikmin.flightTime = timeToTarget;
    pikmin.elapsedFlightTime = 0;
    
    // 播放丟出音效
    sounds.playThrow();
    
    // 產生風軌粒子
    createWindParticles(pikmin.x, pikmin.y);
}

// 9. 寶物系統 (Treasure Spawning & Carrying)
// 隨機召喚寶物
function spawnRandomTreasure() {
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    
    const rx = 150 + Math.random() * (stageWidth - 400);
    const ry = 250 + Math.random() * (stageHeight - 400);
    
    spawnTreasureAt(rx, ry);
}

function spawnTreasureAt(x, y) {
    const stage = document.getElementById("game-stage");
    
    // 隨機選一個寶物類型
    const type = TREASURE_TYPES[Math.floor(Math.random() * TREASURE_TYPES.length)];
    
    const el = document.createElement("div");
    el.className = "treasure-entity";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    el.innerHTML = `
        <div class="treasure-weight"><span class="carry-power-val">0</span> / ${type.weight}</div>
        <i class="fa-solid ${type.icon} treasure-icon" style="color: ${type.color}"></i>
    `;
    
    stage.appendChild(el);
    
    const treasureData = {
        id: Date.now() + Math.random(),
        name: type.name,
        score: type.score,
        weight: type.weight,
        color: type.color,
        icon: type.icon,
        element: el,
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        vx: 0,
        vy: 0,
        carriers: [] // 綁定的皮克敏陣列
    };
    
    treasures.push(treasureData);
    
    // 指派附近「閒逛」的皮克敏前來搬運
    assignPikminsToTreasure(treasureData);
}

// 指派皮克敏去搬運
function assignPikminsToTreasure(treasure) {
    // 尋找空閒的皮克敏
    const idlePikmins = pikmins.filter(p => p.status === 'idle');
    
    // 根據距離排序，由近到遠
    idlePikmins.sort((a, b) => {
        const distA = Math.hypot(a.x - treasure.x, a.y - treasure.y);
        const distB = Math.hypot(b.x - treasure.x, b.y - treasure.y);
        return distA - distB;
    });
    
    // 每隻皮克敏前往幫忙
    idlePikmins.forEach(p => {
        // 如果皮克敏距離小於 400，則前往搬運
        const dist = Math.hypot(p.x - treasure.x, p.y - treasure.y);
        if (dist < 500) {
            p.status = 'carry';
            p.targetTreasure = treasure;
            treasure.carriers.push(p);
        }
    });
}

// 10. 成員資訊彈窗 (Modal Card)
function showMemberModal(memberInfo) {
    const modal = document.getElementById("member-modal");
    const img = document.getElementById("modal-img");
    const name = document.getElementById("modal-name");
    const role = document.getElementById("modal-role");
    const badge = document.getElementById("modal-type-badge");
    const ability = document.getElementById("modal-ability");
    const flavor = document.getElementById("modal-flavor");
    
    // 屬性條
    const strBar = document.getElementById("stat-strength");
    const spdBar = document.getElementById("stat-speed");
    const resBar = document.getElementById("stat-resist");
    const strVal = document.getElementById("stat-strength-val");
    
    const typeDetails = PIKMIN_TYPES[memberInfo.type];
    
    // 設定數值
    img.src = `member/${memberInfo.filename}`;
    name.innerText = memberInfo.name;
    role.innerText = memberInfo.role;
    
    badge.innerText = typeDetails.label;
    badge.className = `type-badge ${memberInfo.type}`;
    
    ability.innerText = typeDetails.ability;
    flavor.innerText = `「${typeDetails.flavor}」`;
    
    // 屬性圖表百分比計算 (假設最大值是 10)
    strVal.innerText = typeDetails.strength;
    strBar.style.width = `${(typeDetails.strength / 10) * 100}%`;
    spdBar.style.width = `${(typeDetails.speed / 10) * 100}%`;
    resBar.style.width = `${(typeDetails.resist / 10) * 100}%`;
    
    // 秀出彈窗
    modal.classList.add("show");
    
    // 綁定關閉
    const closeBtn = modal.querySelector(".btn-close-modal");
    const closeHandler = () => {
        modal.classList.remove("show");
        closeBtn.removeEventListener("click", closeHandler);
    };
    closeBtn.addEventListener("click", closeHandler);
    
    // 點擊遮罩外部也能關閉
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    }, { once: true });
}

// 11. 輔助函數：計數器與得分更新
function addScore(amount) {
    state.score += amount;
    const scoreVal = document.getElementById("score-val");
    if (scoreVal) {
        scoreVal.innerText = state.score;
        // 得分縮放動畫
        scoreVal.style.transform = "scale(1.3)";
        setTimeout(() => scoreVal.style.transform = "scale(1)", 200);
    }
}

function updateCounters() {
    const countVal = document.getElementById("pikmin-count-val");
    if (countVal) {
        countVal.innerText = `${pikmins.length} / 17`;
    }
}

// 12. 粒子系統 (Particle Systems)
// 噴濺泥土粒子 (Pluck)
function createDirtParticles(x, y) {
    const stage = document.getElementById("game-stage");
    for (let i = 0; i < 12; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.backgroundColor = "#5c3d24"; // 泥土色
        
        const size = 4 + Math.random() * 6;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        
        stage.appendChild(p);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        
        particles.push({
            element: p,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3, // 往上噴發
            gravity: 0.2,
            life: 30 + Math.random() * 20
        });
    }
}

// 吹哨音樂音符粒子
function createNotesParticles(x, y) {
    const stage = document.getElementById("game-stage");
    const icons = ["fa-music", "fa-heart", "fa-note-sticky"];
    const colors = ["#ff2d55", "#ffcc00", "#007aff", "#4cd964", "#af52de"];
    
    for (let i = 0; i < 3; i++) {
        const p = document.createElement("div");
        p.className = "particle fa-solid " + icons[Math.floor(Math.random() * icons.length)];
        p.style.color = colors[Math.floor(Math.random() * colors.length)];
        p.style.fontSize = "12px";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        
        stage.appendChild(p);
        
        particles.push({
            element: p,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2,
            gravity: -0.05, // 向上飄浮
            life: 40 + Math.random() * 20
        });
    }
}

// 風軌粒子 (Throw)
function createWindParticles(x, y) {
    const stage = document.getElementById("game-stage");
    for (let i = 0; i < 5; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.backgroundColor = "rgba(255,255,255,0.6)";
        p.style.width = "4px";
        p.style.height = "4px";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        
        stage.appendChild(p);
        
        particles.push({
            element: p,
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            gravity: 0,
            life: 15
        });
    }
}

// 洋蔥基地吸入寶物七彩紙屑 (Confetti)
function createConfetti(x, y) {
    const stage = document.getElementById("game-stage");
    const colors = ["#ff2d55", "#ffcc00", "#007aff", "#4cd964", "#af52de", "#ff9500", "#00f0ff"];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const w = 6 + Math.random() * 6;
        const h = 4 + Math.random() * 4;
        p.style.width = `${w}px`;
        p.style.height = `${h}px`;
        p.style.borderRadius = "2px";
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        
        stage.appendChild(p);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        
        particles.push({
            element: p,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            gravity: 0.15,
            life: 50 + Math.random() * 30
        });
    }
}

// 13. 核心物理與 AI 更新迴圈 (Physics Update Loop)
function updateLoop() {
    const stageWidth = window.innerWidth;
    const stageHeight = window.innerHeight;
    
    // 13.1 更新皮克敏
    pikmins.forEach((p, idx) => {
        p.waddleTime += 1;
        
        // 取得危險區域節點，用於環境反應
        const water = document.getElementById("water-pool");
        const fire = document.getElementById("fire-pit");
        const onion = document.getElementById("onion-base");
        
        const waterRect = water ? water.getBoundingClientRect() : null;
        const fireRect = fire ? fire.getBoundingClientRect() : null;
        const onionRect = onion ? onion.getBoundingClientRect() : null;

        // --- 狀態機邏輯 ---
        
        // A. 著火或落水驚慌狀態
        if (p.status === 'drowning' || p.status === 'onfire') {
            p.panicTimer--;
            
            // 隨機亂跑物理
            p.vx += (Math.random() - 0.5) * 1.5;
            p.vy += (Math.random() - 0.5) * 1.5;
            // 減速以防暴衝
            p.vx *= 0.9;
            p.vy *= 0.9;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // 每隔一小段時間發出驚慌叫聲
            if (p.panicTimer % 15 === 0) {
                sounds.playPanic();
                // 產生驚慌小水花或小火花粒子
                createWindParticles(p.x + 22, p.y + 22);
            }
            
            if (p.panicTimer <= 0) {
                // 恢復閒逛，並彈開到安全區域
                p.status = 'idle';
                if (p.info.type !== 'blue') p.y -= 40; // 逃離水池
                if (p.info.type !== 'red') p.x += 60;  // 逃離火坑
            }
        }
        
        // B. 被丟擲空中狀態
        else if (p.status === 'thrown') {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravityY; // 重力下落
            
            // 產生風軌粒子
            if (p.waddleTime % 3 === 0) {
                createWindParticles(p.x + 22, p.y + 22);
            }
            
            // 判斷是否落地（接近目標點或超出舞台下邊界，考慮皮克敏高度 110px）
            const distToTarget = Math.hypot(p.x - p.targetX, p.y - p.targetY);
            if (distToTarget < 15 || p.y >= stageHeight - 110) {
                p.status = 'idle';
                p.vx = 0;
                p.vy = 0;
                sounds.playLand();
                createDirtParticles(p.x + 22, p.y + 44);
                
                // 落地後若剛好在危險區，立即觸發反應
                checkHazards(p, waterRect, fireRect);
            }
        }
        
        // C. 跟隨隊長狀態
        else if (p.status === 'follow') {
            // 毛毛蟲跟隨邏輯：前面有一隻皮克敏就跟隨它，第一隻跟隨吉祥物
            let targetX, targetY;
            
            if (idx === 0 || pikmins[idx - 1].status !== 'follow') {
                // 跟隨 LiyuChillGuy 的屁股（寬高 140px，目標設在後方中央）
                targetX = state.guyX + 70;
                targetY = state.guyY + 120;
            } else {
                // 跟隨隊伍前一隻
                targetX = pikmins[idx - 1].x;
                targetY = pikmins[idx - 1].y;
            }
            
            const dx = targetX - p.x;
            const dy = targetY - p.y;
            const dist = Math.hypot(dx, dy);
            
            // 移動速度
            const speed = PIKMIN_TYPES[p.type].speed;
            
            if (dist > 85) {
                p.vx = (dx / dist) * speed;
                p.vy = (dy / dist) * speed;
                p.x += p.vx;
                p.y += p.vy;
                p.element.classList.add("walking");
                
                // 加點跳躍感（波浪跳動前進）
                const jumpOffset = Math.abs(Math.sin(p.waddleTime * 0.15)) * 10;
                p.element.querySelector(".pikmin-avatar").style.transform = `translateY(-${jumpOffset}px)`;
            } else {
                p.vx = 0;
                p.vy = 0;
                p.element.classList.remove("walking");
                p.element.querySelector(".pikmin-avatar").style.transform = `translateY(0)`;
            }
            
            // 檢查是否不小心踩到危險區
            checkHazards(p, waterRect, fireRect);
        }
        
        // D. 搬運寶物狀態
        else if (p.status === 'carry') {
            const treasure = p.targetTreasure;
            
            // 如果寶物已被洋蔥吸走或不存在
            if (!treasure || !treasures.includes(treasure)) {
                p.status = 'idle';
                p.targetTreasure = null;
                return;
            }
            
            // 行走去寶物周圍
            const dx = treasure.x - p.x;
            const dy = treasure.y - p.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist > 30) {
                // 前往寶物
                const speed = PIKMIN_TYPES[p.type].speed;
                p.vx = (dx / dist) * speed;
                p.vy = (dy / dist) * speed;
                p.x += p.vx;
                p.y += p.vy;
                p.element.classList.add("walking");
            } else {
                // 已抵達，在寶物周圍圍繞（頂在頭上）
                p.vx = 0;
                p.vy = 0;
                p.element.classList.remove("walking");
                
                // 讓皮克敏位於寶物的底部，營造出合力扛起來的視覺效果 (考慮皮克敏再次變大，加大圍繞半徑與位置偏移)
                const carrierIndex = treasure.carriers.indexOf(p);
                const angle = (carrierIndex / Math.max(1, treasure.carriers.length)) * Math.PI * 2;
                p.x = treasure.x + Math.cos(angle) * 55 - 75;
                p.y = treasure.y + Math.sin(angle) * 30 + 45;
            }
        }
        
        // E. 閒逛狀態 (Idle)
        else if (p.status === 'idle') {
            // 隨機漫步：每隔一段時間改變方向
            if (p.waddleTime % 80 === 0 && Math.random() < 0.4) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + Math.random() * 0.8;
                p.vx = Math.cos(angle) * speed;
                p.vy = Math.sin(angle) * speed;
            }
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
                p.element.classList.add("walking");
            } else {
                p.element.classList.remove("walking");
            }
            
            // 邊界防禦與反彈 (考慮皮克敏寬高 170px)
            if (p.x < 10) { p.x = 10; p.vx *= -1; }
            if (p.x > stageWidth - 170) { p.x = stageWidth - 170; p.vx *= -1; }
            if (p.y < 90) { p.y = 90; p.vy *= -1; }
            if (p.y > stageHeight - 170) { p.y = stageHeight - 170; p.vy *= -1; }
            
            // 檢查危險區域反應
            checkHazards(p, waterRect, fireRect);
        }
        
        // 更新皮克敏的 DOM 位置
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
    });

    // 13.2 更新寶物物理與搬運邏輯
    for (let i = treasures.length - 1; i >= 0; i--) {
        const t = treasures[i];
        
        // 計算當前搬運總力量
        let currentPower = 0;
        t.carriers.forEach(p => {
            currentPower += PIKMIN_TYPES[p.type].strength;
        });
        
        // 更新寶物頭頂顯示的力量比率
        const powerLabel = t.element.querySelector(".carry-power-val");
        if (powerLabel) {
            powerLabel.innerText = Math.floor(currentPower);
        }
        
        const weightLabel = t.element.querySelector(".treasure-weight");
        if (currentPower >= t.weight) {
            // 力量充足：寶物朝洋蔥飛船移動！
            weightLabel.style.backgroundColor = "#4cd964"; // 綠色表示開始移動
            
            // 洋蔥基地中心點位置
            const onionX = window.innerWidth - 140; 
            const onionY = 190;
            
            const tdx = onionX - t.x;
            const tdy = onionY - t.y;
            const tdist = Math.hypot(tdx, tdy);
            
            if (tdist > 40) {
                // 搬運速度依據超出多少力量而定
                const baseSpeed = 1.0;
                const bonusSpeed = (currentPower - t.weight) * 0.1;
                const speed = Math.min(3.0, baseSpeed + bonusSpeed);
                
                t.vx = (tdx / tdist) * speed;
                t.vy = (tdy / tdist) * speed;
                t.x += t.vx;
                t.y += t.vy;
            } else {
                // 抵達洋蔥基地！吸入寶物！
                sounds.playScore();
                createConfetti(t.x + 22, t.y + 22);
                
                // 加分
                addScore(t.score);
                
                // 解散所有搬運工皮克敏，讓他們回復閒逛
                t.carriers.forEach(p => {
                    p.status = 'idle';
                    p.targetTreasure = null;
                    // 被洋蔥彈開一小段距離
                    p.vx = (Math.random() - 0.5) * 3;
                    p.vy = 2 + Math.random() * 2;
                });
                
                // 移除寶物 DOM
                if (t.element && t.element.parentNode) {
                    t.element.parentNode.removeChild(t.element);
                }
                
                treasures.splice(i, 1);
                continue;
            }
        } else {
            // 力量不足：寶物不動，重力將其穩固在地面
            weightLabel.style.backgroundColor = "rgba(0,0,0,0.7)";
            t.vx = 0;
            t.vy = 0;
            
            // 如果皮克敏都跑了，且寶物不在底線，緩慢下落到地面
            if (t.y < stageHeight - 120 && t.carriers.length === 0) {
                t.y += 1.5; // 模擬自然落下
            }
        }
        
        // 更新寶物 DOM 位置
        t.element.style.left = `${t.x}px`;
        t.element.style.top = `${t.y}px`;
    }

    // 13.3 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += pt.gravity;
        pt.life--;
        
        pt.element.style.left = `${pt.x}px`;
        pt.element.style.top = `${pt.y}px`;
        
        // 生命結束則移除
        if (pt.life <= 0) {
            if (pt.element && pt.element.parentNode) {
                pt.element.parentNode.removeChild(pt.element);
            }
            particles.splice(i, 1);
        }
    }

    // 繼續主迴圈
    requestAnimationFrame(updateLoop);
}

// 14. 輔助：檢測皮克敏與水/火危險區域碰撞反應
function checkHazards(p, waterRect, fireRect) {
    if (!waterRect && !fireRect) return;
    
    // 計算皮克敏腳部中心點
    const px = p.x + 27;
    const py = p.y + 44;
    
    // 檢查水池區 (排除藍皮克敏與漂浮的發光皮克敏)
    if (waterRect && p.info.type !== 'blue' && p.info.type !== 'glow') {
        const waterLeft = waterRect.left;
        const waterRight = waterRect.right;
        const waterTop = waterRect.top;
        const waterBottom = waterRect.bottom;
        
        // 水池大致是橢圓形，作簡單的矩形與邊緣收縮判定
        if (px > waterLeft + 20 && px < waterRight - 20 && py > waterTop + 10 && py < waterBottom - 10) {
            if (p.status !== 'drowning') {
                p.status = 'drowning';
                p.panicTimer = 180; // 溺水 3 秒後自動脫險
                p.vx = (Math.random() - 0.5) * 3;
                p.vy = (Math.random() - 0.5) * 3;
            }
        }
    }
    
    // 檢查火堆區 (排除紅皮克敏與漂浮的發光皮克敏)
    if (fireRect && p.info.type !== 'red' && p.info.type !== 'glow') {
        const fireLeft = fireRect.left;
        const fireRight = fireRect.right;
        const fireTop = fireRect.top;
        const fireBottom = fireRect.bottom;
        
        if (px > fireLeft && px < fireRight && py > fireTop && py < fireBottom) {
            if (p.status !== 'onfire') {
                p.status = 'onfire';
                p.panicTimer = 120; // 著火 2 秒後跑開
                p.vx = (Math.random() - 0.5) * 5;
                p.vy = (Math.random() - 0.5) * 5;
            }
        }
    }
}
