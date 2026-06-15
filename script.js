const screens = [
  "introScreen",
  "trustScreen",
  "foreverScreen",
  "memoriesScreen",
  "envelopeScreen",
  "letterScreen",
  "celebrateScreen",
];

const memories = [
  {
    title: "Our First Spark",
    icon: "🌳",
    from: "#63d3ff",
    to: "#8bd66d",
  },
  {
    title: "Golden Evenings",
    icon: "🌅",
    from: "#ff9f43",
    to: "#ff4f9a",
  },
  {
    title: "Quiet Nights",
    icon: "🌙",
    from: "#172554",
    to: "#b83280",
  },
];

let currentScreen = 0;
let currentMemory = 0;
const $ = (selector) => document.querySelector(selector);
const screenEls = screens.map((id) => document.getElementById(id));
const backButton = $("#backButton");
const soundText = $("#soundText");
const music = $("#music");
let fireworksTimer;
let musicAllowed = true;
let wasOnMusicPage = false;
let birthCounterTimer;
let runawayResetTimer;
const musicScreens = [3, 4, 5];
const birthDate = new Date(2000, 6, 22, 0, 0, 0);

function showScreen(index) {
  currentScreen = Math.max(0, Math.min(index, screens.length - 1));
  screenEls.forEach((screen, i) => screen.classList.toggle("active", i === currentScreen));
  backButton.classList.toggle("hidden", currentScreen === 0 || currentScreen === screens.length - 1);
  window.scrollTo({ top: 0, behavior: "smooth" });
  syncPageMusic();

  if (currentScreen === screens.indexOf("celebrateScreen")) {
    startCelebrationEffects();
  } else {
    stopCelebrationEffects();
  }
}

function playPageMusic(restart = false) {
  soundText.textContent = "On";

  if (restart) {
    music.currentTime = 0;
  }

  music.play().catch(() => {
    soundText.textContent = "Tap";
  });
}

function stopPageMusic() {
  soundText.textContent = "Off";
  music.pause();
}

function syncPageMusic() {
  const isOnMusicPage = musicScreens.includes(currentScreen);

  if (isOnMusicPage && musicAllowed) {
    playPageMusic(currentScreen === 3 && !wasOnMusicPage);
  } else {
    stopPageMusic();
  }

  wasOnMusicPage = isOnMusicPage;
}

function makeParticles() {
  const particleLayer = $(".particles");
  const symbols = ["", "", "", "♥", "✦"];

  for (let i = 0; i < 58; i += 1) {
    const dot = document.createElement("span");
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    dot.textContent = symbol;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${8 + Math.random() * 12}s`;
    dot.style.animationDelay = `${Math.random() * -18}s`;
    dot.style.transform = `scale(${0.55 + Math.random() * 1.3})`;

    if (symbol) {
      dot.style.width = "auto";
      dot.style.height = "auto";
      dot.style.background = "transparent";
      dot.style.color = "var(--pink)";
      dot.style.fontSize = `${0.7 + Math.random() * 0.9}rem`;
    }

    particleLayer.appendChild(dot);
  }
}

function makeConfetti() {
  const confettiLayer = $(".confetti");
  const colors = ["#ff3f9d", "#ff7abd", "#a855f7", "#f472b6", "#fb7185"];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.width = `${6 + Math.random() * 12}px`;
    piece.style.height = `${6 + Math.random() * 12}px`;
    piece.style.borderRadius = Math.random() > 0.55 ? "50%" : "2px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${5 + Math.random() * 7}s`;
    piece.style.animationDelay = `${Math.random() * -8}s`;
    confettiLayer.appendChild(piece);
  }
}

function createFirework() {
  const layer = $("#fireworks");
  const burst = document.createElement("span");
  const colors = ["#ff3f9d", "#ff7abd", "#ffd166", "#a855f7", "#35c784"];

  burst.className = "firework";
  burst.style.left = `${12 + Math.random() * 76}%`;
  burst.style.top = `${8 + Math.random() * 44}%`;
  burst.style.color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 18; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.setProperty("--angle", `${i * 20}deg`);
    spark.style.animationDelay = `${Math.random() * 90}ms`;
    burst.appendChild(spark);
  }

  layer.appendChild(burst);
  setTimeout(() => burst.remove(), 1300);
}

function startCelebrationEffects() {
  stopCelebrationEffects();
  $("#fireworks").innerHTML = "";

  for (let i = 0; i < 5; i += 1) {
    setTimeout(createFirework, i * 260);
  }

  fireworksTimer = setInterval(createFirework, 650);
}

function stopCelebrationEffects() {
  clearInterval(fireworksTimer);
  fireworksTimer = undefined;
}

function updateBirthCounter() {
  const counter = $("#birthCounter");
  const now = new Date();
  const diffMs = Math.max(0, now - birthDate);
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  counter.textContent = `${days.toLocaleString()} days, ${hours} hours and ${minutes} mins`;
}

function renderMemories() {
  const track = $("#memoryTrack");
  const dots = $("#memoryDots");
  track.innerHTML = "";
  dots.innerHTML = "";

  memories.forEach((memory, index) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.style.setProperty("--from", memory.from);
    card.style.setProperty("--to", memory.to);
    card.innerHTML = `
      <div class="memory-visual">
        <span class="icon">${memory.icon}</span>
        <strong>${memory.title}</strong>
      </div>
    `;
    track.appendChild(card);

    const dot = document.createElement("span");
    dots.appendChild(dot);
  });

  updateMemories();
}

function updateMemories() {
  const cards = [...document.querySelectorAll(".memory-card")];
  const dots = [...document.querySelectorAll(".dots span")];

  cards.forEach((card, index) => {
    card.classList.remove("active", "prev", "next");
    if (index === currentMemory) card.classList.add("active");
    if (index === (currentMemory - 1 + memories.length) % memories.length) card.classList.add("prev");
    if (index === (currentMemory + 1) % memories.length) card.classList.add("next");
  });

  dots.forEach((dot, index) => dot.classList.toggle("active", index === currentMemory));
}

function moveRunawayButton(button) {
  clearTimeout(runawayResetTimer);

  const maxX = Math.min(window.innerWidth * 0.32, 240);
  const maxY = Math.min(window.innerHeight * 0.18, 130);
  const x = (Math.random() - 0.5) * maxX * 2;
  const y = (Math.random() - 0.5) * maxY * 2;
  const rotate = (Math.random() - 0.5) * 18;
  button.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;

  runawayResetTimer = setTimeout(() => {
    button.style.transform = "";
  }, 900);
}

function isPointerNearButton(event, button) {
  const rect = button.getBoundingClientRect();
  const padding = 18;
  return (
    event.clientX >= rect.left - padding &&
    event.clientX <= rect.right + padding &&
    event.clientY >= rect.top - padding &&
    event.clientY <= rect.bottom + padding
  );
}

$("#beginButton").addEventListener("click", () => showScreen(1));
$("#trustYes").addEventListener("click", () => showScreen(2));
$("#foreverYes").addEventListener("click", () => showScreen(3));
$("#messageButton").addEventListener("click", () => showScreen(4));
$("#openLetter").addEventListener("click", () => showScreen(5));
$("#finalYes").addEventListener("click", () => showScreen(6));
$("#replayButton").addEventListener("click", () => showScreen(0));

backButton.addEventListener("click", () => showScreen(currentScreen - 1));

$("#closeModal").addEventListener("click", () => $("#yesModal").classList.add("hidden"));
$("#modalYes").addEventListener("click", () => {
  $("#yesModal").classList.add("hidden");
  showScreen(3);
});

document.addEventListener("pointermove", (event) => {
  const noButton = $("#trustNo");
  if (currentScreen === 1 && isPointerNearButton(event, noButton)) {
    moveRunawayButton(noButton);
  }
});
$("#trustNo").addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  moveRunawayButton(event.currentTarget);
});
$("#trustNo").addEventListener("pointerdown", (event) => {
  event.preventDefault();
  event.stopPropagation();
  moveRunawayButton(event.currentTarget);
});
$("#trustNo").addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    event.stopPropagation();
    moveRunawayButton(event.currentTarget);
  },
  { passive: false }
);

$("#prevMemory").addEventListener("click", () => {
  currentMemory = (currentMemory - 1 + memories.length) % memories.length;
  updateMemories();
});

$("#nextMemory").addEventListener("click", () => {
  currentMemory = (currentMemory + 1) % memories.length;
  updateMemories();
});

$(".sound-toggle").addEventListener("click", async () => {
  musicAllowed = !musicAllowed;
  syncPageMusic();
});

makeParticles();
makeConfetti();
renderMemories();
updateBirthCounter();
birthCounterTimer = setInterval(updateBirthCounter, 60000);
showScreen(0);
