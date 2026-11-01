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
  formsubmitTarget: "kai.bessler@outlook.com", // z. B. "deine@mail.de" oder "a1b2c3d4e5f6..."
  fallbackMail: "kai.bessler@outlook.com", // Adresse für den mailto-Fallback (optional)
};

/* =========================================================
   DATEVORSCHLÄGE PRO ORT
   ---------------------------------------------------------
   Pro Stadt 3 Vorschläge, jeweils mit Ablauf. Format:

   {
     id: "ma-1",                      // eindeutig
     title: "Kunst & Pasta",          // Name des Vorschlags
     teaser: "Kurze Beschreibung",    // optional
     steps: [                         // der Ablauf
       { time: "17:00", text: "Kunsthalle" },
       { time: "19:00", text: "Essen bei …" },
       { time: "21:00", text: "Drinks bei …" },
     ],
   }

   Aktuell Platzhalter (placeholder()) – einfach durch echte
   Objekte im Format oben ersetzen.
   ========================================================= */
const MIN_DATE_PICKS = 1; // wie viele Vorschläge sie mindestens ankreuzen muss

function placeholder(prefix) {
  return [1, 2, 3].map((n) => ({
    id: `${prefix}-${n}`,
    title: `Datevorschlag ${n} (folgt)`,
    teaser: "Platzhalter",
    placeholder: true,
    steps: [
      { time: "--:--", text: "Ablaufpunkt 1" },
      { time: "--:--", text: "Ablaufpunkt 2" },
      { time: "--:--", text: "Ablaufpunkt 3" },
    ],
  }));
}

const PROGRAM = {
  mannheim: placeholder("ma"),
  pforzheim: placeholder("pf"),
  karlsruhe: placeholder("ka"),
  stuttgart: placeholder("s"),
};

/* =========================================================
   TERMINVORSCHLÄGE
   ---------------------------------------------------------
   Platzhalter – später durch echte Termine ersetzen.
   { id, title, note }
   ========================================================= */
const DATES = [
  { id: "d1", title: "Termin 1 (folgt)", note: "Platzhalter" },
  { id: "d2", title: "Termin 2 (folgt)", note: "Platzhalter" },
  { id: "d3", title: "Termin 3 (folgt)", note: "Platzhalter" },
  { id: "d4", title: "Termin 4 (folgt)", note: "Platzhalter" },
];

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
  dates: new Set(),
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
  const custom = state.location === "other";
  const min = custom ? 2 : MIN_DATE_PICKS;
  $("#program-title").textContent = custom ? "Programmpunkte" : "Datevorschläge";
  $("#program-hint").textContent = custom
    ? `Trag mindestens zwei ein. Ort: ${locationText()}`
    : `Kreuz an, was dir gefällt (mindestens ${min === 1 ? "einer" : min}). Ort: ${locationText()}`;
  $("#program-preset").hidden = custom;
  $("#program-custom").hidden = !custom;
  state.dealWithIt = false;
  if (custom) return updateProgramCount();

  const list = $("#program-list");
  list.innerHTML = "";
  keys.forEach((key) => {
    (PROGRAM[key] || []).forEach((item) => {
      const label = document.createElement("label");
      label.className = "option proposal" + (item.placeholder ? " placeholder" : "");
      label.innerHTML = `
        <input type="checkbox">
        <span><em class="mono city"></em><strong></strong><small></small><ol class="timeline"></ol></span>`;
      const city = label.querySelector(".city");
      if (keys.length > 1) city.textContent = LABELS.location[key];
      else city.remove();
      label.querySelector("strong").textContent = item.title;
      const teaser = label.querySelector("small");
      if (item.teaser) teaser.textContent = item.teaser;
      else teaser.remove();
      const ol = label.querySelector("ol");
      (item.steps || []).forEach((st) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="mono time"></span><span></span>`;
        li.firstChild.textContent = st.time || "";
        li.lastChild.textContent = st.text;
        ol.appendChild(li);
      });
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
function customValues() {
  return $$("#custom-fields input").map((i) => i.value.trim()).filter(Boolean);
}
function programCount() {
  if (state.location === "other") return customValues().length;
  return state.program.size + ($("#program-own").value.trim() ? 1 : 0);
}
function addCustomField() {
  const n = $$("#custom-fields input").length + 1;
  const label = document.createElement("label");
  label.className = "field";
  label.innerHTML = `<span class="mono label">Programmpunkt ${n}</span><input type="text">`;
  const input = label.querySelector("input");
  input.placeholder = ["z. B. Essen beim Italiener", "z. B. Spaziergang am Rhein", "z. B. Cocktails", "Noch was?"][Math.min(n - 1, 3)];
  input.addEventListener("input", updateProgramCount);
  $("#custom-fields").appendChild(label);
  return input;
}
for (let i = 0; i < 3; i++) addCustomField();
$("#add-field").addEventListener("click", () => addCustomField().focus());
$("#deal").addEventListener("click", () => {
  state.dealWithIt = true;
  go(state.step + 1);
});
function updateProgramCount() {
  const n = programCount();
  const custom = state.location === "other";
  const min = custom ? 2 : MIN_DATE_PICKS;
  $("#program-count").textContent = `${n} von mind. ${min} ${custom ? "eingetragen" : "gewählt"}`;
  $("#program-next").disabled = n < min;
}
$("#program-own").addEventListener("input", updateProgramCount);

function programTitles() {
  if (state.location === "other") {
    return state.dealWithIt ? ["Planung ist deine Sache, deal with it 😎"] : customValues();
  }
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
    "Stil": LABELS.style[state.style] ?? "–",
  };
  if (state.style === "princess") data["Blumenwünsche"] = v("#flowers") || "überrasch mich (→ sprießende Kartoffeln)";
  if (state.style === "independent") data["Treffpunkt"] = v("#pickup") || "–";
  data["Ort"] = locationText();
  data["Programm"] = programTitles().join(" | ");
  data["Termine"] = DATES.filter((d) => state.dates.has(d.id)).map((d) => d.title).join(" | ") || "–";
  data["Andere Terminvorschläge"] = v("#when") || "–";
  data["Getränk"] = v("#drink") || "–";
  data["Telefon"] = v("#phone") || "–";
  data["Anmerkungen"] = v("#notes") || "–";
  data["Einsprüche eingelegt"] = String(objectionCount);
  data["Low Effort angeklickt"] = `${faceIndex}x`;
  return data;
}
function renderSummary() {
  const dl = $("#summary");
  dl.innerHTML = "";
  const data = collect();
  ["Stil", "Blumenwünsche", "Treffpunkt", "Ort", "Programm"].forEach((k) => {
    if (!(k in data)) return;
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = k === "Programm" ? programTitles().join(", ") : data[k];
    dl.append(dt, dd);
  });
}

/* ---------- Unterschrift & Absenden ---------- */

/* ---------- Termine ---------- */
function updateSubmit() {
  $("#submit").disabled = state.dates.size === 0 && !$("#when").value.trim();
}
DATES.forEach((d) => {
  const label = document.createElement("label");
  label.className = "option" + (d.note === "Platzhalter" ? " placeholder" : "");
  label.innerHTML = `<input type="checkbox"><span><strong></strong><small></small></span>`;
  label.querySelector("strong").textContent = d.title;
  label.querySelector("small").textContent = d.note;
  const cb = label.querySelector("input");
  cb.addEventListener("change", () => {
    cb.checked ? state.dates.add(d.id) : state.dates.delete(d.id);
    updateSubmit();
  });
  $("#date-list").appendChild(label);
});
$("#when").addEventListener("input", updateSubmit);

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
          _subject: "📜 Az. EV-2026/001 – Antwort von Partei B",
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
