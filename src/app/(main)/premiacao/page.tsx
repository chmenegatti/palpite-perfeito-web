import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Medal, Award, DollarSign, Users, Target, ChevronUp, ChevronDown, Sparkles } from "lucide-react";

export default function PremiacaoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Premiação
        </h1>
        <p className="text-muted-foreground mt-1">
          Veja como funciona a distribuição dos prêmios do bolão
        </p>
      </div>

      {/* Modelo de Premiação */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Modelo Top Heavy 🏆
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nosso bolão utiliza o modelo <strong>Top Heavy</strong>, que premia de forma mais competitiva os primeiros colocados. 
            Quanto melhor sua posição, maior sua fatia do prêmio! 🚀
          </p>
          
          <Separator />

          {/* Tabela de Distribuição */}
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Colocação</th>
                  <th className="text-right p-4 font-semibold">% do Prize Pool</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥇</span>
                      <div>
                        <p className="font-semibold">1º Lugar</p>
                        <p className="text-xs text-muted-foreground">O grande campeão!</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-2xl font-bold text-yellow-600">70%</span>
                  </td>
                </tr>
                <tr className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥈</span>
                      <div>
                        <p className="font-semibold">2º Lugar</p>
                        <p className="text-xs text-muted-foreground">Vice-campeão</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-xl font-bold text-gray-500">20%</span>
                  </td>
                </tr>
                <tr className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥉</span>
                      <div>
                        <p className="font-semibold">3º Lugar</p>
                        <p className="text-xs text-muted-foreground">Terceiro colocado</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-lg font-bold text-amber-700">10%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo Prático */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Exemplo Prático 💰
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Vamos supor que o <strong>prize pool total</strong> seja de <strong>R$ 1.000</strong>. 
            A distribuição ficaria assim:
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <span className="font-semibold">1º Lugar</span>
              </div>
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">R$ 700</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥈</span>
                <span className="font-semibold">2º Lugar</span>
              </div>
              <span className="text-xl font-bold text-gray-600 dark:text-gray-300">R$ 200</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥉</span>
                <span className="font-semibold">3º Lugar</span>
              </div>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">R$ 100</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Nota:</strong> O valor do prize pool depende do número de participantes e do valor de entrada. 
              Quanto mais pessoas participarem, maior o prêmio!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Como Ganhar Mais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Como Aumentar suas Chances? 🎯
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <ChevronUp className="h-5 w-5 text-green-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium">Acerte os placares exatos</p>
                <p className="text-sm text-muted-foreground">
                  Cada acerto exato vale mais pontos no ranking geral
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ChevronUp className="h-5 w-5 text-green-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium">Aposte no artilheiro e campeão</p>
                <p className="text-sm text-muted-foreground">
                  As apostas especiais valem pontos extras que podem fazer a diferença
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ChevronUp className="h-5 w-5 text-green-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium">Seja consistente</p>
                <p className="text-sm text-muted-foreground">
                  Acertar em todas as rodadas é mais importante que acertar muito em apenas uma
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critérios de Desempate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-purple-500" />
            Critérios de Desempate ⚖️
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Em caso de empate na pontuação total, os critérios de desempate são:
          </p>

          <ol className="space-y-3 list-none counter-reset: item">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-medium">Mais acertos exatos de placar</p>
                <p className="text-sm text-muted-foreground">
                  Quem acertou mais placares exatamente como foram
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-medium">Mais acertos de vencedor/empate</p>
                <p className="text-sm text-muted-foreground">
                  Quem acertou mais vezes quem venceria ou se seria empate
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-medium">Menor diferença de gols</p>
                <p className="text-sm text-muted-foreground">
                  Quem chegou mais perto do placar real em termos de diferença
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            Como Funciona o Pagamento? 💸
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-xl">📅</span>
              <div>
                <p className="font-medium">Quando?</p>
                <p className="text-sm text-muted-foreground">
                  O pagamento será feito em até <strong>7 dias úteis</strong> após o término oficial da Copa do Mundo 2026
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">💳</span>
              <div>
                <p className="font-medium">Como?</p>
                <p className="text-sm text-muted-foreground">
                  Transferência via <strong>PIX</strong> para a chave cadastrada na plataforma
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-medium">Requisitos</p>
                <p className="text-sm text-muted-foreground">
                  Para receber o prêmio, o participante deve estar com o <strong>pagamento confirmado</strong> 
                  e o cadastro atualizado com dados válidos
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm">
              🔒 <strong>Importante:</strong> Apenas participantes com pagamento confirmado participam da premiação. 
              Fique atento para confirmar seu pagamento na aba <strong>&quot;Meu Perfil&quot;</strong>!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Rápido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Perguntas Frequentes ❓
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">O que acontece se eu for o único participante?</p>
              <p className="text-sm text-muted-foreground">
                Você ganha 100% do prize pool! 🎉
              </p>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-1">Posso receber o prêmio em outra moeda?</p>
              <p className="text-sm text-muted-foreground">
                Não, todos os pagamentos são feitos em Reais (BRL) via PIX.
              </p>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-1">E se houver empate no 3º lugar?</p>
              <p className="text-sm text-muted-foreground">
                O valor do 3º lugar será dividido igualmente entre os empatados após aplicar os critérios de desempate.
              </p>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-1">O organizador também pode ganhar?</p>
              <p className="text-sm text-muted-foreground">
                Sim! O administrador do bolão participa normalmente e pode ganhar prêmios como qualquer outro participante.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
