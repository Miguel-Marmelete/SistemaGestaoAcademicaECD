<?php

namespace App\Http\Controllers;

use App\Models\EvaluationMoment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class EvaluationMomentController extends Controller
{
    /**
     * Display a listing of the evaluation moments.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $evaluationMoments = EvaluationMoment::with(['course', 'professor', 'module', 'submodule'])->get();
            return response()->json(['evaluationMoments' => $evaluationMoments], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocorreu um erro ao recuperar os momentos de avaliação'], 500);
        }
    }
    

    /**
     * Store a new evaluation moment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:Trabalho,Exame,Exame Recurso',
            'date' => 'required|date',
            'course_id' => 'required|exists:courses,course_id',
            'professor_id' => 'required|exists:professors,professor_id',
            'module_id' => 'required|exists:modules,module_id',
            'submodule_id' => 'nullable|exists:submodules,submodule_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        try {
            $evaluationMoment = EvaluationMoment::create($validator->validated());

            return response()->json(['message' => 'Momento de avaliação criado com sucesso', 'evaluationMoment' => $evaluationMoment], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar o momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao criar o momento de avaliação'], 500);
        }
    }

    /**
     * Display the specified evaluation moment.
     *
     * @param  int  $evaluation_moment_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $evaluationMoment = EvaluationMoment::with(['course', 'professor', 'module', 'submodule'])->findOrFail($id);

            return response()->json(['evaluationMoment' => $evaluationMoment], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Momento de avaliação não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Momento de avaliação não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar o momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao recuperar o momento de avaliação'], 500);
        }
    }

    /**
     * Update the specified evaluation moment.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $evaluation_moment_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // First, check if the evaluation moment exists
            $evaluationMoment = EvaluationMoment::find($id);

            if (!$evaluationMoment) {
                return response()->json(['message' => 'Momento de avaliação não encontrado'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'type' => 'sometimes|string|in:Trabalho,Exame,Exame Recurso',
                'course_id' => 'sometimes|exists:courses,course_id',
                'professor_id' => 'sometimes|exists:professors,professor_id',
                'module_id' => 'sometimes|exists:modules,module_id',
                'submodule_id' => 'sometimes|nullable|exists:submodules,submodule_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Update the evaluation moment with the validated data
            $evaluationMoment->update($validator->validated());

            return response()->json(['message' => 'Momento de avaliação atualizado com sucesso', 'momento de avaliação' => $momento_de_avaliação], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao atualizar o momento de avaliação'], 500);
        }
    }

    /**
     * Remove the specified evaluation moment.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $evaluationMoment = EvaluationMoment::findOrFail($id);
            $evaluationMoment->delete();

            return response()->json(['message' => 'Momento de avaliação apagado com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Momento de avaliação não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Momento de avaliação não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao deletar o momento de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao apagar o momento de avaliação'], 500);
        }
    }

    /**
     * Get filtered evaluation moments based on course, module, and submodule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfessorEvaluationMoments(Request $request)
    {
        try {

            // Validate the request
            $validator = Validator::make($request->all(), [
                'course_id' => 'nullable|exists:courses,course_id',
                'module_id' => 'nullable|exists:modules,module_id',
                'submodule_id' => 'nullable|exists:submodules,submodule_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Get the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['message' => 'Não autorizado'], 401);
            }

            // Start building the query
            $query = EvaluationMoment::with(['course', 'module', 'submodule']);
            // Apply filters
            if ($request->has('course_id')) {
                $query->where('course_id', $request->course_id);
            }
            if ($request->has('module_id')) {
                $query->where('module_id', $request->module_id);
            }
            if ($request->has('submodule_id')) {
                $query->where('submodule_id', $request->submodule_id);
            }

            // Check if the professor is a coordinator
            if ($professor->is_coordinator != 1) {
                $query->where('professor_id', $professor->professor_id);
            }

            // Execute the query
            $evaluationMoments = $query->get();
            return response()->json(['evaluationMoments' => $evaluationMoments], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar momentos de avaliação: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao obter os momentos de avaliação'], 500);
        }
    }
}
