<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class CheckCoordinatorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $professor = JWTAuth::user();
        if ($professor->is_coordinator == 1) {
            return $next($request);
        }

        // Return a 403 response if the user is not an admin
        return response()->json(['error' => 'Isso é que era bom'], 403);
    }
}

