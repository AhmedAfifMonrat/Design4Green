<?php
include_once('../database/config.php');
session_start();

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    #get the data
    $data = file_get_contents('php://input');
    $data = json_decode($data, true);

    #clean the data to use them in db operations
    $username = mysqli_real_escape_string($con, $data["username"]);
    $password = md5($data["password"]);
    $query = "select * from swampthing.users where username='$username' and password='$password'";
    $count = mysqli_query($con, $query);

    header('Content-Type: application/json');
    $json = array();
    if ($count->num_rows > 0) {
        //$user_info= array();
        header("HTTP/1.1 200 OK");
        while ($result = mysqli_fetch_assoc($count)) {
            $json = $result;
        }
        session_unset();
        $_SESSION["user"] = $json;
    } else {
        header("HTTP/1.1 400 BAD_REQUEST");
        $json = array("status" => 400, "msg" => "Username or Password is incorrect");
    }
} else {
    header("HTTP/1.1 403 FORBIDDEN");
    $json = array("status" => 403, "msg" => "Method forbidden");
}
//@mysqli_close($conn);
header('Content-type: application/json');
echo json_encode($json);
?>
