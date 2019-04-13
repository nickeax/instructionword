<?php
/*
Using GET parameters, retrieve the snippet or project from the database and display it
*/
include_once("db/common.php");

if(!$_GET) {
  die();
}
$arr = array($_GET['id']);
      $res = Query('SELECT snippets.snippet_id, snippets.title, snippets.created, snippets.description, snippets.snippet FROM snippets WHERE snippet_id = ?', $arr);
      $data = json_encode($res->fetchAll(PDO::FETCH_ASSOC));
      die("shareSnippet|||success|||data retrieved|||". $data);
?>