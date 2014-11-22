<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/19/14
 * Time: 11:01 AM
 */

class SessionModel {

    public function getLoginSession() {

        return $_SESSION['login'];
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
}