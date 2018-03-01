<?php
/**
 * Created by PhpStorm.
 * User: Orsola
 * Date: 22-Nov-17
 * Time: 11:21 PM
 */

?>

<div id="search-results">
    <?php
    include "views/body/dentists.php";
    ?>
</div>

<form id="search_form" class="form-labels-on-top" method="post" action="#">
    &nbsp;&nbsp;Filters

    <input type="text" class="form-input" name="first_name" id="first_name" placeholder="First name">

    <input type="text" class="form-input" name="last_name" id="last_name" placeholder="Last name">

    <select name="gender" class="form-select" id="gender">
        <option value="">Gender</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
    </select>

    <input type="text" class="form-input" name="address" id="address" placeholder="Address">

    <input type="text" class="form-input" name="city" id="city" placeholder="City">

    <select name="specialty" class="form-select" id="specialty" style="max-width: 93%">
        <option value="">Specialty</option>
        <option value="101">Dental Public Health</option>
        <option value="102">Endodontics</option>
        <option value="103">Periodontics</option>
        <option value="104">Oral and Maxillofacial Pathology</option>
        <option value="105">Oral and Maxillofacial Radiology</option>
        <option value="106">Oral and Maxillofacial Surgery</option>
        <option value="107">Orthodontics and Dentofacial Orthopedics</option>
        <option value="108">Pediatric Dentistry</option>
        <option value="109">Prosthodontics</option>
    </select>

    <span class="form-span">Has picture</span>
    <input type="checkbox" class="form-checkbox" name="has_photo" id="has_photo" value="true" checked>


    <span class="form-span">Opening hours</span>
    <input type="checkbox" class="form-checkbox2" name="opening_days" value="mon"><span
            class="weekday">Monday</span><br>
    <input type="checkbox" class="form-checkbox2" name="opening_days" value="tue"><span
            class="weekday">Tuesday</span><br>
    <input type="checkbox" class="form-checkbox2" name="opening_days" value="wed"><span class="weekday">Wednesday</span><br>
    <input type="checkbox" class="form-checkbox2" name="opening_days" value="thu"><span
            class="weekday">Thursday</span><br>
    <input type="checkbox" class="form-checkbox2" name="opening_days" value="fri"><span
            class="weekday">Friday</span><br>


    <span class="form-span">From</span>
    <input id="from_hour" class="half left" type="number" name="from" placeholder="hh" min="0" max="24">
    &nbsp;&nbsp;:
    <input id="from_minute" class="half" type="number" name="from" placeholder="mm" min="0" max="59">

    <span class="form-span">To</span>
    <input id="to_hour" class="half left" type="number" name="to" placeholder="hh" min="0" max="24">
    &nbsp;&nbsp;:
    <input id="to_minute" class="half" type="number" name="to" placeholder="mm" min="0" max="59">

    <button type="button" onclick="startSearch()">Search</button>


</form>