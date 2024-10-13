<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            Log::error('Erro ao recuperar as inscrições: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao recuperar as inscrições'], 500);
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
        'student_ids' => 'required|array',
        'student_ids.*' => 'required|exists:students,student_id',
        'course_id' => 'required|exists:courses,course_id',
    ]);

    if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

    try {
        $enrollments = []; // Initialize the enrollments array

        foreach ($request->input('student_ids') as $studentId) {
            // Check if the enrollment already exists for this student and course
            $existingEnrollment = Enrollment::where('student_id', $studentId)
                                            ->where('course_id', $request->input('course_id'))
                                            ->first();

            if (!$existingEnrollment) {
                $enrollmentData = [
                    'student_id' => $studentId,
                    'course_id' => $request->input('course_id'),
                ];

                // Create the new enrollment
                $enrollments[] = Enrollment::create($enrollmentData);
            }
        }

        return response()->json([
            'message' => 'Inscrições criadas com sucesso',
            'enrollments' => $enrollments
        ], 201);
    } catch (\Exception $e) {
        Log::error('Erro ao criar as inscrições: ' . $e->getMessage());
        return response()->json(['message' => 'Ocorreu um erro ao criar as inscrições'], 500);
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
            Log::error('Inscrição não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Inscrição não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar a inscrição: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao recuperar a inscrição'], 500);
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
                return response()->json(['message' => 'Inscrição não encontrada'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'student_id' => 'sometimes|exists:students,student_id',
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Update the enrollment record with the validated data
            $enrollment->update($validator->validated());

            return response()->json(['message' => 'Inscrição atualizada com sucesso', 'inscrição' => $enrollment], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar a inscrição: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao atualizar a inscrição'], 500);
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

            return response()->json(['message' => 'Inscrição apagada com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Inscrição não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Inscrição não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar a inscrição: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao apagar a inscrição'], 500);
        }
    }
}
