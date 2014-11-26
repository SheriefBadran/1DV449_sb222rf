var MessageBoard = {

    messages: [],
    textField: null,
    messageArea: null,
    init:function(e)
    {

        MessageBoard.startChat();

        MessageBoard.textField = document.getElementById("inputText");
        MessageBoard.nameField = document.getElementById("inputName");
        MessageBoard.messageArea = document.getElementById("messagearea");
        MessageBoard.tokenField = document.getElementById("token");

        // Add eventhandlers
        document.getElementById("inputText").onfocus = function(e){ this.className = "focus"; }
        document.getElementById("inputText").onblur = function(e){ this.className = "blur" }
        document.getElementById("buttonSend").onclick = function(e) {MessageBoard.sendMessage(); return false;}

        MessageBoard.textField.onkeypress = function(e){
            if(!e) var e = window.event;

            if(e.keyCode == 13 && !e.shiftKey){
                MessageBoard.sendMessage();

                return false;
            }
        }
    },
    startChat: function() {


        chat.getMessage(function(messages) {

            var newMessages = messages.slice(MessageBoard.messages.length, messages.length);
            console.log(newMessages);

            if(MessageBoard.messages.length < messages.length) {

                for(var i = 0, max = newMessages.length; i < max; i++) {

                    var message = new Message();
                    message.setUser(newMessages[i].name);
                    message.setText(newMessages[i].text);
                    message.setDate(newMessages[i].date);

                    MessageBoard.messages.push(message);
                }

            }

            MessageBoard.renderMessages();
        });
    },
    sendMessage:function(){

        if(MessageBoard.textField.value == "") return;


        var name = MessageBoard.nameField.value;
        var text = MessageBoard.textField.value;
        var token = MessageBoard.tokenField.value;

        MessageBoard.nameField.value = '';
        MessageBoard.textField.value = '';

        var message = new Message();
        message.setUser(name);
        message.setText(text);

        chat.postMessage(message.getUser(), message.getText(), token, function () {

            console.log('ajax success');
        });
    },
    renderMessages: function(){

        // Remove all messages
        MessageBoard.messageArea.textContent = "";

        // Renders all messages.
        for(var i=0; i < MessageBoard.messages.length; ++i){

            MessageBoard.renderMessage(MessageBoard.messages[i]);
        }

        document.getElementById("nrOfMessages").textContent = MessageBoard.messages.length;
    },
    renderMessage: function(message){
        // Message div
        var div = document.createElement("div");
        div.className = "message";

        // Clock button
        aTag = document.createElement("a");
        aTag.href="#";
        aTag.onclick = function(){

			MessageBoard.showTime(message);
			return false;
		}

        var imgClock = document.createElement("img");
        imgClock.src="pic/clock.png";
        imgClock.alt="Show creation time";

        aTag.appendChild(imgClock);
        div.appendChild(aTag);

        // Message text
        var pText = document.createElement("p");
        var pName = pText.cloneNode(true);

        pText.textContent = message.getText();
        pName.textContent = message.getUser() + ' said: ';
        div.appendChild(pName);
        div.appendChild(pText);

        // Time - Should fix on server!
        var spanDate = document.createElement("span");
        spanDate.appendChild(document.createTextNode(message.getDate()))

        div.appendChild(spanDate);

        var spanClear = document.createElement("span");
        spanClear.className = "clear";

        div.appendChild(spanClear);

        $(MessageBoard.messageArea).prepend(div);
    },
    showTime: function(message){

         var time = message.getDate();
         alert(time);
    }
}

window.onload = MessageBoard.init;