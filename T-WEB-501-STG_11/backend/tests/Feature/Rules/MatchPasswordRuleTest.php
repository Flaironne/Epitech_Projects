<?php

namespace Tests\Unit;

use App\Rules\MatchPasswordRule;
use Tests\TestCase;

class MatchPasswordRuleTest extends TestCase
{

    protected MatchPasswordRule $rule;

    public function setUp(): void
    {
        parent::setUp();
        $this->rule = new MatchPasswordRule();
    }

    public function test_rule_fails_when_password_does_not_match(): void
    {
        $this->loginAsUser();
        $this->rule->validate('password', 'wrong', function ($message) {
            $this->assertEquals('The password does not match your current password.', $message);
        });
    }

    public function test_rule_passes_when_password_matches(): void
    {
        $this->loginAsUser();
        $this->assertNull($this->rule->validate('password', self::PASSWORD, fn ($message) => $this->fail($message)));
    }
}

