<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkplaceController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\NotificationController;

use Illuminate\Support\Facades\Route;

/**
 * These routes are accessible by users.
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me'])->name('auth.me');
    Route::get('me/likes', [AuthController::class, 'likes'])->name('auth.me.likes');
    Route::get('me/applications', [JobApplicationController::class,'me'])->name('me.applications');
    Route::get('me/notifications', [AuthController::class, 'notifications'])->name('auth.me.notifications');
    Route::put('account', [AccountController::class, 'update'])->name('account.update');
    Route::post('users/{user}/likes', [LikeController::class, 'like'])->name('users.likes.like');
    Route::delete('users/{user}/likes', [LikeController::class, 'unlike'])->name('users.likes.unlike');
    
    /**
     * These routes are only accessible by administrators.
     */
    Route::middleware('administrator')->group(function () {
        Route::apiResources([
            'users' => UserController::class,
            'regions' => RegionController::class,
            'types' => TypeController::class,
            'workplaces' => WorkplaceController::class,
            'notifications' => NotificationController::class,
        ]);
        Route::get('saved', [LikeController::class, 'index'])->name('likes.index');
        Route::delete('saved/{like}', [LikeController::class, 'destroy'])->name('likes.destroy');
        Route::apiResource('jobs', JobController::class)->except(['index', 'show']);
        Route::apiResource('companies', CompanyController::class)->except(['index']);
        Route::apiResource('applications', JobApplicationController::class)->except(['store', 'show']);
    });

    Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
});

/**
 * These routes are accessible by everyone.
 */
Route::get('companies', [CompanyController::class, 'index'])->name('companies.index');
Route::get('filters', [JobController::class, 'filters'])->name('jobs.filters');
Route::get('jobs', [JobController::class, 'index'])->name('jobs.index');
Route::get('jobs/{job}', [JobController::class, 'show'])->name('jobs.show');
Route::get('search', [JobController::class, 'search'])->name('jobs.search');
Route::post('job/{job}/applications', [JobApplicationController::class, 'store'])->name('applications.store');

// These routes are only accessible by guests.
Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('auth/register', [AuthController::class, 'register'])->name('auth.register');

