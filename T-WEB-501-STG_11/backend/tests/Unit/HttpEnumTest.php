<?php

namespace Tests\Unit;

use App\Enums\Http;
use PHPUnit\Framework\TestCase;

class HttpEnumTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_enum_http_codes_conform_to_http_specification(): void
    {
        $this->assertEquals(200, Http::SUCCESS->value);
        $this->assertEquals(201, Http::CREATED->value);
        $this->assertEquals(204, Http::NO_CONTENT->value);
        $this->assertEquals(400, Http::BAD_REQUEST->value);
        $this->assertEquals(401, Http::UNAUTHORIZED->value);
        $this->assertEquals(403, Http::FORBIDDEN->value);
        $this->assertEquals(404, Http::NOT_FOUND->value);
        $this->assertEquals(422, Http::UNPROCESSABLE_ENTITY->value);
        $this->assertEquals(500, Http::INTERNAL_SERVER_ERROR->value);
    }
}
