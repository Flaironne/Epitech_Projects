<?php

namespace Tests\Unit;

use App\Models\User;
use App\Rules\MatchOrUniqueEmailRule;
use Tests\TestCase;

class MatchOrUniqueEmailRuleTest extends TestCase
{
	private User $user;
	protected MatchOrUniqueEmailRule $rule;

	public function setUp(): void
	{
		parent::setUp();
		$this->user = User::first();
		$this->rule = new MatchOrUniqueEmailRule($this->user);
	}

	public function test_rule_passes_when_email_matches(): void
	{
		$this->assertNull($this->rule->validate('email', $this->user->email, fn ($message) => $this->fail($message)));
	}

	public function test_rule_passes_when_email_is_unique(): void
	{
		$this->assertNull($this->rule->validate('email', 'exampleUniqueEmail@example.com', fn ($message) => $this->fail($message)));
	}

	public function test_rule_fails_when_email_is_taken(): void
	{
		$this->assertNull($this->rule->validate('email', User::factory()->create()->email, function ($message) {
			$this->assertEquals('The email has already been taken.', $message);
		}));
	}
}
