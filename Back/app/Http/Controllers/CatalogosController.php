<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 
use PhpCfdi\SatCatalogos\Factory;

class CatalogosController extends Controller
{
    //
    public function index(){
        return '<h1> Esta funcionando </h1>
       
                       ';
    }

    public function getClaveProdServ(Request $request) {
        // Get the 'Texto' parameter from the request
        $texto = $request->query('Texto');
    
        // Specify the path to your SQLite database file 
        $data = DB::connection('sqlite')->select("SELECT *, id || ' - ' || texto AS clavetext
        FROM cfdi_40_productos_servicios WHERE clavetext like ? ORDER BY LENGTH(clavetext)  limit 20 ",['%' . $texto . '%']);
        
        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200);
    }
    
//----------------------------- CLAVE UNIDAD ------------------------------------------------
    public function getClaveUnidad( Request $request){
 
        $texto = $request->query('Texto');
        
        $data = DB::connection('sqlite')->select("SELECT *, id || ' - ' || texto AS clavetext
         FROM cfdi_40_claves_unidades  WHERE clavetext like ? ORDER BY LENGTH(clavetext)  limit 20 ",['%' . $texto . '%']);

        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200); 

    }
    public function checkClaveUnidad(Request $request) {
        $clave = $request->query('Clave');
    
        // Check if the clave exists in the database
        $exists = DB::connection('sqlite')
                    ->table('cfdi_40_claves_unidades')
                    ->where('clave', $clave)
                    ->exists();
    
        if ($exists) {
            // Clave exists, send OK message
            return response()->json(['message' => 'OK'], 200);
        } else {
            // Clave does not exist, send error message
            return response()->json(['message' => 'No existe ese codigo dentro del catalogo'], 404);
        }
    }
    

    public function getClaveRegimen( Request $request){
 
        $texto = $request->query('Texto');
        
        $data = DB::connection('sqlite')->select("SELECT *, id || ' - ' || texto AS clavetext
         FROM cfdi_40_regimenes_fiscales  WHERE clavetext like ? ORDER BY LENGTH(clavetext)  limit 20 ",['%' . $texto . '%']);

        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200);  
    }
    
    public function getClaveUsoCfdi(Request $request){
 
        $texto = $request->query('Texto');
        
        $data = DB::connection('sqlite')->select("SELECT *, id || ' - ' || texto AS clavetext
         FROM cfdi_40_usos_cfdi  WHERE clavetext like ? ORDER BY LENGTH(clavetext)  limit 20  ",['%' . $texto . '%']);

        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200);  
    }

    public function getClaveFatores(Request $request) {
        // Get the 'Texto' parameter from the request
        $texto = $request->query('Texto');
    
        // Specify the path to your SQLite database file 
        $data = DB::connection('sqlite')->select("SELECT * , id || ' - ' || texto AS clavetext
        FROM cfdi_40_reglas_tasa_cuota");
        
        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200);
    }
    public function getClaveFormaPago(Request $request) {
        // Get the 'Texto' parameter from the request
        $texto = $request->query('Texto');
    
        // Specify the path to your SQLite database file 
        $data = DB::connection('sqlite')->select("SELECT id, texto, id || ' - ' || texto AS clavetext
        FROM cfdi_40_formas_pago  WHERE clavetext like ? ORDER BY LENGTH(clavetext)  limit 20  ",['%' . $texto . '%']);
        
        // Return the catalog data as JSON response
        return response()->json(['data' => $data], 200);
    }
     

}

        /*$data = DB::connection('sqlite')->select("SELECT texto FROM cce_20_estados limit 1");
        sqlite> PRAGMA table_info(ccp_30_productos_servicios);
0|id|TEXT|1||1
1|texto|TEXT|1||0
2|similares|TEXT|1||0
3|material_peligroso|TEXT|1||0
4|vigencia_desde|TEXT|1||0
5|vigencia_hasta|TEXT|1||0
sqlite>
        */
