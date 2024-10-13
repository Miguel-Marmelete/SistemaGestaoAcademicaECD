<?php

namespace App\Http\Controllers;

use App\Models\GradeEvaluationMoment;
use App\Models\EvaluationMoment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class GradeEvaluationMomentController extends Controller
{
    /**
     * Display a listing of the grade evaluation moments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStudentsEvaluationMomentGrades($evaluation_moment_id)
    {
        try {
            $professor = JWTAuth::user();
            
            // Validate the evaluation_moment_id
            $validator = Validator::make(['evaluation_moment_id' => $evaluation_moment_id], [
                'evaluation_moment_id' => 'required|exists:evaluation_moments,evaluation_moment_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Check if the professor is associated with the evaluation moment
            if($professor->is_coordinator != 1)
            {
                $evaluationMoment = EvaluationMoment::where('evaluation_moment_id', $evaluation_moment_id)
                    ->where('professor_id', $professor->professor_id)
                    ->first();
                if (!$evaluationMoment) {
                    return response()->json(['message' => 'Não tem permissão para aceder a este momento de avaliação'], 403);
                }    
            }
            

            // Fetch grades for the specific evaluation moment
            $gradeEvaluationMoments = GradeEvaluationMoment::with(['student'])
                ->where('evaluation_moment_id', $evaluation_moment_id)
                ->get();

            // Transform the data to return only student information and grades
            $studentsGrades = $gradeEvaluationMoments->map(function ($gradeEvaluationMoment) {
                return [
                    'student_id' => $gradeEvaluationMoment->student->student_id,
                    'student_name' => $gradeEvaluationMoment->student->name,
                    'student_number' => $gradeEvaluationMoment->student->number,
                    'grade' => $gradeEvaluationMoment->evaluation_moment_grade_value,
                ];
            });

            return response()->json(['students_grades' => $studentsGrades], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao obter notas dos momentos de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter notas dos momentos de avaliação'], 500);
        }
    }

    /**
     * Store a new grade evaluation moment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitEvaluationMomentGrades(Request $request)
    {
       
        try {
            $validator = Validator::make($request->all(), [
                'grades' => 'required|array',
                'grades.*.evaluation_moment_id' => 'required|exists:evaluation_moments,evaluation_moment_id',
                'grades.*.student_id' => 'required|exists:students,student_id',
                'grades.*.evaluation_moment_grade_value' => 'required|decimal:0,2|min:0|max:20', 
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . $validator->errors());
                return response()->json(['message' => 'Dados Inválidos'], 422);
            }

            $grades = $request->input('grades');

            $createdRecords = [];
            foreach ($grades as $grade) {
                try {
                    GradeEvaluationMoment::updateOrCreate(
                        [
                            'evaluation_moment_id' => $grade['evaluation_moment_id'],
                            'student_id' => $grade['student_id']
                        ],
                        [
                            'evaluation_moment_grade_value' => $grade['evaluation_moment_grade_value']
                        ]
                    );
                } catch (\Exception $e) {
                    // Log the error
                    Log::error("Error updating/creating grade: " . $e->getMessage());
                    return response()->json(['message' => 'Ocorreu um erro ao criar as notas dos momentos de avaliação'], 500);
                }
            }

            return response()->json(['message' => 'Notas dos momentos de avaliação criadas com sucesso', 'gradeEvaluationMoments' => $createdRecords], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar as notas dos momentos de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar as notas dos momentos de avaliação'], 500);
        }
    }

    /**
     * Display the specified grade evaluation moment.
     *
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($evaluation_moment_id, $student_id)
    {
        try {
            $gradeEvaluationMoment = GradeEvaluationMoment::with(['evaluationMoment', 'student'])
                ->where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->firstOrFail();

            return response()->json(['gradeEvaluationMoment' => $gradeEvaluationMoment], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Nota do momento de avaliação não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Nota do momento de avaliação não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter a nota do momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter a nota do momento de avaliação'], 500);
        }
    }

    /**
     * Update the specified grade evaluation moment record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $evaluation_moment_id, $student_id)
    {
        try {
            // Validate function arguments
            $validator = Validator::make(
                [
                    'evaluation_moment_id' => $evaluation_moment_id,
                    'student_id' => $student_id,
                ],
                [
                    'evaluation_moment_id' => 'required|integer|min:1',
                    'student_id' => 'required|integer|min:1',
                ]
            );

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Check if the grade evaluation moment exists
            $gradeEvaluationMoment = GradeEvaluationMoment::where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->first();

            if (!$gradeEvaluationMoment) {
                return response()->json(['message' => 'Nota do momento de avaliação não encontrada'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'evaluation_moment_grade_value' => 'required|numeric|min:0|max:20',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Update the grade evaluation moment with the validated data
            $gradeEvaluationMoment->update([
                'evaluation_moment_grade_value' => $request->evaluation_moment_grade_value
            ]);

            return response()->json([
                'message' => 'Nota do momento de avaliação atualizada com sucesso', 
                'gradeEvaluationMoment' => $gradeEvaluationMoment
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o momento de avaliação de nota: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao atualizar o momento de avaliação de nota', 
            ], 500);
        }
    }

    /**
     * Remove the specified grade evaluation moment record.
     *
     * @param  int  $evaluation_moment_id
     * @param  int  $student_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($evaluation_moment_id, $student_id)
    {
        try {
            $gradeEvaluationMoment = GradeEvaluationMoment::where('evaluation_moment_id', $evaluation_moment_id)
                ->where('student_id', $student_id)
                ->firstOrFail();
            $gradeEvaluationMoment->delete();

            return response()->json(['message' => 'Nota do momento de avaliação apagada com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Nota do momento de avaliação não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Nota do momento de avaliação não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar a nota do momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar a nota do momento de avaliação'], 500);
        }
    }
}
