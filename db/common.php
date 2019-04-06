<?php
function escape ($html) {
  return htmlspecialchars($html, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}
function bug($str) {
  echo "<hr><strong>BUG:</strong> <tt>$str</tt><hr>";
}
function Query($q, $args) {
  $i = 0;
  require"config.php";
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
    $i++;
    $conn = new PDO($dsn, $username, $password, $options);  
    $stmt = $conn->prepare($q);
    $stmt->execute($args);
    return $stmt;
    } catch(PDOException $error) {
      $error->getMessage();
    }
  }
}
?>