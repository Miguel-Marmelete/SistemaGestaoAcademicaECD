<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Attendance;
use Illuminate\Support\Facades\Log;
use App\Models\Student; 
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
            Log::error('Erro ao obter as presenças: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter as presenças'], 500);
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
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
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

            return response()->json(['message' => 'Presenças criadas com sucesso', 'attendances' => $attendances], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar as presenças: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar as presenças'], 500);
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
            return response()->json(['message' => 'Registo de presença não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter o registo de presença: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter o registo de presença'], 500);
        }
    }

    /**
     * Update the specified attendance record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $lesson_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $lesson_id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'studentsPresent' => 'required|array',
                'studentsPresent.*' => 'required|exists:students,student_id',
                'lesson_id' => 'required|exists:lessons,lesson_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            $studentsPresentIds = $request->input('studentsPresent');
            Log::info('Request: ' . json_encode($request->all()));

            // Delete existing attendance records for the lesson
            Attendance::where('lesson_id', $lesson_id)->delete();

            // Create new attendance records
            $attendances = [];
            foreach ($studentsPresentIds as $student_id) {
                $attendance = Attendance::create([
                    'lesson_id' => $lesson_id,
                    'student_id' => $student_id,
                ]);
                $attendances[] = $attendance;
            }

            return response()->json(['message' => 'Presenças atualizadas com sucesso', 'attendances' => $attendances], 200);
        } catch (\Exception $e) {
            Log::error('Ocorreu um erro ao atualizar o registo de presença: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao atualizar o registo de presença'], 500);
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

            return response()->json(['message' => 'Registo de presença apagado com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Registo de presença não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Ocorreu um erro ao apagar o registo de presença: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao apagar o registo de presença'], 500);
        }
    }

    public function getAttendance(Request $request)
    {
        // Validate the lesson_id from the query parameters
        $validator = Validator::make($request->query(), [
            'lesson_id' => 'required|exists:lessons,lesson_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
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
            Log::error('Erro ao obter a presença: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter a presença'], 500);
        }
    }
    
}
