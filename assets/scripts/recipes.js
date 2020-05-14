
//Dark Mode
if (localStorage.getItem("switch") == "light" ){
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
    }
}
else if (localStorage.getItem("switch") == "dark"){
    jQuery("body").addClass("dark");
    jQuery(".inner-switch").text("ON");
}

else {
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
    }
}

jQuery(".inner-switch").on("click", function () {
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
    } else {
        jQuery("body").addClass("dark");
        jQuery(".inner-switch").text("ON");
    }
});

