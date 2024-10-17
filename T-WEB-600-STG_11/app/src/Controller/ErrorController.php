<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Throwable;

class ErrorController extends AbstractController
{
    public function show(Throwable $exception, LoggerInterface $logger)
    {
        //Transform Warning status code from 0 to 199 
        $statusCode = (!$exception->getCode() || $exception->getCode() == 0) ? 199 : $exception->getCode();

        //Log the error
        if ($statusCode <= 199) {
            $logger->warning($exception->getMessage());
        } else {
            $logger->error($exception->getMessage());
        }

        //Prepare basic data output coforming on JSend STD.
        $data = [
            'status' => ($statusCode >= 400) ? 'error' : 'fail',
            'message' => $exception->getMessage(),
        ];

        //If Dev add trace
        if ($this->getParameter('kernel.environment') === 'dev') {
            $data['trace'] = $exception->getTrace();
        }

        //return Json
        return $this->json($data, $statusCode);
    }
}
