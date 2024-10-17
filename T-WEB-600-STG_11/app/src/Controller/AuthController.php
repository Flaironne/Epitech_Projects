<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;

#[OA\Tag(name: 'Users')]
class AuthController extends AbstractController
{
    public function __construct(
        private UserRepository $repository,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwt
    ) {
    }

    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: User::class,
            example: [
                "email" => "email",
                "password" => "password"
            ]
        )
    )]
    #[OA\Parameter(
        name: 'email',
        description: 'Email address',
        in: 'query',
        required: true,
    )]
    #[OA\Parameter(
        name: 'password',
        description: 'Password',
        in: 'query',
        required: true,
    )]
    #[OA\Response(
        response: 200,
        description: 'User logged in',
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid email address or password',
    )]
    #[Route('/register', name: 'register', methods: ['POST'])]
    /**
     * Register a new user
     */
    public function register(Request $request): Response
    {
        $response = $this->repository->store(
            $request->getContent()
        );

        if ($response instanceof User) {
            return $this->json(
                [
                    'token' => $response->getApiToken(),
                    'user' => $response->safe(),
                ],
                201,
                [],
                [
                    'groups' => ['main']
                ]
            );
        }

        return $this->json($response, 400);
    }

    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            type: User::class,
            example: [
                "email" => "email",
                "password" => "password"
            ]
        )
    )]
    #[OA\Parameter(
        name: 'email',
        description: 'Email address',
        in: 'query',
        required: true,
    )]
    #[OA\Parameter(
        name: 'password',
        description: 'Password',
        in: 'query',
        required: true,
    )]
    #[OA\Response(
        response: 200,
        description: 'User logged in',
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid email address or password',
    )]
    #[Route('/login', name: 'login', methods: ['POST'])]
    /**
     * Login a user
     */
    public function login(Request $request): Response
    {
        $email = $request->toArray()['email'];
        $password = $request->toArray()['password'];

        $user = $this->repository->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json([
                'message' => 'Invalid email address or password',
            ], 400);
        }

        if (!password_verify($password, $user->getPassword())) {
            return $this->json([
                'message' => 'Invalid email address or password',
            ], 400);
        }

        $this->repository->updateApiToken($user);

        return $this->json(
            [
                'token' => $user->getApiToken(),
                'user' => $user->safe(),
            ],
            200,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/users', name: 'users.me', methods: ['GET'])]
    /**
     * Get the current user
     */
    public function me(): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return $this->json(
            [
                'token' => $user->getApiToken(),
                'user' => $user->safe(),
            ],
            200,
            [],
            [
                'groups' => ['main']
            ]
        );
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/users', name: 'users.me.update', methods: ['PUT'])]
    /**
     * Update the current user
     */
    public function updateCurrentUser(Request $request): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $response = $this->repository->update(
            $user,
            $request->getContent()
        );

        if ($response instanceof User) {
            return $this->json(
                [
                    "token" => $response->getApiToken(),
                    "user" => $response->safe()
                ],
                200,
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

    #[IsGranted('ROLE_USER')]
    #[Route('/favorites', name: 'favorites', methods: ['GET'])]
    public function favorites(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json(
            $user->getFavorites()->toArray(),
            200,
            [],
            [
                'groups' => ['main']
            ]
        );
    }
}
