const output = document.querySelector('#output');
const bgOutput = document.querySelector('#bgOutput');

const btnSaveCode = document.querySelector('#saveCode');
btnSaveCode.addEventListener('click', ()=>{
  alert('not yet implmented');
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