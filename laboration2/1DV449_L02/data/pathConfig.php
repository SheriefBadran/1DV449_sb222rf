<?php

// DEFINE CORE PATHS (absolute).

// Define a short for directory separator.
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define a project root path.
defined('ProjectRootPath') ? null : define('ProjectRootPath', DS.'Applications'.DS.'MAMP'.DS.'htdocs'.DS.'www'.DS.'git'.DS.'1DV449_sb222rf'.DS.'laboration2'.DS.'1DV449_L02');
//defined('ROOT_DIR', dirname(__FILE__));
// defined('ProjectRootPath') ? null : define('ProjectRootPath', DS.'storage'.DS.'content'.DS.'63'.DS.'129463'.DS.'sheriefbadran.com');

// Define helper path.
defined('HelperPath') ? null : define('HelperPath', ProjectRootPath.DS.'data');

// Define project paths
defined('ModelPath') ? null : define('ModelPath', ProjectRootPath.DS.'public_html/model');
defined('ViewPath') ? null : define('ViewPath', ProjectRootPath.DS.'public_html/view');
//defined('ViewPath') ? null : define('ViewPath', ProjectRootPath.DS.'public_html/src/view');
//defined('ControllerPath') ? null : define('ControllerPath', ProjectRootPath.DS.'public_html/src/controller');

// REQUIRE NEEDED FILES BELOW.

// REQUIRE HELPERS

// require database model (helper)
require_once(HelperPath.DS."db".DS."PDOdatabase.php");

//require_once(HelperPath.DS.'SessionModel.php');
//require_once(HelperPath.DS.'PDOdatabase.php');

// REQUIRE MODELS
//require_once(ModelPath.DS.'UserModel.php');
//require_once(ModelPath.DS.'UserModel.php');
// require_once(ModelPath.DS.'Validator.php');

// REQUIRE VIEWS
//require_once(HelperPath.DS.'HTMLView.php');
//require_once(ViewPath.DS.'LoginView.php');
//require_once(ViewPath.DS.'MemberView.php');
//require_once(ViewPath.DS.'CookieStorage.php');

// REQUIRE CONTROLLERS
//require_once(ControllerPath.DS.'LoginController.php');

