$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message,photo) {
        // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        var date = new Date();
        var encodedPhoto = photo;
            //$('#user_photo').attr("src")

        $('.chat-logs').prepend("<div><img src='" + encodedPhoto + "' alt='userPhoto' /><span>" + encodedName + "</span><div>" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "</div><p>" + encodedMsg + "</p></div>");
    };
    // Get the user name and store it to prepend to messages.

    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.
            if ($('#message').val() != "")
                chat.server.send($('#displayname').val(), $('#message').val(), $('#user_photo').attr('src'));
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
    });
});
$("#message").keyup(function(event){
	alert(event.keyCode);
    if(event.keyCode == 13){

        $("#sendmessage").click();

    }
});


