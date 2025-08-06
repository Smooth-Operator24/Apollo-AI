document.getElementById('send-button').addEventListener('click', async function () {
  const userInputElement = document.getElementById('user-input');
  const userInput = userInputElement.value.trim();

  if (!userInput) return;

  addMessage('user', userInput);
  userInputElement.value = '';

  try {
    const response = await fetch('https://apollo-ai-backend.onrender.com/api/ask', {
  // ✅ Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: userInput })  // ✅ Must send `prompt` key
    });

    const data = await response.json();
    addMessage('ai', data.reply);  // ✅ Use `data.reply` (not data.response)
  } catch (error) {
    console.error('Error sending message:', error);
    addMessage('ai', '⚠️ There was an error. Please try again.');
  }
});

function addMessage(sender, text) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  message.innerText = text;

  const chatBox = document.getElementById('chat-box');
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

