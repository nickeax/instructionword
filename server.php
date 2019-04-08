<?php
session_start();
include_once("db/common.php");

if(isset($_POST['mode'])) {
  switch ($_POST['mode']) {
    case 'postSnippet':
      if(!$_SESSION['loggedIn'] == 1) {
        die('postSnippet|||failure|||Please login to post your code');
      }
      if($_POST['str'] === "") {
        die("postSnippet|||failure|||Your snippet contained no text.");
      }
      $arr = array($_SESSION['id'], 0, time(), $_POST['str'], "A test of the emergency broadcast system");
      $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description) VALUES (?, ?, ?, ?, ?)", $arr);
      die("postSnippet|||success|||Your snippet has been saved to your account.");
    case 'getSnippets':
      $arr = [];
      $res = Query('SELECT * FROM snippets', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      echo "getSnippets|||success|||data retrieved|||".$data;
      break;
    case 'login':
    $subArr = explode("&", $_POST['str']);
    $usernameSub = explode("=", $subArr[0]) ;
    $username = $usernameSub[1];
    $passwordSub = explode("=", $subArr[1]) ;
    $pw = $passwordSub[1];
    if($username && $pw) {
      $arr = array($username);
      $res = Query("SELECT * FROM users WHERE username = ?", $arr);
      $fa = $res->fetchAll();
      if(!password_verify($pw, $fa[0]['password'])) {
        die ("login|||failure|||Your login details were incorrect.");
      } else {
        $_SESSION['id'] = $fa[0]['user_id'];
        $_SESSION['loggedIn'] = 1;
        $_SESSION['username'] = $username;
        die ("login|||success|||You're now logged in.|||".$username);
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
      $usernameSub = explode("=", $subArr[0]) ;
      $username = $usernameSub[1];
      $passwordSub = explode("=", $subArr[1]) ;
      $pw = $passwordSub[1];
      if(!$pw || !$username) {
        die("join|||failure|||Please make sure you provided enough information.");
      }
      $arr2 = array($username);
      $res = Query("SELECT * FROM users WHERE username = ?", $arr2);
      if(count($res->fetchAll())) {
        die ("join|||failure|||Unable to register that username");
      } else {
        $pw = password_hash($pw, PASSWORD_DEFAULT);
        $arr3 = array($username, $pw, time());
        $res = Query("INSERT INTO users (username, password, created) VALUES(?, ?, ?)", $arr3);
        die("join|||success|||You joined successfully!");
      }
      die();
      case 'isLoggedIn':
        if($_SESSION['loggedIn']) {
          die("isLoggedIn|||success|||".$_SESSION['username']);
        } else {
          die("isLoggedIn|||failure");
        }
        break;
    default:
      # code...
      break;
  }
} else {
  echo "No data sent.";
}
?>