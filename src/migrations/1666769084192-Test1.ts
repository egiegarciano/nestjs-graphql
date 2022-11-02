import { MigrationInterface, QueryRunner } from "typeorm";

export class Test11666769084192 implements MigrationInterface {
    name = 'Test11666769084192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`access_token\` longtext NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'admin', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` varchar(255) NULL, \`image\` varchar(255) NULL, \`ownerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`owner\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`access_token\` longtext NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD CONSTRAINT \`FK_20acc45f799c122ec3735a3b8b1\` FOREIGN KEY (\`ownerId\`) REFERENCES \`owner\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pet\` DROP FOREIGN KEY \`FK_20acc45f799c122ec3735a3b8b1\``);
        await queryRunner.query(`DROP TABLE \`owner\``);
        await queryRunner.query(`DROP TABLE \`pet\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
    }

}
