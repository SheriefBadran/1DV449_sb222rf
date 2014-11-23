<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/18/14
 * Time: 2:42 PM
 */

require_once("../data/pathConfig.php");
require_once(ModelPath.DS."MessageRepository.php");
require_once(ModelPath.DS."Validator.php");
//require_once("sec.php");

$database = Config::instantiatePDO();
$messageRepository = new MessageRepository($database);

if (isset($_POST['username']) && isset($_POST['password'])) {

    header("Location:" . $validator->authenticate($_POST['username'], $_POST['password']));
}


//$saltedPassword = 'cTrxjRZa51NOXBn0JYtu' . 'Password';
//$password = hash('sha256', $saltedPassword);
//var_dump($password);

//var_dump($messageRepository->test());



//// check tha POST parameters
//if (isset($_POST['username']) && isset($_POST['password'])) {
//
//    $u = $_POST['username'];
//    $p = $_POST['password'];
//}
//
//
//// Check if user is OK
//if(isset($u) && isset($p) && isUser($u, $p)) {
//    // set the session
//    sec_session_start();
//    $_SESSION['username'] = $u;
//    $_SESSION['login_string'] = hash('sha512', "123456" +$u);
//
//    header("Location: mess.php");
//}
//else {
//    // To bad
//    header('HTTP/1.1 401 Unauthorized');
//    die("could not call");
//}