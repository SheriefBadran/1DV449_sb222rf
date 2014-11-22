<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/18/14
 * Time: 10:00 PM
 */

class CookieStorage {

    public $username;
    public $password;
    private static $usernameCookie = "username";
    private static $passwordCookie = "password";

    public function saveLoginUsernameError($message) {

        setcookie(self::$usernameCookie, $message);
    }

    public function saveLoginPasswordError($message) {

        setcookie(self::$passwordCookie, $message);
    }

    public function deleteLoginErrorMessages () {

        setcookie(self::$usernameCookie, "", 1, "/");
        setcookie(self::$passwordCookie, "", 1, "/");
    }

    public function usernameLoginErrorExist() {

        return isset($_COOKIE[self::$usernameCookie]);
    }

    public function  passwordLoginErrorExist() {

        return isset($_COOKIE[self::$passwordCookie]);
    }

    public function getUsernameLoginError () {

        if (isset($_COOKIE[self::$usernameCookie])) {

            return $_COOKIE[self::$usernameCookie];
        }
    }

    public function getPasswordLoginError() {

        if (isset($_COOKIE[self::$passwordCookie])) {

            return $_COOKIE[self::$passwordCookie];
        }
    }
} 