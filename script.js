// Timer durations in minutes
const POMODORO_TIME = 25;
const SHORT_BREAK_TIME = 5;
const LONG_BREAK_TIME = 15;

// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('shortBreak');
const longBreakButton = document.getElementById('longBreak');
const timerDisplay = document.querySelector('.timer');
const themeButtons = document.querySelectorAll('.theme-btn');
const dateDisplay = document.getElementById('date');
const timeDisplay = document.getElementById('time');

let timeLeft;
let timerId = null;
let currentMode = 'pomodoro';
const originalTitle = document.title;

// Update browser tab title
function updateTabTitle(minutes, seconds) {
    if (timerId === null) {
        document.title = originalTitle;
    } else {
        document.title = `(${minutes}:${seconds}) ${originalTitle}`;
    }
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString(undefined, options);
    
    // Format time
    timeDisplay.textContent = now.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    });
}

// Update date and time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Theme switching
function switchTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('cyan-theme', 'purple-theme', 'green-theme', 'orange-theme');
    // Add selected theme class
    document.body.classList.add(`${theme}-theme`);
    
    // Update active state of theme buttons
    themeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });

    // Save theme preference
    localStorage.setItem('pomodoroTheme', theme);
}

// Initialize theme
const savedTheme = localStorage.getItem('pomodoroTheme') || 'cyan';
switchTheme(savedTheme);

// Add theme button event listeners
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
});

// Initialize timer
function initTimer(duration) {
    timeLeft = duration * 60;
    updateDisplay();
    timerDisplay.classList.remove('running');
    updateTabTitle(Math.floor(timeLeft / 60), (timeLeft % 60).toString().padStart(2, '0'));
}

// Update timer display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    minutesDisplay.textContent = minutesStr;
    secondsDisplay.textContent = secondsStr;
    updateTabTitle(minutesStr, secondsStr);
}

// Timer countdown
function startTimer() {
    if (timerId === null) {
        timerDisplay.classList.add('running');
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                timerDisplay.classList.remove('running');
                updateTabTitle();
            }
        }, 1000);
    }
}

// Pause timer
function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    timerDisplay.classList.remove('running');
    updateTabTitle();
}

// Reset timer
function resetTimer() {
    pauseTimer();
    initTimer(currentMode === 'pomodoro' ? POMODORO_TIME : 
              currentMode === 'shortBreak' ? SHORT_BREAK_TIME : 
              LONG_BREAK_TIME);
}

// Switch timer mode
function switchMode(mode, duration) {
    const buttons = [pomodoroButton, shortBreakButton, longBreakButton];
    buttons.forEach(btn => btn.classList.remove('active'));
    
    switch(mode) {
        case 'pomodoro':
            pomodoroButton.classList.add('active');
            break;
        case 'shortBreak':
            shortBreakButton.classList.add('active');
            break;
        case 'longBreak':
            longBreakButton.classList.add('active');
            break;
    }
    
    currentMode = mode;
    pauseTimer();
    initTimer(duration);
}

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

pomodoroButton.addEventListener('click', () => switchMode('pomodoro', POMODORO_TIME));
shortBreakButton.addEventListener('click', () => switchMode('shortBreak', SHORT_BREAK_TIME));
longBreakButton.addEventListener('click', () => switchMode('longBreak', LONG_BREAK_TIME));

// Initialize with Pomodoro mode
initTimer(POMODORO_TIME);