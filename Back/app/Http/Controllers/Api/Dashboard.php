<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Dashboard extends Controller
{
 
    public function getDatos()
    {
        try {
            $ventas =  DB::select('SELECT * FROM VSalesAll');
            $VTopItems =  DB::select('SELECT * FROM VTopItems');
            $VTopClients = DB::select('SELECT * FROM VTopClientes');
            $VConRET =  DB::select('SELECT * FROM VConRET');  
            $VConIVA = DB::select('SELECT * FROM VConIVA');
            $VTopClients = DB::select('SELECT * FROM VTopClientes');

            return response()->json([ 'Ventas' => $ventas,  'TopItems' =>$VTopItems, 
                                    'TopClients'=>$VTopClients, 'ConRET'=>$VConRET, 'ConIVA'=>$VConIVA   ], 200);

        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudieron obtener los datos' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error en el sistema.No se pudieron obtener los datos' . $e->getMessage()], 500);
        }
    } 
}
