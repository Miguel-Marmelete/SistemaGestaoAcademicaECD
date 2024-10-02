<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\ProfessorInChargeOfLesson;
use Illuminate\Support\Facades\Log;

class CheckProfessorForLessonMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Check if the user is an admin
            if ($user->is_coordinator) {
                return $next($request);
            }

            // Get the lesson_id from the request
            $lessonId = $request->route('lesson_id') ?? $request->input('lesson_id');

            if (!$lessonId) {
                return response()->json(['error' => 'Lesson ID is required'], 400);
            }

            // Check if the user is a professor assigned to the lesson
            $isProfessorInCharge = ProfessorInChargeOfLesson::where('lesson_id', $lessonId)
                ->where('professor_id', $user->professor_id)
                ->exists();

            if ($isProfessorInCharge) {
                return $next($request);
            }

            return response()->json(['error' => 'Forbidden'], 403);
        } catch (\Exception $e) {
            Log::error('Authorization check failed: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
