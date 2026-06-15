"use client";

import { useState, useEffect } from "react";
import { Plus, X, ChevronUp, ChevronDown, Printer, Trash2, Edit3, Clock, MapPin, User, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  responsible?: string;
  category: string;
  order: number;
};

const CATEGORIES = [
  { value: "preparation", label: "Preparação", color: "bg-pink-100 text-pink-700 border-pink-200", dot: "bg-pink-400", line: "from-pink-200" },
  { value: "ceremony", label: "Cerimônia", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-[#d4af37]", line: "from-amber-200" },
  { value: "reception", label: "Recepção", color: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-400", line: "from-purple-200" },
  { value: "party", label: "Festa", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400", line: "from-blue-200" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

const emptyForm = {
  title: "",
  description: "",
  startTime: "08:00",
  endTime: "",
  location: "",
  responsible: "",
  category: "ceremony",
};

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Google Calendar state
  const [calendarConnected, setCalendarConnected] = useState<boolean | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCalendarStatus();
    // Handle redirect back from Google OAuth
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("calendar") === "connected") {
        setCalendarConnected(true);
        toast.success("Google Agenda conectado com sucesso!");
        window.history.replaceState({}, "", "/timeline");
      } else if (params.get("calendar") === "error") {
        toast.error("Erro ao conectar com o Google Agenda.");
        window.history.replaceState({}, "", "/timeline");
      }
    }
  }, []);

  async function fetchCalendarStatus() {
    try {
      const res = await fetch("/api/integrations/status");
      if (res.ok) {
        const data = await res.json();
        setCalendarConnected(data.googleCalendar);
      }
    } catch {}
  }

  async function syncCalendar() {
    setSyncing(true);
    try {
      const res = await fetch("/api/integrations/google-calendar/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.synced} evento(s) sincronizado(s) com o Google Agenda!`);
      } else {
        toast.error("Erro ao sincronizar com o Google Agenda.");
      }
    } catch {
      toast.error("Erro ao sincronizar com o Google Agenda.");
    }
    setSyncing(false);
  }

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/timeline");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const maxOrder = items.length > 0 ? Math.max(...items.map((x) => x.order)) + 1 : 0;
    if (editingId) {
      const res = await fetch(`/api/timeline/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((v) => v.map((x) => (x.id === editingId ? updated : x)));
      }
    } else {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: maxOrder }),
      });
      if (res.ok) {
        const created = await res.json();
        setItems((v) => [...v, created]);
      }
    }
    setSaving(false);
    cancelForm();
  }

  async function deleteItem(id: string) {
    if (!confirm("Remover este evento da cronologia?")) return;
    await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    setItems((v) => v.filter((x) => x.id !== id));
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.id === id);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const current = sorted[idx];
    const target = sorted[targetIdx];
    const newOrder = target.order;
    const targetNewOrder = current.order;

    // Update both in parallel
    await Promise.all([
      fetch(`/api/timeline/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      }),
      fetch(`/api/timeline/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: targetNewOrder }),
      }),
    ]);

    setItems((v) =>
      v.map((x) => {
        if (x.id === current.id) return { ...x, order: newOrder };
        if (x.id === target.id) return { ...x, order: targetNewOrder };
        return x;
      })
    );
  }

  function startEdit(item: TimelineItem) {
    setForm({
      title: item.title,
      description: item.description || "",
      startTime: item.startTime,
      endTime: item.endTime || "",
      location: item.location || "",
      responsible: item.responsible || "",
      category: item.category,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function handlePrint() {
    window.print();
  }

  const sorted = [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.startTime.localeCompare(b.startTime);
  });

  const filtered = categoryFilter === "all" ? sorted : sorted.filter((x) => x.category === categoryFilter);

  return (
    <div className="min-h-screen bg-[#fdf8f5] print:bg-white">
      {/* Header */}
      <div className="bg-white border-b border-rose-100 px-6 py-5 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Cronograma do Dia</h1>
            <p className="text-stone-500 text-sm mt-0.5">Organize cada momento do seu casamento</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {calendarConnected === false && (
              <a
                href="/api/integrations/google-calendar/connect"
                className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors"
              >
                <CalendarCheck className="w-4 h-4" />
                Conectar Google Agenda
              </a>
            )}
            {calendarConnected === true && (
              <button
                onClick={syncCalendar}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 bg-blue-50 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <CalendarCheck className="w-4 h-4" />
                {syncing ? "Sincronizando..." : "Sincronizar com Google Agenda"}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-stone-200 text-stone-600 rounded-xl font-medium text-sm hover:bg-stone-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyForm }); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#f43f5e] text-white rounded-xl font-medium text-sm hover:bg-rose-600 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Novo Evento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 print:hidden">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === "all" ? "bg-[#f43f5e] text-white" : "bg-white text-stone-600 border border-stone-200 hover:border-rose-200"
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                categoryFilter === cat.value
                  ? `${cat.color} border-current`
                  : "bg-white text-stone-600 border-stone-200 hover:border-rose-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden print:hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
              <h3 className="font-semibold text-stone-800">
                {editingId ? "Editar Evento" : "Novo Evento"}
              </h3>
              <button onClick={cancelForm} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-stone-600">Título *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Maquiagem da noiva"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Horário de início *</label>
                <input
                  required
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Horário de término</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Responsável</label>
                <input
                  value={form.responsible}
                  onChange={(e) => setForm((f) => ({ ...f, responsible: e.target.value }))}
                  placeholder="Nome do responsável"
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-stone-600">Local</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Ex: Salão principal, Quarto da noiva..."
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-stone-600">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Detalhes do evento..."
                  rows={2}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#f43f5e] text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  {saving ? "Salvando..." : editingId ? "Atualizar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timeline */}
        {loading ? (
          <div className="text-center py-16 text-stone-400">Carregando cronograma...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⏰</div>
            <p className="text-stone-500 font-medium">Nenhum evento no cronograma</p>
            <p className="text-stone-400 text-sm mt-1">Adicione os momentos do seu dia especial</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-amber-200 to-purple-200 print:left-6" />

            <div className="space-y-4">
              {filtered.map((item, idx) => {
                const cat = CAT_MAP[item.category] || CATEGORIES[0];
                const isFirst = idx === 0;
                const isLast = idx === filtered.length - 1;
                return (
                  <div key={item.id} className="relative flex gap-6 group print:gap-4">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md mt-4 ${cat.dot}`} />
                    </div>

                    {/* Card */}
                    <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 p-4 hover:shadow-md transition-shadow print:shadow-none print:border-stone-200`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {/* Time */}
                          <div className="flex items-center gap-2 mb-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-[#f43f5e]">
                              {item.startTime}
                              {item.endTime && ` – ${item.endTime}`}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.color}`}>
                              {cat.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-stone-800">{item.title}</h3>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            {item.location && (
                              <span className="flex items-center gap-1 text-xs text-stone-500">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </span>
                            )}
                            {item.responsible && (
                              <span className="flex items-center gap-1 text-xs text-stone-500">
                                <User className="w-3 h-3" />
                                {item.responsible}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{item.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-center gap-1 print:hidden">
                          <button
                            onClick={() => moveItem(item.id, "up")}
                            disabled={isFirst}
                            className="p-1 rounded-lg text-stone-300 hover:text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveItem(item.id, "down")}
                            disabled={isLast}
                            className="p-1 rounded-lg text-stone-300 hover:text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1 rounded-lg text-stone-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .bg-\\[\\#fdf8f5\\] { background: white !important; }
        }
      `}</style>
    </div>
  );
}
