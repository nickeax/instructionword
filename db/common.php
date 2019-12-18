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
  error_log("-            [".$str."]             -", 0);
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
      el($q . "Something went REALLY wrong!" . $error->getMessage());
      echo $q . "Something went REALLY wrong!" . $error->getMessage();
    }
  } else {
    try {
    $conn = new PDO($dsn, $username, $password, $options);  
    $stmt = $conn->prepare($q);
    $stmt->execute($args);
    return $stmt;
    } catch(PDOException $error) {
      el($q . "Something went REALLY wrong!" . $error->getMessage());
      die("Oops... Please refresh the page.".$error->getMessage()) ;
    }
  }
}

function countResults($q, $args) {
  $res = Query($q, $args);
  return count($res->fetchAll());
}

function updateActiveVisitors() { // remove any inactive users
  $past = time() - 30;
  $arr = array($past);
  // TESTED SQL VERSION [DELETE FROM active WHERE stamp < UNIX_TIMESTAMP() - 30;] 
  Query("DELETE FROM active WHERE stamp < ?", $arr);
 
  if(isset($_SESSION['id'])) {
    $innerArr =  array($_SESSION['id']);
    $i = 100;
    el("[updateActiveVisitors()]");
    if(countResults("SELECT * FROM active WHERE user_id = ?", $innerArr)  == 0) { 
      $arr = array($_SESSION['id'], time());
      Query("INSERT INTO active (user_id, stamp) VALUES(?, ?)", $arr);
    }
  }
}

function IsRegistered($username) {
  Query("select * from users where username = ?", $username);
}
