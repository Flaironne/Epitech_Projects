<?php

namespace App\Controller;

use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\StripeClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

#[OA\Tag(name: 'Catalog')]
class CartsController extends AbstractController
{

    public function __construct(
        private OrderRepository $repository,
        private ProductRepository $productRepository,
        private ContainerBagInterface $params,
    ) {
    }

    #[Route('/carts/validate', name: 'carts.validate', methods: ['POST'])]
    /**
     * Validation of the cart (aka converting the cart to an order) 
     */
    public function validate(): JsonResponse
    {
        $this->repository->validate(
            $this->getUser()
        );

        return $this->json(
            Response::HTTP_OK
        );
    }

    #[Route('/carts', name: 'carts.index', methods: ['GET'])]
    /**
     * State of the shopping cart (list of products in the cart). 
     */
    public function index(): JsonResponse
    {
        $cart = $this->repository->getCart(
            $this->getUser()
        );

        $client = new StripeClient(
            $this->params->get('stripe_secret'),
            $this->params->get('stripe_cancel_url'),
            $this->params->get('stripe_success_url')
        );

        $link = $cart ? $client->generateLink($cart) : '';

        return $this->json(
            [
                "link" => $link,
                "products" => $cart?->getProducts() ?? []
            ],
            Response::HTTP_OK,
            [],
            ['groups' => 'main']
        );
    }

    #[Route('/carts/{id}', name: 'carts.delete', methods: ['DELETE'])]
    /**
     * Remove a product to the shopping cart
     */
    public function delete(string $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(
                ['message' => 'product not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $carts = $this->repository->removeProduct(
            $product,
            $this->getUser()
        );

        return $this->json(
            $carts,
            Response::HTTP_OK,
            [],
            ['groups' => 'main']
        );
    }

    #[Route('/carts/{id}', name: 'carts.add', methods: ['POST'])]
    /**
     * Add a product to the shopping cart
     */
    public function add(string $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        $cart = $this->repository->addProduct(
            $product,
            $this->getUser()
        );

        return $this->json(
            $cart->getProducts(),
            Response::HTTP_OK,
            [],
            ['groups' => 'main']
        );
    }
}
