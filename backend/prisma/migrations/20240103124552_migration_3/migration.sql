/*
  Warnings:

  - Added the required column `activationLink` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `activationLink` VARCHAR(191) NOT NULL,
    MODIFY `IsActivated` BOOLEAN NULL;
