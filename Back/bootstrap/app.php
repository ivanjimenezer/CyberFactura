<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\Cors;
use App\Http\Middleware\LogApiCalls; 
use App\Http\Middleware\RestrictMiddleware;

use App\Http\Middleware\ForceJsonRequest;
use App\Http\Middleware\ForceJsonResponse;

use GuzzleHttp\Psr7\Request;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) { 
      /*  $middleware->priority([
            \Illuminate\Http\Middleware\Cors::class,
            \Illuminate\Http\Middleware\LogApiCalls::class,

        ]);*/
         $middleware->prepend(RestrictMiddleware::class);  
         $middleware->append(Cors::class);
         $middleware->append(ForceJsonRequest::class);
         $middleware->append(ForceJsonResponse::class);
         $middleware->append(LogApiCalls::class);

    })
    ->withExceptions(function (Exceptions $exceptions) {
         
    })->create();
