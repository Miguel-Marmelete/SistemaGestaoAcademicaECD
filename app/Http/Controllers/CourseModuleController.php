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
            return response()->json(['message' => 'An error occurred while retrieving course-module relationships', 'details' => $e->getMessage()], 500);
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
            
            return response()->json(['errors' => $validator->errors()], 422);
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
            Log::error('An error occurred while returning modules by course: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while retrieving modules for the course',
                'details' => $e->getMessage()
            ], 500);
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
            Log::error('Validation failed: ' . $validator->errors());
            return response()->json(['message' => $validator->errors()], 422);
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

            return response()->json(['message' => 'Modules associated with the course successfully.'], 201);
        } catch (\Exception $e) {
            Log::error('An error occurred while associating modules with the course: ' . $e->getMessage());
            return response()->json([
                'message' => 'An error occurred while associating modules with the course',
                'details' => $e->getMessage()
            ], 500);
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
            Log::error('Course-Module relationship not found: ' . $e->getMessage());
            return response()->json(['message' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while retrieving the course-module relationship: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the course-module relationship', 'details' => $e->getMessage()], 500);
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
            Log::error('Validation failed: ' . $validator->errors());
            return response()->json(['message' => $validator->errors()], 422);
        }

        try {
            $courseModule = CourseModule::where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            $courseModule->update($validator->validated());

            return response()->json(['message' => 'Course-Module relationship updated successfully', 'courseModule' => $courseModule], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while updating the course-module relationship: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the course-module relationship', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified course-module relationship.
     *
     * @param  int  $module_id
     * @param  int  $course_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($module_id, $course_id)
    {
        try {
            $courseModule = CourseModule::where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();
            $courseModule->delete();

            return response()->json(['message' => 'Course-Module relationship deleted successfully'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Course-Module relationship not found: ' . $e->getMessage());
            return response()->json(['message' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            Log::error('An error occurred while deleting the course-module relationship: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while deleting the course-module relationship', 'details' => $e->getMessage()], 500);
        }
    }
}