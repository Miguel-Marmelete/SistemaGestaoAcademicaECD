<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Professor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;


class ProfessorController extends Controller
{
    /**
     * Display a listing of all professors.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Retrieve all professors
            $professors = Professor::all();
            return response()->json(['professors' => $professors], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving professors', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified professor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);
            return response()->json(['professor' => $professor], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Professor not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the professor', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new professor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'cc' => 'nullable|integer',
                'cc_expire_date' => 'nullable|date',
                'mobile' => 'nullable|integer',
                'email' => 'required|string|email|max:255|unique:professors,email',
                'is_coordinator' => 'boolean',
                'password' => 'required|confirmed|string|min:8',
                'profile_picture' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Create the professor
            $professor = Professor::create([
                'name' => $request->name,
                'cc' => $request->cc,
                'cc_expire_date' => $request->cc_expire_date,
                'mobile' => $request->mobile,
                'email' => $request->email,
                'is_coordinator' => $request->is_coordinator ?? false,
                'password' => Hash::make($request->password),
                'profile_picture' => $request->profile_picture,
            ]);

            return response()->json(['message' => 'Professor created successfully', 'professor' => $professor], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the professor', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified professor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'cc' => 'sometimes|nullable|integer',
                'cc_expire_date' => 'sometimes|nullable|date',
                'mobile' => 'sometimes|nullable|integer',
                'email' => 'sometimes|string|email|max:255|unique:professors,email,' . $id . ',professor_id',
                'is_coordinator' => 'sometimes|boolean',
                'password' => 'sometimes|string|confirmed|min:8',
                'profile_picture' => 'sometimes|nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Update the professor with the provided data
            $professor->update($request->only([
                'name',
                'cc',
                'cc_expire_date',
                'mobile',
                'email',
                'is_coordinator',
                'profile_picture'
            ]));

            // Update password if provided
            if ($request->has('password')) {
                $professor->update(['password' => Hash::make($request->password)]);
            }

            return response()->json(['message' => 'Professor updated successfully', 'professor' => $professor], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Professor not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the professor', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified professor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);
            $professor->delete();

            return response()->json(['message' => 'Professor deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Professor not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the professor', 'details' => $e->getMessage()], 500);
        }
    }
}