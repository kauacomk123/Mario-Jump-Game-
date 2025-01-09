const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');

const start = document.querySelector('.start');
const gameOver = document.querySelector('.game-over');

audioStart = new Audio('./soung/audio_theme.mp3');
audioGameOver = new Audio('./soung/audio_gameover.mp3');

let gameInterval;
let isGameOver = false; // Flag para controlar o estado do jogo

const startGame = () => {
  if (isGameOver) return; // Evita iniciar o jogo enquanto está no estado "Game Over"

  pipe.classList.add('pipe-animation');
  start.style.display = 'none';

  // Reinicia o áudio do jogo
  audioStart.currentTime = 0;
  audioStart.play();

  if (!gameInterval) {
    loop(); // Inicia o loop do jogo
  }
};

const restartGame = () => {
  isGameOver = false; // Reseta o estado do jogo
  gameOver.style.display = 'none';
  pipe.style.left = '';
  mario.src = './img/mario.gif';
  mario.style.width = '150px';
  mario.style.bottom = '0';

  // Reinicia a animação do tubo
  pipe.classList.remove('pipe-animation');
  void pipe.offsetWidth; // Força reflow
  pipe.classList.add('pipe-animation');

  // Reinicia os áudios
  audioGameOver.pause();
  audioGameOver.currentTime = 0;

  audioStart.currentTime = 0;
  audioStart.play();

  // Reinicia o loop do jogo
  clearInterval(gameInterval);
  loop();
};

const jump = () => {
  if (isGameOver) return; // Evita o pulo enquanto está no estado "Game Over"
  mario.classList.add('jump');

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 800);
};

const loop = () => {
  gameInterval = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window
      .getComputedStyle(mario)
      .bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
      if (isGameOver) return; // Garante que o "Game Over" é processado apenas uma vez

      isGameOver = true; // Define o estado como "Game Over"
      pipe.classList.remove('pipe-animation');
      pipe.style.left = `${pipePosition}px`;

      mario.classList.remove('jump');
      mario.style.bottom = `${marioPosition}px`;

      mario.src = './img/game-over.png';
      mario.style.width = '80px';
      mario.style.marginLeft = '50px';

      // Pausa o áudio principal e inicia o áudio de "Game Over"
      audioStart.pause();
      if (!audioGameOver.paused) {
        audioGameOver.pause();
        audioGameOver.currentTime = 0;
      }
      audioGameOver.play();

      // Exibe a tela de "Game Over"
      gameOver.style.display = 'flex';

      // Pausa o loop do jogo
      clearInterval(gameInterval);
      gameInterval = null;
    }
  }, 10);
};

// Controles
document.addEventListener('keypress', e => {
  const tecla = e.key;
  if (tecla === ' ') {
    jump();
  }
});

document.addEventListener('touchstart', e => {
  if (e.touches.length) {
    jump();
  }
});

document.addEventListener('keypress', e => {
  const tecla = e.key;
  if (tecla === 'Enter') {
    startGame();
  }
});
