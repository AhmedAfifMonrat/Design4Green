<?php
$server_name = "54.37.69.112";
$db_name = "swampthing";
$user_name = "root";
$password = "perccom";
$con = mysqli_connect($server_name, $user_name, $password, $db_name);

if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($con, "utf8");


?>