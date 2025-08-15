<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Global middleware (runs on every request).
     */
    protected $middleware = [
        // Trust proxy headers (X-Forwarded-*)
        \Illuminate\Http\Middleware\TrustProxies::class,

        // CORS handling
        \Illuminate\Http\Middleware\HandleCors::class,

        // Maintenance mode, post size, request trimming
        \Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * Route middleware groups.
     */
    protected $middlewareGroups = [
        'web' => [
            // Cookies + session + CSRF (required for Sanctum cookie flow)
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // ✅ keep your original idea: make SPA requests stateful
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * Single-route middleware aliases.
     */
    protected $routeMiddleware = [
        'auth'      => \Illuminate\Auth\Middleware\Authenticate::class,
        'throttle'  => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'bindings'  => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'verified'  => \App\Http\Middleware\EnsureEmailIsVerified::class, // your file
    ];
}
