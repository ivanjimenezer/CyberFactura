<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class RestrictMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $restrictedIps = [''];
        if (in_array($request->ip(), $restrictedIps)) {
            return response()->json(['error' => "IP BLOQUEADA"], 400);
        }
        return $next($request);
    }
}
