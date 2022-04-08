// ------ message variables
let messagePopUpToggle = false;
const messagesContainerDiv = document.getElementById("messages-container");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const messageIcon = document.getElementById("message-icon");

// ------ message events
messageInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

messageIcon.onclick = (e) => {
    messagePopUpToggle = !messagePopUpToggle;
    if (messagePopUpToggle) {
        messagesContainerDiv.setAttribute("class", "");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    else messagesContainerDiv.setAttribute("class", "hidden");
};

document.body.onclick = (e) => {
    if (messagePopUpToggle && !messagesContainerDiv.contains(e.target) && e.target !== messageIcon) {
        messagePopUpToggle = false;
        messagesContainerDiv.setAttribute("class", "hidden");
    }
}

// ------ message methods
const getMessages = async () => {
    fetch(`/api${window.location.pathname}/messages`)
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                messagesDiv.innerHTML = "";
                data.messages.forEach(message => {
                    messagesDiv.innerHTML = messagesDiv.innerHTML + createMessage(message);
                });
            }
        })
        .catch(err => console.log(err))
        .finally(() => {
            if (messagePopUpToggle) messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
};

const sendMessage = async () => {
    if (messageInput.value.trim().length > 0) {
        fetch(`/api/games/${parseInt(window.location.pathname.split('/')[2])}/messages`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: messageInput.value })
        })
            .then(response => response.json())
            .then(data => {
                messageInput.value = "";
                getMessages();
            })
            .catch(err => console.log(err));
    }
};

const createMessage = (message) => {
    return (
        `<div id="${message.id}" class="message-container">
            <strong class="message-sender">${message.sender}</strong>
            <textarea class="message" contenteditable="false" disabled>${message.message}</textarea>
            <span class="message-time">${timeFormat(new Date(message.createdAt).toLocaleTimeString().split(":"))}</span>
        </div>`
    );
};

const timeFormat = (time) => `${time[0]}:${time[1]} ${time[2].split(" ")[1]}`;