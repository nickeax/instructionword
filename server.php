<?php
session_start();
include_once("db/common.php");

if(isset($_POST['mode'])) {
  switch ($_POST['mode']) {
    case 'postSnippet':
      $arr = array(1, 0, time(), $_POST['str'], "A test of the emergency broadcast system");
      $res = Query("INSERT INTO snippets (user_id, lesson, created, snippet, description) VALUES (?, ?, ?, ?, ?)", $arr);
      die();
    
    default:
      # code...
      break;
  }
} else {
  echo "No data sent.";
}
?>