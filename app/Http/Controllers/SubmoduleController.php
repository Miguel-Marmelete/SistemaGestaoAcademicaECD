<?php


namespace App\Http\Controllers;

use App\Models\Submodule;
use App\Models\ProfessorInChargeOfModule;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;
use App\Models\CourseModule;
use Tymon\JWTAuth\Facades\JWTAuth;

class SubmoduleController extends Controller
{
    /**
     * Display a listing of the submodules.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubModules(Request $request)
    {
        try {
            // Retrieve the authenticated professor
            $professor = JWTAuth::user();
            $moduleId = $request->query('module_id');
            Log::info('moduleId: ' . $moduleId);
    
            // Define a base query for submodules
            $submodulesQuery = Submodule::with('module');
    
            if ($professor->is_coordinator == 1) {
                // If the professor is a coordinator, optionally filter by module_id
                if ($moduleId) {
                    $submodulesQuery->where('module_id', $moduleId);
                }
            } else {
                // If the professor is not a coordinator, retrieve only their submodules
                $moduleIds = ProfessorInChargeOfModule::where('professor_id', $professor->professor_id)
                    ->pluck('module_id');
                $submodulesQuery->whereIn('module_id', $moduleIds);
            }
    
            // Execute the query
            $submodules = $submodulesQuery->get();
    
            return response()->json(['submodules' => $submodules], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving submodules', 'details' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Store a new submodule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:255',
            'contact_hours' => 'required|integer',
            'module_id' => 'required|exists:modules,module_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $submodule = Submodule::create($validator->validated());

            return response()->json(['message' => 'Submodule created successfully', 'submodule' => $submodule], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the submodule', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified submodule.
     *
     * @param  int  $submodule_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $submodule = Submodule::with('module')
                ->where('submodule_id', $id)
                ->firstOrFail();

            return response()->json(['submodule' => $submodule], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Submodule not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the submodule', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified submodule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $submodule_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
{
    try {
        // Check if the submodule exists
        $submodule = Submodule::where('submodule_id', $id)->firstOrFail();

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'abbreviation' => 'sometimes|string|max:255',
            'contact_hours' => 'sometimes|integer',
            'module_id' => 'sometimes|exists:modules,module_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update the submodule with validated data
        $submodule->update($validator->validated());

        return response()->json(['message' => 'Submodule updated successfully', 'submodule' => $submodule], 200);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['error' => 'Submodule not found'], 404);
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while updating the submodule', 'details' => $e->getMessage()], 500);
    }
}

    /**
     * Remove the specified submodule.
     *
     * @param  int  $submodule_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $submodule = Submodule::where('submodule_id', $id)
                ->firstOrFail();
            $submodule->delete();

            return response()->json(['message' => 'Submodule deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Submodule not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the submodule', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Get submodules by course.
     *
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSubmodulesByCourse($course_id)
    {
        // Validate the course_id
        $course = Course::find($course_id);
        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        try {
            // Fetch the modules associated with the course
            $moduleIds = CourseModule::where('course_id', $course_id)->pluck('module_id');

            // Fetch the submodules associated with the modules
            $submodules = Submodule::whereIn('module_id', $moduleIds)->get();

            return response()->json(['submodules' => $submodules], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving submodules', 'details' => $e->getMessage()], 500);
        }
    }
}
