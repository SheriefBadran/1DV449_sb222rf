<?php

    require_once("../data/pathConfig.php");
    require_once("model/SessionModel.php");

    $sessionModel = new SessionModel();

    if (!$sessionModel->isLoggedIn()) {

        header("Location: index.php");
    }

    $sessionModel->setToken();
    $token = $sessionModel->getToken();

?>
<!DOCTYPE html>
<html lang="sv">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="apple-touch-icon" href="touch-icon-iphone.png">
        <link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png">
        <link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png">
        <link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png">
        <link rel="shortcut icon" href="pic/favicon.png">
        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="css/message.css" />
        <title>Messy Labbage</title>
    </head>
    <body>

        <div id="container">

            <div id="messageboard">

                <form method="POST" action="logout.php">
                    <input class="btn btn-danger" type="submit" id="buttonLogout" value="Logout" style="margin-bottom: 20px;" />
                </form>

                <p id="numberOfMess">Number of messages: <span id="nrOfMessages">0</span></p>
                Name:<br /> <input id="inputName" type="text" name="name" /><br />
                Message: <br />
                <textarea name="mess" id="inputText" cols="55" rows="6"></textarea>

                <input class="btn btn-primary" type="button"  id="buttonSend" value="Write your message" />
                <input type="hidden" value="<?php echo $token; ?>" id="token" />
                <br />
                <br />
                <div id="messagearea"></div>
                <span class="clear">&nbsp;</span>

            </div>
        </div>
        <script src="Chat.js"></script>
        <script src="Message.js"></script>
        <script src="MessageBoard.js"></script>
        <script src="js/jquery-1.10.2.min.js"></script>
    </body>
	</html>