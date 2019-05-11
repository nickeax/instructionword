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
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
      /* Either add the snippet as new one, or create an edit entry into the snippet edits table  */
      $arr = array($_POST['snippetID']);
      $res = Query("SELECT * FROM snippets WHERE snippet_id = ?", $arr);
      $rows = $res->rowCount();
      $obj = $res->fetchAll(PDO::FETCH_OBJ);
      // ($_POST['snippetID'] === NULL || $_POST['snippetID'] == 0) || ($_SESSION['id'] === $obj[0]->user_id)
      if ($rows == 0) {
        $message = "Your snippet has been <strong>saved</strong>, thanks!";
        $arr = array($_SESSION['id'], 0, time(), $_POST['str'], $_POST['description'], $_POST['title']);
        $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description, title) VALUES (?, ?, ?, ?, ?, ?)", $arr);
        die("postSnippet" . $sym . "success" . $sym . "" . $message);
      } else {
        $originalSnippet = $obj[0]->snippet;
        $editSnippet = $_POST['str'];
        $originalSnippetArr = explode("\n", $originalSnippet);
        $editTextArr = explode("\n", $editSnippet);
        if (count($editTextArr) >= count($originalSnippetArr)) { // The edit didn't alter the line count or added to it 
          $indexNum = "";
          $editSerial = "";
          for ($i = 0; $i < count($editTextArr); $i++) {
            $inOriginal = false;
            for ($j = 0; $j < count($originalSnippetArr); $j++) {
              if ($editTextArr[$i] == $originalSnippetArr[$j]) {
                // This edit line is in the original snippet, flagged to not add it to the snippet_edit table.
                $inOriginal = true;
              }
            }
            if (!$inOriginal) {
              if (strlen($editSerial) === 0) {
                $editSerial = $editTextArr[$i];
                $indexNum = $i;
              } else {
                $editSerial .= $EDSYM . $editTextArr[$i];
                $indexNum .= $EDSYM . $i;
              }
            }
          }
          $userID = $_SESSION['id'];
          $arr = array($userID, $obj[0]->snippet_id, time(), $editSerial, $_POST['description'], $indexNum);
          $res = Query("INSERT INTO snippet_edits (user_id, snippet_id, created, edit_text, description, line_index) VALUES (?, ?, ?, ?, ?, ?)", $arr);
        } else { // The edited version has fewer lines than the original
          for ($i = 0; $i < count($originalSnippetArr); $i++) {
            $inOriginal = false;
            $indexNum = 0;
            for ($j = 0; $j < count($editTextArr); $j++) {
              if ($editTextArr[$j] == $originalSnippetArr[$i]) {
                $inOriginal = true;
              }
            }
            if (!$inOriginal) {
              if (strlen($editSerial) === 0) {
                $editSerial = $editTextArr[$i];
                $indexNum = $i;
              } else {
                $editSerial .= $EDSYM . $editTextArr[$i];
                $indexNum .= $EDSYM . $i;
              }
            }
          }
          $userID = $_SESSION['id'];
          $arr = array($userID, $obj[0]->snippet_id, time(), $editSerial, $_POST['description'], $indexNum);
          $res = Query("INSERT INTO snippet_edits (user_id, snippet_id, created, edit_text, description, line_index) VALUES (?, ?, ?, ?, ?, ?)", $arr);
        }
        $message = "Thanks, your edit has been added to this snippet.";
        die("postSnippet" . $sym . "success" . $sym . "" . $message);
      }
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
      break; // just here during development, to prevent accidental fall through
    case 'getSnippets':
      $arr = [];
      $res = Query('SELECT snippets.user_id, snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet, users.username 
      FROM snippets INNER JOIN users ON snippets.user_id = users.user_id AND snippets.deleted != 1 ORDER BY snippets.snippet_id DESC', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippets" . $sym . "success" . $sym . "data retrieved" . $sym . "" . $data;
      break;
    case 'getSnippet': // JUST ONE SNIPPET
      $arr = array($_POST['str']);
      $res = Query('SELECT user_id, snippet_id, title, created, description, snippet FROM snippets WHERE snippet_id = ?', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippet" . $sym . "success" . $sym . "data retrieved" . $sym . "" . $data;
      break;
    case 'getEdits':
      $arr = array($_POST['str']);
      $res = Query('SELECT 
        snippet_edits.edit_id,
        snippet_edits.snippet_id,
        snippet_edits.created, 
        snippet_edits.edit_text, 
        snippet_edits.description, 
        snippet_edits.line_index,
        users.username FROM
        snippet_edits INNER JOIN users ON snippet_edits.user_id = users.user_id
        WHERE snippet_edits.snippet_id = ? GROUP BY snippet_edits.description', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getEdits" . $sym . "success" . $sym . "data retrieved" . $sym . $data;
      break;
    case 'displayWithEdits':
      if (!$_POST['editID']) {
        die("displayWithEdits" . $sym . "failure" . $sym . "Snippet ID was not set.");
      }
      $arr = array($_POST['editID']);
      $res = Query("SELECT * FROM snippet_edits WHERE edit_id = ?", $arr);
      $obj = $res->fetchAll(PDO::FETCH_OBJ);
      if (!$res) {
        el("res was empty, ending script.");
        die("displayWithEdits" . $sym . "failure" . $sym . "Could not fetch the edited version, please try again later.");
      }
      $editedArray = explode($EDSYM, $obj[0]->edit_text);
      $lineNumbers = explode($EDSYM, $obj[0]->line_index);
      $arr2 = array($obj[0]->snippet_id);
      $res2 = Query("SELECT * FROM snippets WHERE snippet_id = ?", $arr2);
      if (!$res2) {
        el("res was empty, ending script.");
        die("displayWithEdits" . $sym . "failure" . $sym . "Could not fetch the edited version, please try again later.");
      }
      $obj2 = $res2->fetchAll(PDO::FETCH_OBJ);
      $originalSnippetArr = explode(PHP_EOL, $obj2[0]->snippet);
      for ($i = 0; $i < count($editedArray); $i++) {
        $originalSnippetArr[intval($lineNumbers[$i])] = $editedArray[$i];
      }
      $retString = implode("\n", $originalSnippetArr);
      die("displayWithEdits" . $sym . "success" . $sym . "data retrieved" . $sym . $retString);
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
          die("login" . $sym . "success" . $sym . "You're now logged in." . $sym . "" . $username);
        }
      } else {
        die("login" . $sym . "failure" . $sym . "Please enter the required info.");
      }
      die();
    case 'logout':
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
      $arr = array((int)$_POST['str']);
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
