<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;

class CourseController extends Controller
{
     // Método para listar todos os cursos
     public function index()
     {
        try {
            $courses = Course::all();
            return response()->json(['courses' => $courses], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro ao listar os cursos', 'message' => $e->getMessage()], 500);
        }
     }
 
     // Método para salvar um novo curso
     public function store(Request $request)
     {
        try {
            $validator = Validator::make($request->all(), [
                'abbreviation' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'date' => 'required|date',
                'schedule' => 'nullable|string|max:255',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['error' => 'Erro de validação', 'messages' => $validator->errors()], 400);
            }
 
         
             $course = Course::create($request->all());
             return response()->json(['message' => 'Curso criado com sucesso', 'course' => $course], 201);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Erro ao criar o curso', 'message' => $e->getMessage()], 500);
         }
     }
 
     // Método para mostrar um curso específico
     public function show($id)
     {
         try {
             $course = Course::findOrFail($id);
             return response()->json(['course' => $course], 200);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Erro ao encontrar o curso', 'message' => $e->getMessage()], 404);
         }
     }
 
     public function update(Request $request, $id)
{
    try {
        // Verifica se o curso existe
        $course = Course::findOrFail($id);
        
        // Valida apenas os campos que estão presentes na requisição
        $validator = Validator::make($request->all(), [
            'abbreviation' => 'sometimes|required|string|max:255',
            'name' => 'sometimes|string|max:255',
            'date' => 'sometimes|date_format:m/d/Y',
            'schedule' => 'sometimes|nullable|string|max:255',
        ]);

        // Se a validação falhar, retorna erros de validação
        if ($validator->fails()) {
            return response()->json(['error' => 'Erro de validação', 'messages' => $validator->errors()], 400);
        }

        // Converte a data se o campo "date" estiver presente na requisição
        if ($request->has('date')) {
            $request->merge([
                'date' => \Carbon\Carbon::createFromFormat('m/d/Y', $request->input('date'))->format('Y-m-d')
            ]);
        }

        // Atualiza apenas os campos que foram passados na requisição
        $course->update($request->only(['abbreviation', 'name', 'date', 'schedule']));

        return response()->json(['message' => 'Curso atualizado com sucesso', 'course' => $course], 200);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        // Tratamento específico para quando o curso não é encontrado
        return response()->json(['error' => 'Curso não encontrado'], 404);
    } catch (\Exception $e) {
        // Tratamento para outros tipos de exceções
        return response()->json(['error' => 'Erro ao atualizar o curso', 'message' => $e->getMessage()], 500);
    }
}


     
 
     // Método para apagar um curso
     public function destroy($id)
     {
         try {
             $course = Course::findOrFail($id);
             $course->delete();
             return response()->json(['message' => 'Curso apagado com sucesso'], 200);
         } catch (\Exception $e) {
             return response()->json(['error' => 'Erro ao apagar o curso', 'message' => $e->getMessage()], 500);
         }
     }
}
