<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Admin')]
#[IsGranted('ROLE_ADMIN')]
#[Route('/admin', name: 'admin.')]
class AdminUsersController extends AbstractController
{
    public function __construct(
        private UserRepository $repository
    ) {
    }

    #[Route('/users', name: 'users.index', methods: ['GET'])]
    #[
        OA\Response(
            response: 200,
            description: 'List of users'
        )
    ]
    /**
     * Get the list of users
     */
    public function index(): JsonResponse
    {
        $users = $this->repository->findAll();

        return $this->json(
            $users,
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[Route('/users/{id}', name: 'users.show', methods: ['GET'])]
    #[
        OA\Response(
            response: 200,
            description: 'User details'
        ),
        OA\Response(
            response: 404,
            description: 'User not found'
        )
    ]
    /**
     * Get the details of a user
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->repository->find($id);

        if (!$user) {
            return $this->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            $user,
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[Route('/users/{id}', name: 'users.delete', methods: ['DELETE'])]
    #[
        OA\Response(
            response: 200,
            description: 'User deleted'
        ),
        OA\Response(
            response: 404,
            description: 'User not found'
        )
    ]
    /**
     * Delete the specified user
     */
    public function delete(int $id): JsonResponse
    {
        $user = $this->repository->find($id);

        if (!$user) {
            return $this->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $this->repository->remove($user);

        return $this->json(
            ['message' => 'User deleted'],
            Response::HTTP_OK,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[Route('/users/{id}', name: 'users.update', methods: ['PUT'])]
    /**
     * Update the specified user
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->repository->find($id);

        if (!$user) {
            return $this->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $response = $this->repository->update($user, $request->getContent());

        if ($response instanceof User) {
            return $this->json(
                $response->safe(),
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

    #[Route('/users', name: 'users.store', methods: ['POST'])]
    /**
     * Create a new user
     */
    public function store(Request $request): JsonResponse
    {
        $response = $this->repository->store($request->getContent());

        if ($response instanceof User) {
            return $this->json(
                $response->safe(),
                Response::HTTP_CREATED,
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
}
