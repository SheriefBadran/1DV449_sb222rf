<?php

require_once("../../data/db/PDOdatabase.php");
require_once("SessionModel.php");

/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/19/14
 * Time: 8:46 PM
 */

class MessageLongPoll {

    private $database;
    private static $tablename = "message";
    private static $date = "date";

    private static $username = "root";
    private static $password = "root";
    private static $connectionstring = "mysql:host=localhost;dbname=PhotoGallery";

    public function __construct() {

        $this->database = new PDODatabase(self::$username, self::$password, self::$connectionstring);
        $this->init();
    }

    protected function init() {

        $sessionModel = new SessionModel();
//        var_dump($sessionModel->isLoggedIn());
        if(!$sessionModel->isLoggedIn()) {

            return;
        }

        // All work with session is done.
        session_write_close();


        $mode = $this->fetch('mode');

        switch($mode){
            case 'get':
                $this->getMessage();
                break;
            case 'post':
                $this->postMessage();
                break;
            default:
                $this->output(false, 'Wrong mode.');
                break;
        }
        return;
    }

    protected function getMessage() {

        $endtime = time() + 20;
        $lasttime = $this->fetch('lastTime');
        $currenttime = null;

        while (time() <= $endtime) {

            try {

                $db = $this->database->connection();
                $sql = "SELECT * FROM " . self::$tablename .
                    " ORDER BY " . self::$date . " DESC";

                $query = $db->prepare($sql);
                $query->execute();
                $messages = $query->fetchAll();

                $currenttime = strtotime($messages[0]['date']);

                if(!empty($messages) && $currenttime != $lasttime){

                    $this->output(true, '', array_reverse($messages), $currenttime);
                    break;
                }
                else{

                    sleep(1);
                }
            }
            catch (PDOException $e) {

                throw new Exception($e->getMessage(), (int)$e->getCode());
            }
        }
    }

    protected function postMessage() {

        $user = $this->fetch('user');
        $text = $this->fetch('text');

        if(empty($user) || empty($text)) {

            $this->output(false, 'Username and Chat Text must be inputted.');
        }
        else {

            try {

                $db = $this->database->connection();
                $sql = "INSERT INTO " . self::$tablename .
                    "(
                        name,
                        text
                    )
                    VALUES(?, ?)";

                $params = array($user, $text);
                $query = $db->prepare($sql);
                $result = $query->execute($params);

                if($result == true) {

                    $this->output(true, '');
                }
                else {

                    $this->output(false, 'Chat posting failed. Please try again.');
                }
            }
            catch (PDOException $e) {

                throw new Exception($e->getMessage(), (int)$e->getCode());
            }
        }
    }

    protected function fetch($name) {

        $value = '';

        if(isset($_POST[$name])) {

            $value = $_POST[$name];
        }

        return $value;
    }

    protected function output($result, $output, $message = null, $latest = null) {

        echo json_encode(array(
            'result' => $result,
            'message' => $message,
            'output' => $output,
            'latest' => $latest
        ));
    }
}

new MessageLongPoll();