<?php
$sym = "|||";
$EDSYM = "^^^";
function escape ($html) {
  return htmlspecialchars($html, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}
function bug($str) {
  echo "<hr><strong>BUG:</strong> <tt>$str</tt><hr>";
}

function el($str) {
  error_log("**".$str."**", 0);
}

function Query($q, $args) {
  require"config/config.php";
  if(strpos($q, "SELECT")) {
    try {
      $conn = new PDO($dsn, $username, $password, $options);  
      $stmt = $conn->prepare($q);
      $stmt->execute($args);
      return $stmt;
    } catch(PDOException $error) {
      echo $q . "Something went REALLY wrong!" . $error->getMessage();
    }
  } else {
    try {
    $conn = new PDO($dsn, $username, $password, $options);  
    $stmt = $conn->prepare($q);
    $stmt->execute($args);
    return $stmt;
    } catch(PDOException $error) {
      die("Oops... Please refresh the page.".$error->getMessage()) ;
    }
  }
}
function IsRegistered($username) {
  Query("select * from users where username = ?", $username);
}
