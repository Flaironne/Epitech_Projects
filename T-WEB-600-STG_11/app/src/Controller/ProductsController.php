<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[OA\Tag(name: 'Catalog')]
class ProductsController extends AbstractController
{
    public function __construct(
        private ProductRepository $repository
    ) {
    }

    #[Route('/products', name: 'products.index', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'List of products')]
    /**
     * Retrieve list of products
     */
    public function index(): JsonResponse
    {
        $products = $this->repository->findAll();

        return $this->json(
            $products,
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[Route('/products/search/{needle}', name: 'products.search', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'List of products')]
    /**
     * Search for a product by name
     */
    public function search(string $needle): JsonResponse
    {
        $products = $this->repository->findByName($needle);

        return $this->json(
            $products,
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[Route('/products/{id}', name: 'products.show', methods: ['GET'])]
    #[OA\Response(response: 200, description: 'Product details')]
    #[OA\Response(response: 404, description: 'Product not found')]
    /**
     * Retrieve information on a specific product
     */
    public function show(int $id): JsonResponse
    {
        $product = $this->repository->find($id);

        if (!$product) {
            return $this->json(
                ['message' => 'Product not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $product,
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/products/{id}/favorite', name: 'products.favorite', methods: ['POST'])]
    public function addToFavorites(int $id): JsonResponse
    {
        $this->repository->addToFavorites(
            $this->getUser(),
            $this->repository->find($id)
        );

        return $this->json(
            ['message' => 'Product added to favorites'],
            Response::HTTP_CREATED
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/products/{id}/favorite', name: 'products.unfavorite', methods: ['DELETE'])]
    public function removeFromFavorites(int $id): JsonResponse
    {
        $this->repository->removeFromFavorites(
            $this->getUser(),
            $this->repository->find($id)
        );

        return $this->json(
            ['message' => 'Product removed from favorites'],
            Response::HTTP_OK
        );
    }
}
