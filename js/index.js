let markers = [];
let ip = "";
let resp = "";
let loggedIn = false;
let theUser = "anon";
let snippetOwner = "";
let edited = false;
const home = document.querySelector('#home');
console.log(home);

const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');
const sidebarL = document.querySelector('#sidebarL');
const snippetTitle = document.querySelector('#snippetTitle');
const snippetDescription = document.querySelector('#snippetDescription');
const handle = document.querySelector('#username');
const password = document.querySelector('#password');
// INPUT
const input = document.querySelector('#input');
input.addEventListener('keyup', keyPress);

sidebarL.innerHTML = `<h2>snippets loading...</h2><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>`;
let col = "";
col = ['#cceecc', '#eeccee', '#ccccee', '#eeeeccc'];

// MESSAGES
const messages = document.querySelector('#messages');

checkServer('isLoggedIn', "", setResp);

if (loggedIn) {
  updateUI('loggedIn');
}
// SAVE CODE BUTTON
const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', () => {
  elementActive(btnSaveCode, false);
  data = input.value;
  messages.classList.add("loading");
  checkServer("postSnippet", data, setResp);
})
btnSaveCode.classList.add('hidden');

// CLEAR CODE BUTTON
const btnClearCode = document.querySelector('#clearCode');
btnClearCode.addEventListener('click', ev => {
  edited = false;
  snippetDescription.value = "";
  snippetTitle.value = "";
  input.value = "";
  output.innerHTML = "";
  clearMessages();
  showOutput();
})

// EDIT ONE SNIPPET
// const snippetsSidebar = document.querySelector('.sidebarL');
sidebarL.addEventListener('click', (e) => {
  if(e.target.hasAttribute('data-snippet_edit_id')) {
    checkServer('getSnippet', e.target.dataset.snippet_edit_id, setResp);
  }
  
});

// USER ACCOUNT
const logout = document.querySelector('#logout');
logout.addEventListener("click", ev => {
  checkServer('logout', "", setResp);
});
const login = document.querySelector('#login');
login.addEventListener("click", ev => {
  let str = `username=${document.querySelector('#username').value}&password=${document.querySelector('#password').value}`;
  checkServer('login', str, setResp);
});
const join = document.querySelector('#join');
join.addEventListener("click", ev => {
  let str = `username=${document.querySelector('#username').value}&password=${document.querySelector('#password').value}`;
  resp = checkServer('join', str, setResp);

});

// MAIN UI UPDATE AREA
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  
window.addEventListener('load', autoLoad);
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //



