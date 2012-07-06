/* -*- mode:javascript; coding:utf-8; -*- Time-stamp: <snapshot.js - root> */

(function ($) {
    //
    // create request object suitable for making CORS requests or null
    // if CORS is not supported
    //
    function create_request() {
        var request = new XMLHttpRequest();
        return ("withCredentials" in request ? request
                : typeof XDomainRequest != "undefined" ? new XDomainRequest()
                : null);
    }

    $.fn.snapshot = function (options) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext && canvas.getContext("2d");
        var request = create_request();

        this.trigger("snapshot.oninit", {
            "canvas": !!context,
            "CORS": !!request
        });

        if (context && request) {
            var video = this;

            this.one("canplay", function () {
                canvas.width = this.videoWidth;
                canvas.height = this.videoHeight;

                options.button.on("click.snapshot", function () {
                    context.drawImage(video.get(0), 0, 0);
                    $.ajax(options.url, {
                        type: "POST",
                        data: canvas.toDataURL("image/png"),
                        dataType: "json",
                        success: function(data, status, jqxhr) { video.trigger("snapshot.onsuccess", [data, status, jqxhr]) },
                        error: function(jqxhr, status, error) { video.trigger("snapshot.onerror", [jqxhr, status, error]) }
                    });
                    return false;
                });
            });
        }
        return this;
    };
})(jQuery);
