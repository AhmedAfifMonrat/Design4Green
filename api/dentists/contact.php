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

if (isset($data['id'])
    && is_numeric($data['id'])) {

    $dentist_id = mysqli_real_escape_string($con, $data['id']);

    if (isset($_SESSION['user']['id'])) {

        $user_id = $_SESSION['user']['id'];

        #check that the same row doesnt exist
        #check that the user exists
        #check that the dentist exists
        $entryExists = "SELECT count(*) as c FROM contacted_dentists
join users on contacted_dentists.user_id = users.id
join dentists on contacted_dentists.dentist_id = dentists.id
where contacted_dentists.user_id = '$user_id' and contacted_dentists.dentist_id = '$dentist_id'";


        $entryExistsResult = mysqli_query($con, $entryExists);
        if ($entryExistsResult) {
            while ($eer = mysqli_fetch_assoc($entryExistsResult)) {

                if (intval($eer['c']) > 0) {
                    #there is already a record with this user and dentist
                    $json = array("status" => 2, "msg" => "Invalid user, dentist or entry exists!");
                } else {
                    #the contact doesnt exist => insert it
                    $contactDentistQuery = "insert into contacted_dentists (user_id, dentist_id, date)
                            values ('$user_id', $dentist_id, CURDATE())";

                    $contactDentistQueryResult = mysqli_query($con, $contactDentistQuery);

                    if ($contactDentistQueryResult) {
                        header("HTTP/1.1 200 OK");
                        $json = array("status" => 0, "msg" => "Contacted successfully");
                    } else {
                        header("HTTP/1.1 400 BAD_REQUEST");
                        $json = array("status" => 4, "msg" => "Insert error!");
                    }
                }
            }
        } else {
            header("HTTP/1.1 500 SERVER_ERROR");
            $json = array("status" => 3, "msg" => "DB error!");
        }

    } else {
        header("HTTP/1.1 400 BAD_REQUEST");
        $json = array("status" => 4, "msg" => "User error!");
    }

} else {
    header("HTTP/1.1 400 BAD_REQUEST");
    $json = array("status" => 1, "msg" => "Missing data!");
}

echo json_encode($json);