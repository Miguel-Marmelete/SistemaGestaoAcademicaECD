<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Check if the token is close to expiring
            $payload = JWTAuth::parseToken()->getPayload();
            $exp = $payload->get('exp');
            $expiresAt = Carbon::createFromTimestamp($exp);
            $now = Carbon::now();
            // Add log to verify the times
            //Log::info('Token expiration time:', ['expires_at' => $expiresAt->toDateTimeString()]);
            //Log::info('Current time:', ['now' => $now->toDateTimeString()]);

            // Check if the token expires in the next 5 minutes
            if ($expiresAt->lte($now->addMinutes(5))) {
                //Log::info('Token is about to expire, refreshing token');
                $newToken = JWTAuth::refresh(JWTAuth::getToken());
                //Log::info('New Token:', ['new_token' => $newToken]);
                // Set the new token in the header and authenticate the user again
                JWTAuth::setToken($newToken);
                $user = JWTAuth::authenticate();
                //Log::info('User authenticated after refresh', ['user' => $user]);

                $response = $next($request);
                $response->headers->set('Authorization', 'Bearer ' . $newToken);

                return $response;
            } else {
                // Authenticate the user if the token is not about to expire
                $user = JWTAuth::parseToken()->authenticate();
                //Log::info('User authenticated', ['user' => $user]);
            }

        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired', 'code' => 'TOKEN_EXPIRED'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token invalid', 'code' => 'TOKEN_INVALID'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token absent', 'code' => 'TOKEN_ABSENT'], 401);
        }

        return $next($request);
    }
}