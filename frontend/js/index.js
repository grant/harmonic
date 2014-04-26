(function() {
    "use strict";

    $(document).ready(function() {
        $("#fb").hide().delay(200).fadeIn("slow");
        $("#fb").click(login);
        $("#fb").hover(
            function() {
                $(this).stop().animate({"opacity": "0.65"}, "slow");
            },
            function() {
                $(this).stop().animate({"opacity": "1"}, "slow");
            }
        );
    });

    var login = function() {
        // Login Stuff goes here
    };
})();