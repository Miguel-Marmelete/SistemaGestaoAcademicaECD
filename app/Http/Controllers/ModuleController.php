<?php

namespace App\Http\Controllers;

use App\Models\CourseModule;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\ProfessorInChargeOfModule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class ModuleController extends Controller
{
    /**
     * Display a listing of all modules.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Retrieve all modules
            $modules = Module::all();
            return response()->json(['modules' => $modules], 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving modules: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving modules', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified module.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Find the module by ID
            $module = Module::findOrFail($id);
            return response()->json(['module' => $module], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Module not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving the module: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the module', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a new module.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
{
    try {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact_hours' => 'required|integer',
            'abbreviation' => 'required|string|max:10',
            'ects' => 'required|integer',
            
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed: ' . $validator->errors());
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Create the Module
        $module = Module::create($validator->validated());
        
        return response()->json(['message' => 'Module created successfully', 'module' => $module], 201);
    } catch (\Exception $e) {
        Log::error('An error occurred while creating the module: ' . $e->getMessage());
        return response()->json(['message' => 'An error occurred while creating the module', 'details' => $e->getMessage()], 500);
    }
}

    /**
     * Update the specified module.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the module by ID
            $module = Module::findOrFail($id);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'contact_hours' => 'sometimes|integer',
                'abbreviation' => 'sometimes|string|max:10',
                'ects' => 'sometimes|integer',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            }

            // Update the module with the provided data
            $module->update($request->only(['name', 'contact_hours', 'abbreviation', 'ects']));

            return response()->json(['message' => 'Module updated successfully', 'module' => $module], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Module not found: ' . $e->getMessage());
            return response()->json(['message' => 'Module not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while updating the module: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the module', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified module.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            // Find the module by ID
            $module = Module::findOrFail($id);
            $module->delete();

            return response()->json(['message' => 'Module deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Module not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while deleting the module: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the module', 'details' => $e->getMessage()], 500);
        }
    }
}
