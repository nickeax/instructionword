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
    case 'getEdits':
      let editsStr = JSON.parse(arr[3]);
      editsList.innerHTML = '<ul>';
      if (editsStr.length == 0) {
        editsList.innerHTML = '<em>no edits to display</em>';
        editsList.classList.add('noEdits');
        editsList.classList.remove('editsList');
      } else {
        editsList.innerHTML = "";
        editsList.classList.add('editsList');
        editsList.classList.remove('noEdits');
      }
      for (let i = 0; i < editsStr.length; i++) {
        editsList.innerHTML +=
          `<p><strong class="snippetTitle id="snippetSideBarTitle" 
            data-snippet_edit_id = "${editsStr[i].edit_id}" 
            data-snippet_snippet_id = "${editsStr[i].snippet_id}">
            ${editsStr[i].description}</strong> by 
            ${editsStr[i].username}
          </p>`;
      }
      editsList.innerHTML += "</ul>";
      break;
    case 'displayWithEdits':
      if (arr[1] != "success") {
        messages.innerHTML = arr[2];
        break;
      }
      let stred = arr[3];
      edited = false;
      snippetID = arr[0];
      snippetTitle.value = stred;
      snippetDescription.value = stred;
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
      if (arr[1] != "success") {
        break;
      }
      let str = JSON.parse(arr[3]);
      edited = false;
      snippetID = str[0].snippet_id;
      snippetTitle.value = str[0].title;
      snippetDescription.value = str[0].description;
      input.value = str[0].snippet;
      showOutput();
      break;
    case 'getSnippets':
      if (arr[1] == 'success') {
        let str = JSON.parse(arr[3]);
        // bgOutput.innerHTML = str[0].snippet;
        let existing = sidebarL.innerHTML;
        sidebarL.innerHTML = `<tt class='snippetsHeading'>snippets (${str.length})</tt>\n`;
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
          sidebarL.innerHTML += `
          <div class = 'availableSnippets'>
          <span class = "edit ${displayEdit}" id="edit_snippet" 
            data-snippet_edit_id = "${str[i].snippet_id}"
            data-snippet_edit_title = "${str[i].title}"
            data-snippet_edit_username = "${str[i].username}"
            data-snippet_edit_user_id = "${str[i].user_id}">EDIT
          </span>
          <span class = "share" id="share_snippet">
            <a href=index.html?sid=${str[i].snippet_id}>SHARE</span></a>
          <strong class="snippetTitle id="snippetSideBarTitle" data-snippet_edit_id = "${str[i].snippet_id}" >${str[i].title}</strong> by 
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