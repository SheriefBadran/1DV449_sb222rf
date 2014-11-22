<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/18/14
 * Time: 5:28 PM
 */

class PDODatabase {

    protected $username = 'root';
    protected $password = 'root';
    protected $connectionString = 'mysql:host=localhost;dbname=PhotoGallery';
    protected $connection;
    protected $dbTable;

    public function __construct($username, $password, $connectionString) {

        $this->username = $username;
        $this->password = $password;
        $this->connectionString = $connectionString;
    }

    public function connection() {

        if ($this->connection == null) {

            $this->connection = new \PDO($this->connectionString, $this->username, $this->password);
            $this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $this->connection;
        }

        return $this->connection;
    }

    public function authenticate($username, $password, $authenticationTable) {


    }


} 