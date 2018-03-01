<?php

include_once "../database/config.php";
session_start();

#make the search general if the user is not logged in
if (isset($_SESSION['user']['id'])) {
    $user_id = $_SESSION['user']['id'];

} else {
    $user_id = "%%";

}

$get = array();

#clean the input
foreach ($_GET as $k => $v) {
    if (is_string($v)) {
        $get[$k] = mysqli_real_escape_string($con, $v);
        $get[$k] = trim($get[$k]);
    }else if ($k == "specialty") {
        $get[$k] = intval($get[$k]);
    }else {
        $get[$k] = $v;
    }
}

//the page number ---> calculate the range
//if no page number is given => show them all
if (isset($get['page_no']) && is_numeric($get['page_no'])) {
    $page_no = intval($get['page_no']);
    $minLim = ($page_no - 1) * 15;

    $limit = " limit 30 offset $minLim";
} else {
    $limit = " ";
}


#set this to true if at least one element of the opening hour is set
$opening_hours_el_set = false;

#handle the working days
#you get an array of ["mon", "tue", etc] start hour and end hour
if (isset($get['opening_hours_start'])) {
    $hour_start = intval($get['opening_hours_start']);
    $opening_hours_el_set = true;
} else {
    $hour_start = 0;
}

if (isset($get['opening_hours_end'])) {
    $hour_end = intval($get['opening_hours_end']);
    $opening_hours_el_set = true;
} else {
    $hour_end = 2359;
}

#if no days are selected
if (!isset($get['opening_days']) || count($get['opening_days']) == 0) {
    #include them all
    $get['opening_days'] = array("mon", "tue", "wed", "thu", "fri");
} else {
    $opening_hours_el_set = true;
}

#start building the query
#if no hour element is set DO NOT BUILD THE FOLLOWING PART

if ($opening_hours_el_set) {
    $opening_hours_where = " and NOT ( ";


    foreach ($get['opening_days'] as $day) {
        $field_name_open = "H." . $day . "_open";
        $field_name_close = "H." . $day . "_close";

        $opening_hours_where .= " (($field_name_open > $hour_start and $field_name_open > $hour_end) 
    or ($field_name_close < $hour_start and $field_name_close < $hour_end)) and ";
    }

    $opening_hours_where = substr($opening_hours_where, 0, strlen($opening_hours_where) - 4);

    $opening_hours_where .= " ) ";
} else {
    $opening_hours_where = " ";
}

#woring days END


#parse_hour : mysql function to get the hour (open/close)
#the day is passed as a parameter
#-------------
#if the user is logged in the search results will show if the dentists are contacted or not

$searchQuery = "SELECT D.*, if(contacted_dentists.id>0, 1, 0) as cont_by_user
FROM dentists D
  JOIN (SELECT
          dentists.id,
          parse_hour(openings, '$[0].mon.open')  AS mon_open,
          parse_hour(openings, '$[0].mon.close') AS mon_close,
          parse_hour(openings, '$[0].tue.open')  AS tue_open,
          parse_hour(openings, '$[0].tue.close') AS tue_close,
          parse_hour(openings, '$[0].wed.open')  AS wed_open,
          parse_hour(openings, '$[0].wed.close') AS wed_close,
          parse_hour(openings, '$[0].thu.open')  AS thu_open,
          parse_hour(openings, '$[0].thu.close') AS thu_close,
          parse_hour(openings, '$[0].fri.open')  AS fri_open,
          parse_hour(openings, '$[0].fri.close') AS fri_close
        FROM dentists
       ) H
    ON D.id = H.id
    LEFT JOIN contacted_dentists ON (D.id = contacted_dentists.dentist_id
                                         AND contacted_dentists.user_id = '$user_id'
                                         AND (contacted_dentists.id IS NULL OR contacted_dentists.id > 0))
WHERE 1 = 1 ";
$where = "";
if (isset($_GET['first_name'])) {
    $where .= "and D.first_name like '{$get['first_name']}%' ";
}
if (isset($_GET['last_name'])) {
    $where .= "and D.last_name like '{$get['last_name']}%' ";
}
if (isset($_GET['city'])) {
    $where .= "and D.city like '{$get['city']}%' ";
}
if (isset($_GET['specialty'])) {
    $where .= "and specialty_id = {$get['specialty']} ";
}
if (isset($_GET['address'])) {
    $where .= "and D.address like '%{$get['address']}%' ";
}
if (isset($_GET['gender'])) {
    $where .= "and LEFT(D.gender, 1) = '{$get['gender']}' ";
}
if (isset($_GET['has_photo']) && $_GET['has_photo'] == "true") {
    $where .= "and D.image not like '' ";
}
#hours clause
$where .= $opening_hours_where;


//$searchQuery .= $where . " limit 30 offset $minLim";
$searchQuery .= $where . $limit;


//array to store the dentists
$dentists = array();

$searchResult = mysqli_query($con, $searchQuery);
if ($searchResult) {
    while ($sr = mysqli_fetch_assoc($searchResult)) {
        $dentists[] = $sr;
    }
} else {
    //leave an empty array
    //no results
}

//print_r($searchQuery);
// var_dump($searchQuery);
/*var_dump($searchResult);
var_dump($dentists);*/

echo json_encode($dentists);
