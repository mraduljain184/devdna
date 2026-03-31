/*
  Warnings:

  - A unique constraint covering the columns `[userId,githubRepoId]` on the table `Repository` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Repository_userId_githubRepoId_key" ON "Repository"("userId", "githubRepoId");
