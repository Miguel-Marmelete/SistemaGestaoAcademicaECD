<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    /**
     * Display a listing of the grades.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $grades = Grade::with(['module', 'student'])->get();
            return response()->json(['grades' => $grades], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving grades', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new grade record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'module_id' => 'required|exists:modules,module_id',
                'student_id' => 'required|exists:students,student_id',
                'grade_value' => 'required|integer|min:0|max:20', 
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

        
            $grade = Grade::create($validator->validated());

            return response()->json(['message' => 'Grade created successfully', 'grade' => $grade], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the grade', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified grade record.
     *
     * @param  int  $grade_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $grade = Grade::with(['module', 'student'])->findOrFail($id);

            return response()->json(['grade' => $grade], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Grade record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the grade record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified grade record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $grade_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // First, check if the grade record exists
            $grade = Grade::find($id);

            if (!$grade) {
                return response()->json(['error' => 'Grade record not found'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'module_id' => 'sometimes|exists:modules,module_id',
                'student_id' => 'sometimes|exists:students,student_id',
                'grade_value' => 'sometimes|integer|min:0|max:20', // Assuming grade values are between 0 and 20
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update the grade record with the validated data
            $grade->update($validator->validated());

            return response()->json(['message' => 'Grade updated successfully', 'grade' => $grade], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the grade record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified grade record.
     *
     * @param  int  $grade_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $grade = Grade::findOrFail($id);
            $grade->delete();

            return response()->json(['message' => 'Grade deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Grade record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the grade record', 'details' => $e->getMessage()], 500);
        }
    }
}
