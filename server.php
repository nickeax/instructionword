<?php
ini_set('display_errors', true);
session_start();
include_once("db/common.php");

if (isset($_POST['mode'])) {
  $message = "";
  switch ($_POST['mode']) {
    case 'postSnippet':
      if (!$_SESSION['loggedIn'] == 1) {
        die('postSnippet|||failure|||Please login to post your code');
      }
      if ($_POST['str'] === "") {
        die("postSnippet|||failure|||The snippet was blank.");
      }
      if (!isset($_POST['description'])) {
        die("postSnippet|||failure|||Please enter a description.");
      }
      if (!isset($_POST['title'])) {
        die("postSnippet|||failure|||Please enter a title.");
      }
      if ($_POST['title'] == "") {
        die("postSnippet|||failure|||Please enter a title.");
      }
      if ($_POST['description'] == "") {
        die("postSnippet|||failure|||Please enter a description.");
      }
      if (strlen($_POST['str']) >= 360000) {
        die("postSnippet|||failure|||Maximum snippet length exceeded.");
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
        die("postSnippet|||success|||" . $message);
      } else {
        $originalSnippet = $obj[0]->snippet;
        $editSnippet = $_POST['str'];
        $originalSnippetArr = explode("\n", $originalSnippet);
        $editTextArr = explode("\n", $editSnippet);

        if (count($editTextArr) >= count($originalSnippetArr)) { // The edit didn't alter the line count or added to it 
          
          $indexNum = 0;
          for ($i = 0; $i < count($editTextArr); $i++) {
            $inOriginal = false;
            for ($j = 0; $j < count($originalSnippetArr); $j++) {
              if ($editTextArr[$i] == $originalSnippetArr[$j]) {
                // This edit line is in the original snippet, flagged to not add it to the snippet_edit table.
                $inOriginal = true;
              }
            }
            if (!$inOriginal) {
              $userID = $_SESSION['id'];
              $arr = array($userID, $obj[0]->snippet_id, time(), $editTextArr[$i], $_POST['description'], $i);
              $res = Query("INSERT INTO snippet_edits (user_id, snippet_id, created, edit_text, description, line_index) VALUES (?, ?, ?, ?, ?, ?)", $arr);
            }
          }
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
              $userID = $_SESSION['id'];
              $arr = array($userID, $obj[0]->snippet_id, time(), $$editTextArr[$i], $_POST['description'], $i);
              $res = Query("INSERT INTO snippet_edits (user_id, snippet_id, created, edit_text, description, line_index) VALUES (?, ?, ?, ?, ?, ?)", $arr);
            }
          }
        }
        $message = "Thanks, your edit has been added to this snippet.";
        die("postSnippet|||success|||" . $message);
      }
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 
      break; // just here during development, to prevent accidental fall through
    case 'getSnippets':
      $arr = [];
      $res = Query('SELECT snippets.user_id, snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet, users.username 
      FROM snippets INNER JOIN users ON snippets.user_id = users.user_id ORDER BY snippets.snippet_id DESC', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippets|||success|||data retrieved|||" . $data;
      break;
    case 'getSnippet': // JUST ONE SNIPPET
      $arr = array($_POST['str']);
      $res = Query('SELECT user_id, snippet_id, title, created, description, snippet FROM snippets WHERE snippet_id = ?', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippet|||success|||data retrieved|||" . $data;
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
          die("login|||failure|||Your login details were incorrect. <hr>P1:" . $testPW . "<br>P2:" . $fa[0]['password']);
        } else {
          $_SESSION['id'] = $fa[0]['user_id'];
          $_SESSION['loggedIn'] = 1;
          $_SESSION['username'] = $username;
          die("login|||success|||You're now logged in.|||" . $username);
        }
      } else {
        die("login|||failure|||Please enter the required info.");
      }
      die();
    case 'logout':
      $_SESSION['id'] = null;
      $_SESSION['loggedIn'] = 0;
      $_SESSION['username'] = "";
      die("logout|||success");
      break;
    case 'join':
      $subArr = explode("&", $_POST['str']);
      $usernameSub = explode("=", $subArr[0]);
      $username = $usernameSub[1];
      $passwordSub = explode("=", $subArr[1]);
      $pw = $passwordSub[1];
      if (!$pw || !$username) {
        die("join|||failure|||Please make sure you provided enough information.");
      }
      $arr2 = array($username);
      $res = Query("SELECT * FROM users WHERE username = ?", $arr2);
      if (count($res->fetchAll())) {
        die("join|||failure|||Unable to register that username");
      } else {
        $pw = password_hash($pw, PASSWORD_DEFAULT);
        $arr3 = array($username, $pw, time());
        $res = Query("INSERT INTO users (username, password, created) VALUES(?, ?, ?)", $arr3);
        die("join|||success|||You joined successfully!");
      }
      die();
    case 'isLoggedIn':
      if ($_SESSION['loggedIn']) {
        die("isLoggedIn|||success|||" . $_SESSION['username']);
      } else {
        die("isLoggedIn|||failure");
      }
    case 'getUsername':
      if (!$_SESSION['loggedIn']) {
        die();
      }
      // die("getUsername|||success|||".$_POST['str']);
      // $arr1 = explode("&",$_POST['str']); // sent from snippet information
      // $arr2 = explode("=", $arr1[1]);
      $arr = array((int)$_POST['str']);
      $res = Query("SELECT * FROM users WHERE user_id = ? LIMIT 1", $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      die("getUsername|||success|||recieved|||" . $data);
    default:
      # code...
      break;
  }
} else {
  echo "No data sent.";
}
