<?php

// DEFINE CORE PATHS (absolute).

// Define a short for directory separator.
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

// Define a project root path.
defined('ProjectRootPath') ? null : define('ProjectRootPath', DS.'Applications'.DS.'MAMP'.DS.'htdocs'.DS.'www'.DS.'webbteknik2-lab2'.DS.'1DV449_L02');

// Define helper path.
defined('HelperPath') ? null : define('HelperPath', ProjectRootPath.DS.'data');

// Define project paths
defined('ModelPath') ? null : define('ModelPath', ProjectRootPath.DS.'public_html/model');
defined('ViewPath') ? null : define('ViewPath', ProjectRootPath.DS.'public_html/view');

require_once(HelperPath.DS."db".DS."PDOdatabase.php");

