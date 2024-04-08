<?php

namespace App\Http\Middleware;

use App\Enums\Http;
use App\Models\User;
use App\ResponseContent;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckIfAdminstrator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = User::find(auth()->user()->id);
        if (!$user->isAdmin()) {
            return response()->json(ResponseContent::forbidden(), Http::FORBIDDEN->value);
        }
        return $next($request);
    }
}
