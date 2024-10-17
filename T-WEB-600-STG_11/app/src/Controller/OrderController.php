<?php

namespace App\Controller;

use App\Repository\OrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
class OrderController extends AbstractController
{
    public function __construct(private OrderRepository $repository)
    {
    }

    #[OA\Tag(name: 'Orders')]
    #[Route('/orders', name: 'order.index', methods: ['GET'])]
    /**
     * Get the list of orders of the current user
     */
    public function index(): JsonResponse
    {
        $orders = $this->repository->findUserPayedOrders(
            $this->getUser()
        );

        return $this->json(
            $orders,
            Response::HTTP_OK
        );
    }

    #[OA\Tag(name: 'Orders')]
    #[Route('/orders/{id}', name: 'order.show', methods: ['GET'])]
    /**
     * Get the details of a specific order of the current user
     */
    public function show(int $id): JsonResponse
    {
        $order = $this->repository->find($id);

        if (!$order || $order->getUser() !== $this->getUser()) {
            return $this->json(
                ['message' => 'Order not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $order,
            Response::HTTP_OK
        );
    }
}
