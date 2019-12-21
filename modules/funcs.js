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
  if (loc.indexOf("fbclid") != -1 && loc.indexOf("sid") != -1) {
    let newLoc = loc.slice(0, loc.indexOf('&'));
    console.log(newLoc);
    window.location.href = newLoc;
  } else if (loc.indexOf("fbclid") != -1) {
    window.location.href = "/";
  } else if (loc.indexOf('=') != -1) { // Don't poll if this is a 'share' operation
    language.classList.remove('hidden');
    language.innerHTML = `Copy and paste the below link to share:<hr> ${loc}`;
    checkServer('getSnippet', loc.split("=")[1], setResp);
    elementActive(homeButton, true);
    sidebarL.innerHTML = "";
    elementActive(btnRemoveSnippet, false);
    let si = loc.split("=")[1];
    checkServer('getEdits', si, setResp);
  } else {
    window.setInterval(() => {
      checkServer('getMemberList', "", setResp);
      elementActive(btnSaveCode, edited);
      checkServer('getSnippets', "", setResp);
      checkServer('countOnline', "", setResp);

      if (snippetID >= 0) {
        checkServer('getChatMessages', "", setResp);
      };
    }, pollingInterval);
  }
}
clipboard.addEventListener("click", copyToClipboard);

function copyToClipboard() {
  var range = document.createRange();
  range.selectNode(language);
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  document.execCommand("copy");
  window.getSelection().removeAllRanges();// to deselect
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
  if (snippetID === null) {
    snippetID = -1;
  }
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
  // console.log(params);

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
    sendMessage.disabled = false;
    btnRemoveSnippet.classList.remove('hidden');
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
    sendMessage.disabled = true;
    btnRemoveSnippet.classList.add('hidden');
    snippetDescription.classList.add('hidden');
    snippetTitle.classList.add('hidden');
    btnSaveCode.classList.add('hidden');
    btnClearCode.classList.remove('hidden');
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
  let lineNumber = 2;
  let tmp = "<span class = 'lineNumber'>1: </span>";
  let inSingleQuotes = false;
  let inDoubleQuotes = false;
  let language = detectLanguage(markers);

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
      tmp += `<span class='lineNumber'>${lineNumber}:</span>`;
      lineNumber++;
    } else if (element.type == 'SPC') {
      tmp += "&nbsp;";
    } else if (isKeyword(element.word, language)) {
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
// languagesArray holds to arrays which each hold 26 arrays with various keywords
// To check all of the JavaScript keywords, I need to first select the JavaScript array
// languagesArray[0]
// languagesArray[0] contains 26 sub arrays
function detectLanguage(arr) {
  let keyWordsPercent = 2;
  let total = 0;
  let lan = "";
  detected = [0, 0]; //0 = JS/C/CPP   1 = PHP  2 = unkown
  for (let i = 0; i < arr.length; i++) { // go through every marker
    for (let j = 0; j < languagesArray[0].length; j++) { // go though every word array
      if (languagesArray[0][j].includes(arr[i].word)) {
        detected[0]++;
      }
    }

    for (let k = 0; k < languagesArray[1].length; k++) { // go though every word array
      if (languagesArray[1][k].indexOf(arr[i].word) != -1) {
        detected[1]++;
      }
    }
  }
  total = detected[0] + detected[1];
  let wholePercent = Math.floor((total / arr.length) * 100);
  console.log(wholePercent + "%");

  if (wholePercent < keyWordsPercent) {
    detectedLanguage.innerHTML = '<tt>detected plain text</tt>';
    lan = "text";
    return lan;
  }
  detected[0] > detected[1] ? lan = "JavaScript/C/C++" : lan = "PHP";
  detectedLanguage.innerHTML = "<tt>Detected " + lan + "</tt>";

  return lan;
}

function isKeyword(str, language) {
  let firstLetter = str.toLowerCase().charAt(0);
  if (language === "text") {
    return false;
  }
  if (language === "JavaScript") {
    switch (firstLetter) {
      case 'a':
        if (JSkeyWordsA.indexOf(str) != -1) return true;
        return false;
      case 'b':
        if (JSkeyWordsB.indexOf(str) != -1) return true;
        return false;
      case 'c':
        if (JSkeyWordsC.indexOf(str) != -1) return true;
        return false;
      case 'd':
        if (JSkeyWordsD.indexOf(str) != -1) return true;
        return false;
      case 'e':
        if (JSkeyWordsE.indexOf(str) != -1) return true;
        return false;
      case 'f':
        if (JSkeyWordsF.indexOf(str) != -1) return true;
        return false;
      case 'g':
        if (JSkeyWordsG.indexOf(str) != -1) return true;
        return false;
      case 'h':
        if (JSkeyWordsH.indexOf(str) != -1) return true;
        return false;
      case 'i':
        if (JSkeyWordsI.indexOf(str) != -1) return true;
        return false;
      case 'j':
        if (JSkeyWordsJ.indexOf(str) != -1) return true;
        return false;
      case 'k':
        if (JSkeyWordsK.indexOf(str) != -1) return true;
        return false;
      case 'l':
        if (JSkeyWordsL.indexOf(str) != -1) return true;
        return false;
      case 'm':
        if (JSkeyWordsM.indexOf(str) != -1) return true;
        return false;
      case 'n':
        if (JSkeyWordsN.indexOf(str) != -1) return true;
        return false;
      case 'o':
        if (JSkeyWordsO.indexOf(str) != -1) return true;
        return false;
      case 'p':
        if (JSkeyWordsP.indexOf(str) != -1) return true;
        return false;
      case 'q':
        if (JSkeyWordsQ.indexOf(str) != -1) return true;
        return false;
      case 'r':
        if (JSkeyWordsR.indexOf(str) != -1) return true;
        return false;
      case 's':
        if (JSkeyWordsS.indexOf(str) != -1) return true;
        return false;
      case 't':
        if (JSkeyWordsT.indexOf(str) != -1) return true;
        return false;
      case 'u':
        if (JSkeyWordsU.indexOf(str) != -1) return true;
        return false;
      case 'v':
        if (JSkeyWordsV.indexOf(str) != -1) return true;
        return false;
      case 'w':
        if (JSkeyWordsW.indexOf(str) != -1) return true;
        return false;
      case 'x':
        if (JSkeyWordsX.indexOf(str) != -1) return true;
        return false;
      case 'y':
        if (JSkeyWordsY.indexOf(str) != -1) return true;
        return false;
      case 'z':
        if (JSkeyWordsZ.indexOf(str) != -1) return true;
        return false;
    }
  }
  if (language === "PHP") {
    switch (firstLetter) {
      case 'a':
        if (PHPkeyWordsA.indexOf(str) != -1) return true;
        return false;
      case 'b':
        if (PHPkeyWordsB.indexOf(str) != -1) return true;
        return false;
      case 'c':
        if (PHPkeyWordsC.indexOf(str) != -1) return true;
        return false;
      case 'd':
        if (PHPkeyWordsD.indexOf(str) != -1) return true;
        return false;
      case 'e':
        if (PHPkeyWordsE.indexOf(str) != -1) return true;
        return false;
      case 'f':
        if (PHPkeyWordsF.indexOf(str) != -1) return true;
        return false;
      case 'g':
        if (PHPkeyWordsG.indexOf(str) != -1) return true;
        return false;
      case 'h':
        if (PHPkeyWordsH.indexOf(str) != -1) return true;
        return false;
      case 'i':
        if (PHPkeyWordsI.indexOf(str) != -1) return true;
        return false;
      case 'j':
        if (PHPkeyWordsJ.indexOf(str) != -1) return true;
        return false;
      case 'k':
        if (PHPkeyWordsK.indexOf(str) != -1) return true;
        return false;
      case 'l':
        if (PHPkeyWordsL.indexOf(str) != -1) return true;
        return false;
      case 'm':
        if (PHPkeyWordsM.indexOf(str) != -1) return true;
        return false;
      case 'n':
        if (PHPkeyWordsN.indexOf(str) != -1) return true;
        return false;
      case 'o':
        if (PHPkeyWordsO.indexOf(str) != -1) return true;
        return false;
      case 'p':
        if (PHPkeyWordsP.indexOf(str) != -1) return true;
        return false;
      case 'q':
        if (PHPkeyWordsQ.indexOf(str) != -1) return true;
        return false;
      case 'r':
        if (PHPkeyWordsR.indexOf(str) != -1) return true;
        return false;
      case 's':
        if (PHPkeyWordsS.indexOf(str) != -1) return true;
        return false;
      case 't':
        if (PHPkeyWordsT.indexOf(str) != -1) return true;
        return false;
      case 'u':
        if (PHPkeyWordsU.indexOf(str) != -1) return true;
        return false;
      case 'v':
        if (PHPkeyWordsV.indexOf(str) != -1) return true;
        return false;
      case 'w':
        if (PHPkeyWordsW.indexOf(str) != -1) return true;
        return false;
      case 'x':
        if (PHPkeyWordsX.indexOf(str) != -1) return true;
        return false;
      case 'y':
        if (PHPkeyWordsY.indexOf(str) != -1) return true;
        return false;
      case 'z':
        if (PHPkeyWordsZ.indexOf(str) != -1) return true;
        return false;
    }
  }
}
