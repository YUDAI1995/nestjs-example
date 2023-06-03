import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1685162007277 implements MigrationInterface {
  name = 'CreateUsers1685162007277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT COMMENT 'userID', \`name\` varchar(255) NOT NULL COMMENT 'userName', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
