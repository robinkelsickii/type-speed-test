const textToType = document.getElementById('text-to-type');

fetch('typing_prompts.json')
  .then((response) => response.json())
  .then((data) => {
    const keys = Object.keys(data);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPrompt = data[randomKey];
    textToType.textContent = randomPrompt.text;
  })
  .catch((error) => console.error('Error loading JSON:', error));
