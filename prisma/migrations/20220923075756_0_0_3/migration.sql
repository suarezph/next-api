-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'member',
ALTER COLUMN "gender" DROP NOT NULL;
