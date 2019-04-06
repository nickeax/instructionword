<?php
function escape ($html) {
  return htmlspecialchars($html, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}
function bug($str) {
  echo "<hr><strong>BUG:</strong> <tt>$str</tt><hr>";
}
function Query($q, $args) {
  require"config/config.php";
  echo "<script>alert('hello!');</script>";
  if(strpos($q, "SELECT")) {
    try {
      $conn = new PDO($dsn, $username, $password, $options);  
      $stmt = $conn->prepare($q);
      $stmt->execute($args);
      return $stmt;
    } catch(PDOException $error) {
      echo $q . "<br>" . $error->getMessage();
    }
  } else {
    try {
    $conn = new PDO($dsn, $username, $password, $options);  
    $stmt = $conn->prepare($q);
    $stmt->execute($args);
    return $stmt;
    } catch(PDOException $error) {
      return $error->getMessage();
    }
  }
}
function IsRegistered($username) {
  Query("select * from users where username = ?", $username);
}
?>