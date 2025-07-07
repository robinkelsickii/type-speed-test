const textToType = document.querySelector('.text-to-type');
const userInput = document.querySelector('.user-input');
const userOutput = document.querySelector('.user-output');
const statusAlert = document.querySelector('.status-alert');
let testTimer = document.querySelector('.test-timer');

fetch('typing_prompts.json')
  .then((response) => response.json())
  .then((data) => {
    const keys = Object.keys(data);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPrompt = data[randomKey];
    textToType.textContent = randomPrompt.text;
  })
  .catch((error) => console.error('Error loading JSON:', error));

let testStarted = false;
let startTime;

readTextToType = () => {
  let correctText = textToType.textContent.split('');
  textToType.textContent = '';
  correctText.forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    textToType.appendChild(span);
  });
};

userInput.addEventListener('keydown', (e) => {
  if (!testStarted) {
    testStarted = true;
    startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const timeRemaining = 60 - elapsedTime;

      testTimer.textContent = `Time Remaining: ${timeRemaining} seconds`;

      if (timeRemaining <= 0) {
        clearInterval(timer);
        statusAlert.textContent = 'Time is up! Test ended.';
        userInput.disabled = true;
        testStarted = false;
      }
    }, 1000);
    console.log('User began test:', e.key);
    statusAlert.textContent = 'Test Started!';
  }
});

userInput.addEventListener('input', () => {
  console.log('User input:', userInput.value);
});
