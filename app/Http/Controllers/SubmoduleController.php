<?php


namespace App\Http\Controllers;

use App\Models\Submodule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubmoduleController extends Controller
{
    /**
     * Display a listing of the submodules.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $submodules = Submodule::with('module')->get();
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
}
