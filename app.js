/* =========================================================
   KONFIGURATION
   ---------------------------------------------------------
   Zustellung per FormSubmit (https://formsubmit.co), kein Account nötig.
   1. Trage unten deine E-Mail-Adresse ein (oder nach der Aktivierung
      den zufälligen Alias, den FormSubmit dir schickt – dann steht
      deine echte Adresse nicht öffentlich im Repo).
   2. Beim allerersten Absenden schickt FormSubmit dir eine
      Aktivierungs-Mail. Einmal bestätigen, danach kommt alles an.
      -> Am besten einmal selbst testen, BEVOR du den Link verschickst.
   Bleibt das Feld leer, bekommt sie am Ende einen Button
   "Per Mail senden" bzw. "Kopieren" als Fallback.
   ========================================================= */
const CONFIG = {
  formsubmitTarget: "", // z. B. "deine@mail.de" oder "a1b2c3d4e5f6..."
  fallbackMail: "",     // Adresse für den mailto-Fallback (optional)
};

/* =========================================================
   DATESPOTS & AKTIVITÄTEN PRO ORT
   ---------------------------------------------------------
   Platzhalter – später einfach ersetzen/ergänzen.
   { id, title, note, kind: "spot" | "activity" }
   ========================================================= */
const PROGRAM = {
  mannheim: [
    { id: "ma-spot-1", title: "Datespot 1 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "ma-spot-2", title: "Datespot 2 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "ma-act-1", title: "Aktivität 1 (folgt)", note: "Platzhalter", kind: "activity" },
    { id: "ma-act-2", title: "Aktivität 2 (folgt)", note: "Platzhalter", kind: "activity" },
  ],
  pforzheim: [
    { id: "pf-spot-1", title: "Datespot 1 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "pf-spot-2", title: "Datespot 2 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "pf-act-1", title: "Aktivität 1 (folgt)", note: "Platzhalter", kind: "activity" },
    { id: "pf-act-2", title: "Aktivität 2 (folgt)", note: "Platzhalter", kind: "activity" },
  ],
  karlsruhe: [
    { id: "ka-spot-1", title: "Datespot 1 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "ka-spot-2", title: "Datespot 2 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "ka-act-1", title: "Aktivität 1 (folgt)", note: "Platzhalter", kind: "activity" },
    { id: "ka-act-2", title: "Aktivität 2 (folgt)", note: "Platzhalter", kind: "activity" },
  ],
  stuttgart: [
    { id: "s-spot-1", title: "Datespot 1 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "s-spot-2", title: "Datespot 2 (folgt)", note: "Platzhalter", kind: "spot" },
    { id: "s-act-1", title: "Aktivität 1 (folgt)", note: "Platzhalter", kind: "activity" },
    { id: "s-act-2", title: "Aktivität 2 (folgt)", note: "Platzhalter", kind: "activity" },
  ],
  other: [
    { id: "o-drinks", title: "Drinks", note: "Getränk nach Wahl, vgl. § 2 Abs. 3", kind: "activity" },
    { id: "o-food", title: "Essen gehen", note: "Partei A sucht das Restaurant aus (§ 1 Abs. 3)", kind: "activity" },
    { id: "o-walk", title: "Spaziergang", note: "Platzhalter", kind: "activity" },
    { id: "o-surprise", title: "Überraschung", note: "Platzhalter", kind: "activity" },
  ],
};

const LABELS = {
  style: {
    princess: "Princess Treatment 💅",
    independent: "Strong Independent Woman 💪",
  },
  location: {
    mannheim: "Mannheim",
    pforzheim: "Pforzheim",
    karlsruhe: "Karlsruhe",
    stuttgart: "Stuttgart",
  },
};

/* ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const steps = $$(".step");
const state = {
  step: 0,
  style: null,
  location: null,
  middle: null,
  program: new Set(),
};

/* ---------- Navigation ---------- */
function go(index) {
  state.step = Math.max(0, Math.min(steps.length - 1, index));
  steps.forEach((s, i) => s.classList.toggle("active", i === state.step));
  const total = steps.length - 1;
  $("#folio").textContent =
    state.step === total ? "Urteil" : `Blatt ${state.step + 1} / ${total}`;
  const name = steps[state.step].dataset.step;
  if (name === "program") renderProgram();
  if (name === "sign") renderSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$("[data-next]").forEach((b) => b.addEventListener("click", () => go(state.step + 1)));
$$("[data-back]").forEach((b) => b.addEventListener("click", () => go(state.step - 1)));

/* ---------- Intro: Einspruch ---------- */
const objections = [
  "Einspruch abgelehnt.",
  "Einspruch erneut abgelehnt. Vgl. § 3 (Salvatorische Klausel).",
  "Das Gericht hat Ihren Einspruch zur Kenntnis genommen und ignoriert.",
  "Einspruch wird als „Ja, aber schüchtern“ gewertet.",
];
let objectionCount = 0;
$("#objection").addEventListener("click", (e) => {
  const msg = $("#objection-msg");
  msg.hidden = false;
  msg.textContent = objections[Math.min(objectionCount, objections.length - 1)];
  objectionCount++;
  e.currentTarget.classList.remove("shake");
  void e.currentTarget.offsetWidth;
  e.currentTarget.classList.add("shake");
});

/* ---------- Modal ---------- */
const faces = ["🤨", "😵‍💫", "🧐", "🫠"];
let faceIndex = 0;
function openModal() {
  $("#modal-face").textContent = faces[faceIndex++ % faces.length];
  $("#modal").hidden = false;
  $("#modal-close").focus();
}
function closeModal() { $("#modal").hidden = true; }
$("#modal-close").addEventListener("click", closeModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* ---------- Stil ---------- */
$$(".tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    if (tile.classList.contains("disabled")) return openModal();
    state.style = tile.dataset.style;
    $$(".tile").forEach((t) => t.classList.toggle("selected", t === tile));
    $$('[data-step="style"] .extra').forEach((x) => (x.hidden = x.dataset.extra !== state.style));
    $("#style-next").disabled = false;
  });
});

/* ---------- Ort ---------- */
function updateLocation() {
  const loc = $('input[name="location"]:checked')?.value ?? null;
  state.location = loc;
  state.middle = $('input[name="middle"]:checked')?.value ?? null;
  $$('[data-step="location"] .extra').forEach((x) => (x.hidden = x.dataset.extra !== loc));
  let ok = !!loc;
  if (loc === "middle") ok = !!state.middle;
  if (loc === "other") ok = $("#other-location").value.trim().length > 0;
  $("#location-next").disabled = !ok;
}
$$('input[name="location"], input[name="middle"]').forEach((i) => i.addEventListener("change", updateLocation));
$("#other-location").addEventListener("input", updateLocation);

function cityKeys() {
  if (state.location === "middle") {
    return state.middle === "egal" ? ["karlsruhe", "stuttgart"] : [state.middle];
  }
  return [state.location];
}
function locationText() {
  if (state.location === "other") return `Vorschlag: ${$("#other-location").value.trim()}`;
  if (state.location === "middle") {
    return state.middle === "egal" ? "Karlsruhe oder Stuttgart (egal)" : LABELS.location[state.middle];
  }
  return LABELS.location[state.location] ?? "–";
}

/* ---------- Programm ---------- */
let renderedFor = null;
function renderProgram() {
  const keys = cityKeys();
  const sig = keys.join("+");
  if (renderedFor !== sig) {
    state.program.clear();
    renderedFor = sig;
  }
  $("#program-city").textContent = `Ort: ${locationText()}`;

  const list = $("#program-list");
  list.innerHTML = "";
  keys.forEach((key) => {
    (PROGRAM[key] || []).forEach((item) => {
      const label = document.createElement("label");
      label.className = "option" + (item.note === "Platzhalter" ? " placeholder" : "");
      const prefix = keys.length > 1 ? `${LABELS.location[key]} · ` : "";
      label.innerHTML = `
        <input type="checkbox" value="${item.id}">
        <span><strong></strong><small></small></span>`;
      label.querySelector("strong").textContent = prefix + item.title;
      label.querySelector("small").textContent =
        (item.kind === "spot" ? "Spot" : "Aktivität") + " · " + item.note;
      const cb = label.querySelector("input");
      cb.checked = state.program.has(item.id);
      cb.addEventListener("change", () => {
        cb.checked ? state.program.add(item.id) : state.program.delete(item.id);
        updateProgramCount();
      });
      list.appendChild(label);
    });
  });
  updateProgramCount();
}
function programCount() {
  return state.program.size + ($("#program-own").value.trim() ? 1 : 0);
}
function updateProgramCount() {
  const n = programCount();
  $("#program-count").textContent = `${n} von mind. 2 gewählt`;
  $("#program-next").disabled = n < 2;
}
$("#program-own").addEventListener("input", updateProgramCount);

function programTitles() {
  const all = Object.entries(PROGRAM).flatMap(([city, items]) =>
    items.map((i) => ({ ...i, city }))
  );
  const titles = all
    .filter((i) => state.program.has(i.id))
    .map((i) => (LABELS.location[i.city] ? `${i.title} (${LABELS.location[i.city]})` : i.title));
  const own = $("#program-own").value.trim();
  if (own) titles.push(`Eigener Vorschlag: ${own}`);
  return titles;
}

/* ---------- Zusammenfassung ---------- */
function collect() {
  const v = (id) => $(id).value.trim();
  const data = {
    "Partei B": v("#name") || "(anonym)",
    "Stil": LABELS.style[state.style] ?? "–",
  };
  if (state.style === "princess") data["Blumenwünsche"] = v("#flowers") || "überrasch mich";
  if (state.style === "independent") data["Abholpunkt"] = v("#pickup") || "–";
  data["Ort"] = locationText();
  data["Programm"] = programTitles().join(" | ");
  data["Wann"] = v("#when") || "–";
  data["Getränk"] = v("#drink") || "–";
  data["Anmerkungen"] = v("#notes") || "–";
  data["Unterschrift"] = v("#signature") || "–";
  data["Einsprüche eingelegt"] = String(objectionCount);
  data["Low Effort angeklickt"] = `${faceIndex}x`;
  return data;
}
function renderSummary() {
  const dl = $("#summary");
  dl.innerHTML = "";
  const data = collect();
  ["Partei B", "Stil", "Blumenwünsche", "Abholpunkt", "Ort", "Programm"].forEach((k) => {
    if (!(k in data)) return;
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = k === "Programm" ? programTitles().join(", ") : data[k];
    dl.append(dt, dd);
  });
}

/* ---------- Unterschrift & Absenden ---------- */
$("#signature").addEventListener("input", (e) => {
  $("#submit").disabled = e.target.value.trim().length < 2;
});

function asText(data) {
  return Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
}

$("#submit").addEventListener("click", async () => {
  const btn = $("#submit");
  const err = $("#submit-error");
  const data = collect();
  btn.disabled = true;
  btn.textContent = "Wird zugestellt …";
  err.hidden = true;

  let delivered = false;
  if (CONFIG.formsubmitTarget) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.formsubmitTarget)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `📜 Az. EV-2026/001 – Antwort von ${data["Partei B"]}`,
          _template: "table",
          _captcha: "false",
          ...data,
        }),
      });
      const json = await res.json().catch(() => ({}));
      delivered = res.ok && String(json.success) !== "false";
    } catch (_) {
      delivered = false;
    }
  }

  if (!delivered) {
    const text = asText(data);
    $("#fallback").hidden = false;
    $("#fallback-text").value = text;
    $("#mailto").href =
      `mailto:${CONFIG.fallbackMail}?subject=${encodeURIComponent("Az. EV-2026/001 – Antwort")}&body=${encodeURIComponent(text)}`;
  }
  go(steps.length - 1);
});

$("#copy").addEventListener("click", async () => {
  const ta = $("#fallback-text");
  try {
    await navigator.clipboard.writeText(ta.value);
  } catch (_) {
    ta.select();
    document.execCommand("copy");
  }
  $("#copy").textContent = "Kopiert ✓";
});

go(0);
