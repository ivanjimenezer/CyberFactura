<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdServController;
use App\Http\Controllers\Api\UserController; 
use App\Http\Controllers\Api\TaxController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Dashboard;
use App\Http\Controllers\Api\EmisorController;
use App\Http\Controllers\Api\FacturaController;
use App\Http\Controllers\CatalogosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Middleware\AdminCheckMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//rutas publicas
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
//catalogos
Route::get('/catalogos/prodserv', [CatalogosController::class, 'getClaveProdServ']);

Route::get('/catalogos/unidad', [CatalogosController::class, 'getClaveUnidad']); 
Route::get('/catalogos/check/unidad', [CatalogosController::class, 'checkClaveUnidad']);  

Route::get('/catalogos/regimen', [CatalogosController::class, 'getClaveRegimen']); 
Route::get('/catalogos/usocfdi', [CatalogosController::class, 'getClaveUsoCfdi']);  
Route::get('/catalogos/factores', [CatalogosController::class, 'getClaveFatores']); 
Route::get('/catalogos/formapago', [CatalogosController::class, 'getClaveFormaPago']); 



//Rutas Protegidas
Route::middleware(['auth:sanctum','throttle:api'])->group(function () {
    //Obtener datos de usuarios y desloggearse
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/prueba', [AuthController::class, 'prueba']);
     //Users
     Route::apiResource('/users', UserController::class)->middleware(AdminCheckMiddleware::class);

    //Dashboard - Estadisticas
    //Ventas netas por fecha
    Route::get('/stats', [Dashboard::class, 'getDatos']);


    //Impuestos
    Route::apiResource('/impuestos', TaxController::class);
   
    //ProdServ
    Route::apiResource('/prodserv', ProdServController::class);
        // Obtener lista pequeña
   Route::get('/getprodserv',[ ProdServController::class, 'getProdServ']);

    //Cliente
    Route::apiResource('/cliente', ClientController::class);
    Route::get('/clients/buscar',[ClientController::class, 'getClientes']);
    //Emisor
    Route::apiResource('/emisor', EmisorController::class);
        // laravel PUT no acepta formdata type
    Route::post('/emisor/updating/{id}', [EmisorController::class, 'updating']);
        //Obtener contenido de los archivos
    Route::get('/emisor/content/{id}', [EmisorController::class, 'getContent']);
    // Obtener lista pequeña
    Route::get('/emisores/buscar',[EmisorController::class, 'getEmisores']);

    Route::apiResource('/factura', FacturaController::class); // 
    Route::post('/factura/json', [FacturaController::class, 'storeJSON']);
    Route::post('/factura/xml', [FacturaController::class, 'storeXML']);
});

