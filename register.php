<?php

$header = "
  <!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <meta http-equiv='X-UA-Compatible' content='ie=edge'>
  <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">
  <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css\">
  <title>join instruction word!</title>
  </head>
  <body>
  <header class=\no-padding \"><div class=\navbar-fixed\>  
  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js\"></script>
  <h1 class=\"center-align\">Join<em class = 'red-text lighten-5'>Instruction</em><strong class='blue-text'>WORD</strong> !</h1>
  </div></header>
  <div class = 'container'>
  
  ";
$footer = "
      </div>
    </div>
  </body>
  </html>
  ";
if (!isset($_POST['reg'])) {
  $_POST['reg'] = "";
}
/*REGISTER * * * * * * * * * * **/
$username = "";
$password = "";
if ($_POST['antibot'] !==  $_POST['ans']) {
  die($header . "Your answer to the question was not correct.<hr>" .
    "<a href =\"register.php\"><button type=\"button\" class=\"btn btn-info\">
    join<span class=\"glyphicon glyphicon-log-in\"></span></button></a>    
    <a href =\"index.html\"><button type=\"button\" class=\"btn btn-info\">
    home<span class=\"glyphicon glyphicon-log-in\"></span></button></a>" . $footer);
}
if ($_POST['reg'] == "reg") {
  include_once("db/common.php");
  $passwordchk = $_POST['pwdchk'];
  $password = $_POST['pwd'];
  if ($password != $passwordchk) {
    die($header . "Please enter your details again. The passwords did not match.<hr>" .
      "<a href =\"register.php\"><button type=\"button\" class=\"btn btn-info\">
    join<span class=\"glyphicon glyphicon-log-in\"></span></button></a>    
    <a href =\"index.html\"><button type=\"button\" class=\"btn btn-info\">
    home<span class=\"glyphicon glyphicon-log-in\"></span></button></a>" . $footer);
  };
  $username = $_POST['username'];
  $password = $_POST['pwd'];
  $arr2 = array($username);
  $res = Query("SELECT * FROM users WHERE username = ?", $arr2);
  if (count($res->fetchAll())) { //count($res->fetchAll())+1
    die($header . "<div class=\"alert alert-success\">Unable to add your account, please try again. </div><hr>
   <a href =\"register.php\"><button type=\"button\" class=\"btn btn-info\">
    join<span class=\"glyphicon glyphicon-log-in\"></span></button></a>
    <a href =\"index.html\"><button type=\"button\" class=\"btn btn-info\">
    home<span class=\"glyphicon glyphicon-log-in\"></span></button></a>" .
      $footer);
  } else {
    $pass = "";
    $pass = password_hash($_POST['pwd'], PASSWORD_DEFAULT);
    $arr3 = array($username, $pass, time());
    $res = Query("INSERT INTO users (username, password, created) VALUES(?, ?, ?)", $arr3);
  }

  if ($res->errorCode() == 0) {
    echo $header;
    echo "<div class=\"alert alert-success\">Thanks! You've successfully registered. </div>";
    echo "<a href =\"index.html\"><button type=\"button\" class=\"btn btn-info\">home<span class=\"glyphicon glyphicon-log-in\"></span></button></a>";
    echo $footer;
  };
  die();
}
/*REGISTER*/
echo $header;
?>
<div class="container">
  <h4>Please enter your details below to register for a user account</h4>

  <form action="register.php" method="post">
    <input type="hidden" name="reg" value="reg">
    <div class="row">
      <div class="col s4">
        <label for="input">username:</label>
        <input type="text" class="form-control" id="input" placeholder="first name" name="username" required="">
      </div>
      <div class="col s4">
        <label for="input">Password:</label>
        <input type="password" class="form-control" id="pwd" placeholder="password" name="pwd" required="">
      </div>
      <div class="col s4">
        <label for="input">Retype Password:</label>
        <input type="password" class="form-control" id="pwdchk" placeholder="password" name="pwdchk" required="">
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <?php
        $numberStrings = array("first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelveth", "thirteenth", "fourteenth", "fifteenth");
        $num = mt_rand(0, count($numberStrings));
        $sent = "Please type the <strong>$numberStrings[$num]</strong> word in this sentence to verify that you not a machine.";
        $sentenceWords = explode(" ", $sent);
        echo $sent . "<br>";
        ?>
        <input type="text" class="form-control" id="ans" placeholder="type your answer here..." name="ans" required="">
        <input type="hidden" name="antibot" value="<?php echo $sentenceWords[$num] ?>">
      </div>
    </div>
    <button type="submit" class="btn center-align">join</button>
    <a href="index.html"><button type="button" class="btn btn-info">
        home<span class="glyphicon glyphicon-log-in"></span></button></a>
  </form>