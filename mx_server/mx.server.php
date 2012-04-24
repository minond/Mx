<?php

class mxServer {
	static $player_file = 'players.json';

	public static function register ($game_id) {
		$raw_data = file_get_contents(self::$player_file);

		if ($raw_data) {
			$json_data = (array) json_decode($raw_data);
		}
		else {
			$json_data = array();
		}

		if (!array_key_exists($game_id, $json_data)) {
			$json_data[ $game_id ] = array();
			$raw_data = json_encode($json_data);
			file_put_contents(self::$player_file, $raw_data);
			
			return true;
		}
		else {
			return false;
		}
	}

	public static function announce ($game_id, $location) {
		$raw_data = file_get_contents(self::$player_file);

		if ($raw_data) {
			$json_data = json_decode($raw_data);

			if (isset($json_data->{$game_id})) {
				$json_data->{$game_id} = $location;
				$raw_data = json_encode($json_data);
				file_put_contents(self::$player_file, $raw_data);

				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}
}
