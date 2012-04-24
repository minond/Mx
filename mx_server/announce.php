<?php

require 'mx.server.php';


$success = false;

if (isset($_GET['game_id']) && isset($_GET['location'])) {
	$location = json_decode($_GET['location']);
	$success = mxServer::announce( $_GET['game_id'], $location );
}

echo (int) $success;
