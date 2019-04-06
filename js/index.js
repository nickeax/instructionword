const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');

const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', ()=>{
  checkServer("postSnippet", postOutput());
})

const btnClearCode = document.querySelector('#clearCode');

const input = document.querySelector('#input');
input.addEventListener('keyup', showOutput);

btnClearCode.addEventListener('click', ev => {
  input.value = "";
  showOutput();
})

let markers = [];
let ip = "";

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

function checkServer(mode, str) {
  // console.log(str);
  let params = `mode=${mode}&str=`+encodeURIComponent(str); // build the POST query string
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'server.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    output.innerHTML += (this.responseText);
  }
  xhr.send(params);
}