<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Attendance;
use Illuminate\Support\Facades\Log;
use App\Models\Student; // Assuming Student model is defined in App\Models
use App\Models\Lesson;
use App\Models\Enrollment;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the attendance records.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $attendances = Attendance::with(['lesson', 'student'])->get();
            return response()->json(['attendances' => $attendances], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving attendance records', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new attendance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'lesson_id' => 'required|exists:lessons,lesson_id',
                'student_ids' => 'required|array',
                'student_ids.*' => 'required|exists:students,student_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $lesson_id = $request->input('lesson_id');
            $student_ids = $request->input('student_ids');

            $attendances = [];
            foreach ($student_ids as $student_id) {
                $attendance = Attendance::firstOrCreate([
                    'lesson_id' => $lesson_id,
                    'student_id' => $student_id,
                ]);
                $attendances[] = $attendance;
            }

            return response()->json(['message' => 'Attendance records created successfully', 'attendances' => $attendances], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while creating the attendance records: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while creating the attendance records', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified attendance record.
     *
     * @param  int  $lesson_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($lesson_id, $student_id)
    {
        try {
            $attendance = Attendance::with(['lesson', 'student'])
                ->where('lesson_id', $lesson_id)
                ->where('student_id', $student_id)
                ->firstOrFail();

            return response()->json(['attendance' => $attendance], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Attendance record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the attendance record', 'details' => $e->getMessage()], 500);
        }
    }

    /**
 * Update the specified attendance record.
 *
 * @param  \Illuminate\Http\Request  $request
 * @param  int  $lesson_id
 * @param  int  $student_id
 * @return \Illuminate\Http\JsonResponse
 */
public function update(Request $request, $lesson_id, $student_id)
{
    try {
        // First, check if the attendance record exists
        $attendance = Attendance::where('lesson_id', $lesson_id)
            ->where('student_id', $student_id)
            ->first();

        if (!$attendance) {
            return response()->json(['error' => 'Attendance record not found'], 404);
        }

        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'lesson_id' => 'required|exists:lessons,lesson_id',
            'student_id' => 'required|exists:students,student_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update the attendance record with the validated data
        $attendance->update($validator->validated());

        return response()->json(['message' => 'Attendance record updated successfully', 'attendance' => $attendance], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while updating the attendance record', 'details' => $e->getMessage()], 500);
    }
}

    /**
     * Remove the specified attendance record.
     *
     * @param  int  $lesson_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($lesson_id, $student_id)
    {
        try {
            $attendance = Attendance::where('lesson_id', $lesson_id)
                ->where('student_id', $student_id)
                ->firstOrFail();
            $attendance->delete();

            return response()->json(['message' => 'Attendance record deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Attendance record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the attendance record', 'details' => $e->getMessage()], 500);
        }
    }

    public function getAttendance(Request $request)
    {
        // Validate the lesson_id from the query parameters
        $validator = Validator::make($request->query(), [
            'lesson_id' => 'required|exists:lessons,lesson_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lesson_id = $request->query('lesson_id');

        try {
            // Get the lesson to find the course_id
            $lesson = Lesson::findOrFail($lesson_id);
            $course_id = $lesson->course_id;

            // Get the students enrolled in the course
            $studentIds = Enrollment::where('course_id', $course_id)
                ->pluck('student_id')
                ->toArray();

            // Get the students who were present for the lesson
            $attendances = Attendance::with('student')
                ->where('lesson_id', $lesson_id)
                ->whereIn('student_id', $studentIds)
                ->get();

            $presentStudents = $attendances->pluck('student')->pluck('student_id')->toArray();

            // Get the student IDs who were absent
            $absentStudentIds = array_diff($studentIds, $presentStudents);

            // Fetch the full absent student objects using their IDs
            $absentStudents = Student::whereIn('student_id', $absentStudentIds)->get()->toArray();

            // Fetch full present student objects using their IDs
            $presentStudents = Student::whereIn('student_id', $presentStudents)->get()->toArray();

            return response()->json([
                'presentStudents' => $presentStudents,
                'absentStudents' => $absentStudents,
            ], 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving attendance: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving attendance', 'details' => $e->getMessage()], 500);
        }
    }
    
}
