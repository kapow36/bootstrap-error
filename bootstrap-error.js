(function ($)
{
    $.fn.bootstrapError = function (action, key, value, critical)
    {       
        //This div contains the styling needed to bring all error messages to the bottom right corner
        var holderHtml = '<div class="fixed-bottom-right bootstrap-error-holding-div"></div>';
        //User to print at top of page; must go outside of holderHtml
        var printHtml =
            '<div class="alert print-' + key + ' alert-danger alert-dismissable visible-print" style="margin: 5px"><span class="error-text-' + key + '"></span></div>';
        //This is used for the individual error messages
        var html =
            ' <div class="alert ' + key + ' alert-danger alert-dismissable error-popout hidden-print pull-right" role="alert">'
            + '     <div class="error-email" data-key="' + key + '"><span class="glyphicon glyphicon-envelope"></span></div>'
            + '     <button type="button" class="close" data-key="' + key + '"><span>&times;</span></button>'
            + '     <div><span class="error-text-' + key + '"></span></div>'
            + ' </div >'
            + '<div class="modal fade modal-' + key + '" role="dialog">'
            + ' <div class="modal-dialog">'
            + '     <div class="modal-content">'
            + '         <div class="modal-body">'
            + '             <h4 class="modal-title text-danger">We Cannot Continue...</h4><br>'
            + '             <div class="error-text-' + key + '"></div>'
            + '             <div class="text-right">'
            + '                 <button type="button" class="btn btn-danger" data-dismiss="modal">Ok</button>'
            + '             </div>'
            + '         </div>'
            + '     </div>'
            + '  </div>'
            + '</div><div class="clearfix"></div>';

        this.each(function ()
        {
            var _this = $(this);

            if (!_this.is("div"))
            {
                throw "bootstrap-error must be a div";
            }

            var email = _this.data("email") ? _this.data("email") : null;
            var subject = _this.data("subject") ? _this.data("subject") : "Error";

            _this.data("email", email);
            _this.data("subject", subject);

            if (!(_this.find(".bootstrap-error-holding-div").length))
            {
                _this.append(holderHtml);               
            }

            if (action === "add")
            {
                if (!key || key.trim().length === 0)
                {
                    throw "bootstrap-error add action must have a key";
                }

                if (!(_this.find("." + key).length))
                {
                    _this.find(".bootstrap-error-holding-div").append(html);                    
                    if (!email)
                    {
                        _this.find(".error-email").remove();
                    }
                }
                if (!(_this.find(".print-" + key).length))
                {
                    _this.append(printHtml);
                }

                if (critical)
                {
                    _this.find(".modal").modal({ backdrop: 'static', keyboard: false });
                }

                _this.find(".error-text-" + key).text(value);
                _this.find("." + key).fadeIn();
                _this.find(".print-" + key).fadeIn();
            }
            else if (action === "remove") 
            {
                if (!key || key.trim().length === 0)
                {
                    throw "bootstrap-error remove action must have a key";
                }

                $(this).find("." + key).fadeOut("slow", function ()
                {
                    $(this).remove();
                });
                $(this).find(".modal-" + key).remove();
                $(this).find(".print-" + key).remove();
            }
            else if (action === "email")
            {
                if (!key || key.trim().length === 0)
                {
                    throw "bootstrap-error email action must have a key";
                }

                var text = $(this).find(".error-text-" + key).text();
                var email = $(this).data("email");
                var subject = $(this).data("subject");
                window.open("mailto:" + email + "?Subject=" + subject + "&Body=" + text, "_self");
            }
            else 
            {
                throw action + " does not exist for $.bootstrapError()";
            }
        });
    };
}(jQuery));

$(document).ready(function ()
{
    $(document).on("click", ".bootstrap-error .error-popout .close", function ()
    {
        $(this).closest(".bootstrap-error").bootstrapError("remove", $(this).data("key"));
    });

    $(document).on("click", ".bootstrap-error .error-popout .error-email", function ()
    {
        $(this).closest(".bootstrap-error").bootstrapError("email", $(this).data("key"));
    });

    $(document).ajaxError(function (event, jqxhr, settings, thrownError)
    {
        if (settings.useGlobalError !== false)
        {
            $(".bootstrap-error").bootstrapError("add", getShortUrl(settings.url), thrownError, settings.criticalError);
        }
    });

    $(document).ajaxSuccess(function (event, jqxhr, settings)
    {
        if (settings.useGlobalError !== false)
        {
            $(".bootstrap-error").bootstrapError("remove", getShortUrl(settings.url));
        }
    });

    //Change settings.url into a more class friendly key
    function getShortUrl(originalUrl)
    {
        var shortURL = originalUrl.split("/").pop();
        shortURL = shortURL.split("?")[0];
        return shortURL;
    }
});