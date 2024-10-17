<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductTest extends WebTestCase
{
    public function testGetCatalog(): void
    {
        $client = static::createClient();
        $client->request('GET', '/products');
        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $products = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($products);
        $this->assertNotEmpty($products);
    }

    public function testShowProduct(): void
    {
        $client = static::createClient();
        $client->request('GET', '/products/1');
        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $keys = ['id', 'name', 'price', 'description', 'image'];
        $product = json_decode($client->getResponse()->getContent(), true);
        foreach ($keys as $key) {
            $this->assertArrayHasKey($key, $product);
        }
        $this->assertEquals('BadPal', $product['name']);
    }

    public function testSearchProduct(): void
    {
        $client = static::createClient();
        $client->request('GET', '/products/search/badpal');
        $this->assertResponseIsSuccessful();
        $this->assertJson($client->getResponse()->getContent());
        $products = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($products);
        $this->assertNotEmpty($products);
        $product = $products[0];
        $this->assertEquals('BadPal', $product['name']);
        $this->assertEquals(1, $product['id']);
    }
}
