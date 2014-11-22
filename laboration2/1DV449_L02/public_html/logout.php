<?php
/**
 * Created by IntelliJ IDEA.
 * User: sheriefbadran
 * Date: 11/19/14
 * Time: 11:47 AM
 */

require_once("../data/pathConfig.php");
require_once(ModelPath.DS."SessionModel.php");
session_start();

$sessionModel = new SessionModel();
$sessionModel->destroyLoginSession();

header("Location: index.php");