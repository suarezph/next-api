/*
  Warnings:

  - The values [teacher,student] on the enum `_Role` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "_Role_new" AS ENUM ('admin', 'member');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "_Role_new" USING ("role"::text::"_Role_new");
ALTER TYPE "_Role" RENAME TO "_Role_old";
ALTER TYPE "_Role_new" RENAME TO "_Role";
DROP TYPE "_Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'member';
