function elementActive(el, yes) {
  if (!yes) {
    el.classList.add('disabled');
    el.disabled = true;
  } else {
    el.classList.remove('disabled');
    el.disabled = false;
  }
}

function autoLoad() { // Populate UI with available Project data (just snippets ATM)
  window.setInterval(() => {
    checkServer('getSnippets', "", setResp);
  }, 3000);
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

function postOutput() {
  markers = [];
  let op = "";
  buildMarkers(getInput('input'));
  op = processMarkers(markers);
  return op;
}

function showOutput(ev) {
  markers = [];
  let op = "";
  buildMarkers(getInput('input'));
  op = processMarkers(markers);
  output.innerHTML = op;
  bgOutput.innerHTML = op;
}

function getInput(id) {
  let inputData = document.querySelector(`#${id}`).value;
  return inputData;
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
        tmp += "\n";
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
      if (element.word == "'" || element.word == "`") tmp += "&#34;"; else tmp += `${element.word}`;
    }
  });
  return tmp;
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