<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(
        ManagerRegistry $registry,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private UserPasswordHasherInterface $hasher,
        private JWTTokenManagerInterface $jwt
    ) {
        parent::__construct($registry, User::class);
    }

    public function updateApiToken(User $user): void
    {
        $token = $this->jwt->createFromPayload($user, [
            'exp' => time() + 3600,
        ]);

        $user->setApiToken($token);

        $this->getEntityManager()->persist($user);

        $this->getEntityManager()->flush();
    }

    public function store($payload): User | ConstraintViolationListInterface
    {
        $user = $this->serializer->deserialize(
            $payload,
            User::class,
            'json'
        );

        if (!$user instanceof User) {
            return new ConstraintViolationList([
                new ConstraintViolation(
                    'Invalid payload',
                    null,
                    [],
                    $user,
                    'payload',
                    $payload
                )
            ]);
        }

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            return $errors;
        }

        $user->setRoles(['ROLE_USER']);

        $user->setPassword(
            $this->hasher->hashPassword(
                $user,
                $user->getPassword()
            )
        );

        $token = $this->jwt->createFromPayload($user, [
            'exp' => time() + 3600,
        ]);

        $user->setApiToken($token);

        $this->getEntityManager()->persist($user);

        $this->getEntityManager()->flush();

        return $user;
    }

    public function update(User $user, $payload): User | ConstraintViolationListInterface
    {
        $p = json_decode($payload, true);

        $user->setFirstname($p['firstname'] ?? $user->getFirstname());
        $user->setLastname($p['lastname'] ?? $user->getLastname());

        $email = $p['email'] ?? $user->getEmail();
        $existingUser = $this->findOneBy(['email' => $email]);

        if ($existingUser && $existingUser->getId() !== $user->getId()) {
            return new ConstraintViolationList([
                new ConstraintViolation(
                    'Email already exists',
                    null,
                    [],
                    $existingUser,
                    'email',
                    $email
                )
            ]);
        }

        $user->setEmail($payload['email'] ?? $user->getEmail());
        $this->getEntityManager()->persist($user);

        $this->getEntityManager()->flush();

        return $user;
    }

    public function remove(User $user): void
    {
        $this->getEntityManager()->remove($user);

        $this->getEntityManager()->flush();
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }
}
