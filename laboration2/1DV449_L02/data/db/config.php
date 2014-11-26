<?php

    class Config {

        public static $username = "root";
        public static $password = "root";
        public static $connectionstring = "mysql:host=localhost;dbname=PhotoGallery";

        public static function instantiatePDO() {

            return new PDODatabase(self::$username, self::$password, self::$connectionstring);
        }
    }