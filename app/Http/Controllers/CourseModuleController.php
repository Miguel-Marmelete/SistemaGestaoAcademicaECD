<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseModule;
use Illuminate\Support\Facades\Validator;

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
            return response()->json(['error' => 'An error occurred while retrieving course-module relationships', 'details' => $e->getMessage()], 500);
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
        $validator = Validator::make($request->all(), [
            'module_id' => 'required|exists:modules,module_id',
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $courseModule = CourseModule::create($validator->validated());

            return response()->json(['message' => 'Course-Module relationship created successfully', 'courseModule' => $courseModule], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while creating the course-module relationship', 'details' => $e->getMessage()], 500);
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
            return response()->json(['error' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while retrieving the course-module relationship', 'details' => $e->getMessage()], 500);
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $courseModule = CourseModule::where('module_id', $module_id)
                ->where('course_id', $course_id)
                ->firstOrFail();

            $courseModule->update($validator->validated());

            return response()->json(['message' => 'Course-Module relationship updated successfully', 'courseModule' => $courseModule], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while updating the course-module relationship', 'details' => $e->getMessage()], 500);
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
            return response()->json(['error' => 'Course-Module relationship not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while deleting the course-module relationship', 'details' => $e->getMessage()], 500);
        }
    }
}