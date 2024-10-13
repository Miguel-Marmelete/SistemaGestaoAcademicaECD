<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseModule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
class CourseModuleController extends Controller
{
    /**
     * Display a listing of the course-module relationships.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $courseModules = CourseModule::with(['module', 'course'])->get();
            return response()->json(['courseModules' => $courseModules], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocorreu um erro ao recuperar as relações curso-módulo'], 500);
        }
    }



/**
     * Get modules associated with a specific course.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getModulesByCourse(Request $request)
    {
        // Validate the incoming request data for course_id
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        try {
            // Retrieve course_id from the request query
            $course_id = $request->query('course_id');

            // Get the modules associated with the course
            $modules = CourseModule::with('module')
                ->where('course_id', $course_id)
                ->get()
                ->pluck('module'); // Only return the modules

            return response()->json(['modules' => $modules], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao obter módulos por curso: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter módulos para o curso'], 500);
        }
    }


    /**
     * Store a new course-module relationship.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
            'module_ids' => 'required|array',
            'module_ids.*' => 'exists:modules,module_id', // Validate each module_id in the array
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        // Retrieve the validated data
        $validatedData = $validator->validated();
        $course_id = $validatedData['course_id'];
        $module_ids = $validatedData['module_ids'];

        try {
            // Iterate over each module_id and create a new CourseModule association
            foreach ($module_ids as $module_id) {
                CourseModule::updateOrCreate(
                    ['course_id' => $course_id, 'module_id' => $module_id],
                    ['course_id' => $course_id, 'module_id' => $module_id]
                );
            }

            return response()->json(['message' => 'Módulos associados ao curso com sucesso.'], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao associar módulos ao curso: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao associar módulos ao curso'], 500);
        }
    }

    /**
     * Display the specified course-module relationship.
     *
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($module_id, $course_id)
    {
        try {
            $courseModule = CourseModule::with(['module', 'course'])
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            return response()->json(['courseModule' => $courseModule], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Relação Curso-Módulo não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Relação Curso-Módulo não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar a relação curso-módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao recuperar a relação curso-módulo'], 500);
        }
    }

    /**
     * Update the specified course-module relationship.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $module_id, $course_id)
    {
        $validator = Validator::make($request->all(), [
            'module_id' => 'sometimes|exists:modules,module_id',
            'course_id' => 'sometimes|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        try {
            $courseModule = CourseModule::where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            $courseModule->update($validator->validated());

            return response()->json(['message' => 'Relação Curso-Módulo atualizada com sucesso', 'courseModule' => $courseModule], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Relação Curso-Módulo não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Relação Curso-Módulo não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar a relação curso-módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao atualizar a relação curso-módulo'], 500);
        }
    }

    /**
     * Remove the specified course-module relationship.
     *
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteModuleFromCourse(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
            'module_id' => 'required|exists:modules,module_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        try {
            // Retrieve the validated data
            $validatedData = $validator->validated();
            $course_id = $validatedData['course_id'];
            $module_id = $validatedData['module_id'];

            // Find the course-module relationship
            $courseModule = CourseModule::where('course_id', $course_id)
                ->where('module_id', $module_id)
                ->firstOrFail();

            // Delete the relationship
            $courseModule->delete();

            return response()->json(['message' => 'Módulo removido do curso com sucesso.'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Relação Curso-Módulo não encontrada: ' . $e->getMessage());
            return response()->json(['message' => 'Relação Curso-Módulo não encontrada'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao deletar a relação curso-módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Ocorreu um erro ao deletar a relação curso-módulo'], 500);
        }
    }
}
