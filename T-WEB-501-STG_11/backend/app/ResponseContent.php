<?php

namespace App;

class ResponseContent {

	public static function forbidden(): array 
	{
		return [
			'success' => false,
			'message' => 'You do not have the privileges to perform this action'
		];
	}
}