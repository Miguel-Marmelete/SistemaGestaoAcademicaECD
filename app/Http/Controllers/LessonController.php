<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Models\Attendance;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfessorInChargeOfLesson;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class LessonController extends Controller
{
    /**
     * Display a listing of the lessons.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $lessons = Lesson::with([ 'submodule', 'course','professors'])->get();
            return response()->json(['lessons' => $lessons], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving lessons', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified lesson.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $lesson = Lesson::with(['professor', 'module', 'course'])->findOrFail($id);
            return response()->json(['lesson' => $lesson], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Lesson not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the lesson', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Get lessons of a submodule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilteredLessons(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'submodule_id' => 'sometimes|exists:submodules,submodule_id',
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    
            Log::info($professor);
    
            // Initialize the query
            $query = Lesson::query();
    
            // If the professor is not a coordinator, filter by their assigned lessons
            if ($professor->is_coordinator == 0) {
                $query->whereHas('professors', function ($q) use ($professor) {
                    $q->where('professor_in_charge_of_lesson.professor_id', $professor->professor_id);
                });
            }
    
            // Apply additional filters if present
            if ($request->has('submodule_id')) {
                $query->where('submodule_id', $request->query('submodule_id'));
            }
    
            if ($request->has('course_id')) {
                $query->where('course_id', $request->query('course_id'));
            }
    
            // Eager load relationships
            $lessons = $query->with(['submodule', 'course', 'professors'])->get();
    
            return response()->json(['lessons' => $lessons], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving lessons: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while retrieving lessons',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
    

    


    /**
     * Store a new lesson.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'type' => 'required|string|in:Teórica,Laboratorial,Teórica-Prática',
                'summary' => 'required|string',
                'submodule_id' => 'required|exists:submodules,submodule_id',
                'course_id' => 'required|exists:courses,course_id',
                'date' => 'required|date_format:Y-m-d H:00:00',
                'professor_ids' => 'required|array',
                'professor_ids.*' => 'exists:professors,professor_id',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            // Create the Lesson
            $lesson = Lesson::create($validator->validated());
    
            // Attach Professors to the Lesson using the ProfessorInChargeOfLesson model
            $professorIds = $request->input('professor_ids');
            foreach ($professorIds as $professorId) {
                ProfessorInChargeOfLesson::create([
                    'professor_id' => $professorId,
                    'lesson_id' => $lesson->lesson_id,
                ]);
            }
    
            return response()->json(['message' => 'Lesson created successfully', 'lesson' => $lesson], 201);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return response()->json(['error' => 'An error occurred while creating the lesson', 'details' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Update the specified lesson.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $lessonId)
    {
        try {
            $lesson = Lesson::find($lessonId);
            
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'type' => 'sometimes|string|in:Teórica,Laboratorial,Teórica-Prática',
                'summary' => 'sometimes|string',
                'date' => 'sometimes|date_format:Y-m-d H:00:00',
            ]);
            Log::info($request['title']);
            if ($validator->fails()) {
                Log::info($validator->errors());
                return response()->json(['errors' => $validator->errors()], 422);
            }
            $lesson->update($validator->validated());
        
            return response()->json(['message' => 'Lesson updated successfully', 'lesson' => $lesson], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Lesson not found'], 404);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred while updating the lesson', 'details' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Remove the specified lesson.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $lesson = Lesson::findOrFail($id);
            $lesson->delete();

            return response()->json(['message' => 'Lesson deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Lesson not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the lesson', 'details' => $e->getMessage()], 500);
        }
    }


    public function addLessonAndAttendance(Request $request)    
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'type' => 'required|string|in:Teórica,Laboratorial,Teórica-Prática',
                'summary' => 'required|string',
                'submodule_id' => 'required|exists:submodules,submodule_id',
                'course_id' => 'required|exists:courses,course_id',
                'date' => 'required|date_format:Y-m-d H:00:00',
                'professor_ids' => 'required|array',
                'professor_ids.*' => 'exists:professors,professor_id',
                'student_ids' => 'required|array',
                'student_ids.*' => 'exists:students,student_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Create the Lesson without professor_ids and student_ids
            $lessonData = $validator->validated();
            unset($lessonData['professor_ids']);
            unset($lessonData['student_ids']);
            $lesson = Lesson::create($lessonData);

            // Attach Professors to the Lesson using the ProfessorInChargeOfLesson model
            $professorIds = $request->input('professor_ids');
            foreach ($professorIds as $professorId) {
                ProfessorInChargeOfLesson::firstOrCreate([
                    'professor_id' => $professorId,
                    'lesson_id' => $lesson->lesson_id,
                ]);
            }

            // Register attendance for students
            $studentIds = $request->input('student_ids');
            foreach ($studentIds as $studentId) {
                // Assuming you have an Attendance model to handle the attendance records
                Attendance::firstOrCreate([
                    'student_id' => $studentId,
                    'lesson_id' => $lesson->lesson_id,
                ]);
            }

            return response()->json(['message' => 'Lesson and attendance created successfully', 'lesson' => $lesson], 201);
        } catch (\Exception $e) {
            Log::error('Error creating lesson and attendance: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while creating the lesson and attendance', 'details' => $e->getMessage()], 500);
        }
    }
}
