let markers = [];
let ip = "";
let resp = "";
const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');

// SAVE CODE BUTTON
const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', ()=>{
  checkServer("postSnippet", postOutput(), true);
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
login.addEventListener("click", ev => {
  checkServer('logout', str, setResp);
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

function setResp(str) { // Process any UI changes here, certain that RESPONSE is ready.
  let arr = str.split('|');
  switch (arr[0]) { //switch on mode
    case 'login':
      if(arr[1] == 'success') {
        console.log(arr[2]);
      } else {
        console.log(arr[2]);
      }
      break;
    case 'join':
      if(arr[1] == 'success') {
        console.log(arr[2]);
      } else {
        console.log(arr[2]);
      }
    break;
    case 'logout':
      if(arr[1] == 'success') {
        console.log(arr[2]);
      } else {
        console.log(arr[2]);
      }
    default:
      break;
  }
}

function checkServer(mode, str, cb) {
  messages.innerHTML = "";
  let params = `mode=${mode}&str=`+encodeURIComponent(str); // build the POST query string
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'server.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    resp = this.responseText;
    cb(resp);
  }
  xhr.send(params);
}