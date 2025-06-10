const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const messageForm = document.getElementById('message-form');
const currentUserSpan = document.getElementById('current-user');
const messagesDiv = document.getElementById('messages');

registerBtn.onclick = async () => {
  await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(usernameInput.value)}&password=${encodeURIComponent(passwordInput.value)}`
  });
  await checkSession();
};

loginBtn.onclick = async () => {
  await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(usernameInput.value)}&password=${encodeURIComponent(passwordInput.value)}`
  });
  await checkSession();
};

logoutBtn.onclick = async () => {
  await fetch('/api/logout', { method: 'POST' });
  await checkSession();
};

document.getElementById('send-btn').onclick = async () => {
  const content = document.getElementById('content').value;
  const tag = document.getElementById('tag').value;
  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `content=${encodeURIComponent(content)}&tag=${encodeURIComponent(tag)}`
  });
  document.getElementById('content').value = '';
  document.getElementById('tag').value = '';
  await fetchMessages();
};

async function favoriteMessage(id) {
  await fetch('/api/favorite/' + id, { method: 'POST' });
  fetchMessages();
}
window.favoriteMessage = favoriteMessage;

async function fetchMessages() {
  const res = await fetch('/api/messages');
  const messages = await res.json();
  messagesDiv.innerHTML = '';
  messages.forEach(m => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${m.username}</strong>: ${m.content} <span class="tag">${m.tag || ''}</span>
      <span class="favorite" onclick="favoriteMessage(${m.id})">❤ ${m.favorite}</span>`;
    messagesDiv.appendChild(div);
  });
}

async function checkSession() {
  const res = await fetch('/api/session');
  const user = await res.json();
  if (user) {
    messageForm.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    currentUserSpan.textContent = 'Logged in as ' + user.username;
  } else {
    messageForm.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    currentUserSpan.textContent = '';
  }
  fetchMessages();
}

checkSession();
