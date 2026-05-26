-- This is an empty migration.ALTER TABLE `Role`
ALTER TABLE `Role`
MODIFY COLUMN `status` TINYINT NOT NULL DEFAULT 1
COMMENT '1 = Active, 2 = Suspended';