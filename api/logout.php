<?php
session_start();
?>

<?php

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $logout = (isset($_GET['logout'])) ? $_GET['logout'] : 'logout';

    #destroy the session and remove all the variables
    if ($logout == "logout") {
        session_unset();
        session_destroy();
        $_SESSION['user'] = '';
        $logout = $_SESSION['user'];

    }
}
header('Content-type: application/json');
echo json_encode($logout);


?>