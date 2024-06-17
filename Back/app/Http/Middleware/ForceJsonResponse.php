<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {   
        $response = $next($request);
        // Check if response is already JSON
        if ($request->is('api/*')) {
        if (! $response instanceof \Illuminate\Http\JsonResponse) {
            $response->setStatusCode(200); // Set default status code to 200
            $response->setContent(json_encode($response->getOriginalContent()));
            $response->header('Content-Type', 'application/json');
        }
    }
        return $response;
    }
}
