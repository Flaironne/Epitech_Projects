<?php

namespace App\Repository;

use App\Entity\Order;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 *
 * @method Order|null find($id, $lockMode = null, $lockVersion = null)
 * @method Order|null findOneBy(array $criteria, array $orderBy = null)
 * @method Order[]    findAll()
 * @method Order[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private EntityManagerInterface $entityManager)
    {
        parent::__construct($registry, Order::class);
    }

    public function getCart(User $user)
    {
        return $this->findOneBy(['payed' => false, '_user' => $user]);
    }

    public function findUserPayedOrders(User $user)
    {
        return $this->findBy(['payed' => true, '_user' => $user]);
    }

    public function findPayedOrders()
    {
        return $this->findBy(['payed' => true]);
    }

    public function validate(User $user): bool
    {
        $order = $this->findOneBy(['payed' => false, '_user' => $user]);

        if (!$order) {
            return false;
        }

        $order->setPayed(true);

        $this->entityManager->flush();

        return true;
    }

    public function removeProduct(Product $product, User $user)
    {
        $order = $this->findOneBy(['payed' => false, '_user' => $user]);

        if (!$order) {
            return;
        }

        $order->removeProduct($product);

        $this->entityManager->flush();
    }

    public function addProduct(Product $product, User $user)
    {
        $order = $this->findOneBy(['payed' => false, '_user' => $user]);

        if (!$order) {
            $order = new Order();
            $order->setPayed(false);
            $order->setUser($user);

            $user->addOrder($order);

            $this->entityManager->persist($order);
        }

        $order->addProduct($product);

        $this->entityManager->flush();

        return $order;
    }
}
