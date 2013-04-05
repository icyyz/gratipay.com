
$(document).ready(function()
{

    ////////////////////////////////////////////////////////////
    //                                                         /
    // XXX This is ripe for refactoring. I ran out of steam. :-/
    //                                                         /
    ////////////////////////////////////////////////////////////


    // Wire up username knob.
    // ======================

    $('FORM.username BUTTON.edit').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        $('.username BUTTON.edit').hide();
        $('.username BUTTON.save').show();
        $('.username BUTTON.cancel').show();
        $('.username SPAN.view').hide();
        $('.username INPUT').show().focus();
        $('.username .warning').show();
        return false;
    });
    $('FORM.username').submit(function(e)
    {
        e.preventDefault();

        $('#save-username').text('Saving ...');

        var username = $('INPUT[name=username]').val();

        function success(d)
        {
            window.location.href = "/" + encodeURIComponent(d.username) + "/";
        }
        function error(e)
        {
            $('#save-username').text('Save');
            if (e.status === 409)
            {
                alert("Sorry, that username is already taken.");
            }
            else if (e.status === 413)
            {
                alert( "Sorry, that username is too long (it can only "
                     + "have 32 characters).");
            }
            else
            {
                alert( "Sorry, something went wrong. Either you used "
                     + "disallowed characters or something broke on "
                     + "our end.");
            }
        }
        jQuery.ajax(
            { url: "username.json"
            , type: "POST"
            , success: success
            , dataType: 'json'
            , data: { username: username }
            , success: success
            , error: error
             }
        );
        return false;
    });
    $('.username BUTTON.cancel').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        finish_editing_username();
        return false;
    });
    function finish_editing_username()
    {
        $('.username BUTTON.edit').show();
        $('.username BUTTON.save').hide();
        $('.username BUTTON.cancel').hide();
        $('.username SPAN.view').show();
        $('.username INPUT').hide();
        $('.username .warning').hide();
    }


    // Wire up textarea for statement.
    // ===============================

    $('TEXTAREA').focus();
    function start_editing_statement()
    {
        var h = $('.statement DIV.view').height();
        h = Math.max(h, 128);
        $('.statement TEXTAREA').height(h);

        $('.statement BUTTON.edit').hide();
        $('.statement BUTTON.save').show();
        $('.statement BUTTON.cancel').show();
        $('.statement DIV.view').hide();
        $('.statement DIV.edit').show(0, function() {
            $('.statement TEXTAREA').focus();
        });
    }
    if ($('.statement TEXTAREA').val() === '')
    {
        start_editing_statement();
    }
    $('.statement BUTTON.edit').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        start_editing_statement();
        return false;
    });
    $('FORM.statement').submit(function(e)
    {
        e.preventDefault();

        $('.statement BUTTON.save').text('Saving ...');

        function success(d)
        {
            $('.statement .view SPAN').html(d.statement);
            finish_editing_statement();
        }
        jQuery.ajax(
            { url: "statement.json"
            , type: "POST"
            , success: success
            , data: {"statement": $('.statement TEXTAREA').val()}
             }
        )
        return false;
    });
    $('.statement BUTTON.cancel').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        finish_editing_statement();
        return false;
    });
    function finish_editing_statement()
    {
        $('.statement BUTTON.edit').show();
        $('.statement BUTTON.save').hide().text('Save');
        $('.statement BUTTON.cancel').hide();
        $('.statement DIV.view').show();
        $('.statement DIV.edit').hide();
        $('.statement .warning').hide();
    }


    // Wire up goal knob.
    // ==================

    $('.goal BUTTON.edit').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        $('.goal DIV.view').hide();
        $('.goal TABLE.edit').show();
        $('.goal BUTTON.edit').hide();
        $('.goal BUTTON.save').show();
        $('.goal BUTTON.cancel').show();
        return false;
    });
    $('FORM.goal').submit(function(e)
    {
        e.preventDefault();

        $('.goal BUTTON.save').text('Saving ...');

        var goal = $('INPUT[name=goal]:checked');

        function success(d)
        {
            var newtext = $('LABEL[for=' + goal.attr('id') + ']').text();
            newtext = newtext.replace('$', '$' + d.goal);

            if (d.goal !== '0.00')
                $('INPUT[name=goal_custom]').val(d.goal);
            $('.goal DIV.view').html(newtext);
            finish_editing_goal();
        }
        jQuery.ajax(
            { url: "goal.json"
            , type: "POST"
            , success: success
            , dataType: 'json'
            , data: { goal: goal.val()
                    , goal_custom: $('[name=goal_custom]').val()
                     }
            , success: success
            , error: function() {
                    $('.goal BUTTON.save').text('Save');
                    alert( "Failed to change your funding goal. "
                         + "Please try again."
                          );
                }
             }
        );
        return false;
    });
    $('.goal BUTTON.cancel').click(function(e)
    {
        e.preventDefault();
        e.stopPropagation();
        finish_editing_goal();
        return false;
    });
    function finish_editing_goal()
    {
        $('.goal DIV.view').show();
        $('.goal TABLE.edit').hide();
        $('.goal BUTTON.edit').show();
        $('.goal BUTTON.save').hide().text('Save');;
        $('.goal BUTTON.cancel').hide();
    }


    // Wire up aggregate giving knob.
    // ==============================

    $('.anonymous').click(function()
    {
        jQuery.ajax(
            { url: 'anonymous.json'
            , type: 'POST'
            , dataType: 'json'
            , success: function(data)
            {
                $('INPUT.anonymous').attr('checked', data.anonymous);
            }
            , error: function() {
                    alert( "Failed to change your anonymity "
                         + "preference. Please try again."
                          );
                }
             }
        );
    });
});
