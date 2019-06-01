let markers = [];
let ip = "";
let resp = "";
let loggedIn = false;
let theUser = "anon";
let snippetOwner = "";
let snippetID = 0;
let editID = 0;
let edited = false;
let pollingInterval = 4000;
var displayEdit = "hidden";
const home = document.querySelector('#home');
const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');
const sidebarL = document.querySelector('#sidebarL');
const sidebarR = document.querySelector('#sidebarR');
const editsList = document.querySelector('#editsList');
const detectedLanguage = document.querySelector('#detectedLanguage');
const snippetSideBarTitle = document.querySelector('#snippetSideBarTitle');
const snippetTitle = document.querySelector('#snippetTitle');
const snippetDescription = document.querySelector('#snippetDescription');
const handle = document.querySelector('#username');
const password = document.querySelector('#password');

let snippetEditSnippetID;
let snippetEditUsername;
let snippetEditTitle;

// INPUT
const input = document.querySelector('#input');
input.addEventListener('keyup', keyPress);

sidebarL.innerHTML = `<h2>snippets loading...</h2><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>`;
let col = "";
col = ['#cceecc', '#eeccee', '#ccccee', '#eeeeccc'];

// MESSAGES
const messages = document.querySelector('#messages');

checkServer('isLoggedIn', "", setResp);

/* window.onbeforeunload = confirmExit;
function confirmExit() {
  return "If you have made any changes to your snippets without clicking the SAVE button, your changes will be lost.  Are you sure you want to exit this page?";
} */

// SAVE CODE BUTTON
const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', (e) => {
  elementActive(btnSaveCode, false);
  data = input.value;
  messages.classList.add("loading");
  checkServer('postSnippet', data, setResp);
});

btnSaveCode.classList.add('hidden');

// CLEAR CODE BUTTON
const btnClearCode = document.querySelector('#clearCode');
btnClearCode.addEventListener('click', ev => {
  snippetID = null;
  edited = false;
  snippetDescription.value = "";
  snippetTitle.value = "";
  input.value = "";
  output.innerHTML = "";
  clearMessages();
  showOutput();
})

const btnRemoveSnippet = document.querySelector('#removeSnippet');
btnRemoveSnippet.addEventListener('click', ev => {
  clearMessages();
  showOutput();
})

sidebarL.addEventListener('click', (e) => {
  clearMessages();
  if (e.target.dataset.snippet_snippet_id) {
    let snippetEditSnippetID = e.target.dataset.snippet_edit_id;
    let snippetUsername = e.target.dataset.snippet_edit_username;
    let snippetEditTitle = e.target.dataset.snippet_edit_title;
    checkServer('getSnippet', e.target.dataset.snippet_snippet_id, setResp);
    checkServer('getEdits', e.target.dataset.snippet_snippet_id, setResp);
  }
});

sidebarR.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-snippet_edit_id') && e.target.hasAttribute('data-edit-clicked')) {
    editID = e.target.dataset.snippet_edit_id;
    checkServer('displayWithEdits', e.target.dataset.snippet_edit_id, setResp);
  }
  else {
    console.log("Didn't send request for displayWithEdits.");
  }
})

btnRemoveSnippet.addEventListener('click', (e) => {
  clearMessages();
  let resp = confirm("Are you sure you wish to DELETE this snippet?");
  if (resp === true) {
    if (e.target.dataset.snippet_snippet_id) {
      checkServer('removeSnippet', e.target.dataset.snippet_snippet_id, setResp);
    } else {
      console.log("No snippet ID");
    }
  }
  btnRemoveSnippet.classList.add("hidden");
  autoLoad();
});

// USER ACCOUNT
const logout = document.querySelector('#logout');
console.log(logout);

logout.addEventListener("click", ev => {
  displayEdit = "hidden";
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

if (loggedIn) {
  updateUI('loggedIn');
} else {
  updateUI('loggedOut');
}

// MAIN UI UPDATE AREA
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  
window.addEventListener('load', autoLoad);
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //