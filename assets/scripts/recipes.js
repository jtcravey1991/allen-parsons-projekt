//Dark Mode
jQuery(".inner-switch").on("click", function () {
    if (jQuery("body").hasClass("dark")) {
        jQuery("body").removeClass("dark");
        jQuery(".inner-switch").text("OFF");
    } else {
        jQuery("body").addClass("dark");
        jQuery(".inner-switch").text("ON");
    }
});