<?php

namespace Tests\Unit;

use App\Rules\PasswordRule;
use PHPUnit\Framework\TestCase;

class PasswordRuleTest extends TestCase
{
    protected PasswordRule $rule;

    public function setUp(): void
    {
        parent::setUp();
        $this->rule = new PasswordRule();
    }

    public function test_rule_fails_when_password_is_too_short(): void
    {
        $this->rule->validate('password', 'short', function ($message) {
            $this->assertEquals('The password must be at least 8 characters.', $message);
        });
    }

    public function test_rule_fails_when_password_does_not_contain_a_number(): void
    {
        $this->rule->validate('password', 'password', function ($message) {
            $this->assertEquals('The password must contain at least one number.', $message);
        });
    }

    public function test_rule_fails_when_password_does_not_contain_a_lowercase_letter(): void
    {
        $this->rule->validate('password', 'PASSWORD1', function ($message) {
            $this->assertEquals('The password must contain at least one lowercase letter.', $message);
        });
    }

    public function test_rule_fails_when_password_does_not_contain_an_uppercase_letter(): void
    {
        $this->rule->validate('password', 'password1', function ($message) {
            $this->assertEquals('The password must contain at least one uppercase letter.', $message);
        });
    }

    public function test_rule_fails_when_password_does_not_contain_a_special_character(): void
    {
        $this->rule->validate('password', 'Password1', function ($message) {
            $this->assertEquals('The password must contain at least one special character.', $message);
        });
    }

    public function test_rule_passes_when_password_is_valid(): void
    {
        $this->assertNull($this->rule->validate('password', 'Password1!', fn ($message) => $this->fail($message)));
    }
}
