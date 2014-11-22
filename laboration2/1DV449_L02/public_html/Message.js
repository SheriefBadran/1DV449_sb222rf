function Message(){

    var _user;
    var _text;
    var _date;


    this.getUser = function() {

        return _user;
    };

    this.setUser = function(user) {

        if (typeof user !== 'string') {

            throw {error: "Message author has to be of type string"};
        }

        _user = this.sanitize(user);
    };

	this.getText = function() {

		return _text;
	};

	this.setText = function(text) {

        if (typeof text !== 'string') {

            throw {error: "Message text has to be of type string"};
        }

		_text = this.sanitize(text);
	};

	this.getDate = function() {

		return _date;
	};

	this.setDate = function(date) {

        if (typeof date !== 'string') {

            throw {error: "Message date has to be of type string"};
        }

		_date = this.sanitize(date);
	};
}

Message.prototype.toString = function(){

	return this.getText()+" ("+this.getDate()+")";
}

Message.prototype.getHTMLText = function() {

    return this.getUser() + ' said:' + '<br/>' + this.getText().replace(/[\n\r]/g, "<br />");
}

Message.prototype.getDateText = function() {

    return this.getDate();
}

Message.prototype.sanitize = function(string) {

   return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}