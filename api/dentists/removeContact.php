<?php
/**
 * Created by PhpStorm.
 * User: Orsola
 * Date: 23-Nov-17
 * Time: 10:06 AM
 */

include_once "../../database/config.php";
session_start();
$data = file_get_contents('php://input');
$data = json_decode($data, true);

if (isset($data['id']) && is_numeric($data['id'])) {

    $dentist_id = mysqli_real_escape_string($con, $data['id']);

    if (isset($_SESSION['user']['id'])) {

        $user_id = $_SESSION['user']['id'];

        $entryDelete = "DELETE FROM contacted_dentists
where contacted_dentists.user_id = '$user_id' and contacted_dentists.dentist_id = '$dentist_id'";


        $entryDeleteResult = mysqli_query($con, $entryDelete);
        header("HTTP/1.1 200 OK");
        $json = array(
            "status" => 0,
            "msg" => "Removed successfully"
        );
    } else {
        header("HTTP/1.1 400 BAD_REQUEST");
        $json = array(
            "status" => 4,
            "msg" => "User error!"
        );
    }

} else {
    header("HTTP/1.1 400 BAD_REQUEST");
    $json = array(
        "status" => 1,
        "msg" => "Missing data!"
    );
}

echo json_encode($json);