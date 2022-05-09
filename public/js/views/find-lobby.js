import serializeForm from '../lib/serializeForm.js';

const socket = io();
const baseURL = `${window.location.protocol}//${window.location.host}`;
const closeModal = document.getElementById("closeModal");
const joinPrivateLobbyForm = document.getElementById("joinPrivateLobbyForm");

if (socket) {
  socket.on('redirect', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.pathname) window.location.href = baseURL + data.pathname;
    } catch (err) {
      console.error(err);
    }
  })
}

closeModal.addEventListener('click', () => {
  const joinLobbyFormModal = document.getElementById("joinPrivateLobbyModal");
  const passwordInput = document.getElementById("password");
  joinPrivateLobbyForm.removeEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = window.location.protocol + '//' + window.location.host;
    const serializedData = serializeForm(joinPrivateLobbyForm);
    fetch(url + `/api/lobbies/${lobbyId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serializedData),
    })
    .then(async (res) => {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        if (res.status === 400) {
          const error = document.getElementById('error');
          error.innerHTML = data.message;
          error.className = 'error-message';
        } else console.log(data);
      }
    })
    .catch((err) => console.error(err));
  });
  passwordInput.value = "";
  joinLobbyFormModal.style.display = "none";
});

window.addEventListener('load', () => {
  const url = window.location.protocol + '//' + window.location.host;
  fetch(url + '/api/lobbies/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(async (res) => {
    const data = await res.json();
    for(let i = 0; i<data.length; i++) {
      const { id, hostName, name, playerCapacity, guests, type } = data[i];
      const newLobby = document.createElement("div");
      const lobbyName = document.createElement("div");
      const playerCount = document.createElement("div");
      const host = document.createElement("div");
      const joinButton = document.createElement("button");
      const lobbyType = document.createElement("div");

      newLobby.id = id;
      newLobby.className= "lobby-container"; 
      lobbyName.className = "lobby-name";
      lobbyName.innerHTML = name;
      playerCount.innerHTML = 1 + guests.length + "/" + playerCapacity;
      joinButton.innerHTML = "Join";
      host.innerHTML = hostName;
      lobbyType.innerHTML = type;
      
      joinButton.onclick = function () { joinLobby(id) }


      newLobby.appendChild(lobbyName)
      newLobby.appendChild(host)
      newLobby.appendChild(lobbyType)
      newLobby.appendChild(playerCount)
      newLobby.append(joinButton)

      document.getElementById("lobbyListContainer").appendChild(newLobby);
    }
  })
  .catch((err) => {
    console.error(err);
  });
});


async function isLobbyGuest(lobbyId) {
  const url = window.location.protocol + '//' + window.location.host;
  return fetch(url + `/api/lobbies/${lobbyId}/users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(async(result) => {
    const data = await result.json();
    return Promise.resolve(data.isGuest);
  })
  .catch((err) => {
    console.error(err);
    return Promise.reject(err);
  })
}
async function getLobbyType(lobbyId) {
  const url = window.location.protocol + '//' + window.location.host;
  return fetch(url + `/api/lobbies/${lobbyId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(async(result) => {
    const data = await result.json();
    return Promise.resolve(data.type);
  })
  .catch((err) => {
    console.error(err);
    return Promise.reject(err);
  })
}

async function joinLobby(lobbyId) {
  const url = window.location.protocol + '//' + window.location.host;
  const isGuest = await isLobbyGuest(lobbyId);
  const privateLobby = await getLobbyType(lobbyId);

  if(isGuest) {
    return document.location.href=url+`/lobbies/${lobbyId}`;
  }

  if(privateLobby) {
    const joinLobbyFormModal = document.getElementById("joinPrivateLobbyModal")
    joinLobbyFormModal.style.display = "block";
    joinPrivateLobbyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const url = window.location.protocol + '//' + window.location.host;
      const serializedData = serializeForm(joinPrivateLobbyForm);
      fetch(url + `/api/lobbies/${lobbyId}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serializedData),
      })
      .then(async (res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          const data = await res.json();
          if (res.status === 400) {
            const error = document.getElementById('error');
            error.innerHTML = data.message;
            error.className = 'error-message';
          } else console.log(data);
        }
      })
      .catch((err) => console.error(err));
    });
    
  }
  else {
    fetch(url + `/api/lobbies/${lobbyId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(async (res) => {
      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        console.log(data);
      }
    })
    .catch((err) => console.error(err));
  }
}

