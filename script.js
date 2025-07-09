const textToType = document.querySelector('.text-to-type');
const userInput = document.querySelector('.user-input');
const userOutput = document.querySelector('.user-output');
const statusAlert = document.querySelector('.status-alert');
const resetButton = document.querySelector('.reset-button');
let testTimer = document.querySelector('.test-timer');

fetch('typing_prompts.json')
  .then((response) => response.json())
  .then((data) => {
    const keys = Object.keys(data);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPrompt = data[randomKey];
    textToType.textContent = randomPrompt.text;
    readTextToType();
  })
  .catch((error) => console.error('Error loading JSON:', error));

let testStarted = false;
let startTime;
let correctText = [];

readTextToType = () => {
  correctText = textToType.textContent.split('');
  textToType.textContent = '';
  correctText.forEach((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    textToType.appendChild(span);
  });
  return correctText;
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

        calculateWPM(elapsedTime);
        calculateAccuracy();
      }
    }, 1000);
    console.log('User began test:', e.key);
    statusAlert.textContent = 'Test Started!';
  }
});

userInput.addEventListener('input', () => {
  console.log('User input:', userInput.value);
  const userText = userInput.value.split('');
  const spans = textToType.querySelectorAll('span');

  for (let i = 0; i < spans.length; i++) {
    if (userText[i] == null) {
      spans[i].className = '';
    } else if (userText[i] === correctText[i]) {
      spans[i].className = 'correct';
    } else {
      spans[i].className = 'incorrect';
    }
  }
});

calculateWPM = (elapsedTime) => {
  const totalTyped = userInput.value.length;
  const minutes = elapsedTime / 60;

  const wpm = Math.round(totalTyped / 5 / minutes);
  userOutput.textContent = `Your WPM: ${wpm}`;
};

calculateAccuracy = () => {
  let correctCount = 0;
  for (let i = 0; i < userInput.value.length; i++) {
    if (userInput.value[i] === correctText[i]) {
      correctCount++;
    }
  }
  const accuracy =
    Math.round((correctCount / userInput.value.length) * 100) || 0;
  userOutput.textContent += ` Accuracy: ${accuracy}%`;
};

resetButton.addEventListener('click', () => {
  testStarted = false;
  userInput.value = '';
  userInput.disabled = false;
  userOutput.textContent = '';
  statusAlert.textContent = '';
  testTimer.textContent = '';
  // Load a new prompt
  fetch('typing_prompts.json')
    .then((response) => response.json())
    .then((data) => {
      const keys = Object.keys(data);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomPrompt = data[randomKey];
      textToType.textContent = randomPrompt.text;
      readTextToType();
    })
    .catch((error) => console.error('Error loading JSON:', error));
});
