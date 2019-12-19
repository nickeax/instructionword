<?php
session_start();
include_once("db/common.php");
if (isset($_POST['mode'])) {
  $message = "";
  switch ($_POST['mode']) {
    case 'postSnippet':
      if (!$_SESSION['loggedIn'] == 1) {
        die("postSnippet" . $sym . "failure" . $sym . "Please login to post your code");
      }
      if ($_POST['str'] === "") {
        die("postSnippet" . $sym . "failure" . $sym . "The snippet was blank.");
      }
      if (!isset($_POST['description'])) {
        die("postSnippet" . $sym . "failure" . $sym . "Please enter a description.");
      }
      if (!isset($_POST['title'])) {
        die("postSnippet" . $sym . "failure" . $sym . "Please enter a title.");
      }
      if ($_POST['title'] == "") {
        die("postSnippet" . $sym . "failure" . $sym . "Please enter a title.");
      }
      if ($_POST['description'] == "") {
        die("postSnippet" . $sym . "failure" . $sym . "Please enter a description.");
      }
      if (strlen($_POST['str']) >= 360000) {
        die("postSnippet" . $sym . "failure" . $sym . "Maximum snippet length exceeded.");
      }
      if (!isset($_POST['snippetID'])) {
        $_POST['snippetID'] = 0;
      }
      updateActiveVisitors(getClientIP());
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
      /* Either add the snippet as new one, or create an edit entry into the snippet edits table  */
      $arr = array($_POST['snippetID']);
      $res = Query("SELECT * FROM snippets WHERE snippet_id = ?", $arr);
      $rows = $res->rowCount();
      $obj = $res->fetchAll(PDO::FETCH_OBJ);
      if ($rows === 0) {
        $message = "Your snippet has been <strong>saved</strong>, thanks!";
        $arr = array($_SESSION['id'], 0, time(), $_POST['str'], $_POST['description'], $_POST['title']);
        $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description, title) VALUES (?, ?, ?, ?, ?, ?)", $arr);
        die("postSnippet" . $sym . "success" . $sym . "" . $message);
      } else {
        $originalSnippet = $obj[0]->snippet;
        $editSnippet = $_POST['str'];
        $arr = array($_SESSION['id'], $obj[0]->snippet_id, time(), $editSnippet, $_POST['description'], 1);
        $res = Query("INSERT INTO snippet_edits (user_id, snippet_id, created, edit_text, description, line_index) VALUES (?, ?, ?, ?, ?, ?)", $arr);
        $message = "Thanks, your edit has been added to this snippet.";
        die("postSnippet" . $sym . "success" . $sym . "" . $message);
      }
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
      break; // just here during development, to prevent accidental fall through
    case 'getMemberList':
      $arr = array();
      $res = Query("SELECT active.user_id, users.username FROM active INNER JOIN users ON active.user_id = users.user_id", $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      if(!$data) {
        echo "getMemberList" . $sym . "failure" . $sym . "" . $sym . "" . $data;
      } else {
        el("THE DATA:".$data);
        echo "getMemberList" . $sym . "success" . $sym . "" . $sym . "" . $data;
      }
      break;
    case 'getSnippets':
      updateActiveVisitors(getClientIP());
      if ($_SESSION['id']) {
        $now = time();
        $arr = array($now, $_SESSION['id']);
        // Query("UPDATE active SET stamp = ? WHERE user_id = ?", $arr);
      }
      $arr = [];
      $res = Query('SELECT snippets.user_id, snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet, users.username 
      FROM snippets INNER JOIN users ON snippets.user_id = users.user_id AND snippets.deleted != 1 ORDER BY snippets.snippet_id DESC', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippets" . $sym . "success" . $sym . "" . $sym . "" . $data;
      break;
    case 'getSnippet': // JUST ONE SNIPPET
      updateActiveVisitors(getClientIP());
      $arr = array($_POST['str']);
      $res = Query('SELECT user_id, snippet_id, title, created, description, snippet FROM snippets WHERE snippet_id = ?', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippet" . $sym . "success" . $sym . "" . $sym . "" . $data;
      break;
    case 'editInPlace':

      break;

    case 'removeSnippet':
      updateActiveVisitors(getClientIP());
      $arr = array($_POST['str']);
      $res = Query("SELECT user_id FROM snippets WHERE snippet_id = ?", $arr);
      $data = $res->fetchAll(PDO::FETCH_OBJ);
      if ($_SESSION['id'] !== $data[0]->user_id) {
        echo "removeSnippet" . $sym . "failure" . $sym . "This is not your snippet." . $sym . "";
        die();
      } else {
        Query("UPDATE snippets SET deleted = 1 WHERE snippet_id = ?", $arr);
        echo "removeSnippet" . $sym . "success" . $sym . "Your snippet has been removed, but it can be restored by the site admin." . $sym . "";
      }
      break;
    case 'getEdits':
      $arr = array(intval($_POST['str']));
      $res = Query('SELECT 
        snippet_edits.edit_id,
        snippet_edits.snippet_id,
        snippet_edits.created, 
        snippet_edits.edit_text, 
        snippet_edits.description, 
        snippet_edits.line_index,
        users.username
         FROM
         snippet_edits INNER JOIN users ON snippet_edits.user_id = users.user_id
        WHERE snippet_edits.snippet_id = ?', $arr);
      $data = $res->fetchAll(PDO::FETCH_OBJ);
      // $serial = implode("", $data);
      $data = json_encode($data);
      echo "getEdits" . $sym . "success" . $sym . "" . $sym . $data;
      break;
    case 'displayWithEdits':
      updateActiveVisitors(getClientIP());
      if (!$_POST['editID']) {
        die("displayWithEdits" . $sym . "failure" . $sym . "Edit ID was not set.");
      }
      $arr = array($_POST['editID']);
      $res = Query("SELECT * FROM snippet_edits WHERE edit_id = ?", $arr);
      $obj = $res->fetchAll(PDO::FETCH_OBJ);
      $data = $obj[0]->edit_text;
      if (!$res) {
        die("displayWithEdits" . $sym . "failure" . $sym . "Could not fetch the edited version, please try again later.");
      }
      die("displayWithEdits" . $sym . "success" . $sym . "" . $sym . $data);
      break;
    case 'sendMessage':
      if (isset($_POST['str']) && isset($_SESSION['id'])) {
        $mess = filter_input(INPUT_POST, 'str', FILTER_SANITIZE_SPECIAL_CHARS);
        $sid = filter_input(INPUT_POST, 'snippetID', FILTER_SANITIZE_SPECIAL_CHARS);
        $arr = array($sid, $_SESSION['id'], $mess, time());
        Query("INSERT INTO messages (snippet_id, user_id, message, timestamp) values (?, ?, ?, ?)", $arr);
      } else {
        die("sendMessage" . $sym . "failure" . $sym . "The message was invalid.");
      }
      break;
    case 'getChatMessages':
      $arr = array($_POST['snippetID']);
      $res = Query("SELECT messages.message, messages.timestamp, users.username FROM messages INNER JOIN users ON messages.user_id = users.user_id WHERE messages.snippet_id = ?", $arr);
      $data = $res->fetchAll(PDO::FETCH_OBJ);
      // $serial = implode("", $data);
      $data = json_encode($data);
      die("getChatMessages" . $sym . "success" . $sym . "" . $sym . $data);
      break;
    case 'login':
      $subArr = explode("&", $_POST['str']);
      $usernameSub = explode("=", $subArr[0]);
      $username = $usernameSub[1];
      $passwordSub = explode("=", $subArr[1]);
      $pw = $passwordSub[1];
      if ($username && $pw) {
        $arr = array($username);
        $res = Query("SELECT * FROM users WHERE username = ?", $arr);
        $fa = $res->fetchAll();

        $check = password_verify($pw, $fa[0]['password']);
        if (!$check) {
          $testPW = $pw;
          die("login" . $sym . "failure" . $sym . "Your login details were incorrect.");
        } else {
          $_SESSION['id'] = $fa[0]['user_id'];
          $_SESSION['loggedIn'] = 1;
          $_SESSION['username'] = $username;
          updateActiveVisitors(getClientIP());
          die("login" . $sym . "success" . $sym . "You're now logged in." . $sym . "" . $username);
        }
      } else {
        die("login" . $sym . "failure" . $sym . "Please enter the required info.");
      }
    case 'countOnline':
      $arr = array();
      die("countOnline" . $sym . "success" . $sym . countResults("SELECT * FROM active", $arr));
      break;
    case 'logout':
      $arr = array($_SESSION['id']);
      Query("DELETE FROM active where user_id = ?", $arr);
      $_SESSION['id'] = null;
      $_SESSION['loggedIn'] = 0;
      $_SESSION['username'] = "";
      die("logout" . $sym . "success");
      break;
    case 'join':
      $subArr = explode("&", $_POST['str']);
      $usernameSub = explode("=", $subArr[0]);
      $username = $usernameSub[1];
      $passwordSub = explode("=", $subArr[1]);
      $pw = $passwordSub[1];
      if (!$pw || !$username) {
        die("join" . $sym . "failure" . $sym . "Please make sure you provided enough information.");
      }
      $arr2 = array($username);
      $res = Query("SELECT * FROM users WHERE username = ?", $arr2);
      if (count($res->fetchAll())) {
        die("join" . $sym . "failure" . $sym . "Unable to register that username");
      } else {
        $pw = password_hash($pw, PASSWORD_DEFAULT);
        $arr3 = array($username, $pw, time());
        $res = Query("INSERT INTO users (username, password, created) VALUES(?, ?, ?)", $arr3);
        die("join" . $sym . "success" . $sym . "You joined successfully!");
      }
      die();
    case 'isLoggedIn':
      if ($_SESSION['loggedIn']) {
        die("isLoggedIn" . $sym . "success" . $sym . "" . $_SESSION['username']);
      } else {
        die("isLoggedIn" . $sym . "failure");
      }
    case 'getUsername':
      if (!$_SESSION['loggedIn']) {
        die();
      }
      // die("getUsername".$sym."success".$sym."".$_POST['str']);
      // $arr1 = explode("&",$_POST['str']); // sent from snippet information
      // $arr2 = explode("=", $arr1[1]);
      $arr = array((int) $_POST['str']);
      $res = Query("SELECT * FROM users WHERE user_id = ? LIMIT 1", $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      die("getUsername" . $sym . "success" . $sym . "recieved" . $sym . "" . $data);
    default:
      # code...
      break;
  }
} else {
  echo "No data sent.";
}
