<?php

namespace App\Http\Controllers;

use App\Models\ProfessorInChargeOfModule;
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
            return response()->json(['error' => 'An error occurred while retrieving professors in charge of modules', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new professor in charge of module record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'professor_id' => 'required|exists:professors,professor_id',
            'module_id' => 'required|exists:modules,module_id',
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the entry already exists
        $exists = ProfessorInChargeOfModule::where('professor_id', $request->professor_id)
            ->where('module_id', $request->module_id)
            ->where('course_id', $request->course_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Professor already in charge of module'], 409);
        }

        try {
            $professorInCharge = ProfessorInChargeOfModule::create($validator->validated());

            return response()->json(['message' => 'Professor in charge of module created successfully', 'professorInCharge' => $professorInCharge], 201);
        } catch (\Exception $e) {
            Log::error('Error creating professor in charge of module: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while creating the professor in charge of module record', 'details' => $e->getMessage()], 500);
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
            return response()->json(['error' => 'Professor in charge of module record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the professor in charge of module record', 'details' => $e->getMessage()], 500);
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
                return response()->json(['error' => 'Professor in charge of module record not found'], 404);
            }

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'professor_id' => 'sometimes|exists:professors,professor_id',
                'module_id' => 'sometimes|exists:modules,module_id',
                'course_id' => 'sometimes|exists:courses,course_id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Update the record with the validated data
            $professorInCharge->update($validator->validated());

            return response()->json(['message' => 'Professor in charge of module record updated successfully', 'professorInCharge' => $professorInCharge], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the professor in charge of module record', 'details' => $e->getMessage()], 500);
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
            $professorInCharge = ProfessorInChargeOfModule::where('professor_id', $professor_id)
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();
            $professorInCharge->delete();

            return response()->json(['message' => 'Professor in charge of module record deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Professor in charge of module record not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the professor in charge of module record', 'details' => $e->getMessage()], 500);
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
                return response()->json(['errors' => $validator->errors()], 422);
            }
    
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
    
            // Initialize the query for submodules
            $query = Submodule::query();
    
            // If the professor is not a coordinator, filter by their assigned modules
            if ($professor->is_coordinator == 0) {
                $moduleIds = ProfessorInChargeOfModule::where('professor_id', $professor->professor_id)
                    ->pluck('module_id');
    
                // Filter by both module_id (from professor) and course_id (if provided)
                if ($request->has('course_id')) {
                    $courseModuleIds = CourseModule::where('course_id', $request->query('course_id'))
                        ->whereIn('module_id', $moduleIds) // Ensure both conditions are met
                        ->pluck('module_id');
                    $query->whereIn('module_id', $courseModuleIds);
                } else {
                    $query->whereIn('module_id', $moduleIds);
                }
            }
    
        
    
            // Eager load relationships
            $submodules = $query->with(['module'])->get();
    
            return response()->json(['submodules' => $submodules], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving submodules: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while retrieving submodules',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    
    

    
}
