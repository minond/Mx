<?php

require 'mx.server.php';


$success = false;

if (isset($_GET['game_id'])) {
	$success = mxServer::register( $_GET['game_id'] );
}

echo (int) $success;
