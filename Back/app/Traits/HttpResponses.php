<?php
namespace App\Traits;

trait HttpResponses{

    //200 significa que la conexion/request fue exitosa
    protected function success($data, $message=null, $code = 200)
    {
        return response()->json([
            'status'=>'Petición exitosa',
            'message'=> $message,
            'data'=>$data
        ], $code);
    }

    //Sera administrado por un controladorss
    protected function error($data, $message=null, $code)
    {
        return response()->json([
            'status'=>'Ocurrio un error',
            'message'=> $message,
            'data'=>$data
        ], $code);
    }
}