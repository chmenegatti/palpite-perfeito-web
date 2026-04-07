import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const DEFAULT_TEST_ADMIN_PASSWORD = "admin123";

type MatchSeed = {
  teamA: string;
  teamB: string;
  datetime: Date;
  groupStage: string;
};

async function resetCompetitionData(
  tx: Prisma.TransactionClient,
  options: { preserveMatches?: boolean } = {}
) {
  await tx.guess.deleteMany();
  await tx.goal.deleteMany();
  await tx.topScorerBet.deleteMany();
  await tx.championBet.deleteMany();
  await tx.tournamentResult.deleteMany();
  await tx.loginAttempt.deleteMany();
  if (!options.preserveMatches) {
    await tx.match.deleteMany();
  }
  await tx.user.updateMany({ data: { totalPoints: 0 } });
}

export async function seedAdminUser(adminPasswordValue: string) {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await hash(adminPasswordValue, 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@bolao.com" },
      update: {
        name: "Administrador",
        password: hashedPassword,
        role: "ADMIN",
        paymentConfirmed: true,
        paymentConfirmedAt: new Date(),
      },
      create: {
        name: "Administrador",
        email: "admin@bolao.com",
        password: hashedPassword,
        role: "ADMIN",
        paymentConfirmed: true,
        paymentConfirmedAt: new Date(),
      },
    });
    return { success: true, message: `Admin criado: ${admin.email}` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao criar admin" };
  } finally {
    await prisma.$disconnect();
  }
}

function buildBrasileiraoTestMatches(): MatchSeed[] {
  return [
    { teamA: "São Paulo", teamB: "Cruzeiro", datetime: new Date("2026-04-04T18:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Coritiba", teamB: "Fluminense", datetime: new Date("2026-04-04T20:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Vasco da Gama", teamB: "Botafogo", datetime: new Date("2026-04-04T21:00:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Chapecoense", teamB: "Vitória", datetime: new Date("2026-04-05T16:00:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Atlético-MG", teamB: "Athletico-PR", datetime: new Date("2026-04-05T17:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Flamengo", teamB: "Santos", datetime: new Date("2026-04-05T17:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Bahia", teamB: "Palmeiras", datetime: new Date("2026-04-05T19:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Corinthians", teamB: "Internacional", datetime: new Date("2026-04-05T19:30:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Mirassol", teamB: "Bragantino", datetime: new Date("2026-04-05T20:00:00-03:00"), groupStage: "Rodada 10" },
    { teamA: "Grêmio", teamB: "Clube do Remo", datetime: new Date("2026-04-05T20:30:00-03:00"), groupStage: "Rodada 10" },

    { teamA: "Clube do Remo", teamB: "CR Vasco da Gama", datetime: new Date("2026-04-11T19:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "EC Vitória", teamB: "São Paulo FC", datetime: new Date("2026-04-11T19:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "Fluminense FC", teamB: "CR Flamengo", datetime: new Date("2026-04-11T21:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "Mirassol FC", teamB: "EC Bahia", datetime: new Date("2026-04-11T21:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "Santos FC", teamB: "CA Mineiro", datetime: new Date("2026-04-11T23:00:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "SC Internacional", teamB: "Grêmio FBPA", datetime: new Date("2026-04-11T23:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "CA Paranaense", teamB: "Chapecoense AF", datetime: new Date("2026-04-12T14:00:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "Botafogo FR", teamB: "Coritiba FBC", datetime: new Date("2026-04-12T19:00:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "SC Corinthians Paulista", teamB: "SE Palmeiras", datetime: new Date("2026-04-12T21:30:00.000Z"), groupStage: "Rodada 11" },
    { teamA: "Cruzeiro EC", teamB: "RB Bragantino", datetime: new Date("2026-04-12T21:30:00.000Z"), groupStage: "Rodada 11" },
  ];
}

export async function seedBrasileiraoTest(adminPasswordValue: string) {
  const prisma = new PrismaClient();
  try {
    const matches = buildBrasileiraoTestMatches();

    await prisma.$transaction(async (tx) => {
      await resetCompetitionData(tx, { preserveMatches: false });
    });

    const adminResult = await seedAdminUser(adminPasswordValue);
    if (!adminResult.success) {
      return adminResult;
    }

    for (const match of matches) {
      await prisma.match.create({ data: match });
    }

    return { success: true, message: `${matches.length} partidas de teste do Brasileirão 2026 criadas` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao seed Brasileirão" };
  } finally {
    await prisma.$disconnect();
  }
}

export async function seedWorldCup2026(adminPasswordValue: string) {
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction(async (tx) => {
      await resetCompetitionData(tx, { preserveMatches: false });
    });

    const adminResult = await seedAdminUser(adminPasswordValue);
    if (!adminResult.success) {
      return adminResult;
    }

    // ============================================================
    // Copa do Mundo FIFA 2026 - Fase de Grupos (72 jogos oficiais)
    // Horários em UTC. Fontes: FIFA / Wikipedia
    // ============================================================
    const matches: MatchSeed[] = [
      // ==================== GRUPO A ====================
      { teamA: "México", teamB: "África do Sul", datetime: new Date("2026-06-11T19:00:00Z"), groupStage: "Grupo A" },
      { teamA: "Coreia do Sul", teamB: "Rep. Tcheca", datetime: new Date("2026-06-12T02:00:00Z"), groupStage: "Grupo A" },
      { teamA: "Rep. Tcheca", teamB: "África do Sul", datetime: new Date("2026-06-18T16:00:00Z"), groupStage: "Grupo A" },
      { teamA: "México", teamB: "Coreia do Sul", datetime: new Date("2026-06-19T01:00:00Z"), groupStage: "Grupo A" },
      { teamA: "Rep. Tcheca", teamB: "México", datetime: new Date("2026-06-25T01:00:00Z"), groupStage: "Grupo A" },
      { teamA: "África do Sul", teamB: "Coreia do Sul", datetime: new Date("2026-06-25T01:00:00Z"), groupStage: "Grupo A" },

      // ==================== GRUPO B ====================
      { teamA: "Canadá", teamB: "Bósnia", datetime: new Date("2026-06-12T19:00:00Z"), groupStage: "Grupo B" },
      { teamA: "Catar", teamB: "Suíça", datetime: new Date("2026-06-13T19:00:00Z"), groupStage: "Grupo B" },
      { teamA: "Suíça", teamB: "Bósnia", datetime: new Date("2026-06-18T19:00:00Z"), groupStage: "Grupo B" },
      { teamA: "Canadá", teamB: "Catar", datetime: new Date("2026-06-18T22:00:00Z"), groupStage: "Grupo B" },
      { teamA: "Suíça", teamB: "Canadá", datetime: new Date("2026-06-24T19:00:00Z"), groupStage: "Grupo B" },
      { teamA: "Bósnia", teamB: "Catar", datetime: new Date("2026-06-24T19:00:00Z"), groupStage: "Grupo B" },

      // ==================== GRUPO C ====================
      { teamA: "Brasil", teamB: "Marrocos", datetime: new Date("2026-06-13T22:00:00Z"), groupStage: "Grupo C" },
      { teamA: "Haiti", teamB: "Escócia", datetime: new Date("2026-06-14T01:00:00Z"), groupStage: "Grupo C" },
      { teamA: "Escócia", teamB: "Marrocos", datetime: new Date("2026-06-19T22:00:00Z"), groupStage: "Grupo C" },
      { teamA: "Brasil", teamB: "Haiti", datetime: new Date("2026-06-19T22:00:00Z"), groupStage: "Grupo C" },
      { teamA: "Escócia", teamB: "Brasil", datetime: new Date("2026-06-24T22:00:00Z"), groupStage: "Grupo C" },
      { teamA: "Marrocos", teamB: "Haiti", datetime: new Date("2026-06-24T22:00:00Z"), groupStage: "Grupo C" },

      // ==================== GRUPO D ====================
      { teamA: "Estados Unidos", teamB: "Paraguai", datetime: new Date("2026-06-13T01:00:00Z"), groupStage: "Grupo D" },
      { teamA: "Austrália", teamB: "Turquia", datetime: new Date("2026-06-13T04:00:00Z"), groupStage: "Grupo D" },
      { teamA: "Estados Unidos", teamB: "Austrália", datetime: new Date("2026-06-19T19:00:00Z"), groupStage: "Grupo D" },
      { teamA: "Turquia", teamB: "Paraguai", datetime: new Date("2026-06-20T04:00:00Z"), groupStage: "Grupo D" },
      { teamA: "Turquia", teamB: "Estados Unidos", datetime: new Date("2026-06-26T02:00:00Z"), groupStage: "Grupo D" },
      { teamA: "Paraguai", teamB: "Austrália", datetime: new Date("2026-06-26T02:00:00Z"), groupStage: "Grupo D" },

      // ==================== GRUPO E ====================
      { teamA: "Alemanha", teamB: "Curaçao", datetime: new Date("2026-06-14T17:00:00Z"), groupStage: "Grupo E" },
      { teamA: "Costa do Marfim", teamB: "Equador", datetime: new Date("2026-06-14T23:00:00Z"), groupStage: "Grupo E" },
      { teamA: "Alemanha", teamB: "Costa do Marfim", datetime: new Date("2026-06-20T20:00:00Z"), groupStage: "Grupo E" },
      { teamA: "Equador", teamB: "Curaçao", datetime: new Date("2026-06-21T00:00:00Z"), groupStage: "Grupo E" },
      { teamA: "Curaçao", teamB: "Costa do Marfim", datetime: new Date("2026-06-25T20:00:00Z"), groupStage: "Grupo E" },
      { teamA: "Equador", teamB: "Alemanha", datetime: new Date("2026-06-25T20:00:00Z"), groupStage: "Grupo E" },

      // ==================== GRUPO F ====================
      { teamA: "Holanda", teamB: "Japão", datetime: new Date("2026-06-14T20:00:00Z"), groupStage: "Grupo F" },
      { teamA: "Suécia", teamB: "Tunísia", datetime: new Date("2026-06-15T02:00:00Z"), groupStage: "Grupo F" },
      { teamA: "Holanda", teamB: "Suécia", datetime: new Date("2026-06-20T20:00:00Z"), groupStage: "Grupo F" },
      { teamA: "Tunísia", teamB: "Japão", datetime: new Date("2026-06-21T04:00:00Z"), groupStage: "Grupo F" },
      { teamA: "Japão", teamB: "Suécia", datetime: new Date("2026-06-25T23:00:00Z"), groupStage: "Grupo F" },
      { teamA: "Tunísia", teamB: "Holanda", datetime: new Date("2026-06-25T23:00:00Z"), groupStage: "Grupo F" },

      // ==================== GRUPO G ====================
      { teamA: "Bélgica", teamB: "Egito", datetime: new Date("2026-06-15T19:00:00Z"), groupStage: "Grupo G" },
      { teamA: "Irã", teamB: "Nova Zelândia", datetime: new Date("2026-06-16T01:00:00Z"), groupStage: "Grupo G" },
      { teamA: "Bélgica", teamB: "Irã", datetime: new Date("2026-06-21T19:00:00Z"), groupStage: "Grupo G" },
      { teamA: "Nova Zelândia", teamB: "Egito", datetime: new Date("2026-06-22T01:00:00Z"), groupStage: "Grupo G" },
      { teamA: "Egito", teamB: "Irã", datetime: new Date("2026-06-27T03:00:00Z"), groupStage: "Grupo G" },
      { teamA: "Nova Zelândia", teamB: "Bélgica", datetime: new Date("2026-06-27T03:00:00Z"), groupStage: "Grupo G" },

      // ==================== GRUPO H ====================
      { teamA: "Espanha", teamB: "Cabo Verde", datetime: new Date("2026-06-15T16:00:00Z"), groupStage: "Grupo H" },
      { teamA: "Arábia Saudita", teamB: "Uruguai", datetime: new Date("2026-06-15T22:00:00Z"), groupStage: "Grupo H" },
      { teamA: "Espanha", teamB: "Arábia Saudita", datetime: new Date("2026-06-21T16:00:00Z"), groupStage: "Grupo H" },
      { teamA: "Uruguai", teamB: "Cabo Verde", datetime: new Date("2026-06-21T22:00:00Z"), groupStage: "Grupo H" },
      { teamA: "Cabo Verde", teamB: "Arábia Saudita", datetime: new Date("2026-06-27T00:00:00Z"), groupStage: "Grupo H" },
      { teamA: "Uruguai", teamB: "Espanha", datetime: new Date("2026-06-27T00:00:00Z"), groupStage: "Grupo H" },

      // ==================== GRUPO I ====================
      { teamA: "França", teamB: "Senegal", datetime: new Date("2026-06-16T19:00:00Z"), groupStage: "Grupo I" },
      { teamA: "Repescagem IC 2", teamB: "Noruega", datetime: new Date("2026-06-16T22:00:00Z"), groupStage: "Grupo I" },
      { teamA: "França", teamB: "Repescagem IC 2", datetime: new Date("2026-06-22T21:00:00Z"), groupStage: "Grupo I" },
      { teamA: "Noruega", teamB: "Senegal", datetime: new Date("2026-06-23T00:00:00Z"), groupStage: "Grupo I" },
      { teamA: "Noruega", teamB: "França", datetime: new Date("2026-06-26T19:00:00Z"), groupStage: "Grupo I" },
      { teamA: "Senegal", teamB: "Repescagem IC 2", datetime: new Date("2026-06-26T19:00:00Z"), groupStage: "Grupo I" },

      // ==================== GRUPO J ====================
      { teamA: "Argentina", teamB: "Argélia", datetime: new Date("2026-06-17T01:00:00Z"), groupStage: "Grupo J" },
      { teamA: "Áustria", teamB: "Jordânia", datetime: new Date("2026-06-17T04:00:00Z"), groupStage: "Grupo J" },
      { teamA: "Argentina", teamB: "Áustria", datetime: new Date("2026-06-22T17:00:00Z"), groupStage: "Grupo J" },
      { teamA: "Jordânia", teamB: "Argélia", datetime: new Date("2026-06-23T03:00:00Z"), groupStage: "Grupo J" },
      { teamA: "Argélia", teamB: "Áustria", datetime: new Date("2026-06-28T02:00:00Z"), groupStage: "Grupo J" },
      { teamA: "Jordânia", teamB: "Argentina", datetime: new Date("2026-06-28T02:00:00Z"), groupStage: "Grupo J" },

      // ==================== GRUPO K ====================
      { teamA: "Portugal", teamB: "Repescagem IC 1", datetime: new Date("2026-06-17T17:00:00Z"), groupStage: "Grupo K" },
      { teamA: "Uzbequistão", teamB: "Colômbia", datetime: new Date("2026-06-18T02:00:00Z"), groupStage: "Grupo K" },
      { teamA: "Portugal", teamB: "Uzbequistão", datetime: new Date("2026-06-23T17:00:00Z"), groupStage: "Grupo K" },
      { teamA: "Colômbia", teamB: "Repescagem IC 1", datetime: new Date("2026-06-24T02:00:00Z"), groupStage: "Grupo K" },
      { teamA: "Colômbia", teamB: "Portugal", datetime: new Date("2026-06-27T23:30:00Z"), groupStage: "Grupo K" },
      { teamA: "Repescagem IC 1", teamB: "Uzbequistão", datetime: new Date("2026-06-27T23:30:00Z"), groupStage: "Grupo K" },

      // ==================== GRUPO L ====================
      { teamA: "Inglaterra", teamB: "Croácia", datetime: new Date("2026-06-17T20:00:00Z"), groupStage: "Grupo L" },
      { teamA: "Gana", teamB: "Panamá", datetime: new Date("2026-06-17T23:00:00Z"), groupStage: "Grupo L" },
      { teamA: "Inglaterra", teamB: "Gana", datetime: new Date("2026-06-23T20:00:00Z"), groupStage: "Grupo L" },
      { teamA: "Panamá", teamB: "Croácia", datetime: new Date("2026-06-23T23:00:00Z"), groupStage: "Grupo L" },
      { teamA: "Panamá", teamB: "Inglaterra", datetime: new Date("2026-06-27T21:00:00Z"), groupStage: "Grupo L" },
      { teamA: "Croácia", teamB: "Gana", datetime: new Date("2026-06-27T21:00:00Z"), groupStage: "Grupo L" },
    ];

    for (const match of matches) {
      await prisma.match.create({ data: match });
    }

    return { success: true, message: `${matches.length} partidas da Copa 2026 criadas` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao seed Copa 2026" };
  } finally {
    await prisma.$disconnect();
  }
}
