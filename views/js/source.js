//var HOST = 'http://54.37.69.112/';
var HOST = '';
var RESOURCES = {
    login: 'api/login.php',
    logout: 'api/logout.php',
    signUp: 'api/signup.php',
    dentists: 'api/dentists.php',
    contactedDentists: 'api/dentists/contacted.php',
    contactDentist: 'api/dentists/contact.php',
    removeContactedDentist: 'api/dentists/removeContact.php'
};
var LOGIN_FORM = {
    ids: {
        USERNAME: "username",
        PASSWORD: "password"
    }
};
var SIGNUP_FORM = {
    ids: {
        USERNAME: "username",
        EMAIL: "email",
        FIRST_NAME: "firstname"
    }
};
var SEARCH_FORM = {
    ids: {
        FIRST_NAME: "first_name",
        LAST_NAME: "last_name",
        GENDER: "gender",
        ADDRESS: "address",
        CITY: "city",
        OPENING_DAYS: "opening_days",
        OPENING_HOUR_START: "opening_hours_start",
        OPENING_HOUR_END: "opening_hours_end",
        SPECIALITY: "specialty",
        HAS_PHOTO: "has_photo"
    }
};
var DENTISTS_LIST = "#dentists";
var SPECIALITIES = {
    "101": 'Dental Public Health',
    "102": 'Endodontics',
    "103": 'Prosthodontics',
    "104": 'Oral and Maxillofacial Pathology',
    "105": 'Oral and Maxillofacial Radiology',
    "106": 'Oral and Maxillofacial Surgery',
    "107": 'Orthodontics and Dentofacial Orthopedics',
    "108": 'Pediatric Dentistry',
    "109": 'Periodontics'
};

var ACTIVE_TAB = 1;

function serialize (obj, prefix) {
    var str = [], p;
    for(p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push((v !== null && typeof v === "object") ?
            serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

function constructDentistSearchParams() {
    var params = {},
        keys = Object.keys(SEARCH_FORM.ids);
    for (var k in keys) {
        var value;
        if (SEARCH_FORM.ids[keys[k]] == "opening_days") {
            value = [];
            $("input[name=opening_days]").each(function(idx, e) {
                if ($(this).prop('checked')) {
                    value.push($(this).val());
                }
            });
        } else if (SEARCH_FORM.ids[keys[k]] == "opening_hours_start" || SEARCH_FORM.ids[keys[k]] == "opening_hours_end") {
            var from_to = SEARCH_FORM.ids[keys[k]] == "opening_hours_start" ? "from" : "to",
                count = 0;
            value = "";
            $("input[name=" + from_to + "]").each(function(idx, e) {
                // console.log(from_to, value);
                if ($(this).attr('id') === from_to + "_hour") {
                    if (!$(this).val()) {
                        value = "00";
                        count++;
                    } else {
                        value = ($(this).val().length === 1) ? "0" + $(this).val() : $(this).val();
                    }
                }
                if ($(this).attr('id') === from_to + "_minute") {
                    if (!$(this).val()) {
                        count++;
                        if (value == "00" && from_to === "to") {
                            value = "2359";
                        } else {
                            value += "00";
                        }
                    } else {
                        value += ($(this).val().length === 1) ? "0" + $(this).val() : $(this).val();
                    }
                }
            });
            if (count === 2) {
                value = false;
            }
        } else {
            var searchElem = $("#" + SEARCH_FORM.ids[keys[k]]);
            value = searchElem.val();
            if (searchElem.attr("id") == "has_photo") {
                value = (searchElem.prop('checked')) ? "true" : "false";
            }
        }
        if (!!value) {
            params[SEARCH_FORM.ids[keys[k]]] = value;
        }
    }
    return params;
}

function constructLoginParams() {
    var params = {
        username: $("#" + LOGIN_FORM.ids['USERNAME']).val(),
        password: $("#" + LOGIN_FORM.ids['PASSWORD']).val()
    };
    return params;
}

function constructSignUpParams() {
    var params = {
        username: $("#signUpUsername").val(),
        firstname: $("#signUpfirstName").val(),
        password: $("#signUpPassword").val()
    };
    return params;
}

function checkLoginStatus() {
    if (localStorage.getItem("user")) {
        return true;
    }
    return false;
}

function constructDentistElem(dentist) {
    var dentistElem = $("<div>", {
        id: "dentist-" + dentist.id,
        "data-id": dentist.id
    });
    var openings = "<p class=\"dentist-info working-hours\">";
    if (dentist.openings) {
        var tmp = JSON.parse(dentist.openings)[0];
        for (var k in tmp) {
            // console.log(k, tmp[k]);
            openings += k.charAt(0).toUpperCase() + k.slice(1) + ": " + tmp[k].open + "-" + tmp[k].close + ", ";
            if (k === "wed") {
                openings += "</br>";
            }
        }
    }
    openings += "</p>";
    dentistElem.html(
        "<div class=\"result-card " + ((dentist.cont_by_user === "1") ? "contacted\"" : "\"") + ">" +
        "<p>" +
        "<div class=\"dentist-details\">" +
        "<h1 class=\"dentist-name\"><b>" + dentist.first_name + " " + dentist.last_name + "</b></h1> " +
        ((dentist.specialty_id) ? ("<p class=\"dentist-info specialty\">" + SPECIALITIES[dentist.specialty_id] + "</p>") : "") +
        ((dentist.address) ? ("<p class=\"dentist-info address\" onclick=\"openMap('" + dentist.address + ", " + dentist.city + "');\">" + dentist.address + ", " + dentist.city + "</p>") : "") +
        ((dentist.email) ? ("<p class=\"dentist-info email\" onclick=\"openEmail('" + dentist.email + "');\">" + dentist.email + "</p>") : "") +
        ((dentist.phone) ? ("<p class=\"dentist-info phone\" onclick=\"openPhone('" + dentist.phone + "');\">" + dentist.phone + "</p>") : "") +
        ((dentist.openings) ? openings : "") +
        "</div>" +
        "<div class=\"dentist-image\">" +
        ((!dentist.image) ? "<p class=\"image-placeholder\">(No image)</p>" : "<img class=\"user-image\" src=\"" + dentist.image + "\">") +
        "</div>" +
        "<div class=\"contact-button-div\">" +
        ((dentist.cont_by_user === "1") ? "<h6 class=\"visited-before\">Added to Contacted</h6>" : "") +
        ((dentist.cont_by_user === "0") ? "<button class=\"contact-button\" type=\"button\" onclick=\"contactDentist(" + dentist.id + ");\">Add to Contacted</button>"  : "") +
        ((dentist.cont_by_user === "1") ? "<button class=\"contact-button\" type=\"button\" onclick=\"removeContactDentist(" + dentist.id + ");\">Remove</button>"  : "") +
        "</div>" +
        "</p>" +
        "</div>"
    );
    return dentistElem;
}

function enterEmptyElement() {
    var dentistListElem = $(DENTISTS_LIST);
    dentistListElem.html("<p class=\"empty_element\">No dentists found. Try again with another Search!</p>");
}

function populateDentists(data, dentistListElem) {
    for (var idx in data) {
        dentistListElem.append(
            constructDentistElem(data[idx])
        );
    }
    if (data.length === 0) {
        enterEmptyElement();
    }
    var countObj = $("<p>", {
        id: "counter"
    });
    countObj.html(data.length + " dentists found!");
    $("#search_form").append(countObj);
}

function login() {
    var webMethod = HOST + RESOURCES.login,
        parameters = constructLoginParams();

    $("p#login-error").remove();

    var request = new XMLHttpRequest();
    request.open('POST', webMethod, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            localStorage.setItem('user', JSON.stringify(data));
            checkLoggedInStatus();
            hidepopup();
        } else {
            var loginError = $("<p>", {
                    id: "login-error"
                }),
                errorText = JSON.parse(e.responseText);
            console.error(errorText);
            loginError.html(errorText.msg);
            $("form.login-form").prepend(loginError);
        }
    };
    request.send(JSON.stringify(parameters));
}

function signUp() {
    var webMethod = HOST + RESOURCES.signUp,
        parameters = constructSignUpParams();

    $("p#signUp-error").remove();

    var request = new XMLHttpRequest();
    request.open('POST', webMethod, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            localStorage.setItem('user', JSON.stringify(parameters));
            checkLoggedInStatus();
            hidepopup();
        } else {
            console.error("SignUp impossible");
            var signupError = $("<p>", {
                    id: "signUp-error"
                }),
                errorText = JSON.parse(e.responseText);
            console.error(errorText);
            loginError.html(errorText.msg);
            $("form.signup-form-title").prepend(signupError);
        }
    };
    request.send(JSON.stringify(parameters));
}

function logout() {
    var webMethod = HOST + RESOURCES.logout;

    var request = new XMLHttpRequest();
    request.open('GET', webMethod, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        localStorage.removeItem('user');
        localStorage.removeItem('dentists');
        checkLoggedInStatus();
        var data = JSON.parse(request.responseText);
      } else {
        // We reached our target server, but it returned an error
        console.error("Logout error!");
        localStorage.removeItem('user');
        localStorage.removeItem('dentists');
        checkLoggedInStatus();
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
        console.error("Logout error!");
        localStorage.removeItem('user');
        localStorage.removeItem('dentists');
        checkLoggedInStatus();
    };
    request.send()
}

function getDentists() {
    var dentistList = DENTISTS_LIST,
        dentistListElem = $(dentistList),
        webMethod = HOST + RESOURCES.dentists,
        parameters = constructDentistSearchParams();

    showLoader();
    $("p#counter").remove();

    var request = new XMLHttpRequest();
    request.open('GET', webMethod + "?" + serialize(parameters), true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        dentistListElem.empty();
        //console.log(data);
        populateDentists(data, dentistListElem);
        localStorage.setItem('dentists', JSON.stringify(data));
      } else {
        // We reached our target server, but it returned an error
        console.error(request);
        enterEmptyElement();
      }
    };
    request.onerror = function() {
        // There was a connection error of some sort
        console.error(request);
        enterEmptyElement();
    };
    request.send()
}

function getContactedDentists() {
    var dentistList = DENTISTS_LIST,
        dentistListElem = $(dentistList),
        webMethod = HOST + RESOURCES.contactedDentists;

    $("p#counter").remove();
    showLoader();

    var request = new XMLHttpRequest();
    request.open('GET', webMethod, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        $(dentistList).empty();
        populateDentists(data, dentistListElem);
      } else {
        // We reached our target server, but it returned an error
        showpopup();
      }
    };
    request.onerror = function() {
        // There was a connection error of some sort
        console.error(e);
        enterEmptyElement();
    };
    request.send()
}

function contactDentist(dentistId) {
    var webMethod = HOST + RESOURCES.contactDentist,
        user = getLoggedUser();

    if (!user) {
        showpopup();
        return;
    }
    var parameters = {
        id: dentistId,
        user: user.id
    };

    var request = new XMLHttpRequest();
    request.open('POST', webMethod, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            // Success!    
            var data = JSON.parse(request.responseText);
            var dentistDiv = $("div#dentist-" + dentistId),
                contactedBeforeElem = $("<h6>", {
                    class: "visited-before"
                });
            contactedBeforeElem.html("Added to Contacted");
            // console.log(dentistDiv);
            dentistDiv.find(".result-card").addClass("contacted");
            dentistDiv.find(".contact-button-div").prepend(contactedBeforeElem);
            dentistDiv.find("button").remove();
            dentistDiv.find(".result-card").append("<button class=\"contact-button\" type=\"button\" onclick=\"removeContactDentist(" + dentistId + ");\">Remove</button>");
        } else {
            console.error(request);
            showpopup();
        }
    };
    request.send(JSON.stringify(parameters));
}

function removeContactDentist(dentistId) {
    var webMethod = HOST + RESOURCES.removeContactedDentist,
        user = getLoggedUser();

    if (!user) {
        showpopup();
        return;
    }
    var parameters = {
        id: dentistId,
        user: user.id
    };

    var request = new XMLHttpRequest();
    request.open('POST', webMethod, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = function(data) {
        if (request.status >= 200 && request.status < 400) {
            // Success!    
            var data = JSON.parse(request.responseText);
            var dentistDiv = $("div#dentist-" + dentistId);
            if (ACTIVE_TAB === 2) {
                dentistDiv.remove();
                if ($('*[id^="dentist-"]').length === 0) {
                    enterEmptyElement();
                }
            } else {
                dentistDiv.find(".result-card").removeClass("contacted");
                dentistDiv.find(".visited-before").remove();
                dentistDiv.find("button").remove();
                dentistDiv.find(".result-card").append("<button class=\"contact-button\" type=\"button\" onclick=\"contactDentist(" + dentistId + ");\">Add to Contacted</button>");
            }
        } else {
            console.error(request);
            showpopup();
        }
    };
    request.send(JSON.stringify(parameters));
}

function startSearch() {
    if (ACTIVE_TAB === 2) {
        $("li.menu_tab").each(function(idx, el) {
            $(this).removeClass("active");
        });
        $("li#search-form-link").addClass("active");
        ACTIVE_TAB = 1;
    }
    getDentists();
}

function changeTab(tabNum) {
    if (ACTIVE_TAB === 1 && tabNum !== 1) {
        $("li.menu_tab").each(function(idx, el) {
            $(this).removeClass("active");
        });
        ACTIVE_TAB = 2;
        getContactedDentists();
        $("li#contacted-dentists-link").addClass("active");
    } else if (ACTIVE_TAB === 2 && tabNum !== 2) {
        $("li.menu_tab").each(function(idx, el) {
            $(this).removeClass("active");
        });
        ACTIVE_TAB = 1;
        $("li#search-form-link").addClass("active");
        var dentists = localStorage.getItem("dentists");
        if (dentists) {
            var dentistList = DENTISTS_LIST,
                dentistListElem = $(dentistList);
            $("p#counter").remove();
            dentistListElem.empty();
            populateDentists(JSON.parse(dentists), dentistListElem);
        } else {
            enterEmptyElement();
        }
    }
}

function getLoggedUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function openMap(address) {
    // console.log(address);
    window.open("https://maps.google.com/?q=" + address + "&sensor=true", "_blank");
}

function openEmail(email) {
    // console.log(email);
    window.open("mailto:" + email + "?Subject=Appointment", "_top");
}

function openPhone(phone) {
    // console.log(phone);
    window.open("tel:" + phone, "_top");
}

$(document).ready(function() {
    checkLoggedInStatus();

    enterEmptyElement();

    $("#login").click(function() {
        showpopup();
    });

    $(".close-login-form").click(function() {
        hidepopup();
    });
});

function showLoader () {
    var dentistList = DENTISTS_LIST,
        dentistListElem = $(dentistList);
    $("p#counter").remove();
    dentistListElem.empty();
    dentistListElem.append("<div class=\"loader\"></div>")
}

function showpopup() {
    $("#login-modal").fadeIn();
    $("#login-modal").css({
        "visibility": "visible",
        "display": "block"
    });
}

function hidepopup() {
    $("#login-modal").fadeOut();
    $("#login-modal").css({
        "visibility": "hidden",
        "display": "none"
    });
    changeTab(1);
}

function showSignUpModal() {
    $("#login-form").fadeOut();
    $("#login-form").css({
        "visibility": "hidden",
        "display": "none"
    });
    $("#signup-form").fadeIn();
    $("#signup-form").css({
        "visibility": "visible",
        "display": "block"
    });
}

function hideSignUpModal() {
    $("#signup-form").fadeOut();
    $("#signup-form").css({
        "visibility": "hidden",
        "display": "none"
    });
    $("#login-form").fadeIn();
    $("#login-form").css({
        "visibility": "visible",
        "display": "block"
    });
}

function checkLoggedInStatus() {
    if (checkLoginStatus()) {
        $("#menu #name").css({
            "visibility": "visible",
            "display": "block"
        });
        var user = getLoggedUser();
        $("#menu #name").html(user.firstname);
        $("#menu #logout").css({
            "visibility": "visible",
            "display": "block"
        });
        $("#menu #login").css({
            "visibility": "hidden",
            "display": "none"
        });
    } else {
        $("#menu #name").css({
            "visibility": "hidden",
            "display": "none"
        });
        $("#menu #logout").css({
            "visibility": "hidden",
            "display": "none"
        });
        $("#menu #login").css({
            "visibility": "visible",
            "display": "block"
        });
    }
}