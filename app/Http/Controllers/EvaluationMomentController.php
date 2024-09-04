<?php

namespace App\Http\Controllers;

use App\Models\EvaluationMoment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
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
            return response()->json(['error' => 'An error occurred while retrieving evaluation moments', 'details' => $e->getMessage()], 500);
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $evaluationMoment = EvaluationMoment::create($validator->validated());

            return response()->json(['message' => 'Evaluation moment created successfully', 'evaluationMoment' => $evaluationMoment], 201);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return response()->json(['error' => 'An error occurred while creating the evaluation moment', 'details' => $e->getMessage()], 500);
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
            return response()->json(['error' => 'Evaluation moment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the evaluation moment', 'details' => $e->getMessage()], 500);
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
                return response()->json(['error' => 'Evaluation moment not found'], 404);
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
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update the evaluation moment with the validated data
            $evaluationMoment->update($validator->validated());

            return response()->json(['message' => 'Evaluation moment updated successfully', 'evaluationMoment' => $evaluationMoment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the evaluation moment', 'details' => $e->getMessage()], 500);
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

            return response()->json(['message' => 'Evaluation moment deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Evaluation moment not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the evaluation moment', 'details' => $e->getMessage()], 500);
        }
    }
}
