<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the enrollments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $enrollments = Enrollment::with(['student', 'course'])->get();
            return response()->json(['enrollments' => $enrollments], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving enrollments', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new enrollment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,student_id',
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $enrollment = Enrollment::create($validator->validated());

            return response()->json(['message' => 'Enrollment created successfully', 'enrollment' => $enrollment], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the enrollment', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified enrollment record.
     *
     * @param  int  $student_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($student_id, $course_id)
    {
        try {
            $enrollment = Enrollment::with(['student', 'course'])
                ->where('student_id', $student_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            return response()->json(['enrollment' => $enrollment], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Enrollment record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the enrollment record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified enrollment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $student_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $student_id, $course_id)
    {
        try {
            // First, check if the enrollment record exists
            $enrollment = Enrollment::where('student_id', $student_id)
                ->where('course_id', $course_id)
                ->first();

            if (!$enrollment) {
                return response()->json(['error' => 'Enrollment record not found'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'student_id' => 'sometimes|exists:students,student_id',
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update the enrollment record with the validated data
            $enrollment->update($validator->validated());

            return response()->json(['message' => 'Enrollment updated successfully', 'enrollment' => $enrollment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the enrollment record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified enrollment record.
     *
     * @param  int  $student_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($student_id, $course_id)
    {
        try {
            $enrollment = Enrollment::where('student_id', $student_id)
                ->where('course_id', $course_id)
                ->firstOrFail();
            $enrollment->delete();

            return response()->json(['message' => 'Enrollment deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Enrollment record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the enrollment record', 'details' => $e->getMessage()], 500);
        }
    }
}
