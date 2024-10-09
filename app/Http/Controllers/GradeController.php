<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Enrollment; // Assuming Student model is used
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
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
            Log::error('An error occurred while retrieving grades: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving grades', 'details' => $e->getMessage()], 500);
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
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => $validator->errors()], 422);
            }

        
            $grade = Grade::create($validator->validated());

            return response()->json(['message' => 'Grade created successfully', 'grade' => $grade], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while creating the grade: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the grade', 'details' => $e->getMessage()], 500);
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
            return response()->json(['message' => 'Grade record not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving the grade record: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the grade record', 'details' => $e->getMessage()], 500);
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
                return response()->json(['message' => 'Grade record not found'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'module_id' => 'sometimes|exists:modules,module_id',
                'student_id' => 'sometimes|exists:students,student_id',
                'grade_value' => 'sometimes|integer|min:0|max:20', // Assuming grade values are between 0 and 20
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => $validator->errors()], 422);
            }

            // Update the grade record with the validated data
            $grade->update($validator->validated());

            return response()->json(['message' => 'Grade updated successfully', 'grade' => $grade], 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while updating the grade record: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the grade record', 'details' => $e->getMessage()], 500);
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
            return response()->json(['message' => 'Grade record not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while deleting the grade record: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the grade record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Get students with grades for a specific course and module.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentsWithGrades(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,course_id',
                'module_id' => 'required|exists:modules,module_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => $validator->errors()], 422);
            }

            $courseId = $request->query('course_id');
            $moduleId = $request->query('module_id');

            // Get all students from the course with a default grade of 0
            $students = Enrollment::where('course_id', $courseId)
                ->with('student')
                ->get()
                ->map(function ($enrollment) {
                    return [
                        'student_id' => $enrollment->student_id,
                        'student_name' => $enrollment->student->name,
                        'student_number' => $enrollment->student->number,
                        'grade_value' => null,
                    ];
                })
                ->keyBy('student_id')
                ->toArray(); // Convert to array for direct modification

            // Get and update grades for students who have them
            $grades = Grade::with('student')
                ->where('module_id', $moduleId)
                ->where('course_id', $courseId)
                ->get();

            foreach ($grades as $grade) {
                if (isset($students[$grade->student->student_id])) {
                    $students[$grade->student->student_id]['grade_value'] = $grade->grade_value;
                }
            }

            return response()->json(['students' => array_values($students)], 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving students with grades: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving students with grades', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store or update multiple grade records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitGrades(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'grades' => 'required|array',
                'grades.*.module_id' => 'required|exists:modules,module_id',
                'grades.*.student_id' => 'required|exists:students,student_id',
                'grades.*.course_id' => 'required|exists:courses,course_id',
                'grades.*.grade_value' => 'required|integer|min:0|max:20',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => $validator->errors()], 422);
            }

            $grades = $request->input('grades');
            $updatedGrades = [];

            foreach ($grades as $gradeData) {
                $grade = Grade::updateOrCreate(
                    [
                        'module_id' => $gradeData['module_id'],
                        'student_id' => $gradeData['student_id'],
                        'course_id' => $gradeData['course_id'],
                    ],
                    ['grade_value' => $gradeData['grade_value']]
                );
                $updatedGrades[] = $grade;
            }

            return response()->json(['message' => 'Grades submitted successfully', 'grades' => $updatedGrades], 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while submitting grades: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while submitting grades', 'details' => $e->getMessage()], 500);
        }
    }
}
