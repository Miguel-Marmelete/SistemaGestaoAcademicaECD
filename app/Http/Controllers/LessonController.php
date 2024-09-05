<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfessorInChargeOfLesson;

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
            Log::info('Lessons Data: ' . $lessons->toJson());
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
    public function update(Request $request, $id)
    {
        try {
            $lesson = Lesson::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'type' => 'sometimes|string|in:Teórica,Laboratorial,Teórica-Prática',
                'summary' => 'sometimes|string',
                'submodule_id' => 'sometimes|exists:submodules,submodule_id',
                'course_id' => 'sometimes|exists:courses,course_id',
                'date' => 'sometimes|date_format:Y-m-d H:00:00',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $lesson->update($validator->validated());

            return response()->json(['message' => 'Lesson updated successfully', 'lesson' => $lesson], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Lesson not found'], 404);
        } catch (\Exception $e) {
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
}