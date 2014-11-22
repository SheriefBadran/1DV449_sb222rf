<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/18/14
 * Time: 6:02 PM
 */

require_once("../data/pathConfig.php");


class MessageRepository {

    private $messageId;
    private $date;
    private $message;
    private $sender;
    private $db;

    private $messages;

    public function __construct(PDOdatabase $database) {

        $this->db = $database;
        $this->dbTable = 'messages';
        // $this->messages = new MessageList();
    }

//    public function insert(MessageModel $message) {
//
//        $this->db->insert($message);
//    }

    public function test() {

        try {
            $con = $this->db->connection();
            $sql = "SELECT * FROM user WHERE username = ?";
            $params = array("Admin");
            $query = $con -> prepare($sql);
            $query -> execute($params);
            $result = $query -> fetch();
            if ($result) {

                return $result["username"];
//                return new \model\Participant($result[self::$name], $result[self::$key]);
            }
            return null;
        } catch (\PDOException $e) {
            die('An unknown error have occured.');
        }
    }
} 