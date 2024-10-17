<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240507124318 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE orders DROP CONSTRAINT fk_e52ffdee9d86650f');
        $this->addSql('DROP INDEX idx_e52ffdee9d86650f');
        $this->addSql('ALTER TABLE orders DROP user_id_id');
        $this->addSql('ALTER TABLE orders ALTER _user_id DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE orders ADD user_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE orders ALTER _user_id SET NOT NULL');
        $this->addSql('ALTER TABLE orders ADD CONSTRAINT fk_e52ffdee9d86650f FOREIGN KEY (user_id_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_e52ffdee9d86650f ON orders (user_id_id)');
    }
}
