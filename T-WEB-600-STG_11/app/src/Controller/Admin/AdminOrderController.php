<?php

namespace App\Controller\Admin;

use App\Repository\OrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[OA\Tag(name: 'Admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminOrderController extends AbstractController
{
    public function __construct(private OrderRepository $repository, private SerializerInterface $serializer)
    {
    }

    #[Route('/admin/orders', name: 'admin.order.index', methods: ['GET'])]
    /**
     * Get all the orders
     */
    public function index(): JsonResponse
    {
        $orders = $this->repository->findAll();

        $json =  $this->serializer->serialize($orders, 'json', ['groups' => 'order']);

        return new JsonResponse($json, Response::HTTP_OK, [], true);
    }

    #[Route('/admin/orders/{id}', name: 'admin.order.show', methods: ['GET'])]
    /**
     * Get the details of a specific order
     */
    public function show(int $id): JsonResponse
    {
        $order = $this->repository->find($id);

        if (!$order) {
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
