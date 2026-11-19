/* MinBiz app: profil, idé, automatisk plan, tavle, merker og mine data.
   Kjører mot Supabase (me-voteapp) når du er innlogget, eller i minnet med ?demo=1. */
(function () {
  "use strict";

  var CFG = window.MINBIZ_CONFIG || {};
  var DEMO = /(?:^|[?&])demo=1(?:&|$)/.test(location.search);

  /* ---------- Plan-maler (fra prototype v0.2, 18.11.2026) ---------- */
  var PLANS = {
    "24t": { name: "24-timers lansering", len: "24 timer", fits: "Én konkret ting som skal ut: en nettside, et tilbud, en åpningsdag.", steps: [
      { d: 0, t: "09:00", phase: "Forberedelse", title: "Samle det du trenger", list: ["Logo og farger, om du har", "Liste over det du tilbyr", "5 spørsmål kunder ofte stiller, med svar", "3 sitater fra fornøyde kunder, eller skriv «ettersendes»", "Kontaktinfo"] },
      { d: 0, t: "10:00", phase: "Forberedelse", title: "Avklaring, 30 minutter", list: ["Hva skal ut i morgen?", "Hvem er det for?", "Hvilken ene handling skal folk gjøre?"] },
      { d: 0, t: "12:00", phase: "Bygg", title: "Skriv og sett opp", list: ["Overskrift, kort tekst og én knapp", "Tilbud og pris, eller merk pris som ikke satt", "Sjekk at det ser bra ut på mobil"] },
      { d: 0, t: "21:00", phase: "Sjekk", title: "Test alt som skal virke", list: ["Skjema eller bestilling testet", "Alle lenker virker", "Ingen plassholdertekst igjen"] },
      { d: 0, t: "23:00", phase: "Sjekk", title: "Siste gjennomgang", list: ["Les alt én gang høyt", "Be én person se over"] },
      { d: 1, t: "00:00", phase: "Lansering", title: "Gå live", list: ["Publiser", "Sjekk at det virker for andre enn deg"] },
      { d: 1, t: "10:00", phase: "Oppfølging", title: "Si ifra til nettverket", list: ["Fem personlige meldinger", "Ett innlegg der kundene dine er"] },
      { d: 1, t: "22:00", phase: "Oppfølging", title: "Se på resultatet", list: ["Hvor mange så det, og hvor mange tok kontakt?", "Velg ett neste steg"] }
    ] },
    "forste_uke": { name: "Første uke", len: "7 dager", fits: "Test idéen raskt før du bruker mye tid og penger.", steps: [
      { d: 0, phase: "Første uke", title: "Skriv idéen på én side", list: ["Hva, for hvem, hvorfor deg", "Ett løfte i én setning"] },
      { d: 1, phase: "Første uke", title: "Snakk med to mulige kunder", list: ["Spør hva de bruker i dag", "Spør hva som irriterer dem", "Lytt mer enn du snakker"] },
      { d: 2, phase: "Første uke", title: "Snakk med tre til", list: ["Skriv ned ordene de bruker"] },
      { d: 3, phase: "Første uke", title: "Lag en enkel side eller et innlegg", list: ["Ett tilbud", "Én måte å ta kontakt på"] },
      { d: 4, phase: "Første uke", title: "Del det med 20 personer", list: ["Personlige meldinger fungerer best"] },
      { d: 5, phase: "Første uke", title: "Svar alle som tok kontakt", list: ["Noter hvem som vil kjøpe eller vite mer"] },
      { d: 6, phase: "Første uke", title: "Oppsummer og bestem", list: ["Hva lærte du?", "Fortsette, endre eller legge bort?", "Velg neste plan"] }
    ] },
    "6_uker": { name: "6-ukers oppstart", len: "6 uker", fits: "Ny bedrift som skal lanseres skikkelig.", steps: [
      { d: 0, phase: "Fase 0: Grunnmur", title: "Bestem tilbud, løfte og pris", list: ["Ett hovedtilbud", "Pris, eller merk den som ikke satt", "Hvordan folk tar kontakt"] },
      { d: 1, phase: "Fase 0: Grunnmur", title: "Sett opp kontakt og bestilling", list: ["E-post, telefon eller bookingside", "Noter hvor henvendelsene kommer fra"] },
      { d: 3, phase: "Fase 1: Lansering", title: "Publiser første versjon", list: ["Side eller profil med tilbudet", "Sjekk mobil og lenker"] },
      { d: 4, phase: "Fase 1: Lansering", title: "Fortell det til de første", list: ["Personlige meldinger", "To innlegg"] },
      { d: 5, phase: "Fase 1: Lansering", title: "Følg opp alle som svarer", list: ["Svar innen et døgn"] },
      { d: 9, phase: "Fase 2: Bevis", title: "Lag to eksempler på fornøyde kunder", list: ["Før, etter og hva det betydde", "Spør om lov før du bruker navn"] },
      { d: 12, phase: "Fase 2: Bevis", title: "Prøv to versjoner av overskriften", list: ["Behold den som gir flest henvendelser"] },
      { d: 16, phase: "Fase 2: Bevis", title: "Finn samarbeidspartnere", list: ["Hvem har allerede kundene dine?"] },
      { d: 22, phase: "Fase 3: System", title: "Skriv ned hvordan du leverer", list: ["Sjekkliste per kunde"] },
      { d: 28, phase: "Fase 3: System", title: "Tilbud til faste kunder", list: ["Noe som gjør at de kommer tilbake"] },
      { d: 41, phase: "Fase 3: System", title: "Gjennomgang etter seks uker", list: ["Hva virket?", "Hva er neste plan?"] }
    ] },
    "30_60_90": { name: "30/60/90 dager", len: "3 måneder", fits: "Retning og mål for et helt kvartal.", steps: [
      { d: 0, phase: "Dag 1 til 30", title: "Sett tre mål for måneden", list: ["Ett om kunder, ett om tilbud, ett om deg selv"] },
      { d: 3, phase: "Dag 1 til 30", title: "Gjør det enkelt å kjøpe", list: ["Kontakt eller bestilling på plass", "Betaling avklart"] },
      { d: 7, phase: "Dag 1 til 30", title: "20 personlige henvendelser", list: ["Lokalt og i nettverket"] },
      { d: 20, phase: "Dag 1 til 30", title: "Første betalende kunde", list: ["Lever godt, spør om tilbakemelding"] },
      { d: 29, phase: "Dag 1 til 30", title: "Gjennomgang dag 30", list: ["Hva virket?", "Justér målene for neste måned"] },
      { d: 40, phase: "Dag 31 til 60", title: "To eksempler på fornøyde kunder", list: ["Med lov fra kunden"] },
      { d: 45, phase: "Dag 31 til 60", title: "Enkel oppfølging av interesserte", list: ["Tre e-poster eller meldinger over en uke"] },
      { d: 55, phase: "Dag 31 til 60", title: "Prisliste for tillegg", list: ["Hva kan du tilby dem som allerede har kjøpt?"] },
      { d: 59, phase: "Dag 31 til 60", title: "Gjennomgang dag 60", list: ["Egne tall mot målene"] },
      { d: 70, phase: "Dag 61 til 90", title: "Fast avtale for de som vil ha mer", list: ["Noe som gir jevn inntekt"] },
      { d: 80, phase: "Dag 61 til 90", title: "Rydd i det som tar mest tid", list: ["Hva kan gjøres enklere?"] },
      { d: 89, phase: "Dag 61 til 90", title: "Gjennomgang dag 90", list: ["Hva er neste kvartal?"] }
    ] },
    "forretningsplan": { name: "Full forretningsplan", len: "2 uker", fits: "Søknad om støtte eller lån, samtale med bank, partner eller investor.", steps: [
      { d: 0, phase: "Uke 1", title: "Fyll ut profil og idé så godt du kan", list: ["Tomme felt står som [Mangler]"] },
      { d: 2, phase: "Uke 1", title: "Skriv utkastet til forretningsplanen", list: ["Bruk idéen, kundene og løftet ditt som utgangspunkt", "Tall du ikke har, merkes [Mangler]"] },
      { d: 4, phase: "Uke 1", title: "Fyll inn tallene som mangler", list: ["Pris, kostnader, forventet antall kunder"] },
      { d: 7, phase: "Uke 2", title: "Få planen lest av noen du stoler på", list: ["Regnskapsfører, bank eller næringskontakt i kommunen"] },
      { d: 10, phase: "Uke 2", title: "Rett opp og lagre som PDF", list: ["Bruk utskrift i nettleseren og velg PDF"] }
    ] }
  };
  var PLAN_ORDER = ["24t", "forste_uke", "6_uker", "30_60_90", "forretningsplan"];
  var NEXT_LEVEL = { "24t": "forste_uke", "forste_uke": "6_uker", "6_uker": "30_60_90", "30_60_90": "forretningsplan", "forretningsplan": "30_60_90" };
  var KIND_LABEL = { imperium: "Imperium", bedrift: "Bedrift", ekstra_inntekt: "Ekstra inntekt", ide: "Idé" };
  var STATUS = [
    { key: "neste", label: "Neste" },
    { key: "i_dag", label: "I dag" },
    { key: "venter", label: "Venter" },
    { key: "gjort", label: "Gjort" }
  ];

  /* ---------- Støtte: generelle pekere til primærkilder ---------- */
  var SRC = {
    brreg: { name: "Brønnøysundregistrene", url: "https://www.brreg.no/", why: "Enhetsregisteret, Foretaksregisteret og søk etter ledige navn." },
    altinn: { name: "Altinn: starte og drive bedrift", url: "https://info.altinn.no/starte-og-drive/", why: "Veiledning om organisasjonsform, registrering og drift." },
    skatt: { name: "Skatteetaten: bedrift og organisasjon", url: "https://www.skatteetaten.no/bedrift-og-organisasjon/", why: "Skatt, merverdiavgift og hva som gjelder for inntekt." },
    inno: { name: "Innovasjon Norge", url: "https://www.innovasjonnorge.no/", why: "Rådgivning og finansieringsordninger for gründere." }
  };
  var SUPPORT = {
    ekstra_inntekt: ["skatt", "altinn", "brreg"],
    bedrift: ["altinn", "brreg", "skatt", "inno"],
    imperium: ["altinn", "brreg", "skatt", "inno"],
    ide: ["brreg", "altinn", "inno"]
  };

  /* ---------- Hjelpere ---------- */
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function today() { return iso(new Date()); }
  function addDays(isoDate, n) { var p = isoDate.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return iso(d); }
  function fmtDate(isoDate) {
    if (!isoDate) return "Ingen dato";
    var p = isoDate.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]);
    try { return d.toLocaleDateString("nb-NO", { weekday: "short", day: "numeric", month: "short" }); } catch (e) { return isoDate; }
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
  }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* lagring ikke tilgjengelig */ } }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var toastTimer;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3500);
  }
  function missing(v) { return v == null || String(v).trim() === ""; }
  function errText(e) { return (e && (e.message || e.error_description)) || "Ukjent feil"; }

  /* ---------- Stjernetegn (tradisjon og inspirasjon) ---------- */
  /* [måned, første dag i neste tegn, tegnet før den dagen] */
  var SIGNS = [[1, 20, "Steinbukken", "Vannmannen"], [2, 19, "Vannmannen", "Fiskene"], [3, 21, "Fiskene", "Væren"], [4, 20, "Væren", "Tyren"],
    [5, 21, "Tyren", "Tvillingene"], [6, 21, "Tvillingene", "Krepsen"], [7, 23, "Krepsen", "Løven"], [8, 23, "Løven", "Jomfruen"],
    [9, 23, "Jomfruen", "Vekten"], [10, 23, "Vekten", "Skorpionen"], [11, 22, "Skorpionen", "Skytten"], [12, 22, "Skytten", "Steinbukken"]];
  function zodiac(isoDate) {
    if (!isoDate) return null;
    var p = String(isoDate).split("-"), m = +p[1], d = +p[2];
    if (!m || !d || m > 12) return null;
    var s = SIGNS[m - 1];
    return d < s[1] ? s[2] : s[3];
  }

  /* ---------- Datalag: Supabase eller minne (demo) ---------- */
  function check(r) { if (r.error) throw r.error; return r.data; }
  function supaDb(sb, uid) {
    return {
      load: async function () {
        var r = await Promise.all([
          sb.from("minbiz_profiles").select("*").eq("user_id", uid).maybeSingle(),
          sb.from("minbiz_ideas").select("*").order("created_at", { ascending: false }),
          sb.from("minbiz_plans").select("*").order("created_at", { ascending: false }),
          sb.from("minbiz_steps").select("*").order("sort", { ascending: true }),
          sb.from("minbiz_achievements").select("*").order("earned_at", { ascending: false })
        ]);
        return { profile: check(r[0]), ideas: check(r[1]) || [], plans: check(r[2]) || [], steps: check(r[3]) || [], achievements: check(r[4]) || [] };
      },
      member: async function () {
        try {
          var r = await sb.from("members").select("birth_date").eq("id", uid).maybeSingle();
          if (r.error) return null;
          return r.data;
        } catch (e) { return null; }
      },
      saveProfile: async function (row) {
        row.user_id = uid; row.updated_at = new Date().toISOString();
        return check(await sb.from("minbiz_profiles").upsert(row).select().single());
      },
      saveIdea: async function (row) {
        row.user_id = uid;
        if (row.id) { row.updated_at = new Date().toISOString(); return check(await sb.from("minbiz_ideas").update(row).eq("id", row.id).select().single()); }
        return check(await sb.from("minbiz_ideas").insert(row).select().single());
      },
      createPlan: async function (plan, steps) {
        plan.user_id = uid;
        var p = check(await sb.from("minbiz_plans").insert(plan).select().single());
        var rows = steps.map(function (s) { s.user_id = uid; s.plan_id = p.id; return s; });
        var r = await sb.from("minbiz_steps").insert(rows).select();
        if (r.error) { await sb.from("minbiz_plans").delete().eq("id", p.id); throw r.error; }
        return { plan: p, steps: r.data };
      },
      updateSteps: async function (list) {
        var res = await Promise.all(list.map(function (s) {
          return sb.from("minbiz_steps").update({ status: s.status, due_date: s.due_date, done_at: s.done_at, moved_count: s.moved_count }).eq("id", s.id);
        }));
        res.forEach(check);
      },
      addAchievement: async function (row) {
        row.user_id = uid;
        return check(await sb.from("minbiz_achievements").insert(row).select().single());
      },
      deleteAll: async function () {
        var tables = ["minbiz_achievements", "minbiz_steps", "minbiz_plans", "minbiz_ideas", "minbiz_profiles"];
        for (var i = 0; i < tables.length; i++) check(await sb.from(tables[i]).delete().eq("user_id", uid));
      }
    };
  }
  function memDb() {
    var M = { profile: null, ideas: [], plans: [], steps: [], achievements: [] };
    var now = function () { return new Date().toISOString(); };
    var copy = function (o) { return JSON.parse(JSON.stringify(o)); };
    return {
      load: async function () { return copy(M); },
      member: async function () { return null; },
      saveProfile: async function (row) { row.user_id = "demo"; row.updated_at = now(); M.profile = copy(row); return copy(row); },
      saveIdea: async function (row) {
        row.user_id = "demo";
        if (row.id) { M.ideas = M.ideas.map(function (i) { return i.id === row.id ? copy(row) : i; }); return copy(row); }
        row.id = uuid(); row.created_at = now(); M.ideas.unshift(copy(row)); return copy(row);
      },
      createPlan: async function (plan, steps) {
        plan.id = uuid(); plan.user_id = "demo"; plan.created_at = now(); M.plans.unshift(copy(plan));
        steps = steps.map(function (s) { s.id = uuid(); s.plan_id = plan.id; s.user_id = "demo"; s.done_at = null; s.moved_count = 0; s.status = s.status || "neste"; return s; });
        M.steps = M.steps.concat(copy(steps));
        return { plan: copy(plan), steps: copy(steps) };
      },
      updateSteps: async function (list) {
        list.forEach(function (s) { M.steps.forEach(function (x, i) { if (x.id === s.id) M.steps[i] = copy(s); }); });
      },
      addAchievement: async function (row) { row.id = uuid(); row.user_id = "demo"; row.earned_at = now(); M.achievements.unshift(copy(row)); return copy(row); },
      deleteAll: async function () { M = { profile: null, ideas: [], plans: [], steps: [], achievements: [] }; }
    };
  }

  /* ---------- Tilstand ---------- */
  var db, sb, S = { profile: null, ideas: [], plans: [], steps: [], achievements: [] };
  var interests = [];
  var activePlanId = null;
  var memberBirth = null;
  var chosenType = null;

  function idea() { return S.ideas[0] || null; }
  function activePlan() {
    var p = S.plans.filter(function (x) { return x.id === activePlanId; })[0];
    return p || S.plans[0] || null;
  }
  function stepsOf(planId) { return S.steps.filter(function (s) { return s.plan_id === planId; }).sort(function (a, b) { return a.sort - b.sort; }); }
  function phaseOf(plan, step) { var t = PLANS[plan.plan_type]; var s = t && t.steps[step.sort]; return s ? s.phase : ""; }

  /* ---------- Navigasjon ---------- */
  function show(view) {
    Array.prototype.forEach.call(document.querySelectorAll("#appnav button"), function (b) {
      if (b.getAttribute("data-view") === view) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    Array.prototype.forEach.call(document.querySelectorAll("#app .view"), function (v) { v.hidden = v.id !== "view-" + view; });
    if (view === "plan") renderPlanForm();
    if (view === "ide") renderIdeaCard();
    if (view === "dash") renderDash();
    var hd = document.querySelector("#view-" + view + " h2");
    if (hd) { hd.setAttribute("tabindex", "-1"); hd.focus(); }
  }

  /* ---------- Profil ---------- */
  function renderInterests() {
    var ul = $("interest-list"); ul.textContent = "";
    if (!interests.length) { ul.appendChild(h("li", { class: "missing" }, ["[Mangler]"])); return; }
    interests.forEach(function (t, i) {
      ul.appendChild(h("li", null, [t, h("button", { type: "button", "aria-label": "Fjern " + t, onclick: function () { interests.splice(i, 1); renderInterests(); $("interest-input").focus(); } }, ["×"])]));
    });
  }
  function addInterest() {
    var inp = $("interest-input"), v = inp.value.trim();
    if (!v) return;
    if (interests.map(function (x) { return x.toLowerCase(); }).indexOf(v.toLowerCase()) === -1 && interests.length < 30) interests.push(v.slice(0, 60));
    inp.value = ""; renderInterests(); inp.focus();
  }
  function fillProfile() {
    var p = S.profile || {};
    interests = (p.interests || []).slice();
    renderInterests();
    $("ambitions").value = p.ambitions || "";
    $("hours").value = p.hours_per_week == null ? "" : p.hours_per_week;
    $("has_already").value = p.has_already || "";
    $("skills").value = p.skills || "";
    $("use_horoscope").checked = !!p.use_horoscope;
    $("birth_local").value = DEMO ? "" : (load("minbiz_birth_local") || "");
    renderHoroscope();
  }
  function renderHoroscope() {
    var on = $("use_horoscope").checked;
    $("horo-box").hidden = !on;
    if (!on) return;
    var date = memberBirth || $("birth_local").value || null;
    $("horo-birth-field").hidden = !!memberBirth;
    var out = $("horo-out"); out.textContent = "";
    var sign = zodiac(date);
    if (!sign) { out.appendChild(h("span", { class: "muted" }, ["Fødselsdato: ikke satt."])); return; }
    out.appendChild(h("span", null, ["Stjernetegn: ", h("b", null, [sign]), " "]));
    out.appendChild(h("span", { class: "tag trad" }, ["Tradisjon og inspirasjon"]));
    out.appendChild(h("span", { class: "hint" }, [(memberBirth ? "Hentet fra profilen din i Min dag. " : "") + "Brukes bare til refleksjon, aldri som grunnlag for penger, lån eller avtaler."]));
  }
  async function saveProfile(ev) {
    ev.preventDefault();
    var hrs = String($("hours").value).trim();
    var n = hrs === "" ? null : Math.max(0, Math.min(168, parseInt(hrs, 10) || 0));
    try {
      S.profile = await db.saveProfile({
        interests: interests.slice(), ambitions: $("ambitions").value.trim() || null, hours_per_week: n,
        has_already: $("has_already").value.trim() || null, skills: $("skills").value.trim() || null,
        use_horoscope: $("use_horoscope").checked
      });
      if (!DEMO) store("minbiz_birth_local", $("birth_local").value || null);
      chosenType = null;
      toast("Profilen er lagret.");
    } catch (e) { toast("Kunne ikke lagre profilen: " + errText(e)); }
  }

  /* ---------- Idé ---------- */
  function fillIdea() {
    var i = idea() || {};
    $("title").value = i.title || ""; $("description").value = i.description || "";
    $("goal").value = i.goal || ""; $("audience").value = i.audience || ""; $("promise").value = i.promise || "";
    var kind = i.kind || "bedrift";
    Array.prototype.forEach.call(document.querySelectorAll('input[name="kind"]'), function (r) { r.checked = r.value === kind; });
    renderIdeaCard();
  }
  function currentKind() { var r = document.querySelector('input[name="kind"]:checked'); return r ? r.value : "bedrift"; }
  function renderIdeaCard() {
    var dl = $("idea-card"); dl.textContent = "";
    var rows = [["Tittel", $("title").value], ["Type", KIND_LABEL[currentKind()]], ["Beskrivelse", $("description").value], ["Mål", $("goal").value], ["Hvem det er for", $("audience").value], ["Løfte", $("promise").value]];
    rows.forEach(function (r) {
      dl.appendChild(h("dt", null, [r[0]]));
      dl.appendChild(missing(r[1]) ? h("dd", { class: "missing" }, ["[Mangler]"]) : h("dd", null, [String(r[1]).trim()]));
    });
  }
  async function saveIdea(ev) {
    ev.preventDefault();
    var title = $("title").value.trim();
    if (!title) { $("idea-err").textContent = "Skriv en tittel, et arbeidsnavn holder."; $("title").focus(); return; }
    $("idea-err").textContent = "";
    var cur = idea();
    var row = { title: title, description: $("description").value.trim() || null, kind: currentKind(), goal: $("goal").value.trim() || null, audience: $("audience").value.trim() || null, promise: $("promise").value.trim() || null };
    if (cur) row.id = cur.id;
    try {
      var saved = await db.saveIdea(row);
      if (cur) S.ideas[0] = saved; else S.ideas.unshift(saved);
      chosenType = null;
      toast("Idéen er lagret. Neste: lag planen.");
    } catch (e) { toast("Kunne ikke lagre idéen: " + errText(e)); }
  }

  /* ---------- Plan ---------- */
  function suggest() {
    var i = idea(), hrs = S.profile ? S.profile.hours_per_week : null, kind = i ? i.kind : "ide";
    if (hrs != null && hrs < 5) return ["forste_uke", "Du har under 5 timer i uka. «Første uke» gir små steg du rekker."];
    if (kind === "ekstra_inntekt") return ["30_60_90", "En ekstra inntekt bygges med jevn rytme. «30/60/90 dager» gir mål for hver måned."];
    if (kind === "bedrift") return ["6_uker", "En ny bedrift trenger en skikkelig start. «6-ukers oppstart» går gjennom grunnmur, lansering, bevis og system."];
    if (kind === "imperium") return ["30_60_90", "Et stort mål trenger retning for et helt kvartal. Etter 90 dager kan du lage en full forretningsplan."];
    return ["forste_uke", "En idé testes best raskt. «Første uke» viser om den er verdt mer tid."];
  }
  function buildSteps(type, start) {
    return PLANS[type].steps.map(function (s, i) {
      return { sort: i, title: s.t ? s.title + " (kl. " + s.t + ")" : s.title, detail: s.list.join("\n"), due_date: addDays(start, s.d), status: "neste", moved_count: 0, done_at: null };
    });
  }
  function renderPlanForm() {
    var i = idea();
    $("plan-needs-idea").hidden = !!i;
    $("plan-form").hidden = !i;
    if (!i) return;
    var sg = suggest();
    if (!chosenType) chosenType = sg[0];
    var box = $("suggest"); box.textContent = "";
    box.appendChild(h("b", null, ["Forslag: " + PLANS[sg[0]].name + ". "]));
    box.appendChild(document.createTextNode(sg[1] + " Du kan velge en annen under."));
    var wrap = $("ptypes"); wrap.textContent = "";
    PLAN_ORDER.forEach(function (k) {
      var p = PLANS[k];
      var inp = h("input", { type: "radio", name: "ptype", value: k, onchange: function () { chosenType = k; renderPreview(); } });
      inp.checked = k === chosenType;
      wrap.appendChild(h("label", { class: "ptype" }, [inp, h("span", null, [h("b", null, [p.name + (k === sg[0] ? " (foreslått)" : "")]), h("span", { class: "muted small" }, [p.len + ". " + p.fits])])]));
    });
    if (!$("start_date").value) $("start_date").value = today();
    $("plan-exists").hidden = !S.plans.length;
    renderPreview();
  }
  function renderPreview() {
    var ol = $("preview"); ol.textContent = "";
    var start = $("start_date").value || today();
    buildSteps(chosenType, start).forEach(function (s) {
      ol.appendChild(h("li", null, [h("b", null, [s.title]), " ", h("span", { class: "muted small" }, [fmtDate(s.due_date)])]));
    });
  }
  async function createPlan(ev) {
    ev.preventDefault();
    var i = idea(); if (!i) return;
    var start = $("start_date").value || today();
    var btn = $("plan-btn"); btn.disabled = true;
    try {
      var res = await db.createPlan({ idea_id: i.id, plan_type: chosenType, start_date: start }, buildSteps(chosenType, start));
      S.plans.unshift(res.plan); S.steps = S.steps.concat(res.steps);
      activePlanId = res.plan.id;
      $("celebrate").hidden = true;
      await autoMove();
      toast("Planen er laget.");
      show("dash");
    } catch (e) { toast("Kunne ikke lage planen: " + errText(e)); }
    btn.disabled = false;
  }

  /* ---------- Flytt passerte steg til i dag ---------- */
  async function autoMove() {
    var t = today(), changed = [], moved = 0;
    S.steps.forEach(function (s) {
      if (s.status === "gjort" || !s.due_date) return;
      if (s.due_date < t) {
        s.due_date = t; s.moved_count = (s.moved_count || 0) + 1; moved++;
        if (s.status === "neste") s.status = "i_dag";
        changed.push(s);
      } else if (s.due_date === t && s.status === "neste") {
        s.status = "i_dag"; changed.push(s);
      }
    });
    if (changed.length) { try { await db.updateSteps(changed); } catch (e) { toast("Kunne ikke oppdatere datoene: " + errText(e)); } }
    var m = $("moved-msg");
    if (moved) {
      m.textContent = (moved === 1 ? "Ett steg" : moved + " steg") + " fra tidligere dager er flyttet til i dag. Planer tar ofte litt lengre tid enn tenkt, og det går helt fint. Ta dem i ditt eget tempo.";
      m.hidden = false;
    }
  }

  /* ---------- Oversikt og tavle ---------- */
  function stepCard(s, plan) {
    var li = h("li", { class: "step" });
    li.appendChild(h("p", { class: "t" }, [s.title]));
    var meta = fmtDate(s.due_date);
    var ph = phaseOf(plan, s); if (ph && ph !== PLANS[plan.plan_type].name) meta += " · " + ph;
    if (s.moved_count) meta += " · flyttet " + s.moved_count + (s.moved_count === 1 ? " gang" : " ganger");
    li.appendChild(h("p", { class: "d" }, [meta]));
    if (s.detail) li.appendChild(h("ul", { class: "detail" }, s.detail.split("\n").map(function (x) { return h("li", null, [x]); })));
    var moves = h("div", { class: "moves", role: "group", "aria-label": "Flytt «" + s.title + "»" });
    STATUS.forEach(function (st) {
      if (st.key === s.status) return;
      moves.appendChild(h("button", { type: "button", class: "btn small " + (st.key === "gjort" ? "" : "quiet"), onclick: function () { moveStep(s, st.key); } }, [st.key === "gjort" ? "Merk som gjort" : "Til " + st.label]));
    });
    li.appendChild(moves);
    return li;
  }
  async function moveStep(s, status) {
    var prev = { status: s.status, done_at: s.done_at };
    s.status = status;
    s.done_at = status === "gjort" ? new Date().toISOString() : null;
    try { await db.updateSteps([s]); }
    catch (e) { s.status = prev.status; s.done_at = prev.done_at; toast("Kunne ikke flytte steget: " + errText(e)); return; }
    var lbl = STATUS.filter(function (x) { return x.key === status; })[0].label;
    toast("«" + s.title + "» er flyttet til " + lbl + ".");
    if (status === "gjort") await checkAchievements(activePlan());
    renderDash();
  }
  async function checkAchievements(plan) {
    var steps = stepsOf(plan.id), tpl = PLANS[plan.plan_type];
    var have = S.achievements.filter(function (a) { return a.plan_id === plan.id; }).map(function (a) { return a.title; });
    var phases = [];
    steps.forEach(function (s) { var p = phaseOf(plan, s); if (p && phases.indexOf(p) === -1) phases.push(p); });
    var earned = null;
    if (phases.length > 1) {
      for (var i = 0; i < phases.length; i++) {
        var ph = phases[i];
        var inPh = steps.filter(function (s) { return phaseOf(plan, s) === ph; });
        var title = "Fase fullført: " + ph;
        if (inPh.every(function (s) { return s.status === "gjort"; }) && have.indexOf(title) === -1) {
          try { var a = await db.addAchievement({ plan_id: plan.id, kind: "fase", title: title }); S.achievements.unshift(a); earned = { a: a, phase: ph, next: phases[i + 1] || null }; }
          catch (e) { toast("Kunne ikke lagre merket: " + errText(e)); }
        }
      }
    }
    var ptitle = "Plan fullført: " + tpl.name;
    if (steps.length && steps.every(function (s) { return s.status === "gjort"; }) && have.indexOf(ptitle) === -1) {
      try { var b = await db.addAchievement({ plan_id: plan.id, kind: "plan", title: ptitle }); S.achievements.unshift(b); earned = { a: b, plan: true }; }
      catch (e2) { toast("Kunne ikke lagre merket: " + errText(e2)); }
    }
    if (earned) celebrate(earned, plan);
  }
  function badgeIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.4"); svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    var p = document.createElementNS(ns, "path"); p.setAttribute("d", "M5 12.5l4.5 4.5L19 7.5"); svg.appendChild(p);
    return svg;
  }
  function celebrate(e, plan) {
    var box = $("celebrate"); box.textContent = "";
    var badge = h("span", { class: "badge", "aria-hidden": "true" }, [badgeIcon()]);
    var body = h("div", { class: "stack" });
    body.appendChild(h("h3", null, [e.a.title]));
    if (e.plan) {
      var nx = NEXT_LEVEL[plan.plan_type];
      body.appendChild(h("p", null, ["Hele planen «" + PLANS[plan.plan_type].name + "» er gjennomført. Godt arbeid, steg for steg."]));
      body.appendChild(h("p", null, [h("b", null, ["Neste nivå: " + PLANS[nx].name + ". "]), PLANS[nx].fits]));
      body.appendChild(h("div", { class: "btnrow" }, [
        h("button", { type: "button", class: "btn", onclick: function () { chosenType = nx; $("start_date").value = today(); show("plan"); } }, ["Lag neste plan"]),
        h("button", { type: "button", class: "btn quiet", onclick: function () { box.hidden = true; } }, ["Lukk"])
      ]));
    } else {
      body.appendChild(h("p", null, ["Du har fullført fasen «" + e.phase + "». Fint jobbet."]));
      if (e.next) body.appendChild(h("p", null, [h("b", null, ["Neste nivå: "]), "fasen «" + e.next + "» ligger klar på tavlen."]));
      body.appendChild(h("div", { class: "btnrow" }, [h("button", { type: "button", class: "btn quiet", onclick: function () { box.hidden = true; } }, ["Lukk"])]));
    }
    box.appendChild(badge); box.appendChild(body);
    box.hidden = false;
  }
  function renderSupport(plan) {
    var box = $("support"); box.textContent = "";
    var i = idea(), kind = i ? i.kind : "ide";
    var keys = (SUPPORT[kind] || SUPPORT.ide).slice();
    if (plan && plan.plan_type === "forretningsplan" && keys.indexOf("inno") === -1) keys.push("inno");
    box.appendChild(h("h3", null, ["Støtte mens idéen formes"]));
    box.appendChild(h("p", { class: "small" }, ["Offentlige kilder som er verdt å lese for en idé av typen «" + KIND_LABEL[kind] + "». MinBiz gir ikke skatte-, juridiske eller investeringsråd. Les hos kilden, og spør regnskapsfører eller bank når du er usikker."]));
    box.appendChild(h("ul", { class: "sources" }, keys.map(function (k) {
      var s = SRC[k];
      return h("li", null, [h("a", { href: s.url, rel: "noopener noreferrer", target: "_blank" }, [s.name, h("span", { class: "sr-only" }, [" (åpnes i ny fane)"])]), h("br"), h("span", { class: "muted small" }, [s.why])]);
    })));
  }
  function renderDash() {
    var plan = activePlan();
    $("dash-empty").hidden = !!plan;
    $("dash-plan").hidden = !plan;
    if (!plan) return;
    var pick = $("plan-pick");
    $("plan-pick-wrap").hidden = S.plans.length < 2;
    pick.textContent = "";
    S.plans.forEach(function (p) {
      var o = h("option", { value: p.id }, [PLANS[p.plan_type].name + " fra " + fmtDate(p.start_date)]);
      if (p.id === plan.id) o.selected = true;
      pick.appendChild(o);
    });
    var steps = stepsOf(plan.id);
    var done = steps.filter(function (s) { return s.status === "gjort"; }).length;
    var pct = steps.length ? Math.round(done / steps.length * 100) : 0;
    $("progress").value = pct;
    $("progress-text").textContent = PLANS[plan.plan_type].name + ": " + done + " av " + steps.length + " steg gjort (" + pct + " %).";

    var ul = $("today"); ul.textContent = "";
    var tod = steps.filter(function (s) { return s.status === "i_dag"; });
    if (tod.length) tod.forEach(function (s) { ul.appendChild(stepCard(s, plan)); });
    else {
      var nxt = steps.filter(function (s) { return s.status === "neste"; })[0];
      if (nxt) {
        ul.appendChild(h("li", null, [h("p", null, ["Ingen steg står på i dag. Neste steg er «" + nxt.title + "» (" + fmtDate(nxt.due_date) + ")."]),
          h("button", { type: "button", class: "btn small", onclick: function () { moveStep(nxt, "i_dag"); } }, ["Ta det i dag"])]));
      } else if (steps.length && steps.every(function (s) { return s.status === "gjort"; })) {
        ul.appendChild(h("li", null, [h("p", null, ["Alle stegene i denne planen er gjort."])]));
      } else {
        ul.appendChild(h("li", null, [h("p", null, ["Ingen steg står på i dag. Resten venter på noe eller noen."])]));
      }
    }

    var board = $("board"); board.textContent = "";
    STATUS.forEach(function (st) {
      var list = steps.filter(function (s) { return s.status === st.key; });
      var hid = "col-" + st.key;
      var col = h("section", { class: "col", "aria-labelledby": hid }, [h("h4", { id: hid, class: "colh" }, [h("span", null, [st.label]), h("span", { class: "muted", "aria-label": list.length + " steg" }, [String(list.length)])])]);
      var cul = h("ul");
      if (!list.length) cul.appendChild(h("li", { class: "muted small" }, ["Tomt"]));
      list.forEach(function (s) { cul.appendChild(stepCard(s, plan)); });
      col.appendChild(cul);
      board.appendChild(col);
    });

    var merits = $("merits"); merits.textContent = "";
    if (!S.achievements.length) merits.appendChild(h("li", { class: "muted" }, ["Ingen merker ennå. Det første kommer når en fase eller en plan er gjort."]));
    S.achievements.forEach(function (a) {
      var when = a.earned_at ? fmtDate(a.earned_at.slice(0, 10)) : "";
      merits.appendChild(h("li", null, [h("span", { class: "dot", "aria-hidden": "true" }), h("span", null, [a.title, " ", h("span", { class: "muted small" }, [when])])]));
    });
    renderSupport(plan);
  }

  /* ---------- Mine data ---------- */
  async function exportData() {
    try {
      var data = await db.load();
      var blob = new Blob([JSON.stringify({ eksportert: new Date().toISOString(), kilde: "MinBiz (my.bizplanpilot.com)", data: data }, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = h("a", { href: url, download: "minbiz-data-" + today() + ".json" });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      toast("Filen er lastet ned.");
    } catch (e) { toast("Kunne ikke hente dataene: " + errText(e)); }
  }
  async function deleteAll() {
    if (!window.confirm("Vil du slette alle MinBiz-dataene dine? Profil, idéer, planer, steg og merker slettes for godt. Innloggingen og Min dag blir ikke rørt.")) return;
    try {
      await db.deleteAll();
      S = { profile: null, ideas: [], plans: [], steps: [], achievements: [] };
      activePlanId = null; chosenType = null;
      store("minbiz_birth_local", null);
      $("moved-msg").hidden = true; $("celebrate").hidden = true;
      fillProfile(); fillIdea(); renderDash();
      $("delete-msg").textContent = "Alle MinBiz-dataene dine er slettet.";
    } catch (e) { $("delete-msg").textContent = "Kunne ikke slette: " + errText(e); }
  }

  /* ---------- Oppstart ---------- */
  async function startApp(label) {
    $("loading").hidden = true; $("login").hidden = true; $("app").hidden = false;
    $("who").textContent = label;
    S = await db.load();
    var m = await db.member();
    memberBirth = m && m.birth_date ? m.birth_date : null;
    fillProfile(); fillIdea();
    await autoMove();
    renderDash();
  }
  function showLogin() {
    $("loading").hidden = true; $("app").hidden = true; $("login").hidden = false;
  }
  function redirectUrl() {
    var host = location.hostname;
    if (host === "leamarketing.github.io") return "https://leamarketing.github.io/minbiz/app.html";
    return "https://my.bizplanpilot.com/app.html";
  }
  async function sendLink(ev) {
    ev.preventDefault();
    var email = $("email").value.trim(), msg = $("login-msg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Skriv en gyldig e-postadresse."; $("email").focus(); return; }
    var btn = $("login-btn"); btn.disabled = true; msg.textContent = "Sender ...";
    try {
      var r = await sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectUrl() } });
      if (r.error) throw r.error;
      msg.textContent = "Lenken er sendt til " + email + ". Åpne e-posten og trykk på lenken. Sjekk søppelpost hvis den ikke kommer.";
    } catch (e) {
      msg.textContent = "Kunne ikke sende lenken: " + errText(e) + ". Prøv igjen om litt.";
    }
    btn.disabled = false;
  }

  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll("#appnav button"), function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-view")); }); });
    document.addEventListener("click", function (e) { var g = e.target.closest && e.target.closest("[data-goto]"); if (g) show(g.getAttribute("data-goto")); });
    $("interest-add").addEventListener("click", addInterest);
    $("interest-input").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addInterest(); } });
    $("use_horoscope").addEventListener("change", renderHoroscope);
    $("birth_local").addEventListener("change", renderHoroscope);
    $("profile-form").addEventListener("submit", saveProfile);
    $("idea-form").addEventListener("submit", saveIdea);
    $("idea-form").addEventListener("input", renderIdeaCard);
    $("idea-form").addEventListener("change", renderIdeaCard);
    $("plan-form").addEventListener("submit", createPlan);
    $("start_date").addEventListener("change", renderPreview);
    $("plan-pick").addEventListener("change", function () { activePlanId = this.value; $("celebrate").hidden = true; renderDash(); });
    $("export").addEventListener("click", exportData);
    $("delete-all").addEventListener("click", deleteAll);
    $("login-form").addEventListener("submit", sendLink);
    $("logout").addEventListener("click", async function () { try { await sb.auth.signOut(); } catch (e) { /* uansett */ } location.href = "app.html"; });
  }

  async function init() {
    wire();
    if (DEMO) {
      $("demo-bar").hidden = false;
      document.title = "Demo · MinBiz-appen";
      db = memDb();
      await startApp("Demo uten konto");
      return;
    }
    if (!window.supabase || !window.supabase.createClient || !CFG.url) {
      $("loading").textContent = "Kunne ikke laste innloggingen. Sjekk nettforbindelsen og last siden på nytt.";
      return;
    }
    sb = window.supabase.createClient(CFG.url, CFG.publishable, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    var started = false;
    async function go(session) {
      if (started || !session) return;
      started = true;
      db = supaDb(sb, session.user.id);
      $("logout").hidden = false;
      try { await startApp(session.user.email || "Innlogget"); }
      catch (e) { $("loading").hidden = false; $("loading").textContent = "Kunne ikke hente dataene dine: " + errText(e); $("app").hidden = true; }
      if (location.hash && /access_token|error/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search);
    }
    sb.auth.onAuthStateChange(function (_ev, session) { if (session) setTimeout(function () { go(session); }, 0); });
    var r = await sb.auth.getSession();
    if (r.data && r.data.session) await go(r.data.session);
    else if (!started) {
      showLogin();
      if (location.hash && /error_description=/.test(location.hash)) {
        var m = decodeURIComponent(((location.hash.match(/error_description=([^&]+)/) || [])[1] || "").replace(/\+/g, " "));
        $("login-msg").textContent = "Innloggingslenken virket ikke (" + m + "). Be om en ny lenke.";
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
