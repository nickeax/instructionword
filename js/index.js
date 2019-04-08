let markers = [];
let ip = "";
let resp = "";
let theUser;
let loggedIn = false;
const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');


// SAVE CODE BUTTON
const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', () => {
  data = postOutput();
  // data = JSON.stringify(postOutput());

  checkServer("postSnippet", data, setResp);
})

// CLEAR CODE BUTTON
const btnClearCode = document.querySelector('#clearCode');
btnClearCode.addEventListener('click', ev => {
  input.value = "";
  showOutput();
})
// INPUT
const input = document.querySelector('#input');
input.addEventListener('keyup', showOutput);

// MESSAGES
const messages = document.querySelector('#messages');

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
window.addEventListener('load', updateUI);
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  

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
    login.classList.add('hidden');
    logout.classList.remove('hidden');
    username.classList.add("hidden");
    password.classList.add("hidden");
    join.classList.add('hidden');
    logout.textContent = `logout [${theUser}]`;
    document.title = theUser + "@IW";

    document.title = theUser + " @ IW";
    logout.textContent = `logout [${theUser}]`;
  }
  if (str == 'loggedOut') {
    btnSaveCode.classList.add('hidden');
    login.classList.remove('hidden');
    logout.classList.add('hidden');
    username.classList.remove("hidden");
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
function setResp(str) { // Process any UI changes here, certain that RESPONSE is ready.
  updateUI();
  let arr = str.split('|||');
  messages.classList.remove('error');
  // arr[0] == MODE arr[1] == SUCCESS/FAIL arr[2] == MESSAGE arr[3] == DATA
  switch (arr[0]) { //switch on mode
    case 'login':
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
        document.title = defaultTitle;
      } else {
        console.log(arr[2]);
      }
      break;
    case 'postSnippet':
      if (arr[1] == 'failure') {
        showError(arr[2]);
      } else {
        showMessage(arr[2]);
        input.value = "";
        output.innerHTML = "";
      }
      break;
    case 'isLoggedIn':
      if (arr[1] == 'success') {
        theUser = arr[2];
        updateUI('loggedIn');
      }
      break;
    case 'getSnippets':
      if (arr[1] == 'success') {
        let str = JSON.parse(arr[3]);
        output.innerHTML = str[1].snippet;
      }
      break;
    default:
      break;
  }
}
function checkServer(mode, str, cb) {
  messages.innerHTML = "";
  let params = `mode=${mode}&str=` + encodeURIComponent(str); // build the POST query string
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'server.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    resp = this.responseText;
    cb(resp);
  }
  xhr.send(params);
}