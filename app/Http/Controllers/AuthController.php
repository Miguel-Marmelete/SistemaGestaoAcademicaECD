<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use App\Models\PendingProfessor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a Professor (Pre-create).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
{
    try {
        // Check if the email is already in the pending_professors table
        $pendingProfessor = PendingProfessor::where('email', $request->email)->first();
        if ($pendingProfessor) {
            return response()->json(['message' => 'Email is awaiting approval. Please check your inbox.'], 400);
        }

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:pending_professors|unique:professors',
            'password' => 'required|confirmed|min:8',
        ]);

        // Return validation errors if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Generate a random token for email verification
        $token = Str::random(60);

        // Create a pending professor record
        $pendingProfessor = PendingProfessor::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_token' => $token
        ]);

        // Send verification email to the professor
        Mail::send('emails.verify_professor', ['token' => $token], function($message) use ($request) {
            $message->to($request->email);
            $message->subject('Verify Email Address');
        });

        // Return success response
        return response()->json(['message' => 'Registration initiated, please check your email for verification'], 201);

    } catch (\Exception $e) {
        // Log the error and return error response
        Log::error('Error during registration: ' . $e->getMessage());
        return response()->json(['message' => 'Registration failed'], 500);
    }
}


    /**
     * Confirm email address by professor.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyEmail($token)
    {
        try {
            // Find pending professor by verification token
            $pendingProfessor = PendingProfessor::where('verification_token', $token)->first();

            // Return error if token is invalid
            if (!$pendingProfessor) {
                return response()->json(['message' => 'Invalid token'], 400);
            }

            // Notify admin about email verification
            Mail::send('emails.notify_admin', ['pendingProfessor' => $pendingProfessor], function($message) {
                $message->to('20431@stu.ipbeja.pt'); // Replace with the admin's email
                $message->subject('Professor Email Verified');
            });

            // return redirect
            // Return success response
            //return response()->json(['message' => 'Email verified successfully, awaiting admin approval']);
            $reactFrontendUrl = 'http://localhost:3000/verify-email';

        // Redirect to the React frontend page
            return redirect()->away($reactFrontendUrl);

        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error during email verification: ' . $e->getMessage());
            return response()->json(['message' => 'Email verification failed'], 500);
        }
    }

    /**
     * Admin approves professor registration.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveProfessor($token)
    {
        try {
            // Find pending professor by verification token
            $pendingProfessor = PendingProfessor::where('verification_token', $token)->first();

            // Return error if token is invalid
            if (!$pendingProfessor) {
                return response()->json(['message' => 'Invalid token'], 400);
            }

            // Create the professor account
            $professor = Professor::create([
                'name' => $pendingProfessor->name,
                'email' => $pendingProfessor->email,
                'password' => $pendingProfessor->password,
            ]);

            // Delete the pending professor entry
            $pendingProfessor->delete();

            // Return success response
            return response()->json(['message' => 'Professor account created successfully']);

        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error during professor approval: ' . $e->getMessage());
            return response()->json(['message' => 'Professor approval failed'], 500);
        }
    }

    /**
     * Authenticate and login the professor.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            // Validate input data
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|min:8',
            ]);
    
            // Return validation errors if validation fails
            if ($validator->fails()) {
                return response()->json($validator->errors()->toJson(), 400);
            }
    
            // Check if the email is in pending professors
            $pendingProfessor = PendingProfessor::where('email', $request->email)->first();
            if ($pendingProfessor) {
                return response()->json(['message' => 'Email is awaiting approval. Please check your inbox for verification.'], 400);
            }
    
            // Get credentials from request
            $credentials = $request->only(['email', 'password']);
    
            // Attempt to authenticate the user
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid Credentials'], 401);
            }
    
            // Retrieve authenticated professor
            $professor = JWTAuth::user();
            $token_data = $this->respondWithToken($token)->getData();
    
            // Return success response with token and professor data
            return response()->json([
                'message' => 'Successfully logged in',
                'token_data' =>  $token_data,
                'professor' => $professor,
            ]);
    
        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error during login: ' . $e->getMessage());
            return response()->json(['message' => 'Login failed'], 500);
        }
    }

    /**
     * Get the authenticated Professor.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        try {
            // Return the authenticated user
            return response()->json(JWTAuth::user());

        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error fetching authenticated professor: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch authenticated professor'], 500);
        }
    }

    /**
     * Log the professor out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            // Invalidate the current token
            JWTAuth::invalidate(JWTAuth::getToken());

            // Return success response
            return response()->json(['message' => 'Successfully logged out']);

        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error during logout: ' . $e->getMessage());
            return response()->json(['message' => 'Logout failed'], 500);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            // Refresh the token
            $token = JWTAuth::refresh(JWTAuth::getToken());

            // Return the new token
            return $this->respondWithToken($token);

        } catch (\Exception $e) {
            // Log the error and return error response
            Log::error('Error refreshing token: ' . $e->getMessage());
            return response()->json(['message' => 'Token refresh failed'], 500);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
}
