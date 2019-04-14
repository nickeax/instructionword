<?php
$numberStrings = array("first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelveth", "thirteenth", "fourteenth", "fifteenth");
$num = mt_rand(0, count($numberStrings)); 
$sent = "Please type the $numberStrings[$num] word in this sentence to verify that you not a machine.";
$sentenceWords = explode(" ", $sent);
echo $sent;
?>