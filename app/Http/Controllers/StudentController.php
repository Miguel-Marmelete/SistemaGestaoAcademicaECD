<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Validator;
use App\Models\Student;
use Illuminate\Support\Facades\Log; 
class StudentController extends Controller
{


    public function getStudents(Request $request)
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
                $students = Student::all();
            }
    
            // Return students as a JSON response
            return response()->json(['students' => $students], 200);
    
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            Log::error('Search error: ' . $e->getMessage());
    
            // Return a JSON response with the error message
            return response()->json([
                'error' => 'An unexpected error occurred.',
                'details' => $e->getMessage()
            ], 500);
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
                'birthday' => 'required|date',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'mobile' => 'required|integer',
                'posto' => 'required|string|max:255',
                'nim' => 'required|integer',
                'classe' => 'required|string|max:255',
                'personal_email' => 'required|string|email|max:255|unique:students',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['details' => $validator->errors()], 400);
            }

            $student = Student::create($validator->validated());
            

            return response()->json(['message' => 'Student created successfully', 'student' => $student], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while creating the student: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating the student', 'details' => $e->getMessage()], 500);
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
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['details' => $validator->errors()], 400);
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



    

    public function addAndEnrollStudent(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'ipbeja_email' => 'required|string|email|max:255|unique:students',
                'number' => 'required|integer|unique:students',
                'birthday' => 'required|date',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'mobile' => 'required|integer',
                'posto' => 'required|string|max:255',
                'nim' => 'required|integer',
                'classe' => 'required|string|max:255',
                'personal_email' => 'required|string|email|max:255|unique:students',
                'course_id' => 'required|integer|exists:courses,course_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['details' => $validator->errors()], 400);
            }

            // Create the student without course_id
            $studentData = $validator->validated();
            unset($studentData['course_id']);
            $student = Student::firstOrCreate($studentData);

            // Enroll the student in the course
            Enrollment::firstOrCreate([
                'student_id' => $student->student_id,
                'course_id' => $request->input('course_id'),
            ]);

            return response()->json(['message' => 'Student created and enrolled successfully'], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while creating and enrolling the student: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while creating and enrolling the student', 'details' => $e->getMessage()], 500);
        }
    }

}

 
    

