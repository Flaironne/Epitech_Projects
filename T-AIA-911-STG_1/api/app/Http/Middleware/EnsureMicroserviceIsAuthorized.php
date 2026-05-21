<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMicroserviceIsAuthorized
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Service-Token');

        if (!$token || $token !== config('sayway.microservices.token')) {
            return response()->json([
                'message' => 'Unauthorized microservice',
            ], 401);
        }

        return $next($request);
    }
}
