<?php
    session_start();
    require_once("../data/pathConfig.php");
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="ico/favicon.png">

    <title>Mezzy Labbage - Log in</title>

    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/login.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
      <form class="form-signin" action="validate.php" method="POST">
        <h2 class="form-signin-heading">Log in</h2>
        <input value="" name="username" type="text" class="form-control" placeholder="Användarnamn" autofocus>
        <input value="" name="password" type="password" class="form-control" placeholder="Password">
        <button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
      </form>
    </div>
  </body>
</html>

