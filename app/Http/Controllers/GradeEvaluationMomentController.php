<?php

namespace App\Http\Controllers;

use App\Models\GradeEvaluationMoment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeEvaluationMomentController extends Controller
{
    /**
     * Display a listing of the grade evaluation moments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $gradeEvaluationMoments = GradeEvaluationMoment::with(['evaluationMoment', 'student'])->get();
            return response()->json(['gradeEvaluationMoments' => $gradeEvaluationMoments], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving grade evaluation moments', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new grade evaluation moment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'evaluation_moment_id' => 'required|exists:evaluation_moments,evaluation_moment_id',
                'student_id' => 'required|exists:students,student_id',
                'evaluation_moment_grade_value' => 'required|integer|min:0|max:20', // Assuming grades are between 0 and 20
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $gradeEvaluationMoment = GradeEvaluationMoment::create($validator->validated());

            return response()->json(['message' => 'Grade evaluation moment created successfully', 'gradeEvaluationMoment' => $gradeEvaluationMoment], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the grade evaluation moment', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified grade evaluation moment.
     *
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($evaluation_moment_id, $student_id)
    {
        try {
            $gradeEvaluationMoment = GradeEvaluationMoment::with(['evaluationMoment', 'student'])
                ->where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->firstOrFail();

            return response()->json(['gradeEvaluationMoment' => $gradeEvaluationMoment], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Grade evaluation moment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the grade evaluation moment', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified grade evaluation moment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $evaluation_moment_id, $student_id)
    {
        try {
            // Check if the grade evaluation moment exists
            $gradeEvaluationMoment = GradeEvaluationMoment::where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->first();

            if (!$gradeEvaluationMoment) {
                return response()->json(['error' => 'Grade evaluation moment not found'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'evaluation_moment_grade_value' => 'sometimes|integer|min:0|max:20', // Assuming grades are between 0 and 100
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update the grade evaluation moment with the validated data
            $gradeEvaluationMoment->update($validator->validated());

            return response()->json(['message' => 'Grade evaluation moment updated successfully', 'gradeEvaluationMoment' => $gradeEvaluationMoment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the grade evaluation moment', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified grade evaluation moment record.
     *
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($evaluation_moment_id, $student_id)
    {
        try {
            $gradeEvaluationMoment = GradeEvaluationMoment::where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->firstOrFail();
            $gradeEvaluationMoment->delete();

            return response()->json(['message' => 'Grade evaluation moment deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Grade evaluation moment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the grade evaluation moment', 'details' => $e->getMessage()], 500);
        }
    }
}
