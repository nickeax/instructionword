function elementActive(el, yes) {
  if (!yes) {
    el.classList.add('hidden');
    el.disabled = true;
  } else {
    el.classList.remove('hidden');
    el.disabled = false;
  }
}

function autoLoad() { // Populate UI with available Project data (just snippets ATM)
  let loc = window.location.href;
  if (loc.indexOf('=') != -1) { // Don't poll if this is a 'share' operation
    messages.classList.remove('hidden');
    document.querySelector('#messages').innerHTML = `Copy and paste the below link to share:<hr> ${loc}`;
    checkServer('getSnippet', loc.split("=")[1], setResp);
    elementActive(homeButton, true);
    // elementActive(input, false);
    // input.classList.add('hidden');
  } else {
    window.setInterval(() => {
      elementActive(btnSaveCode, edited);
      checkServer('getSnippets', "", setResp);
    }, pollingInterval);
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

function postOutput() {
  markers = [];
  let op = "";
  buildMarkers(getInput('#input'));
  op = processMarkers(markers);
  return op;
}

function keyPress() {
  edited = true;
  elementActive(btnSaveCode, edited);
  showOutput();
}

function showOutput(str) {
  markers = [];
  let op = "";
  buildMarkers(getInput('#input'));
  op = processMarkers(markers);
  document.querySelector('#output').innerHTML = op;
  bgOutput.innerHTML = op;

}

function getInput(id) {
  let inputData = document.querySelector(`${id}`).value;
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
    st = snippetDescription.value;
    description = encodeURIComponent(st);
  }
  if (snippetEditUsername != "") {
    snippetEditUsername = encodeURIComponent(snippetEditUsername);
  }

  if (editID !== 0) {
    editID = encodeURIComponent(editID);
  }

  str = encodeURIComponent(str);

  params = `mode=${mode}&str=${str}&title=${title}&description=${description}&username=${snippetEditUsername}&snippetID=${snippetID}&editID=${editID}`; // build the POST query string
  const xhr = new XMLHttpRequest();
  xhr.open("POST", 'server.php', true);
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
    displayEdit = "hidden";
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