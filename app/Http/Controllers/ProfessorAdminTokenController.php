<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfessorAdminToken;
use Illuminate\Support\Facades\Log;

class ProfessorAdminTokenController extends Controller
{
    
    /**
     * Store a new token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string|max:255',
                'professor_id' => 'required|exists:professors,professor_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => $validator->errors()], 422);
            }

            $token = ProfessorAdminToken::create($validator->validated());

            return response()->json(['message' => 'Token created successfully', 'token' => $token], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while creating the token: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the token', 'details' => $e->getMessage()], 500);
        }
    }



    /**
     * Remove the specified token.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $token = ProfessorAdminToken::findOrFail($id);
            $token->delete();

            return response()->json(['message' => 'Token deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Token not found: ' . $e->getMessage());
            return response()->json(['message' => 'Token not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while deleting the token: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the token', 'details' => $e->getMessage()], 500);
        }
    }
}
