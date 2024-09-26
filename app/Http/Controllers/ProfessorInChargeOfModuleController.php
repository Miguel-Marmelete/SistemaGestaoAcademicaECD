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
            return response()->json(['error' => 'An error occurred while retrieving professors in charge of modules', 'details' => $e->getMessage()], 500);
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course_id = $request->query('course_id');

        // Retrieve the professors and their associated modules for the course
        $professorsAndModules = ProfessorInChargeOfModule::with(['professor', 'module'])
            ->where('course_id', $course_id)
            ->get();

        // If no records are found
        /*
        if ($professorsAndModules->isEmpty()) {
            return response()->json(['message' => 'No professors or modules found for this course'], 404);
        }*/

        return response()->json(['professorsAndModules' => $professorsAndModules], 200);
    } catch (\Exception $e) {
        Log::error('Error retrieving professors and modules: ' . $e->getMessage());
        return response()->json([
            'error' => 'An error occurred while retrieving professors and modules',
            'details' => $e->getMessage()
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
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        // Check if the entry already exists
        $professorInCharge = ProfessorInChargeOfModule::where('module_id', $request->module_id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($professorInCharge) {
            // Delete the existing entry
            Log::info('Existing entry found and will be deleted: ', $professorInCharge->toArray());
            $professorInCharge->delete();
        }

        // Create a new entry
        $professorInCharge = ProfessorInChargeOfModule::create([
            'module_id' => (int) $request->module_id,
            'course_id' => (int) $request->course_id,
            'professor_id' => (int) $request->professor_id,
        ]);
        Log::info('New entry created: ', $professorInCharge->toArray());

        return response()->json(['message' => 'Professor in charge of module updated successfully', 'professorInCharge' => $professorInCharge], 200);
    } catch (\Exception $e) {
        Log::error('Error updating professor in charge of module: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while updating the professor in charge of module record', 'details' => $e->getMessage()], 500);
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
            $assignment = ProfessorInChargeOfModule::where('professor_id', $professor_id)
                ->where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            $assignment->delete();
            return response()->json(['message' => 'Assignment deleted successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting assignment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete record', 'error' => $e->getMessage()], 500);
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
           
                $moduleIds = ProfessorInChargeOfModule::where('professor_id', $professor->professor_id)
                    ->pluck('module_id');
    
                // Filter by both module_id (from professor) and course_id (if provided)
                if ($request->has('course_id')) {
                    $courseModuleIds = ProfessorInChargeOfModule::where('course_id', $request->query('course_id'))
                        ->whereIn('module_id', $moduleIds) // Ensure both conditions are met
                        ->pluck('module_id');
                    $query->whereIn('module_id', $courseModuleIds);
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
    
   
    
    public function getCoursesAndModulesOfProfessor()
    {
        try {
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            if (!$professor) {
                return response()->json(['error' => 'Unauthorized'], 401);
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
            Log::error('Error retrieving courses and modules: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while retrieving courses and modules',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    

    
    

    
}
