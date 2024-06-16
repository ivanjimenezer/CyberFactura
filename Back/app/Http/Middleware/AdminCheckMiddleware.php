<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminCheckMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && $user->type !== 'admin') {
            return response()->json(['error' => 'No es un usuario admin'], 403);
        }

        return $next($request);
    }
}
