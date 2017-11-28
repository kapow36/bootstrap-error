(function ($) {
    $.fn.bootstrapError = function (action, key, value, critical) {
        //This div contains the styling needed to bring all error messages to the bottom right corner
        var holderHtml = '<div class="fixed-bottom-right bootstrap-error-holding-div" style="max-height: 33%; max-width: 33%"></div>';
        //User to print at top of page; must go outside of holderHtml
        var printHtml =
            '<div class="alert print-' + key + ' alert-danger alert-dismissable visible-print" style="margin: 5px"><span class="error-text-' + key + '"></span></div>';
        //This is used for the individual error messages
        var html =
            ' <div class="alert ' + key + ' alert-danger alert-dismissable error-popout hidden-print" role="alert">'
            + '     <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '     <div><span class="error-text-' + key + '"></span></div>'
            + ' </div >'
            + '<div class="modal fade" role="dialog">'
            + ' <div class="modal-dialog">'
            + '     <div class="modal-content">'
            + '         <div class="modal-body">'
            + '             <h4 class="modal-title text-danger">We Cannot Continue...</h4><br>'
            + '             <div class="error-text-' + key + '"></div>'
            + '             <div class="text-right">'
            + '                 <button type="button" class="btn btn-danger" data-dismiss="modal">Ok</button>'
            + '             </div>'
            + '         </div >'
            + '     </div >'
            + '  </div >'
            + '</div > ';
        
        this.each(function () {
            if (!$(this).is("div")) {
                throw "bootstrap-error must be a div";
            }
        });

        if (!($(this).find(".bootstrap-error-holding-div").length)) {
            $(this).append(holderHtml);
        }

        if (action === "add") {
            if (!key || key.trim().length === 0)
            {
                throw "bootstrap-error add action must have a name";
            }

            if (!($(this).find("." + key).length))
            {
                $(this).find(".bootstrap-error-holding-div").append(html);
            }
            if(!($(this).find(".print-" + key).length))
            {
                $(this).append(printHtml);
            }

            if (critical)
            {
                $(this).find(".modal").modal({ backdrop: 'static', keyboard: false });
            }

            $(this).find(".error-text-" + key).text(value);
            $(this).find("." + key).fadeIn();
            $(this).find(".print-" + key).fadeIn();
        }
        else if (action === "remove") {
            if (!key || key.trim().length === 0)
            {
                throw "bootstrap-error remove action must have a name";
            }

            $(this).find("." + key).fadeOut();
            $(this).find(".print-" + key).remove();
        }
        else {
            throw action + " does not exist for $.bootstrapError()";
        }
    };
}(jQuery));

$(document).ready(function () {
    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        if (settings.useGlobalError !== false) {
            $(".bootstrap-error").bootstrapError("add", getShortUrl(settings.url), thrownError, settings.criticalError);
        }
    });
    $(document).ajaxSuccess(function (event, jqxhr, settings) {
        if (settings.useGlobalError !== false) {
            $(".bootstrap-error").bootstrapError("remove", getShortUrl(settings.url));
        }
    });

    //Change settings.url into a more class friendly name
    function getShortUrl(originalUrl)
    {
        var shortURL = originalUrl.split("/").pop();
        shortURL = shortURL.split("?")[0];
        return shortURL;
    }
});