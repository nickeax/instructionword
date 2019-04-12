<?php
session_start();
include_once("db/common.php");

if (isset($_POST['mode'])) {
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
      if(strlen($_POST['str']) >= 360000) {
        die("postSnippet|||failure|||Maximum snippet length exceeded.");
      }
      $arr = array($_SESSION['id'], 0, time(), $_POST['str'], $_POST['description'], $_POST['title']);
      $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description, title) VALUES (?, ?, ?, ?, ?, ?)", $arr);

      die("postSnippet|||success|||Snippet saved.");
    case 'getSnippets':
      $arr = [];
      $res = Query('SELECT snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet, users.username 
      FROM snippets INNER JOIN users ON snippets.user_id = users.user_id ORDER BY snippets.snippet_id DESC', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippets|||success|||data retrieved|||" . $data;
      break;
    case 'getSnippet': // JUST ONE SNIPPET
      $arr = array($_POST['str']);
      $res = Query('SELECT snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet FROM snippets WHERE snippet_id = ?', $arr);
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
        if (!password_verify($pw, $fa[0]['password'])) {
          die("login|||failure|||Your login details were incorrect.");
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
/* 
const article = document.querySelector('#electric-cars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
*/
