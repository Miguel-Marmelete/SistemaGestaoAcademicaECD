<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfessorResetPasswordToken;

class ProfessorResetPasswordTokenController extends Controller
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
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $token = ProfessorResetPasswordToken::create($validator->validated());

            return response()->json(['message' => 'Token created successfully', 'token' => $token], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the token', 'details' => $e->getMessage()], 500);
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
            $token = ProfessorResetPasswordToken::findOrFail($id);
            $token->delete();

            return response()->json(['message' => 'Token deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Token not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the token', 'details' => $e->getMessage()], 500);
        }
    }
}
