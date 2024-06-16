<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        try {

            $datos = DB::select('Select * from  Vusers');
            return response()->json($datos);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de usuarios' . $e->getMessage()], 500);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de usuarios' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $data = $request->validated();
            $data['password'] = bcrypt($data['password']);
            DB::beginTransaction();
            $user = User::create($data);
            DB::commit();
            return response()->json(['message' => 'Usuario Guardado Exitosamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo almacenar el usuario: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo almacenar el usuario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $data = $request->validated();

            // Obtener datos del usuario que hace la actualizacion
            $authUser = auth()->user(); 
            
            // Determinar si se quiere modificar al usuario root
            if($user->id == "1"){
                //Solo el usuario root puede modificarse a si mismo
                if($authUser->id != 1){
                    return response()->json(['error' => 'No estas autorizado para modificar a este usuario'], 403);
                }
            }

            // If password is present in the data and not null, hash it
            if (isset($data['password']) && !is_null($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Build the SQL query
            $sql = "UPDATE users SET ";
            $bindings = [];

            foreach ($data as $key => $value) {
                if ($key !== 'id') {
                    $sql .= "$key = ?, ";
                    $bindings[] = $value;
                }
            }

            $sql = rtrim($sql, ", ");
            $sql .= " WHERE id = ?";
            $bindings[] = $user->id;
            // Execute the SQL query
            DB::beginTransaction();
            DB::update($sql, $bindings);
            // Commit a la base de datos
            DB::commit();
            return response()->json(['message' => 'Usuario Actualizado Exitosamente'], 201);
        } catch (\Throwable $th) {
            DB::rollback();
            return response()->json(['error' => 'An unexpected error occurred: ' . $th->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Ocurrio una exception  al actualizar' . $e->getMessage()], 500);
        }
    }



    public function destroy($id)
    {
        try {
 
            if($id == "1"){ 
                    return response()->json(['error' => 'No se puede eliminar al usuario root'], 403);
            } 

            $user = DB::delete('DELETE FROM users WHERE id = ?', [$id]);

            if ($user == 0) {
                // If no tax record is found, return a 404 response
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            return response()->json(["message" => "Usuario Eliminado"], 200);
        } catch (\Throwable $e) {
            // If an error occurs, return an error response with the error message
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
