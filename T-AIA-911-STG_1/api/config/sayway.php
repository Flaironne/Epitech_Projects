<?php

return [
    'microservices' => [
        'token' => env('SERVICES_CALLBACK_TOKEN'),
        'nlp_service_url' => env('NLP_SERVICE_URL', 'http://nlp_service:8000'),
        'pathfinder_service_url' => env('PATHFINDER_SERVICE_URL', 'http://pathfinder_service:8000'),
    ],
];
