import { MigrationInterface, QueryRunner } from "typeorm";

export class Test11664509861289 implements MigrationInterface {
    name = 'Test11664509861289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pet\` CHANGE \`ownerUsername\` \`ownerId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pet\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD CONSTRAINT \`FK_20acc45f799c122ec3735a3b8b1\` FOREIGN KEY (\`ownerId\`) REFERENCES \`owner\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pet\` DROP FOREIGN KEY \`FK_20acc45f799c122ec3735a3b8b1\``);
        await queryRunner.query(`ALTER TABLE \`pet\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`pet\` ADD \`ownerId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pet\` CHANGE \`ownerId\` \`ownerUsername\` varchar(255) NULL`);
    }

}
