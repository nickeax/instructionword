
function setResp(str) { // Process any UI changes here, certain that RESPONSE is ready.
  let arr = str.split('|||');
  // elementActive(btnSaveCode, true);
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
      snippetID = 0;
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
    case 'sendMessage':
      if (arr[1] == 'failure') {
        messages.innerHTML = arr[2];
      }
    case 'getMemberList':
      usersArr = JSON.parse(arr[3]);
      break;
    case 'countOnline':
      let content = "";
      onlineUsers = arr[2];
      onlineInfo.innerHTML = "";
      onlineInfo.innerHTML = `<tt>online(${onlineUsers})</tt>`;
      if (usersArr.length > 0) {
        for (let i = 0; i < usersArr.length; i++) {
          if (i > 0) content += ', ';
          content += `${usersArr[i].username}`;
        }
      } else { content = "no one is logged in"; }
      onlineInfo.innerHTML += `<div class="loggedInMembers">${content}</div>`;
      break;
    case 'getEdits':
      let editsStr = JSON.parse(arr[3]);
      editsList.innerHTML = "";
      editsList.innerHTML = '<ul>';
      if (editsStr.length == 0) {
        editsList.innerHTML = "";
        editsList.innerHTML = 'no edits to display';
        // editsList.classList.add('noEdits');
        editsList.classList.remove('editsList');
      } else {
        editsList.innerHTML = "";
        editsList.classList.add('editsList');
        editsList.classList.remove('noEdits');
      }
      editsList.innerHTML += `<p class="snippetEditLink"><tt>https://instructionword.com/${snippetID}</tt></p>
      <a href="#"><p class="editListItem" id="original">ORIGINAL</p></a>`;
      for (let i = 0; i < editsStr.length; i++) {
        editsList.innerHTML += `<a href="#"><p class="editListItem">
            <strong class="snippetTitle id="snippetSideBarTitle"
              data-snippet_edit_id = "${editsStr[i].edit_id}"  
              data-snippet_snippet_id = "${editsStr[i].snippet_id}"
              data-edit-clicked = "1"> ${editsStr[i].description} 
              <span class="username">edited by ${editsStr[i].username}</span>
            </strong>
          </p></a>`;
        editsList.innerHTML += "</ul>";
      }
      document.querySelector('#original').addEventListener(`click`, (e) => {
        checkServer('getSnippet', editsStr[0].snippet_id, setResp);
      });
      break;
    case 'getChatMessages':
      chatOutput.innerHTML = "";
      if (arr[1] == "success") {
        chatMessages = JSON.parse(arr[3]);
      }
      chatMessages.forEach(x => {
        let d = new Date(parseInt(x.timestamp) * 1000);
        let monthDay = d.getDate();
        let month = d.getMonth();
        let h = d.getHours();
        let m = d.getMinutes();
        let disp = `${h}:${m}`;
        chatOutput.innerHTML += `<p class="chatMessage"><span class="chatTime">${disp}</span> <span class="chatUsername">${x.username}</span>: ${x.message}</p>`;
      });
      chatOutput.scrollTop = chatOutput.scrollHeight;
      break;
    case 'removeSnippet':
      // messages.classList.add('hidden');
      if (arr[1] != "success") {
        messages.innerHTML = arr[2];
      } else {
        messages.innerHTML = arr[2];
      }
      elementActive(messages, "yes");
      break;
    case 'displayWithEdits':
      if (arr[1] != "success") {
        messages.innerHTML = arr[2];
        break;
      }
      let stred = arr[3];
      edited = false;
      snippetID = arr[0];
      // snippetTitle.value = stred;
      // snippetDescription.value = stred;
      input.value = stred;
      showOutput(stred);
      break;
    case 'isLoggedIn':
      if (arr[1] == 'success') {
        theUser = arr[2];
        updateUI('loggedIn');
      }
      break;
    case 'getSnippet':
      elementActive(messages, "no");
      if (arr[1] != "success") {
        break;
      }
      let str = JSON.parse(arr[3]);
      edited = false;
      snippetID = str[0].snippet_id;
      snippetTitle.value = str[0].title;
      snippetDescription.value = str[0].description;
      input.value = str[0].snippet;
      btnRemoveSnippet.setAttribute("data-snippet_snippet_id", snippetID);
      elementActive(btnRemoveSnippet, "yes");
      showOutput();
      break;
    case 'getSnippets':
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      snippetSelectModalContent.innerHTML = "";
      if (arr[1] == 'success') {
        let str = JSON.parse(arr[3]);
        for (let i = 0; i < str.length; i++) {
          if (!loggedIn) {
            displayEdit = "hidden";
          } else {
            displayEdit = "";
          }
          let d = new Date(str[i].created * 1000);
          let monthDay = d.getDate();
          let month = d.getMonth();
          let h = d.getHours();
          let m = d.getMinutes();
          let hoursMinutes = `${h}:${m}`;
          snippetSelectModalContent.innerHTML += `
          <div class = 'availableSnippets'>
            <span class="snippetTitle id="snippetSideBarTitle" data-snippet_snippet_id = "${str[i].snippet_id}" >
              ${str[i].title} 
            </span>
            <em>${str[i].description.substring(0, 40)}...</em>
              <span id="timestamp" class = "username">${months[month]} ${monthDay + 1}</span> by 
              <span id = "listed_snippet" class = "username">${str[i].username}</span>
            <span class = "share" id="share_snippet">
              <a href=index.html?sid=${str[i].snippet_id}>SHARE</a>
            </span>          
          </div>`;
        }
        snippetSelectModalContent.innerHTML += "\n";
      }
      break;
    default:
      break;
  }
}