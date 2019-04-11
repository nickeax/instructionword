let markers = [];
let ip = "";
let resp = "";
let loggedIn = false;
let theUser = "anon";
let snippetOwner = "";
const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');
const sidebarL = document.querySelector('#sidebarL');
const snippetTitle = document.querySelector('#snippetTitle');
const snippetDescription = document.querySelector('#snippetDescription');
const handle = document.querySelector('#username');
const password = document.querySelector('#password');

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

// CLEAR CODE BUTTON
const btnClearCode = document.querySelector('#clearCode');
btnClearCode.addEventListener('click', ev => {
  input.value = "";
  clearMessages();
  showOutput();
})
// INPUT
const input = document.querySelector('#input');
input.addEventListener('keyup', showOutput);

const snippetsSidebar = document.querySelector('.sidebarL');
snippetsSidebar.addEventListener('click', (e) => {
  if (!e.target.hasAttribute('data-snippet_id')) return;
  output.innerHTML = "What the fuck is going on?";
  checkServer('getSnippet', e.target.dataset.snippet_id, setResp);
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
function autoLoad() { // Populate UI with available Project data (just snippets ATM)
  window.setInterval(() => {
    checkServer('getSnippets', "", setResp);
  }, 3000);
}
function elementActive(el, yes) {
  if (!yes) {
    el.classList.add('disabled');
    el.disabled = true;
  } else {
    el.classList.remove('disabled');
    el.disabled = false;
  }
}

function getFormattedTime(timestamp) {
  var date = new Date(timestamp * 1000);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var day = date.getDay;
  var year = date.getFullYear;
  // var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  let formattedTime = `${day} - ${year}`;
  return formattedTime;
}

function getInput(id) {
  let inputData = document.querySelector(`#${id}`).value;
  return inputData;
}
function showOutput(ev) {
  markers = [];
  let op = "";
  buildMarkers(getInput('input'));
  op = processMarkers(markers);
  output.innerHTML = op;
  bgOutput.innerHTML = op;
}
function postOutput() {
  markers = [];
  let op = "";
  buildMarkers(getInput('input'));
  op = processMarkers(markers);
  return op;
}
function updateUI(str) {
  if (str == 'loggedIn') {
    btnSaveCode.classList.remove('hidden');
    btnClearCode.classList.remove('hidden');
    login.classList.add('hidden');
    logout.classList.remove('hidden');
    handle.classList.add("hidden");
    password.classList.add("hidden");
    snippetDescription.classList.remove('hidden');
    snippetTitle.classList.remove('hidden');
    join.classList.add('hidden');
    logout.textContent = `logout [${theUser}]`;
    document.title = theUser + "@IW";
    document.title = theUser + " @ IW";
    logout.textContent = `logout [${theUser}]`;
  }
  if (str == 'loggedOut') {
    snippetDescription.classList.add('hidden');
    snippetTitle.classList.add('hidden');
    btnSaveCode.classList.add('hidden');
    btnClearCode.classList.add('hidden');
    login.classList.remove('hidden');
    logout.classList.add('hidden');
    handle.classList.remove("hidden");
    password.classList.remove("hidden");
    join.classList.remove('hidden');
  }
}

function showError(str) {
  messages.classList.remove('hidden');
  messages.classList.add('error');
  messages.innerHTML = str;
}

function showMessage(str) {
  messages.classList.remove('hidden');
  messages.innerHTML = str;
}

function clearMessages() {
  messages.classList.remove('error');
  messages.classList.add('hidden');
  messages.innerHTML = "";
}

function setResp(str) { // Process any UI changes here, certain that RESPONSE is ready.
  let arr = str.split('|||');

  elementActive(btnSaveCode, true);

  // arr[0] == MODE arr[1] == SUCCESS/FAIL arr[2] == MESSAGE arr[3] == DATA
  switch (arr[0]) { //switch on mode
    case 'login':
      clearMessages();
      if (arr[1] == 'success') {
        loggedIn = true;
        theUser = arr[3];
        updateUI('loggedIn');
      } else {
        showMessage(arr[2]);
      }
      break;
    case 'join':
      if (arr[1] == 'success') {
        updateUI('joined');
        showMessage(arr[2]);
      } else {
        showError(arr[2]);
      }
      break;
    case 'logout':
      if (arr[1] == 'success') {
        updateUI('loggedOut');
        document.title = "anon @ IW";
        snippetDescription.value = "";
        snippetTitle.value = "";

        messages.classList.remove('error');
        messages.classList.add('hidden');
        messages.innerHTML = "";
      } else {
        snippetDescription.value = "";
        snippetTitle.value = "";
      }
      break;
    case 'postSnippet':
      snippetDescription.textContent = "";
      snippetTitle.textContent = "";

      if (arr[1] == 'failure') {
        messages.classList.remove('loading');
        showError(arr[2]);

      } else {
        messages.classList.remove('loading');
        showMessage(arr[2]);
        input.value = "";
        output.innerHTML = "";
        snippetDescription.value = "";
        snippetTitle.value = "";
      }
      break;
    case 'isLoggedIn':
      if (arr[1] == 'success') {
        theUser = arr[2];
        updateUI('loggedIn');
      }
      break;
    case 'getSnippet':
      if(arr[1] != "success") {
        console.log("Couldn't get the snippet.");
        break;
      }
      let str = JSON.parse(arr[3]);
      console.log(`Got the snippet and it's value is ${str[0].snippet}`);
      input.innerHTML = str[0].snippet;
      output.innerHTML = postOutput();
      break;
    case 'getSnippets':
      if (arr[1] == 'success') {
        let str = JSON.parse(arr[3]);
        bgOutput.innerHTML = str[0].snippet;
        sidebarL.innerHTML = `<h3>snippets (${str.length})</h3>\n`;

        for (let i = 0; i < str.length; i++) {
          let d = new Date(str[i].created * 1000);
          let monthDay = d.getDate();
          let month = d.getMonth();
          let h = d.getHours();
          let m = d.getMinutes();
          let hoursMinutes = `${h}:${m}`;
          sidebarL.innerHTML += `
          <div class = 'availableSnippets'>
          
          <span class = "view" id="view_snippet" data-snippet_id = "${str[i].snippet_id}">VIEW</span>
          <span class = "edit" id="edit_snippet" data-snippet_id = "${str[i].snippet_id}">EDIT</span>
          <span class = "share" id="share_snippet" data-snippet_id = "${str[i].snippet_id}">SHARE</span>
          
          <strong class="snippetTitle">${str[i].title}</strong> by 
          <span id = "listed_snippet" class = "username">${str[i].username}</span>
          
          <br>
            <em>${str[i].description}</em>
            <span id="timestamp" class = "username">${hoursMinutes}-${monthDay + 1}/${month + 1}</span>
              
            </div>`;
        }
        sidebarL.innerHTML += "\n";
      }
      break;
    default:
      break;
  }
}

function checkServer(mode, str, cb) {
  let st = "";
  let sd = "";
  let title = "";
  let description = "";
  let params = "";

  if (snippetTitle.value != "") {
    st = snippetTitle.value;
    title = encodeURIComponent(st);
  }
  if (snippetDescription.value != "") {
    sd = snippetDescription.value;
    description = encodeURIComponent(sd);
  }
  str = encodeURIComponent(str);
  params = `mode=${mode}&str=${str}&title=${title}&description=${description}`; // build the POST query string

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'server.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    resp = this.responseText;
    cb(resp);
  }
  xhr.send(params);

}