<?php

use App\Http\Controllers\CatalogosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;


Route::get('/storage/facturas/pdf/{uuid}.pdf', function ($uuid) {
    return response()->file(storage_path("app/public/facturas/pdf/{$uuid}.pdf"));
});

Route::get('/', function() {
    return view('welcome');
});
/*
Route::get('/{any}', function () {
    return File::get(public_path('Front/index.html'));
})->where('any', '.*');
*/
Route::get('{path}', function ($path) {
    return view('welcome'); // Replace 'react-app.index' with your view name
})->where('path', '^(?!api).*$');