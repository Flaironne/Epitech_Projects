<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{

	/**
	 * @var User
	 */
	protected $model;

	public function __construct(User $model)
	{
		$this->model = $model;
	}

	public function update(User $user, array $data): User
	{
		unset($data['password']);
		if (isset($data['new_password'])) {
			$data['password'] = $data['new_password'];
			unset($data['new_password']);
		}
		$user->update($data);
		return $user;
	}
}