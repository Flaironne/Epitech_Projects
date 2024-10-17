<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\User;
use App\StripeClient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    private StripeClient $client;

    public function __construct(
        ManagerRegistry $registry,
        private SerializerInterface $serializer,
        private ContainerBagInterface $params,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct($registry, Product::class);

        $this->client = new StripeClient(
            $this->params->get('stripe_secret')
        );
    }

    public function addToFavorites(User $user, Product $product): void
    {
        $user->addFavorite($product);

        $this->entityManager->flush();
    }

    public function removeFromFavorites(User $user, Product $product): void
    {
        $user->removeFavorite($product);

        $this->entityManager->flush();
    }

    public function findByName(string $name): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('LOWER(p.name) LIKE LOWER(:name)')
            ->setParameter('name', "%$name%")
            ->getQuery()
            ->getResult();
    }

    public function store($payload): Product | ConstraintViolationListInterface
    {
        $product = $this->serializer->deserialize(
            $payload,
            Product::class,
            'json'
        );

        $errors = $this->validator->validate($product);

        if (count($errors) > 0) {
            return $errors;
        }

        $product = $this->client->createProduct($product);

        $this->getEntityManager()->persist($product);

        $this->getEntityManager()->flush();

        return $product;
    }

    public function update(Product $product, $data): Product | ConstraintViolationListInterface
    {
        $product = $this->serializer->deserialize(
            $data,
            Product::class,
            'json',
            ['object_to_populate' => $product]
        );

        $errors = $this->validator->validate($product);

        if (count($errors) > 0) {
            return $errors;
        }

        // $this->client->updateProduct($product);

        $this->getEntityManager()->persist($product);

        $this->getEntityManager()->flush();

        return $product;
    }

    public function remove(Product $product): void
    {
        // $this->client->deleteProduct($product);

        $this->getEntityManager()->remove($product);

        $this->getEntityManager()->flush();
    }
}
