console.log("Welcome to Spotify");

let songIndex = 0;
let audioElement = new Audio('song/Baby.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
  { songName: "Baby - Justin Bieber", filePath: "song/Baby.mp3", coverPath: "cover/Babycoverart.jpg" },
  { songName: "Kesariya - Arijit Singh", filePath: "song/Kesariya.mp3", coverPath: "cover/kesariya-cover.jpg" },
  { songName: "Kukkad - Vishal", filePath: "song/Kukkad.mp3", coverPath: "cover/kukkad-cover.jpg" },
  { songName: "Malang Sajna - Sachet", filePath: "song/Malang Sajna.mp3", coverPath: "cover/4.jpg" },
  { songName: "O Rangrez - Javed Bashir ", filePath: "song/O Rangrez.mp3", coverPath: "cover/o rangrez-cover.jpg" },
  { songName: "Pee Loon - Mohit Chauhan", filePath: "song/Pee Loon.mp3", coverPath: "cover/peeloon-cover.jpg" },
  { songName: "Perfect - Ed Sheeran", filePath: "song/Perfect.mp3", coverPath: "cover/perfect-cover.jpg" },
  { songName: "Thousand Years - Christina", filePath: "song/Thousand-Years.mp3", coverPath: "cover/thousand-years-cover.jpg" },
  { songName: "Voh Dekhney Mei - Ali Zafar", filePath: "song/Voh Dekhnay Mein.mp3", coverPath: "cover/wodekhnemei-cover.jpg" },
  { songName: "You Are The Reason - Calum", filePath: "song/4.mp3", coverPath: "cover/10.jpg" }
];

// Fill song items
songItems.forEach((element, i) => {
  element.getElementsByTagName("img")[0].src = songs[i].coverPath;
  element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

const makeAllPlays = () => {
  Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.classList.remove('fa-circle-pause');
    element.classList.add('fa-circle-play');
  });
};

const updatePlayIcon = () => {
  makeAllPlays();
  const icon = document.getElementById(songIndex);
  if (icon) {
    icon.classList.remove('fa-circle-play');
    icon.classList.add('fa-circle-pause');
  }
};

masterPlay.addEventListener('click', () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
    gif.style.opacity = 1;
    updatePlayIcon();
  } else {
    audioElement.pause();
    masterPlay.classList.replace('fa-circle-pause', 'fa-circle-play');
    gif.style.opacity = 0;
    makeAllPlays();
  }
});

audioElement.addEventListener('timeupdate', () => {
  let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
  myProgressBar.value = progress;
  updateTimeDisplay();
});

myProgressBar.addEventListener('change', () => {
  audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
  element.addEventListener('click', (e) => {
    makeAllPlays();
    songIndex = parseInt(e.target.id);
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
    updatePlayIcon();
  });
});

document.getElementById('next').addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  gif.style.opacity = 1;
  masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
  updatePlayIcon();
});

document.getElementById('previous').addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  gif.style.opacity = 1;
  masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
  updatePlayIcon();
});

const updateTimeDisplay = () => {
  const display = document.getElementById("timeDisplay");
  let cur = formatTime(audioElement.currentTime);
  let dur = formatTime(audioElement.duration);
  if (!isNaN(audioElement.duration)) display.innerText = `${cur} / ${dur}`;
};

const formatTime = (seconds) => {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

// === VOICE COMMANDS ===
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-IN';

recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
  console.log("🎤 Voice:", transcript);

  if (transcript === "play" || transcript === "resume") {
    masterPlay.click();
  } else if (transcript === "pause" || transcript === "stop") {
    if (!audioElement.paused) masterPlay.click();
  } else if (transcript.startsWith("play ")) {
    const name = transcript.replace("play ", "").replace(/\./g, '').trim();
    const songObj = songs.find(song => song.songName.toLowerCase().includes(name));
    if (songObj) {
      songIndex = songs.indexOf(songObj);
      audioElement.src = songObj.filePath;
      masterSongName.innerText = songObj.songName;
      audioElement.currentTime = 0;
      audioElement.play();
      gif.style.opacity = 1;
      masterPlay.classList.replace('fa-circle-play', 'fa-circle-pause');
      updatePlayIcon();
    } else {
      console.warn("🎤 Voice: Song not found:", name);
    }
  } else if (transcript === "volume up") {
    audioElement.volume = Math.min(audioElement.volume + 0.1, 1);
    console.log("🔊 Volume increased to", audioElement.volume.toFixed(2));
  } else if (transcript === "volume down") {
    audioElement.volume = Math.max(audioElement.volume - 0.1, 0);
    console.log("🔉 Volume decreased to", audioElement.volume.toFixed(2));
  }
};

let recognitionRestartTimeout = null;

recognition.onerror = (e) => {
  console.error("🎤 Speech recognition error:", e);
  if (!recognitionRestartTimeout) {
    recognitionRestartTimeout = setTimeout(() => {
      recognition.start();
      recognitionRestartTimeout = null;
    }, 1000);
  }
};

recognition.onend = () => {
  console.warn("🎤 Recognition stopped. Restarting...");
  if (!recognitionRestartTimeout) {
    recognitionRestartTimeout = setTimeout(() => {
      recognition.start();
      recognitionRestartTimeout = null;
    }, 1000);
  }
};

recognition.start();
