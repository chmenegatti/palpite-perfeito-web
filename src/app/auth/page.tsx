"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Target,
  Trophy,
  Crown,
  Crosshair,
  Eye,
  EyeOff,
  DollarSign,
  Medal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import { signUp, login } from "@/app/actions/auth";
import { toast } from "sonner";

type TabType = "scoring" | "prize";

/* ── Scoring & Prize info panel (shared mobile + desktop) ── */
function InfoPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("scoring");
  const [expandedSection, setExpandedSection] = useState<string>("match");

  const toggleSection = (name: string) => {
    setExpandedSection((prev) => (prev === name ? "" : name));
  };

  /* ── Scoring items ── */
  const scoringItems = [
    { icon: Target, iconBg: "bg-gold/20", pts: "25", ptsColor: "text-gold", title: "Placar Exato", desc: "Acertou o placar completo da partida", highlight: true },
    { icon: Trophy, iconBg: "bg-gold/20", pts: "20", ptsColor: "text-gold", title: "Vencedor + Gols de 1 Time", desc: "Acertou quem venceu e os gols de um dos times", highlight: true },
    { icon: Star, iconBg: "bg-white/10", pts: "18", ptsColor: "text-white/70", title: "Empate Não Exato", desc: "Acertou que empatou, mas errou o número de gols", highlight: false },
    { icon: Star, iconBg: "bg-white/10", pts: "15", ptsColor: "text-white/70", title: "Vencedor Seco", desc: "Acertou só quem venceu, mas errou os placares", highlight: false },
    { icon: Zap, iconBg: "bg-white/10", pts: "5", ptsColor: "text-white/70", title: "Gols de um Time (Venc. Errado)", desc: "Errou o vencedor, mas acertou os gols de um time", highlight: false },
  ];

  const bonusItems = [
    { icon: Crosshair, iconBg: "bg-gold/20", pts: "35 ou 20", ptsColor: "text-gold", title: "Artilheiro", desc: "35 = jogador + gols, 20 = apenas jogador", highlight: true },
    { icon: Crown, iconBg: "bg-gold/20", pts: "90, 70 ou 50", ptsColor: "text-gold", title: "Campeão", desc: "90 = campeão + placar + vice, 70 = campeão + placar, 50 = só campeão", highlight: true },
  ];

  return (
    <div className="w-full min-h-105">
      {/* Tabs */}
      <div className="flex rounded-lg bg-white/5 p-1 mb-4">
        <button
          onClick={() => setActiveTab("scoring")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm md:text-base xl:text-lg font-medium transition-all ${activeTab === "scoring"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-white/50 hover:text-white/80"
            }`}
        >
          <Star className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
          Pontuação
        </button>
        <button
          onClick={() => setActiveTab("prize")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2 text-sm md:text-base xl:text-lg font-medium transition-all ${activeTab === "prize"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-white/50 hover:text-white/80"
            }`}
        >
          <Award className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
          Premiação
        </button>
      </div>

      {/* Scoring Tab */}
      {activeTab === "scoring" && (
        <div className="space-y-2">
          {/* Match Scoring */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => toggleSection("match")}
              className="w-full flex items-center justify-between p-3 md:p-4 xl:p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 xl:h-5 xl:w-5 text-gold" />
                <span className="text-sm md:text-base xl:text-lg font-semibold">Pontuação por Partida</span>
              </div>
              {expandedSection === "match" ? (
                <ChevronUp className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              ) : (
                <ChevronDown className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              )}
            </button>
            {expandedSection === "match" && (
              <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 space-y-3">
                {scoringItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`flex h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 shrink-0 items-center justify-center rounded-full ${item.iconBg} mt-0.5`}>
                      <item.icon className={`h-2.5 w-2.5 md:h-3 md:w-3 xl:h-4 xl:w-4 ${item.iconBg.includes("gold") ? "text-gold" : "text-white/60"}`} />
                    </div>
                    <div>
                      <p className="text-sm md:text-[15px] xl:text-[17px] font-semibold">
                        <span className={item.ptsColor}>{item.pts} pts</span>{" "}
                        <span className={item.highlight ? "text-white/90" : "text-white/80"}>{item.title}</span>
                      </p>
                      <p className="text-xs md:text-[13px] xl:text-[15px] text-white/40 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bonus Section */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => toggleSection("bonus")}
              className="w-full flex items-center justify-between p-3 md:p-4 xl:p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 xl:h-5 xl:w-5 text-gold" />
                <span className="text-sm md:text-base xl:text-lg font-semibold">Bônus Especiais</span>
              </div>
              {expandedSection === "bonus" ? (
                <ChevronUp className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              ) : (
                <ChevronDown className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              )}
            </button>
            {expandedSection === "bonus" && (
              <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 space-y-3">
                {bonusItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={`flex h-5 w-5 md:h-6 md:w-6 xl:h-7 xl:w-7 shrink-0 items-center justify-center rounded-full ${item.iconBg} mt-0.5`}>
                      <item.icon className={`h-2.5 w-2.5 md:h-3 md:w-3 xl:h-4 xl:w-4 ${item.iconBg.includes("gold") ? "text-gold" : "text-white/60"}`} />
                    </div>
                    <div>
                      <p className="text-sm md:text-[15px] xl:text-[17px] font-semibold">
                        <span className={item.ptsColor}>{item.pts} pts</span>{" "}
                        <span className="text-white/90">{item.title}</span>
                      </p>
                      <p className="text-xs md:text-[13px] xl:text-[15px] text-white/40 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prize Tab */}
      {activeTab === "prize" && (
        <div className="space-y-2">
          {/* Distribution */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => toggleSection("distribution")}
              className="w-full flex items-center justify-between p-3 md:p-4 xl:p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 xl:h-5 xl:w-5 text-gold" />
                <span className="text-sm md:text-base xl:text-lg font-semibold">Distribuição do Prêmio</span>
              </div>
              {expandedSection === "distribution" ? (
                <ChevronUp className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              ) : (
                <ChevronDown className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              )}
            </button>
            {expandedSection === "distribution" && (
              <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 space-y-3">
                <p className="text-xs md:text-sm xl:text-base text-white/50 mb-2">
                  Modelo Top Heavy — quem fica em 1º leva a maior fatia!
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 md:p-3 xl:p-4 rounded-lg bg-gold/10 border border-gold/20">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg xl:text-xl">🥇</span>
                      <span className="text-sm md:text-base xl:text-lg font-semibold">1º Lugar</span>
                    </div>
                    <span className="text-base md:text-lg xl:text-xl font-bold text-gold">70%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 md:p-3 xl:p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg xl:text-xl">🥈</span>
                      <span className="text-sm md:text-base xl:text-lg font-semibold">2º Lugar</span>
                    </div>
                    <span className="text-sm md:text-base xl:text-lg font-bold text-white/70">20%</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 md:p-3 xl:p-4 rounded-lg bg-amber-700/10 border border-amber-700/20">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg xl:text-xl">🥉</span>
                      <span className="text-sm md:text-base xl:text-lg font-semibold">3º Lugar</span>
                    </div>
                    <span className="text-sm md:text-base xl:text-lg font-bold text-amber-400">10%</span>
                  </div>
                </div>
                <div className="p-2.5 md:p-3 xl:p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[11px] md:text-xs xl:text-sm text-white/50">
                    💡 <strong>Exemplo:</strong> Prize pool de R$1.000 → 1º: R$700 | 2º: R$200 | 3º: R$100
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => toggleSection("payment")}
              className="w-full flex items-center justify-between p-3 md:p-4 xl:p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 xl:h-5 xl:w-5 text-gold" />
                <span className="text-sm md:text-base xl:text-lg font-semibold">Como Funciona o Pagamento</span>
              </div>
              {expandedSection === "payment" ? (
                <ChevronUp className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              ) : (
                <ChevronDown className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              )}
            </button>
            {expandedSection === "payment" && (
              <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 space-y-3">
                {[
                  { emoji: "📅", q: "Quando?", a: "Até 7 dias úteis após o fim da Copa" },
                  { emoji: "💳", q: "Como?", a: "Transferência via PIX" },
                  { emoji: "✅", q: "Requisitos", a: "Pagamento confirmado + cadastro atualizado" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-sm xl:text-base">{item.emoji}</span>
                    <div>
                      <p className="text-xs md:text-sm xl:text-base font-medium text-white/80">{item.q}</p>
                      <p className="text-[11px] md:text-xs xl:text-sm text-white/50">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tiebreak */}
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <button
              onClick={() => toggleSection("tiebreak")}
              className="w-full flex items-center justify-between p-3 md:p-4 xl:p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 xl:h-5 xl:w-5 text-gold" />
                <span className="text-sm md:text-base xl:text-lg font-semibold">Critérios de Desempate</span>
              </div>
              {expandedSection === "tiebreak" ? (
                <ChevronUp className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              ) : (
                <ChevronDown className="h-4 w-4 xl:h-5 xl:w-5 text-white/50" />
              )}
            </button>
            {expandedSection === "tiebreak" && (
              <div className="px-3 md:px-4 xl:px-5 pb-3 md:pb-4 xl:pb-5 space-y-2">
                {[
                  "Mais acertos exatos de placar",
                  "Mais acertos de vencedor/empate",
                  "Menor diferença de gols",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 xl:h-6 xl:w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] xl:text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <p className="text-xs md:text-sm xl:text-base text-white/60">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setError(null);

    if (!isLogin) {
      const password = (formData.get("password") as string | null) ?? "";
      const confirmPassword = (formData.get("confirmPassword") as string | null) ?? "";

      if (password !== confirmPassword) {
        const message = "As senhas não coincidem.";
        setError(message);
        toast.error(message);
        return;
      }
    }

    startTransition(async () => {
      if (isLogin) {
        const result = await login(formData);
        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
        }
      } else {
        const result = await signUp(formData);
        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
        } else if (result?.success) {
          toast.success("Conta criada! Faça login.");
          setIsLogin(true);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Mobile: stacked layout ── */}
      <div className="lg:hidden">
        {/* Mobile header */}
        <div className="bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white px-4 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/20">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">
                Palpite Perfeito
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-white/50">
                Copa do Mundo 2026
              </p>
            </div>
          </div>

          {/* Mobile Auth Form */}
          <div className="bg-white rounded-2xl p-5 text-foreground shadow-xl">
            <div className="mb-5">
              <h2 className="font-display text-xl font-bold">
                {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin
                  ? "Acesse sua conta para ver seus palpites"
                  : "Registre-se para começar a apostar"}
              </p>
            </div>

            <form action={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Nome
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome"
                    className="h-11"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "••••••••" : "Mín. 6 caracteres"}
                    className="h-11 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className="h-11 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? "Ocultar" : "Visualizar"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                disabled={isPending}
              >
                {isPending ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <Separator className="my-5" />

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        </div>

        {/* Mobile Info Section */}
        <div className="bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white px-4 pb-6">
          <InfoPanel />
        </div>
      </div>

      {/* ── Desktop: side-by-side ── */}
      <div className="hidden lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:py-8 bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950">
        <div className="w-full xl:max-w-[60%] flex shadow-2xl rounded-2xl overflow-hidden">
          {/* LEFT - Dark panel with info */}
          <div className="lg:w-3/5 flex flex-col bg-linear-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 xl:p-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 xl:h-12 xl:w-12 items-center justify-center rounded-xl bg-primary ring-1 ring-primary/50 shadow-lg shadow-primary/20">
                <Trophy className="h-5 w-5 xl:h-6 xl:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl xl:text-2xl font-bold tracking-tight">
                  Palpite Perfeito
                </h1>
                <p className="text-[10px] xl:text-xs uppercase tracking-widest text-white/50">
                  Copa do Mundo 2026
                </p>
              </div>
            </div>

            <p className="text-sm xl:text-base text-white/60 mb-6 max-w-lg">
              Dê seus palpites nas partidas da Copa e dispute com seus amigos!
            </p>

            <div className="flex-1 overflow-hidden">
              <InfoPanel />
            </div>
          </div>

          {/* RIGHT - Clean auth form (40%) */}
          <div className="lg:w-2/5 flex items-center justify-center p-8 xl:p-10 bg-background">
            <div className="w-full max-w-md">
              {/* Title */}
              <div className="mb-8">
                <h2 className="font-display text-2xl xl:text-3xl font-bold">
                  {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
                </h2>
                <p className="text-base xl:text-lg text-muted-foreground mt-2">
                  {isLogin
                    ? "Acesse sua conta para ver seus palpites"
                    : "Registre-se para começar a apostar"}
                </p>
              </div>

              {/* Form */}
              <form action={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Nome
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      className="h-12 text-base xl:text-lg"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="h-12 text-base xl:text-lg"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "••••••••" : "Mín. 6 caracteres"}
                      className="h-12 text-base xl:text-lg pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Ocultar senha" : "Visualizar senha"}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5 xl:h-4 xl:w-4" /> : <Eye className="h-3.5 w-3.5 xl:h-4 xl:w-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        className="h-12 text-base xl:text-lg pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? "Ocultar" : "Visualizar"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 xl:h-4 xl:w-4" /> : <Eye className="h-3.5 w-3.5 xl:h-4 xl:w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-sm xl:text-base text-destructive text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base xl:text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                  disabled={isPending}
                >
                  {isPending ? "Aguarde..." : isLogin ? "Entrar" : "Criar Conta"}
                </Button>
              </form>

              <Separator className="my-6" />

              <p className="text-center text-sm xl:text-base text-muted-foreground">
                {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Criar conta" : "Entrar"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
