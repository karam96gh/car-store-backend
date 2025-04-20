-- AlterTable
ALTER TABLE `car` ADD COLUMN `dimensionHeight` DOUBLE NULL,
    ADD COLUMN `dimensionLength` DOUBLE NULL,
    ADD COLUMN `dimensionWidth` DOUBLE NULL,
    ADD COLUMN `doors` INTEGER NULL,
    ADD COLUMN `driveType` VARCHAR(191) NULL,
    ADD COLUMN `engineSize` VARCHAR(191) NULL,
    ADD COLUMN `exteriorColor` VARCHAR(191) NULL,
    ADD COLUMN `fuel` VARCHAR(191) NULL,
    ADD COLUMN `interiorColor` VARCHAR(191) NULL,
    ADD COLUMN `origin` VARCHAR(191) NULL,
    ADD COLUMN `passengers` INTEGER NULL,
    ADD COLUMN `transmission` VARCHAR(191) NULL,
    ADD COLUMN `vin` VARCHAR(191) NULL;
