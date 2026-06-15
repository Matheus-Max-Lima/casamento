"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  User, Heart, DollarSign, Trash2, Save, Loader2,
  AlertTriangle, Lock, MapPin, Calendar, Users,
  Palette, CheckCircle2, Circle,
} from "lucide-react";

interface WeddingData {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string | null;
  city: string | null;
  totalBudget: number;
  guestCount: number;
  theme: string | null;
  style: string | null;
}

interface FormState {
  name: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  city: string;
  theme: string;
  style: string;
  totalBudget: string;
  guestCount: string;
}

const INITIAL_FORM: FormState = {
  name: "", brideName: "", groomName: "", weddingDate: "",
  venue: "", city: "", theme: "", style: "", totalBudget: "", guestCount: "",
};

const STYLES = ["Elegante", "Rústico", "Boho", "Moderno", "Clássico", "Romântico", "Tropical", "Minimalista", "Luxuoso", "Descontraído"];
const THEMES = ["Romântico Clássico", "Jardim Botânico", "Rústico Chic", "Praia", "Minimalista", "Hollywood Glamour", "Provençal", "Tropical", "Vintage", "Contemporâneo", "Palácio", "Campo"];

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition ${className}`}
    >
      {children}
    </select>
  );
}

function SectionCard({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-gray-50 ${color}`}>
        {icon}
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </section>
  );
}

function completionScore(form: FormState, email: string) {
  const fields = [
    form.name, email, form.brideName, form.groomName,
    form.weddingDate, form.venue, form.city,
    form.theme, form.style, form.totalBudget, form.guestCount,
  ];
  const filled = fields.filter(f => f && f.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function daysUntilWedding(dateStr: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Password
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmail(data.user?.email || "");
      const w: WeddingData | null = data.wedding;
      setForm({
        name: data.user?.name || "",
        brideName: w?.brideName || "",
        groomName: w?.groomName || "",
        weddingDate: w?.weddingDate ? new Date(w.weddingDate).toISOString().split("T")[0] : "",
        venue: w?.venue || "",
        city: w?.city || "",
        theme: w?.theme || "",
        style: w?.style || "",
        totalBudget: w?.totalBudget ? w.totalBudget.toString() : "",
        guestCount: w?.guestCount ? w.guestCount.toString() : "",
      });
      setDirty(false);
    } catch {
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brideName.trim() || !form.groomName.trim()) {
      toast.error("Nome da noiva e do noivo são obrigatórios");
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          brideName: form.brideName,
          groomName: form.groomName,
          weddingDate: form.weddingDate || undefined,
          venue: form.venue || null,
          city: form.city || null,
          theme: form.theme || null,
          style: form.style || null,
          totalBudget: parseFloat(form.totalBudget) || 0,
          guestCount: parseInt(form.guestCount) || 0,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Configurações salvas!");
      setDirty(false);
    } catch {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.confirm) { toast.error("As senhas não coincidem"); return; }
    if (pw.next.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    try {
      setSavingPw(true);
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro ao alterar senha"); return; }
      toast.success("Senha alterada com sucesso!");
      setPw({ current: "", next: "", confirm: "" });
    } catch {
      toast.error("Erro ao alterar senha");
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDelete() {
    if (deleteInput !== "DELETAR") { toast.error('Digite "DELETAR" para confirmar'); return; }
    try {
      setDeleting(true);
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Conta deletada.");
      router.push("/");
    } catch {
      toast.error("Erro ao deletar conta");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const score = completionScore(form, email);
  const days = daysUntilWedding(form.weddingDate);
  const initials = (form.name || email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-16">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie seu perfil e as informações do casamento</p>
        </div>
        {dirty && (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Alterações não salvas
          </span>
        )}
      </div>

      {/* Progress + Countdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Setup progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Perfil completo</span>
            <span className="text-lg font-bold text-rose-500">{score}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="space-y-1">
            {[
              { label: "Nome", done: !!form.name },
              { label: "Noiva & Noivo", done: !!(form.brideName && form.groomName) },
              { label: "Data do casamento", done: !!form.weddingDate },
              { label: "Local", done: !!(form.venue || form.city) },
              { label: "Orçamento", done: !!form.totalBudget },
            ].map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                {done
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  : <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 text-rose-100 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            {form.weddingDate
              ? new Date(form.weddingDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
              : "Data não definida"}
          </div>
          {days !== null ? (
            <div className="mt-4">
              <div className="text-5xl font-black leading-none">{days > 0 ? days : 0}</div>
              <div className="text-rose-100 text-sm mt-1 font-medium">
                {days > 1 ? "dias para o grande dia" : days === 1 ? "dia para o grande dia!" : days === 0 ? "É hoje! 🎉" : "O casamento já aconteceu 💍"}
              </div>
            </div>
          ) : (
            <div className="text-rose-200 text-sm mt-4">Defina a data para ver a contagem regressiva</div>
          )}
          {form.brideName && form.groomName && (
            <div className="text-white font-semibold text-sm mt-3 border-t border-rose-400 pt-3">
              {form.brideName} & {form.groomName}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <SectionCard
          icon={<div className="p-1.5 bg-purple-100 rounded-lg"><User className="w-4 h-4 text-purple-600" /></div>}
          title="Perfil da conta"
          color="bg-purple-50/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow">
              {initials}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-800">{form.name || "Seu nome"}</div>
              <div className="text-gray-400 text-xs mt-0.5">{email}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Seu nome">
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nome completo" />
            </Field>
            <Field label="Email" hint="O email não pode ser alterado">
              <Input value={email} disabled />
            </Field>
          </div>
        </SectionCard>

        {/* Wedding */}
        <SectionCard
          icon={<div className="p-1.5 bg-rose-100 rounded-lg"><Heart className="w-4 h-4 text-rose-500" /></div>}
          title="Informações do casamento"
          color="bg-rose-50/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome da noiva *">
              <Input
                value={form.brideName}
                onChange={e => set("brideName", e.target.value)}
                placeholder="Nome da noiva"
                required
              />
            </Field>
            <Field label="Nome do noivo *">
              <Input
                value={form.groomName}
                onChange={e => set("groomName", e.target.value)}
                placeholder="Nome do noivo"
                required
              />
            </Field>
            <Field label="Data do casamento">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="date"
                  value={form.weddingDate}
                  onChange={e => set("weddingDate", e.target.value)}
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Cidade">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  value={form.city}
                  onChange={e => set("city", e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  className="pl-9"
                />
              </div>
            </Field>
            <Field label="Local / Espaço" hint="Nome do salão, fazenda ou hotel">
              <div className="relative sm:col-span-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  value={form.venue}
                  onChange={e => set("venue", e.target.value)}
                  placeholder="Nome do espaço ou local da cerimônia"
                  className="pl-9"
                />
              </div>
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Estilo do casamento">
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Select value={form.style} onChange={e => set("style", e.target.value)} className="pl-9">
                  <option value="">Selecione um estilo</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </Field>
            <Field label="Tema do casamento">
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Select value={form.theme} onChange={e => set("theme", e.target.value)} className="pl-9">
                  <option value="">Selecione um tema</option>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
            </Field>
          </div>
        </SectionCard>

        {/* Budget & Guests */}
        <SectionCard
          icon={<div className="p-1.5 bg-green-100 rounded-lg"><DollarSign className="w-4 h-4 text-green-600" /></div>}
          title="Orçamento e convidados"
          color="bg-green-50/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Orçamento total" hint="Usado para calcular percentuais e gastos">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">R$</span>
                <Input
                  type="number"
                  value={form.totalBudget}
                  onChange={e => set("totalBudget", e.target.value)}
                  placeholder="0"
                  min={0}
                  step={500}
                  className="pl-10"
                />
              </div>
            </Field>
            <Field label="Meta de convidados" hint="Número estimado de convidados">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="number"
                  value={form.guestCount}
                  onChange={e => set("guestCount", e.target.value)}
                  placeholder="0"
                  min={0}
                  className="pl-9"
                />
              </div>
            </Field>
          </div>

          {/* Summary bar */}
          {(form.totalBudget || form.guestCount) && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {form.totalBudget && (
                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <div className="text-lg font-bold text-green-700">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(parseFloat(form.totalBudget) || 0)}
                  </div>
                  <div className="text-xs text-green-600 mt-0.5">Orçamento total</div>
                </div>
              )}
              {form.guestCount && (
                <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                  <div className="text-lg font-bold text-blue-700">{parseInt(form.guestCount) || 0}</div>
                  <div className="text-xs text-blue-600 mt-0.5">Convidados previstos</div>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* Save */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-500">
            {dirty ? "Você tem alterações não salvas." : "Tudo salvo."}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Salvando..." : "Salvar configurações"}
          </button>
        </div>
      </form>

      {/* Password */}
      <SectionCard
        icon={<div className="p-1.5 bg-blue-100 rounded-lg"><Lock className="w-4 h-4 text-blue-600" /></div>}
        title="Segurança — Alterar senha"
        color="bg-blue-50/50"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="Senha atual">
            <Input
              type="password"
              value={pw.current}
              onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
              placeholder="Digite sua senha atual"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nova senha">
              <Input
                type="password"
                value={pw.next}
                onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
              />
            </Field>
            <Field label="Confirmar nova senha">
              <Input
                type="password"
                value={pw.confirm}
                onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Repita a nova senha"
                className={pw.confirm && pw.confirm !== pw.next ? "border-red-300 focus:ring-red-300" : ""}
              />
            </Field>
          </div>
          {pw.confirm && pw.next && pw.confirm !== pw.next && (
            <p className="text-xs text-red-500">As senhas não coincidem</p>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPw || !pw.next || pw.next !== pw.confirm}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {savingPw ? "Salvando..." : "Alterar senha"}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* Danger Zone */}
      <section className="bg-white rounded-2xl border-2 border-red-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-50 bg-red-50/50">
          <div className="p-1.5 bg-red-100 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-500" /></div>
          <h2 className="text-base font-semibold text-red-700">Zona de perigo</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Ao deletar sua conta, <strong>todos os dados serão permanentemente removidos</strong> — convidados, orçamento, checklist, fornecedores e todo o planejamento. Esta ação não pode ser desfeita.
          </p>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 border-2 border-red-300 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Deletar minha conta
            </button>
          ) : (
            <div className="space-y-3 bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-sm font-medium text-red-700">
                Para confirmar, digite <span className="font-mono font-bold">DELETAR</span> abaixo:
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={e => setDeleteInput(e.target.value)}
                placeholder="DELETAR"
                className="w-full border border-red-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
              />
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleDelete}
                  disabled={deleting || deleteInput !== "DELETAR"}
                  className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Confirmar exclusão
                </button>
                <button
                  onClick={() => { setDeleteConfirm(false); setDeleteInput(""); }}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
