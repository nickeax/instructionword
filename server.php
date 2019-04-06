<?php
session_start();
include_once("db/common.php");

if(isset($_POST['mode'])) {
  switch ($_POST['mode']) {
    case 'postSnippet':
      $arr = array(1, 0, time(), $_POST['str'], "A test of the emergency broadcast system");
      $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description) VALUES (?, ?, ?, ?, ?)", $arr);
      die();
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
        die ("login|failure|Your login details were incorrect.");
      } else {
        $_SESSION['id'] = $fa[0]['user_id'];
        $_SESSION['id'] = 1;
        die ("login|success|You're now logged in.");
      }
    } else {
      die("login|failure|Please enter the required info.");
    }
    die();
    case 'logout':
      $_SESSION['id'] = null;
      $_SESSION['loggedIn'] = 0;
      die("logout|success");
      break;
    case 'join':
      $subArr = explode("&", $_POST['str']);
      $usernameSub = explode("=", $subArr[0]) ;
      $username = $usernameSub[1];
      $passwordSub = explode("=", $subArr[1]) ;
      $pw = $passwordSub[1];
      if(!$pw || !$username) {
        die("join|failure|Please make sure you provided enough information.");
      }
      $arr2 = array($username);
      $res = Query("SELECT * FROM users WHERE username = ?", $arr2);
      if(count($res->fetchAll())) {
        die ("join|failure|Unable to register that username");
      } else {
        $pw = password_hash($pw, PASSWORD_DEFAULT);
        $arr3 = array($username, $pw, time());
        $res = Query("INSERT INTO users (username, password, created) VALUES(?, ?, ?)", $arr3);
        die("join|success|You joined successfully!");
      }
      die();
      case 'isLoggedIn':
        if($_SESSION['loggedIn']) {
          die("loggedIn|success");
        } else {
          die("loggedIn|failure");
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