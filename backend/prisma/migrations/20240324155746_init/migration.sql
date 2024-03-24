/*
  Warnings:

  - Added the required column `set_order` to the `DefaultSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DefaultSet" ADD COLUMN     "set_order" INTEGER NOT NULL;
