<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Validator;
use App\Models\Student;
use Illuminate\Support\Facades\Log; 
class StudentController extends Controller
{
    /**
     * Display a listing of the students.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $students = Student::all();
            return response()->json(['students' => $students], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving students', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified student.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $student = Student::findOrFail($id);
            return response()->json(['student' => $student], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the student', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new student.
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
                'ipbeja_email' => 'required|string|email|max:255|unique:students',
                'number' => 'required|integer|unique:students',
                'birthday' => 'nullable|date',
                'address' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:255',
                'mobile' => 'nullable|integer',
                'posto' => 'nullable|string|max:255',
                'nim' => 'nullable|integer',
                'classe' => 'nullable|string|max:255',
                'personal_email' => 'required|string|email|max:255|unique:students',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $student = Student::create($validator->validated());
            /*
            // Create the student
            $student = Student::create([
                'name' => $request->name,
                'ipbeja_email' => $request->ipbeja_email,
                'number' => $request->number,
                'birthday' => $request->birthday,
                'address' => $request->address,
                'city' => $request->city,
                'mobile' => $request->mobile,
                'posto' => $request->posto,
                'nim' => $request->nii,
                'classe' => $request->classe,
                'personal_email' => $request->personal_email,
            ]);*/

            return response()->json(['message' => 'Student created successfully', 'student' => $student], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the student', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified student.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the student by ID
            $student = Student::findOrFail($id);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'ipbeja_email' => 'sometimes|string|email|max:255|unique:students,ipbeja_email,'.$id.',student_id',
                'number' => 'sometimes|integer|unique:students,number,'.$id.',student_id',
                'birthday' => 'sometimes|date',
                'address' => 'sometimes|string|max:255',
                'city' => 'sometimes|string|max:255',
                'mobile' => 'sometimes|integer',
                'posto' => 'sometimes|string|max:255',
                'nim' => 'sometimes|integer',
                'classe' => 'sometimes|string|max:255',
                'personal_email' => 'sometimes|string|email|max:255|unique:students,personal_email,'.$id.',student_id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Update the student with the provided data
            $student->update($request->only([
                'name', 'ipbeja_email', 'number', 'birthday', 'address', 
                'city', 'mobile', 'posto', 'nii', 'classe', 'personal_email'
            ]));

            return response()->json(['message' => 'Student updated successfully', 'student' => $student], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the student', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified student from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $student = Student::findOrFail($id);
            $student->delete();

            return response()->json(['message' => 'Student deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Student not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the student', 'details' => $e->getMessage()], 500);
        }
    }


    public function getStudentsByCourse(Request $request)
    {
        // Validate course_id if it's present
        $request->validate([
            'course_id' => 'nullable|integer|exists:courses,course_id',
        ]);
    
        try {
            // Extract course_id from query parameters
            $courseId = $request->query('course_id');
    
            // If course_id is provided, fetch students for that course
            if ($courseId) {
                // Get student IDs from the enrollment table based on course_id
                $studentIds = Enrollment::where('course_id', $courseId)
                    ->pluck('student_id');
    
                // Retrieve students based on the obtained student IDs
                $students = Student::whereIn('student_id', $studentIds)->get();
            } else {
            // If no course_id is provided, return a message
            return response()->json(['message' => 'No students are enrolled in the provided course'], 200);
            }
    
            // Return students as a JSON response
            return response()->json($students, 200);
    
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            Log::error('Search error: ' . $e->getMessage());
    
            // Return a JSON response with the error message
            return response()->json([
                'error' => 'An unexpected error occurred.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
}

 
    

