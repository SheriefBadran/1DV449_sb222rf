<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/19/14
 * Time: 11:01 AM
 */

class SessionModel {

    public function __construct() {

//        if(session_id() !== '') {

            session_start();
//        }
    }

    public function isLoggedIn() {

        return isset($_SESSION['login']);
    }

    public function setLoginSession() {

        $_SESSION["login"] = true;
    }

    public function destroyLoginSession() {

        unset($_SESSION['login']);
    }

    public function setToken() {


        $_SESSION['token'] = uniqid();
    }

    public function getToken() {

        if (isset($_SESSION['token'])) {

            return $_SESSION['token'];
        }

        return false;
    }
}