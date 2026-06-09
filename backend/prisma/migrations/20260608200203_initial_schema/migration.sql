/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `municipalities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "municipalities_name_key" ON "municipalities"("name");
