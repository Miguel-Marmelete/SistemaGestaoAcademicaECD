<?php

namespace App\Http\Controllers;

use App\Models\ProfessorInChargeOfModule;
use App\Models\Module;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; 
use App\Models\Submodule;
use App\Models\CourseModule;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ProfessorInChargeOfModuleController extends Controller
{
    /**
     * Display a listing of the professors in charge of modules.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $professorsInCharge = ProfessorInChargeOfModule::with(['professor', 'module', 'course'])->get();
            return response()->json(['professorsInCharge' => $professorsInCharge], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao obter professores encarregues de módulos: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter professores encarregues de módulos'], 500);
        }
    }


    /**
 * Get professors and modules for a given course.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\JsonResponse
 */
public function getProfessorsInChargeOfModulesByCourse(Request $request)
{
    try {
        // Validate the request to ensure course_id exists
        $validator = Validator::make($request->query(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 422);
        }

        $course_id = $request->query('course_id');

        // Retrieve the professors and their associated modules for the course
        $professorsAndModules = ProfessorInChargeOfModule::with(['professor', 'module'])
            ->where('course_id', $course_id)
            ->get();

      

        return response()->json(['professorsAndModules' => $professorsAndModules], 200);
    } catch (\Exception $e) {
        Log::error('Erro ao obter professores e módulos: ' . $e->getMessage());
        return response()->json([
            'message' => 'Erro ao obter professores encarregues de módulos',
        ], 500);
    }
}


public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'professor_id' => 'required|exists:professors,professor_id',
        'module_id' => 'required|exists:modules,module_id',
        'course_id' => 'required|exists:courses,course_id',
    ]);
    Log::info('Request data: ', $request->all());
    if ($validator->fails()) {
        Log::error('Validação falhou: ' . $validator->errors());
        return response()->json(['message' => 'Dados inválidos'], 422);
    }

    try {
        // Check if the entry already exists
        $professorInCharge = ProfessorInChargeOfModule::where('module_id', $request->module_id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($professorInCharge) {
            // Delete the existing entry
            Log::info('Entrada existente encontrada e será apagada: ', $professorInCharge->toArray());
            $professorInCharge->delete();
        }

        // Create a new entry
        $professorInCharge = ProfessorInChargeOfModule::create([
            'module_id' => (int) $request->module_id,
            'course_id' => (int) $request->course_id,
            'professor_id' => (int) $request->professor_id,
        ]);

        return response()->json(['message' => 'Professor encarregue de módulo atualizado com sucesso', 'professorInCharge' => $professorInCharge], 200);
    } catch (\Exception $e) {
        Log::error('Erro ao atualizar o professor encarregue de módulo: ' . $e->getMessage());
        return response()->json(['message' => 'Erro ao atualizar o professor encarregue de módulo'], 500);
    }
}


    /**
     * Display the specified professor in charge of module record.
     *
     * @param  int  $professor_id
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($professor_id, $module_id, $course_id)
    {
        try {
            $professorInCharge = ProfessorInChargeOfModule::with(['professor', 'module', 'course'])
                ->where('professor_id', $professor_id)
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            return response()->json(['professorInCharge' => $professorInCharge], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Professor encarregue de módulo não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Professor encarregue de módulo não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter o professor encarregue de módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter o professor encarregue de módulo'], 500);
        }
    }

    /**
     * Update the specified professor in charge of module record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $professor_id
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $professor_id, $module_id, $course_id)
    {
        try {
            // Check if the record exists
            $professorInCharge = ProfessorInChargeOfModule::where('professor_id', $professor_id)
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->first();

            if (!$professorInCharge) {
                return response()->json(['message' => 'Professor encarregue de módulo não encontrado'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'professor_id' => 'sometimes|exists:professors,professor_id',
                'module_id' => 'sometimes|exists:modules,module_id',
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            // Update the record with the validated data
            $professorInCharge->update($validator->validated());

            return response()->json(['message' => 'Professor encarregue de módulo atualizado com sucesso', 'professorInCharge' => $professorInCharge], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o professor encarregue de módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar o professor encarregue de módulo'], 500);
        }
    }

    /**
     * Remove the specified professor in charge of module record.
     *
     * @param  int  $professor_id
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($professor_id, $module_id, $course_id)
    {
        try {
            $assignment = ProfessorInChargeOfModule::where('professor_id', $professor_id)
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            $assignment->delete();
            return response()->json(['message' => 'Professor encarregue de módulo apagado com sucesso'], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar o professor encarregue de módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar o professor encarregue de módulo'], 500);
        }
    }
    
    public function getSubmodulesOfProfessor(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);
    
            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }
    
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            // If the professor is not a coordinator, filter by their assigned modules
            $moduleIds = ProfessorInChargeOfModule::where('professor_id', $professor->professor_id)
                ->where('course_id', $request->query('course_id'))
                ->pluck('module_id');
            if($professor->is_coordinator == 1){
                $moduleIds = CourseModule::where('course_id', $request->query('course_id'))
                ->pluck('module_id');            }
            $submodules = Submodule::whereIn('module_id', $moduleIds)->get();
            return response()->json(['submodules' => $submodules], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao obter submódulos: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter submódulos'], 500);
        }
    }
    
   
    
    public function getCoursesAndModulesOfProfessor()
    {
        try {
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            // Retrieve the entries based on the professor's role
            if ($professor->is_coordinator == 1) {
                // If the professor is a coordinator, return all courses and modules
                $courses = Course::all();
                $modules = Module::all();
                return response()->json([
                    'courses' => $courses,
                    'modules' => $modules
                ], 200);
            } else {
                // If the professor is not a coordinator, filter by their assigned modules
                $entries = ProfessorInChargeOfModule::with(['course', 'module'])
                    ->where('professor_id', $professor->professor_id)
                    ->get();
            }
    
            // Separate courses and modules into two arrays
            $courses = [];
            $modules = [];
    
            foreach ($entries as $entry) {
                // Extract the course and module if they exist
                if ($entry->course && !in_array($entry->course, $courses)) {
                    $courses[] = $entry->course;
                }
                if ($entry->module && !in_array($entry->module, $modules)) {
                    $modules[] = $entry->module;
                }
            }
    
            return response()->json([
                'courses' => $courses,
                'modules' => $modules
            ], 200);
    
        } catch (\Exception $e) {
            Log::error('Erro ao obter cursos e módulos: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter cursos e módulos'], 500);
        }
    }
    
    function getModulesOfCourseOfProfessor()
    {
        try {
        // Obtém o professor autenticado
        $professor = JWTAuth::user();
        
        if (!$professor) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        // Obtém os cursos do professor, com detalhes completos
        $courses = Course::whereIn('course_id', function($query) use ($professor) {
            $query->select('course_id')
                  ->from('professor_in_charge_of_module')
                  ->where('professor_id', $professor->professor_id);
        })->get();
        if($professor->is_coordinator == 1){
            $courses = Course::all();
        }
    
        // Para cada curso, obtenha os módulos associados
        $courseModules = [];
        foreach ($courses as $course) {
            $modules = ProfessorInChargeOfModule::where('course_id', $course->course_id)
            ->where('professor_id', $professor->professor_id)
            ->pluck('module_id');
            if($professor->is_coordinator == 1){
                $modules = CourseModule::where('course_id', $course->course_id)
                ->pluck('module_id');
            }
            // Obtenha detalhes completos dos módulos
            $modulesDetails = Module::whereIn('module_id', $modules)->get();
    
            // Adiciona o curso e seus módulos ao array de resposta
            $courseModules[] = [
                'course' => $course,  // Detalhes completos do curso
                'modules' => $modulesDetails  // Detalhes completos dos módulos
            ];
        }
        Log::info('Cursos e módulos: ', $courseModules);
        // Retorna a resposta JSON com os cursos e seus módulos
        return response()->json(['courseModules' => $courseModules], 200);
    } catch (\Exception $e) {
        Log::error('Erro ao obter cursos e módulos: ' . $e->getMessage());
        return response()->json([
            'message' => 'Erro ao obter cursos e módulos'], 500);
    }
    }

    
}
