<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProfessorAdminToken;
use Illuminate\Support\Facades\Log;

class ProfessorAdminTokenController extends Controller
{
    
    /**
     * Store a new token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token' => 'required|string|max:255',
                'professor_id' => 'required|exists:professors,professor_id',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 422);
            }

            $token = ProfessorAdminToken::create($validator->validated());

            return response()->json(['message' => 'Token criado com sucesso', 'token' => $token], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar o token: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar o token'], 500);
        }
    }



    /**
     * Remove the specified token.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $token = ProfessorAdminToken::findOrFail($id);
            $token->delete();

            return response()->json(['message' => 'Token apagado com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Token não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Token não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar o token: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar o token'], 500);
        }
    }
}
