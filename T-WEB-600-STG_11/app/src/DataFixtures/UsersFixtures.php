<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UsersFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < 5; $i++) {
            $user = new User();
            $user->setEmail('user' . $i . '@example.com');
            $user->setPassword(password_hash('password', PASSWORD_DEFAULT));
            $user->setFirstname('Firstname ' . $i);
            $user->setLastname('Lastname ' . $i);
            $manager->persist($user);
        }

        $admin = new User();
        $admin->setEmail('a@b.c');
        $admin->setPassword(password_hash('admin', PASSWORD_DEFAULT));
        $admin->setFirstname('Admin');
        $admin->setLastname('Admin');
        $admin->setRoles(['ROLE_USER', 'ROLE_ADMIN']);
        $manager->persist($admin);

        $manager->flush();
    }
}
