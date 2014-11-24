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

        // Add eventhandlers
        document.getElementById("inputText").onfocus = function(e){ this.className = "focus"; }
        document.getElementById("inputText").onblur = function(e){ this.className = "blur" }
        document.getElementById("buttonSend").onclick = function(e) {MessageBoard.sendMessage(); return false;}
//        document.getElementById("buttonSend").onclick = function(e) {MessageBoard.startChat(); return false;}
        document.getElementById("buttonLogout").onclick = function(e) {MessageBoard.logout(); return false;}

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

            MessageBoard.messages = [];

            if(MessageBoard.messages.length < messages.length) {

                for(var i = 0, max = messages.length; i < max; i++) {

                    var message = new Message();
                    message.setUser(messages[i].name);
                    message.setText(messages[i].text);
                    message.setDate(messages[i].date);

                    MessageBoard.messages.push(message);
                }

            }

            MessageBoard.renderMessages();
        });
    },
    getMessages: function() {
//        console.log("INNE");
//
//        $.ajax({
//			type: "get",
//			url: "functions.php",
//			data: {function: "getMessages"}
//		}).done(function(data) { // called when the AJAX call is ready
//
//			data = JSON.parse(data);
//
//
//			for(var mess in data) {
//				var obj = data[mess];
//			    var text = obj.name +" said:\n" +obj.message;
//				var mess = new Message(text, new Date());
//                var messageID = MessageBoard.messages.push(mess)-1;
//
//                MessageBoard.renderMessage(messageID);
//
//			}
//			document.getElementById("nrOfMessages").innerHTML = MessageBoard.messages.length;
//
//		});


    },
    sendMessage:function(){

        if(MessageBoard.textField.value == "") return;

        var name = MessageBoard.nameField.value;
        var text = MessageBoard.textField.value;

        var message = new Message();
        message.setUser(name);
        message.setText(text);
        console.log(message.getText());

        chat.postMessage(message.getUser(), message.getText(), function () {

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

        MessageBoard.messageArea.appendChild(div);
    },
    removeMessage: function(messageID){

		if(window.confirm("Vill du verkligen radera meddelandet?")){

			MessageBoard.messages.splice(messageID,1); // Removes the message from the array.

			MessageBoard.renderMessages();
        }
    },
    showTime: function(message){

         var time = message.getDate();

//         var showTime = "Created "+time.toLocaleDateString()+" at "+time.toLocaleTimeString();

         alert(time);
    }
//    logout: function() {
//        window.location = "index.php";
//    }
}

window.onload = MessageBoard.init;