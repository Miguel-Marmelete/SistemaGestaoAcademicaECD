<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Professor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\ProfessorAdminToken;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfessorController extends Controller
{
    /**
     * Display a listing of all professors.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // Retrieve all professors
            $professors = Professor::all();
            return response()->json(['professors' => $professors], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao obter os professores: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter os professores'], 500);
        }
    }

    /**
     * Display the specified professor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);
            return response()->json(['professor' => $professor], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Professor não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Professor não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao obter o professor: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao obter o professor'], 500);
        }
    }

    /**
     * Store a new professor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addProfessor(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'cc' => 'nullable|integer',
                'cc_expire_date' => 'nullable|date',
                'mobile' => 'nullable|integer',
                'email' => 'required|string|email|max:255|unique:professors,email',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 400);
            }

            // Generate a random password
            $password = $this->generateRandomPassword();

            // Create the professor
            $professor = Professor::create([
                'name' => $request->name,
                'cc' => $request->cc,
                'cc_expire_date' => $request->cc_expire_date,
                'mobile' => $request->mobile,
                'email' => $request->email,
                'is_coordinator' => false,
                'password' => Hash::make($password),
            ]);

            // Send password to professor's email
            Mail::send('emails.professor_password', ['professor' => $professor, 'password' => $password], function ($message) use ($professor) {
                $message->from('SGAED@sgaed.pt', 'Sistema de Gestão Académica');
                $message->to($professor->email, $professor->name)
                ->subject('Senha de Acesso');
            });

            return response()->json([
                'message' => 'Professor criado com sucesso. Senha enviada para o email.'], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao criar o professor: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao criar o professor'], 500);
        }
    }

    /**
     * Update the specified professor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);

            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'cc' => 'sometimes|nullable|integer',
                'cc_expire_date' => 'sometimes|nullable|date',
                'mobile' => 'sometimes|nullable|integer',
                'email' => 'sometimes|string|email|max:255|unique:professors,email,' . $id . ',professor_id',
                'is_coordinator' => 'sometimes|boolean',
                'password' => 'sometimes|string|confirmed|min:8',
                'profile_picture' => 'sometimes|nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                Log::error('Validação falhou: ' . $validator->errors());
                return response()->json(['message' => 'Dados inválidos'], 400);
            }

            // Update the professor with the provided data
            $professor->update($request->only([
                'name',
                'cc',
                'cc_expire_date',
                'mobile',
                'email',
                'is_coordinator',
                'profile_picture'
            ]));

            // Update password if provided
            if ($request->has('password')) {
                $professor->update(['password' => Hash::make($request->password)]);
            }

            return response()->json(['message' => 'Professor atualizado com sucesso', 'professor' => $professor], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Professor não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Professor não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar o professor: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao atualizar o professor'], 500);
        }
    }

    /**
     * Remove the specified professor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            // Find the professor by ID
            $professor = Professor::findOrFail($id);
            $professor->delete();

            return response()->json(['message' => 'Professor apagado com sucesso'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Professor não encontrado: ' . $e->getMessage());
            return response()->json(['message' => 'Professor não encontrado'], 404);
        } catch (\Exception $e) {
            Log::error('Erro ao apagar o professor: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao apagar o professor'], 500);
        }
    }

    public function initiateAdminSetting()
    {
        try {
            // Find the professor by token
            $professor = JWTAuth::user();

            // Generate a random token
            $token = Str::random(60);

            // Create a professor admin token record
            ProfessorAdminToken::create([
                'professor_id' => $professor->professor_id,
                'token' => $token,
            ]);

            // Send confirmation email to the professor
            Mail::send('emails.confirm_admin', ['token' => $token], function($message) use ($professor) {
                $message->from('SGAED@sgaed.pt', 'Sistema de Gestão Académica');
                $message->to('20431@stu.ipbeja.pt');
                $message->subject('Confirmar Coordenador');
            });

            return response()->json(['message' => 'Configuração de coordenador iniciada, por favor verifique o seu email para confirmar'], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao iniciar a configuração de coordenador: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao iniciar a configuração de coordenador'], 500);
        }
    }

    public function confirmAdmin($token)
    {
        try {
            // Find the professor admin token by token
            $professorAdminToken = ProfessorAdminToken::where('token', $token)->first();

            // Return error if token is invalid
            if (!$professorAdminToken) {
                return response()->json(['message' => 'Token inválido'], 400);
            }

            // Find the professor by ID
            $professor = Professor::findOrFail($professorAdminToken->professor_id);

            // Set the professor as admin
            $professor->is_coordinator = true;
            $professor->save();

            // Delete the professor admin token entry
            $professorAdminToken->delete();

            return response()->json(['message' => 'Professor mudado para coordenador com sucesso']);
        } catch (\Exception $e) {
            Log::error('Erro ao confirmar o coordenador: ' . $e->getMessage());
            return response()->json(['message' => 'Erro ao confirmar o coordenador'], 500);
        }
    }

    private function generateRandomPassword()
    {
        $length = 12;
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*(),.?":{}|<>';
        $password = '';

        do {
            $password = '';
            for ($i = 0; $i < $length; $i++) {
                $password .= $characters[random_int(0, strlen($characters) - 1)];
            }
        } while (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password));

        return $password;
    }
}