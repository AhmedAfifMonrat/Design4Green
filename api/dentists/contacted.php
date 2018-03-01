<?php
/**
 * Created by PhpStorm.
 * User: Orsola
 * Date: 23-Nov-17
 * Time: 10:06 AM
 */

include_once "../../database/config.php";

session_start();
$contacted = array();

if (isset($_SESSION["user"])) {
    header("HTTP/1.1 200 OK");

    $user_id = mysqli_real_escape_string($con, $_SESSION["user"]["id"]);

    #query to get the contacted users
    $contactedDentistsQuery = "SELECT dentists.*, 1 as cont_by_user FROM dentists
JOIN contacted_dentists ON dentists.id = contacted_dentists.dentist_id
WHERE contacted_dentists.user_id = '$user_id'
GROUP BY dentists.id";

    $contactedDentistsQueryResult = mysqli_query($con, $contactedDentistsQuery);
    if ($contactedDentistsQueryResult) {
        while ($cdqr = mysqli_fetch_assoc($contactedDentistsQueryResult)) {
            $contacted[] = $cdqr;
        }
    }
} else {
    header("HTTP/1.1 401 UNAUTHORZED");
    $contacted = array("status" => 400, "msg" => "You need to log in.");
}

echo json_encode($contacted);