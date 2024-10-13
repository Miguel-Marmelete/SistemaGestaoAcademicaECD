<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Module;
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
            Log::error('Erro ao obter os módulos: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter os módulos'], 500);
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
            return response()->json(['message' => 'Módulo não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter o módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter o módulo'], 500);
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
            Log::error('Validação falhou: ' . $validator->errors());
            return response()->json(['message' => 'Dados inválidos'], 400);
        }

        // Create the Module
        $module = Module::create($validator->validated());
        
        return response()->json(['message' => 'Módulo criado com sucesso', 'module' => $module], 201);
    } catch (\Exception $e) {
        Log::error('Erro ao criar o módulo: ' . $e->getMessage());
        return response()->json(['message' => 'Erro ao criar o módulo'], 500);
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
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 400);
            }

            // Update the module with the provided data
            $module->update($request->only(['name', 'contact_hours', 'abbreviation', 'ects']));

            return response()->json(['message' => 'Módulo atualizado com sucesso', 'module' => $module], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Módulo não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Módulo não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar o módulo'], 500);
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

            return response()->json(['message' => 'Módulo apagado com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Módulo não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar o módulo: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar o módulo'], 500);
        }
    }
}
