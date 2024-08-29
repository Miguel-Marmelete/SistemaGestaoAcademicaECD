<?php

namespace App\Http\Controllers;

use App\Models\ProfessorInChargeOfLesson;
use Illuminate\Http\Request;

class ProfessorInChargeOfLessonController extends Controller
{
    public function index()
    {
        try {
            $assignments = ProfessorInChargeOfLesson::all();
            return response()->json(['message' => 'Assignments retrieved successfully', 'assignments' => $assignments], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch records', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'professor_id' => 'required|exists:professors,professor_id',
                'lesson_id' => 'required|exists:lessons,lesson_id',
            ]);

            $assignment = ProfessorInChargeOfLesson::create($validatedData);
            return response()->json(['message' => 'Assignment created successfully', 'assignment' => $assignment], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create record', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($professor_id, $lesson_id)
    {
        try {
            $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
                ->where('lesson_id', $lesson_id)
                ->firstOrFail();
            return response()->json(['message' => 'Assignment retrieved successfully', 'assignment' => $assignment], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Record not found', 'error' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $professor_id, $lesson_id)
{
    try {
        // Validate the incoming data
        $validatedData = $request->validate([
            'professor_id' => 'required|exists:professors,professor_id',
            'lesson_id' => 'required|exists:lessons,lesson_id',
        ]);

        // Check if the assignment exists
        $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
            ->where('lesson_id', $lesson_id)
            ->first();

        if (!$assignment) {
            return response()->json(['message' => 'Assignment not found'], 404);
        }

        // Update the assignment
        $assignment->update($validatedData);
        return response()->json(['message' => 'Assignment updated successfully', 'assignment' => $assignment], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to update record', 'error' => $e->getMessage()], 500);
    }
}


    public function destroy($professor_id, $lesson_id)
    {
        try {
            $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
                ->where('lesson_id', $lesson_id)
                ->firstOrFail();

            $assignment->delete();
            return response()->json(['message' => 'Assignment deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete record', 'error' => $e->getMessage()], 500);
        }
    }
}
