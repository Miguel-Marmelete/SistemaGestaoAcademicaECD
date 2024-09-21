<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Attendance;
use Illuminate\Support\Facades\Log;

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
                $attendance = Attendance::create([
                    'lesson_id' => $lesson_id,
                    'student_id' => $student_id,
                ]);
                $attendances[] = $attendance;
            }

            return response()->json(['message' => 'Attendance records created successfully', 'attendances' => $attendances], 201);
        } catch (\Exception $e) {
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
}
