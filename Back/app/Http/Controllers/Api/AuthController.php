<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use http\Env\Response;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

    use HttpResponses;

    public function login(LoginRequest $request)
    {
        try {
            //comprobacion de las credenciales 
            $request->validated($request->only(['email', 'password']));
            // Attempt to authenticate the user using the provided email and password
            if (!Auth::attempt($request->only(['email', 'password']))) {
                // If authentication fails, return an error response with status code 401
                return $this->error('', 'Contraseña o email incorrecto', 401);
            }

            // Retrieve the authenticated user from the database based on the email
            $user = User::where('email', $request->email)->first();
            // Check if the user exists
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no encontrado',
                ], 404);
            }

            $user   = User::where('email', $request->email)->firstOrFail();
            $token  = $user->createToken('TOKEN AUTH')->plainTextToken;
            return response()->json([
                'message'       => 'Login success',
                'user' => $user,
                'token'  => $token,
                'type' => $user->type, // Include the user type here
                'token_type'    => 'Bearer',
                'status' => 200
            ]);
        } catch (\Exception $e) {
            // Return an error response
            return $this->error('Error en el servidor:', $e->getMessage(), 500);
        }
    }


    //cada clase usa un request para trabajar
    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('desloggeao', 200);
    }
   
    public function register(Request $request)
    {
         
        try{
            // Create a new user
            $user = new User();
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->password = Hash::make($request->input('password'));
            $user->type = $request->input('type');
            $user->save();
    
            // Generate token for the newly registered user
            $token = $user->createToken('auth_token')->plainTextToken;
            
           // $user   = User::where('email', $request->email)->firstOrFail();
          //  $token  = $user->createToken('TOKEN AUTH')->plainTextToken; 
    
            // Return success response with user data and token
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'status' => 201
            ], 201);
        } catch (\Exception $e) {
            // Return an error response
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}
