/**
 * Created by sheriefbadran on 11/20/14.
 */
function Chat() {

    this.getMessage = function(callback, lastTime){

        var that = this;
        var latest = null;

        $.ajax({
            'url': 'model/MessageLongPoll.php',
            'type': 'POST',
            'dataType': 'json',
            'data': {
                'mode': 'get',
                'lastTime': lastTime
            },
            'timeout': 30000,
            'cache': false,
            'success': function(result) {

                if(result.result) {
                    // render to chat.
                    callback(result.message);
                    latest = result["latest"];
                }
            },
            'error': function(e) {

                console.log(e);
            },
            'complete': function() {

                that.getMessage(callback, latest);
            }
        });
    };


    this.postMessage = function(user, text, callback){

        $.ajax({
            'url': 'model/MessageLongPoll.php',
            'type': 'POST',
            'dataType': 'json',
            'data': {
                'mode': 'post',
                'user': user,
                'text': text
            },
            'success': function(result) {

                callback(result);
            },
            'error': function(e) {

                console.log(e);
            }
        });
    };
}

var chat = new Chat();