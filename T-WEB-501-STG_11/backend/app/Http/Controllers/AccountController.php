<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAccountRequest;
use App\Repositories\UserRepository;

class AccountController extends Controller
{
    /**
     * @var UserRepository
     */
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request)
    {
        $credentials = $request->validated();
        $this->userRepository->update(auth()->user(), $credentials);
        return response()->json([
            'success' => true,
            'message' => 'Account updated successfully',
            'data' => auth()->user()
        ]);
    }
}
