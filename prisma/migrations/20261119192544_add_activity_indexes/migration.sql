-- CreateIndex
CREATE INDEX "Activity_userId_startedAt_idx" ON "Activity"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "Activity_userId_type_startedAt_idx" ON "Activity"("userId", "type", "startedAt");
