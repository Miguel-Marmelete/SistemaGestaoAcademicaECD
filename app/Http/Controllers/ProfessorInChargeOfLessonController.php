<?php

namespace App\Http\Controllers;

use App\Models\ProfessorInChargeOfLesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfessorInChargeOfLessonController extends Controller
{
    public function index()
    {
        try {
            $assignments = ProfessorInChargeOfLesson::all();
            return response()->json(['message' => 'Professores encarregues de aula encontrados com sucesso', 'assignments' => $assignments], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao recuperar professores encarregues de aula: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao recuperar professores encarregues de aula'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'professor_id' => 'required|exists:professors,professor_id',
                'lesson_id' => 'required|exists:lessons,lesson_id',
            ]);
            

            $assignment = ProfessorInChargeOfLesson::create($validatedData);
            return response()->json(['message' => 'Professor encarregue de aula criado com sucesso', 'assignment' => $assignment], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar o professor encarregue de aula: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar o professor encarregue de aula'], 500);
        }
    }

    public function show($professor_id, $lesson_id)
    {
        try {
            $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
                ->where('lesson_id', $lesson_id)
                ->firstOrFail();
            return response()->json(['message' => 'Professor encarregue de aula encontrado com sucesso', 'assignment' => $assignment], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao encontrar o professor encarregue de aula: ' . $e->getMessage());
            return response()->json(['message' => 'Professor encarregue de aula não encontrado'], 404);
        }
    }

    public function update(Request $request, $professor_id, $lesson_id)
{
        try {
            // Validate the incoming data
            $validatedData = $request->validate([
                'professor_id' => 'required|exists:professors,professor_id',
            'lesson_id' => 'required|exists:lessons,lesson_id',
        ]);

        // Check if the assignment exists
        $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
            ->where('lesson_id', $lesson_id)
            ->first();

        if (!$assignment) {
            return response()->json(['message' => 'Professor encarregue de aula não encontrado'], 404);
        }

        // Update the assignment
        $assignment->update($validatedData);
            return response()->json(['message' => 'Professor encarregue de aula atualizado com sucesso', 'assignment' => $assignment], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o professor encarregue de aula: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar o professor encarregue de aula'], 500);
        }
}


    public function destroy($professor_id, $lesson_id)
    {
        try {
            $assignment = ProfessorInChargeOfLesson::where('professor_id', $professor_id)
                ->where('lesson_id', $lesson_id)
                ->firstOrFail();

            $assignment->delete();
            return response()->json(['message' => 'Professor encarregue de aula apagado com sucesso'], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar o professor encarregue de aula: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar o professor encarregue de aula'], 500);
        }
    }
}
