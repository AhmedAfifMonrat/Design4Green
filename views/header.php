<!DOCTYPE HTML>
<html>

<head>
    <title>Contact me, I'm a dentist</title>

    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <link rel="stylesheet" type="text/css" href="views/css/style.min.css"/>

</head>

<body>
<div id="main">
    <div id="header">
        <div id="logo">
            <div id="logo_text">
                <h1 class="logo_colour">Contact me, I'm a dentist</h1>
            </div>
        </div>
        <div id="menubar">
            <ul id="menu">
                <!-- put class="selected" in the li tag for the selected page - to highlight which page you're on -->
                <li id="search-form-link" class="menu_tab active" onclick="changeTab(1);">Search</li>
                <li id="contacted-dentists-link" class="menu_tab" onclick="changeTab(2);">Contacted Dentists</li>
                <li id="name"></li>
                <li id="login">Log In</li>
                <li id="logout" onclick="logout();">Log Out</li>
            </ul>
        </div>
    </div>
    <div id="site_content">
