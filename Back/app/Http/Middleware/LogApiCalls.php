<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiCalls
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Start time to calculate response time
        $startTime = microtime(true);

        // Process the request and get the response
        $response = $next($request);

        // End time
        $endTime = microtime(true);
        $responseTime = $endTime - $startTime;

        // Capture request and response information
        $ipAddress = $request->ip();
        $route = $request->path();
        $date = now();
        $method = $request->method();
        $headers = $request->headers->all();
        $requestBody = $request->all();
        $queryParams = $request->query();
        $userAgent = $request->header('User-Agent');
        $userId = Auth::check() ? Auth::user()->id : null;
        $responseStatus = $response->status(); 
        $responseBody = $response->getContent();

        // Log the information using the custom channel
        Log::channel('api_calls')->info('API Call Log', [
            'ip_address' => $ipAddress,
            'route' => $route,
            'date' => $date,
            'request_body' => $requestBody,
            'method' => $method,
            'headers' => $headers, 
            'query_params' => $queryParams,
            'user_agent' => $userAgent,
            'user_id' => $userId,
            'response_status' => $responseStatus, 
            'response_time' => $responseTime,
            'response_body' => $responseBody,
        ]);

        return $response;
    }
}
