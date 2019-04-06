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

const VVC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

let dblQuotesFlag = false;
let sngQuotesFlag = false;
let markers = [];
let ip = "";

function buildMarkers(str) {
  let start = 0;
  let tmp = "";
  for (let i = 0; i < str.length; i++) {
    if (VVC.indexOf(str[i]) != -1) {
      start = i;
      place = start;
      while (VVC.indexOf(str[i]) != -1) {
        tmp += str[i];
        i++;
      }
      i -= 1;
      let marker = new Marker(start, "VVC", tmp.length, tmp);
      markers.push(marker);
      tmp = "";
    } else if (VVC.indexOf(str[i]) == -1) {
      start = i;
      if (str[i] == "'") {
        tmp += str[i];
        let marker = new Marker(start, "SQT", 1, "&#8217;");
        markers.push(marker);
      } else if (str[i] == '"') {
        tmp += str[i];
        let marker = new Marker(start, "DQT", 1, "&#8220;");
        markers.push(marker);
      } else if (str[i] == " ") {
        tmp += str[i];
        let marker = new Marker(start, "SPC", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "\n") {
        tmp += str[i];
        let marker = new Marker(start, "NWL", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "{") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "}") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "(") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == ")") {
        tmp += str[i];
        let marker = new Marker(start, "BLK", 1, tmp);
        markers.push(marker);
      } else if (str[i] == "<") {
        let marker = new Marker(start, "MTH", 1, "&lt;");
        markers.push(marker);
      } else if (str[i] == ">") {
        let marker = new Marker(start, "MTH", 1, "&gt;");
        markers.push(marker);
      } else if (str[i] == "=") {
        let marker = new Marker(start, "MTH", 1, "=");
        markers.push(marker);
      } else if (str[i] == "!") {
        let marker = new Marker(start, "MTH", 1, "!");
        markers.push(marker);
      } else if (str[i] == "*") {
        let marker = new Marker(start, "MTH", 1, "*");
        markers.push(marker);
      } else if (str[i] == "/") {
        let marker = new Marker(start, "MTH", 1, "/");
        markers.push(marker);
      } else {
        let marker = new Marker(start, str[i], str[i].length, str[i]);
        markers.push(marker);
      }
    }
    tmp = "";
  }
}

function processMarkers(markers) {
  let tmp = "";
  let inSingleQuotes = false;
  let inDoubleQuotes = false;
  markers.forEach(element => {
    if (element.type == "SQT" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      if (inSingleQuotes) {
        tmp += "<span class = 'inSingleQuotes'>&#39;";
      } else {
        tmp += "&#39;</span>";
      }
    } else if (element.type == "DQT" && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      if (inDoubleQuotes) {
        tmp += "<span class='inDoubleQuotes'>&quot;";
      } else {
        tmp += "&quot;</span>";
      }
    } else if (element.type == 'NWL') {
      tmp += "<br>";
    } else if (element.type == 'SPC') {
      tmp += "&nbsp;";
    } else if (isKeyword(element.word)) {
      tmp += `<span class='keyword'>${element.word}</span>`;
    } else if (element.word == '`') {
      tmp += `&#96;`;
    } else if (element.type == 'MTH') {
      tmp += `<span class = 'math'>${element.word}</span>`;    
    } else if (element.type == 'BLK') {
      tmp += `<span class = 'block'>${element.word}</span>`;    
    } else {
      if(element.word == "'" || element.word == "`") tmp += "&#34;"; else tmp += `${element.word}`;
    }
  });
  return tmp;
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

function isKeyword(str) {
  let firstLetter = str.toLowerCase().charAt(0);
  switch (firstLetter) {
    case 'a':
      if (keyWordsA.indexOf(str) != -1) return true;
      return false;
    case 'b':
      if (keyWordsB.indexOf(str) != -1) return true;
      return false;
    case 'c':
      if (keyWordsC.indexOf(str) != -1) return true;
      return false;
    case 'd':
      if (keyWordsD.indexOf(str) != -1) return true;
      return false;
    case 'e':
      if (keyWordsE.indexOf(str) != -1) return true;
      return false;
    case 'f':
      if (keyWordsF.indexOf(str) != -1) return true;
      return false;
    case 'g':
      if (keyWordsG.indexOf(str) != -1) return true;
      return false;
    case 'i':
      if (keyWordsI.indexOf(str) != -1) return true;
      return false;
    case 'l':
      if (keyWordsL.indexOf(str) != -1) return true;
      return false;
    case 'n':
      if (keyWordsN.indexOf(str) != -1) return true;
      return false;
    case 'p':
      if (keyWordsP.indexOf(str) != -1) return true;
      return false;
    case 'q':
      if (keyWordsQ.indexOf(str) != -1) return true;
      return false;
    case 'r':
      if (keyWordsR.indexOf(str) != -1) return true;
      return false;
    case 's':
      if (keyWordsS.indexOf(str) != -1) return true;
      return false;
    case 't':
      if (keyWordsT.indexOf(str) != -1) return true;
      return false;
    case 'v':
      if (keyWordsV.indexOf(str) != -1) return true;
      return false;
    case 'w':
      if (keyWordsW.indexOf(str) != -1) return true;
      return false;
    case 'y':
      if (keyWordsY.indexOf(str) != -1) return true;
      return false;
  }
}

const keyWordsA = ['abstract', 'arguments', 'await'];
const keyWordsB = ['boolean', 'break', 'byte'];
const keyWordsC = ['case', 'catch', 'char', 'class', 'const', 'continue', 'console'];
const keyWordsD = ['debugger', 'default', 'delete', 'do', 'double', 'document'];
const keyWordsE = ['else', 'enum', 'evalexport', 'extends'];
const keyWordsF = ['false', 'final', 'finally', 'float', 'for', 'function'];
const keyWordsG = ['goto'];
const keyWordsI = ['if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface'];
const keyWordsL = ['let', 'long', 'length', 'log'];
const keyWordsN = ['native', 'new', 'null'];
const keyWordsP = ['package', 'private', 'protected', 'public'];
const keyWordsQ = ['querySelector'];
const keyWordsR = ['return'];
const keyWordsS = ['short', 'static', 'super', 'switch', 'synchronized'];
const keyWordsT = ['this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof'];
const keyWordsV = ['var', 'void', 'volatile'];
const keyWordsW = ['while', 'with'];
const keyWordsY = ['yield'];

class Marker {
  constructor(start, type, len, word) {
    this.start = start;
    this.type = type;
    this.len = len;
    this.word = word;
  }
}