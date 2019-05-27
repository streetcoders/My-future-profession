$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        var date = new Date();

        $('.chat-logs').prepend("<div><img src='~/Content/Images/user_anonim.png' alt='userPhoto' />"+encodedName+"<div>"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"</div><p>"+encodedMsg+"</p></div>");
    };
    // Get the user name and store it to prepend to messages.

    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.
            if ($('#message').val() != "")
                chat.server.send($('#displayname').val(), $('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
    });
});



