function setResp(str) { // Process any UI changes here, certain that RESPONSE is ready.
  let arr = str.split('|||');
  // elementActive(btnSaveCode, true);
  switch (arr[0]) { //switch on mode
    case 'login':
      clearMessages();
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
      snippetTitle.value = str[0].title;
      snippetDescription.value = str[0].description;
      input.value = str[0].snippet;
      showOutput();
    case 'getSnippets':
      if (arr[1] == 'success') {
        let str = JSON.parse(arr[3]);
        bgOutput.innerHTML = str[0].snippet;
        sidebarL.innerHTML = `<h3>snippets (${str.length})</h3>\n`;

        for (let i = 0; i < str.length; i++) {
          let d = new Date(str[i].created * 1000);
          let monthDay = d.getDate();
          let month = d.getMonth();
          let h = d.getHours();
          let m = d.getMinutes();
          let hoursMinutes = `${h}:${m}`;
          sidebarL.innerHTML += `
          <div class = 'availableSnippets'>
          
          <span class = "view" id="view_snippet" data-snippet_view_id = "${str[i].snippet_id}">VIEW</span>
          <span class = "edit" id="edit_snippet" data-snippet_edit_id = "${str[i].snippet_id}">EDIT</span>
          <span class = "share" id="share_snippet" data-snippet_share_id = "${str[i].snippet_id}">SHARE</span>
          
          <strong class="snippetTitle">${str[i].title}</strong> by 
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