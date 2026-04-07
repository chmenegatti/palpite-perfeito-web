-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "paymentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "paymentConfirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "teamA" TEXT NOT NULL,
    "teamB" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "groupStage" TEXT NOT NULL,
    "scoreA" INTEGER,
    "scoreB" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "guessA" INTEGER NOT NULL,
    "guessB" INTEGER NOT NULL,
    "pointsEarned" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopScorerBet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "totalGoals" INTEGER NOT NULL,
    "pointsEarned" INTEGER,

    CONSTRAINT "TopScorerBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChampionBet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "champion" TEXT NOT NULL,
    "runnerUp" TEXT NOT NULL,
    "finalScoreA" INTEGER NOT NULL,
    "finalScoreB" INTEGER NOT NULL,
    "pointsEarned" INTEGER,

    CONSTRAINT "ChampionBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TournamentResult" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "topScorerName" TEXT,
    "topScorerGoals" INTEGER,
    "champion" TEXT,
    "runnerUp" TEXT,
    "finalScoreA" INTEGER,
    "finalScoreB" INTEGER,

    CONSTRAINT "TournamentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "ip" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_totalPoints_idx" ON "User"("totalPoints");

-- CreateIndex
CREATE INDEX "Match_datetime_idx" ON "Match"("datetime");

-- CreateIndex
CREATE INDEX "Goal_matchId_idx" ON "Goal"("matchId");

-- CreateIndex
CREATE INDEX "Guess_userId_idx" ON "Guess"("userId");

-- CreateIndex
CREATE INDEX "Guess_matchId_idx" ON "Guess"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "Guess_userId_matchId_key" ON "Guess"("userId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "TopScorerBet_userId_key" ON "TopScorerBet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChampionBet_userId_key" ON "ChampionBet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TournamentResult_key_key" ON "TournamentResult"("key");

-- CreateIndex
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ip_createdAt_idx" ON "LoginAttempt"("ip", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopScorerBet" ADD CONSTRAINT "TopScorerBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChampionBet" ADD CONSTRAINT "ChampionBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
