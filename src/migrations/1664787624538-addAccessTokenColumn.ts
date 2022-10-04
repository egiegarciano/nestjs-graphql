import { MigrationInterface, QueryRunner } from "typeorm";

export class addAccessTokenColumn1664787624538 implements MigrationInterface {
    name = 'addAccessTokenColumn1664787624538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner\` ADD \`access_token\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`owner\` DROP COLUMN \`access_token\``);
    }

}
