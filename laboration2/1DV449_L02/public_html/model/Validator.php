<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/18/14
 * Time: 7:41 PM
 */
require_once("../data/pathConfig.php");
require_once(HelperPath.DS."db".DS."config.php");
require_once(ModelPath.DS."MessageRepository.php");
require_once(ModelPath.DS."SessionModel.php");
require_once(ViewPath.DS."CookieStorage.php");

session_start();


class Validator {

    private $sessionModel;
    private static $authenticationTable = 'user';
    private static $uniqueId = 'uniqueId';
    private static $username = 'username';
    private static $password = 'password';
    private static $toLogin = 'index.php';
    private static $toChat = 'mess.php';

    public function authenticate($username, $password) {

        $sessionModel = new SessionModel();
        $database = Config::instantiatePDO();
        $authenticated = false;
        $validated = true;

        if ($username === '') {

            $validated = false;
            $_SESSION['errors']['username'] = 'error-shown';
        }

        if ($password === '') {

            $validated = false;
            $_SESSION['errors']['password'] = 'error-shown';
        }


        if ($validated) {

            try {

                $db = $database->connection();

                $sql = "SELECT " . self::$uniqueId . ", " . self::$password  .
                    " FROM " . self::$authenticationTable . " WHERE username = ?";

                $params = array($username);
                $query = $db->prepare($sql);
                $query->execute($params);
                $result = $query->fetch();


                if ( hash('sha256', $result[self::$uniqueId].$password) === $result[self::$password] ) {

                    $authenticated = true;
                }
            }
            catch (PDOException $e) {

                throw new \Exception($e->getMessage(), (int)$e->getCode());
            }
        }

        if ($authenticated) {

            $sessionModel->setLoginSession();
            // $_SESSION['login'] = true;

            return self::$toChat;
        }

        return self::$toLogin;
    }
} 