<?php
include_once('../database/config.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    #get the data
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);

    #clean the input
    $username = mysqli_real_escape_string($con, $data["username"]);
    $password = md5($data["password"]);
    $firstname = mysqli_real_escape_string($con, $data["firstname"]);
    $lastname = ''; #going green :P
    $email = ''; #going green
    $id = uniqid();
    $sql = "INSERT INTO users values('$id','$username','$password','$firstname','$lastname','$email')";
    $qur = mysqli_query($con, $sql);
    if ($qur) {
        header("HTTP/1.1 200 OK");
        $_SESSION["user"] = $data;
        $json = $data;
    } else {
        header("HTTP/1.1 400 BAD_REQUEST");
        $json = array("status" => 0, "msg" => "Error adding user!");
    }
} else {
    header("HTTP/1.1 403 FORBIDDEN");
    $json = array("status" => 0, "msg" => "Request method not accepted");
}
//@mysqli_close($conn);
header('Content-type: application/json');
echo json_encode($json);
?>