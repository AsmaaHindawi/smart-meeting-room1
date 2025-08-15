<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Apply CORS to API routes and Sanctum’s CSRF endpoint (plus auth routes
    | you listed). Keep credentials enabled so cookies and Authorization
    | headers are allowed. Methods/headers are made explicit to avoid
    | proxies/browsers rejecting non-GET requests.
    |
    */

    // Apply CORS to these paths only
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
    ],

    // Be explicit so POST/PUT/PATCH/DELETE/OPTIONS are always allowed
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Set FRONTEND_URL in .env to http://localhost:5173
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:5173',
        // You can add 'http://127.0.0.1:5173' here if you ever use 127.0.0.1,
        // but prefer staying on "localhost" to match your session domain.
    ],

    'allowed_origins_patterns' => [],

    // Allow common headers used by your SPA + Sanctum
    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-XSRF-TOKEN',
        'Origin',
        'Referer',
    ],

    // No special exposure needed; keep empty
    'exposed_headers' => [],

    // Cache preflight result (0 = no cache)
    'max_age' => 0,

    // Must be true to send cookies and Authorization across origins
    'supports_credentials' => true,

];
