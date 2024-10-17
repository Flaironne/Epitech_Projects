<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Catalog')]
#[IsGranted('ROLE_ADMIN')]
class AdminProductsController extends AbstractController
{
    public function __construct(
        private ProductRepository $repository
    ) {
    }

    #[Route('/products', name: 'products.store', methods: ['POST'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: Product::class,
            example: [
                "name" => "Product name",
                "description" => "Product description",
                "price" => 9.99
            ]
        )
    )]
    /**
     * Add a product
     */
    public function store(Request $request): JsonResponse
    {
        $product = $this->repository->store($request->getContent());

        if ($product instanceof Product) {
            return $this->json(
                $product,
                Response::HTTP_CREATED,
                [],
                [
                    'groups' => ['main']
                ]
            );
        }

        return $this->json(
            $product,
            Response::HTTP_BAD_REQUEST
        );
    }

    #[Route('/products/{id}', name: 'products.update', methods: ['PUT'])]
    /**
     * Modify a product
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $product = $this->repository->find($id);

        if (!$product) {
            return $this->json(
                ['message' => 'Product not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $response = $this->repository->update(
            $product,
            $request->getContent()
        );

        if ($response instanceof Product) {
            return $this->json(
                $response,
                Response::HTTP_OK,
                [],
                [
                    'groups' => ['main']
                ]
            );
        }

        return $this->json(
            $response,
            Response::HTTP_BAD_REQUEST
        );
    }

    #[Route('/products/{id}', name: 'admin.products.delete', methods: ['DELETE'])]
    /**
     * Delete a product
     */
    public function delete(int $id): JsonResponse
    {
        $product = $this->repository->find($id);

        if (!$product) {
            return $this->json(
                ['message' => 'Product not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $this->repository->remove($product);

        return $this->json(
            ['message' => 'Product deleted'],
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }
}
