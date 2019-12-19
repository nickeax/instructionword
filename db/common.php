<?php
$sym = "|||";
$EDSYM = "^^^";
$ip = array("UNKNOWN");
function escape($html)
{
  return htmlspecialchars($html, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}
function bug($str)
{
  echo "<hr><strong>BUG:</strong> <tt>$str</tt><hr>";
}

function el($str)
{
  error_log("-            [" . $str . "]             -", 0);
}

function Query($q, $args)
{
  require "config/config.php";
  if (strpos($q, "SELECT")) {
    try {
      $conn = new PDO($dsn, $username, $password, $options);
      $stmt = $conn->prepare($q);
      $stmt->execute($args);
      return $stmt;
    } catch (PDOException $error) {
      el($q . "Something went REALLY wrong!" . $error->getMessage());
      echo $q . "Something went REALLY wrong!" . $error->getMessage();
    }
  } else {
    try {
      $conn = new PDO($dsn, $username, $password, $options);
      $stmt = $conn->prepare($q);
      $stmt->execute($args);
      return $stmt;
    } catch (PDOException $error) {
      el($q . "Something went REALLY wrong!" . $error->getMessage());
      die("Oops... Please refresh the page." . $error->getMessage());
    }
  }
}

function countResults($q, $args)
{
  $res = Query($q, $args);
  return count($res->fetchAll());
}

function updateActiveVisitors($ip)
{ // remove any inactive users
  $past = time() - 5;
  $arr = array($past);
  // TESTED SQL VERSION [DELETE FROM active WHERE stamp < UNIX_TIMESTAMP() - 30;] 


  Query("DELETE FROM active WHERE stamp < ?", $arr);

  if (isset($_SESSION['id'])) {
    $innerArr = array($_SESSION['id']);
    if (countResults("SELECT * FROM active WHERE user_id = ?", $innerArr)  == 0) {
      $arr = array($_SESSION['id'], time(), $ip);
      Query("INSERT INTO active (user_id, stamp, ip) VALUES(?, ?, ?)", $arr);
    }
  } else {
    $innerArr = array($ip);
    if (countResults("SELECT * FROM active WHERE ip = ?", $innerArr)  == 0) {
      $arr = array(-1, $ip[0], time());
      Query("INSERT INTO active (user_id, ip, stamp) VALUES(?, ?, ?)", $arr);
    }      //ip from share internet
  }
}

function IsRegistered($username)
{
  Query("select * from users where username = ?", $username);
}

function getUserIpAddr()
{
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    //ip from share internet
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    //ip pass from proxy
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
  } else {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  return $ip;
}
