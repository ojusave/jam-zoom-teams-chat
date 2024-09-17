// public/script.js
document.getElementById('authorize').addEventListener('click', () => {
    window.location.href = '/auth/zoom';
});

document.getElementById('send-message').addEventListener('click', async () => {
    const channelId = document.getElementById('channel-select').value;
    const messageText = document.getElementById('message-text').value;
    const linkUrl = document.getElementById('link-url').value;  // Capture the link input

    const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channelId, messageText, linkUrl })  // Send the link along with the message
    });

    if (response.ok) {
        alert('Message sent successfully!');
    } else {
        alert('Failed to send message.');
    }
});


// Fetch channels when the page loads
window.onload = async () => {
    const response = await fetch('/api/channels');
    const channels = await response.json();

    const channelSelect = document.getElementById('channel-select');
    channels.forEach(channel => {
        const option = document.createElement('option');
        option.value = channel.id;
        option.textContent = channel.name;
        channelSelect.appendChild(option);
    });

    document.getElementById('chat-controls').style.display = 'block';
};
