(function () {
  const DELAY = 420;

  let intersections = [
    { id: "alb-001", name: "Av. 5 de Outubro × R. Liberdade",     address: "Av. 5 de Outubro 12, Albufeira",    status: "idle",     lat: 37.0889, lng: -8.2486 },
    { id: "alb-002", name: "EN125 × Estrada do Peneco",           address: "EN125 km 60.3, Albufeira",          status: "priority", lat: 37.0850, lng: -8.2510 },
    { id: "alb-003", name: "R. Cândido dos Reis × R. da Igreja",  address: "R. Cândido dos Reis 5, Albufeira",  status: "offline",  lat: 37.0876, lng: -8.2490 },
    { id: "alb-004", name: "Av. Sá Carneiro × Acesso Aeroporto",  address: "Av. Sá Carneiro, Albufeira",        status: "pending",  lat: 37.1050, lng: -8.2350 },
    { id: "alb-005", name: "R. de Paderne × Estrada Real",        address: "R. de Paderne, Paderne, Albufeira", status: "idle",     lat: 37.1200, lng: -8.2100 },
  ];

  const events = [
    { id: "evt-001", intersection_id: "alb-002", intersection_name: "EN125 × Estrada do Peneco",          triggered_by: "INEM",                    green_duration_s: 32, detected_at: "2026-06-15T14:23:11Z", resolved_at: "2026-06-15T14:23:43Z", status: "resolved" },
    { id: "evt-002", intersection_id: "alb-001", intersection_name: "Av. 5 de Outubro × R. Liberdade",    triggered_by: "PSP",                     green_duration_s: 28, detected_at: "2026-06-15T09:11:04Z", resolved_at: null,                   status: "active"   },
    { id: "evt-003", intersection_id: "alb-005", intersection_name: "R. de Paderne × Estrada Real",       triggered_by: "Bombeiros Voluntários",   green_duration_s: 41, detected_at: "2026-06-14T22:47:38Z", resolved_at: "2026-06-14T22:48:19Z", status: "resolved" },
    { id: "evt-004", intersection_id: "alb-002", intersection_name: "EN125 × Estrada do Peneco",          triggered_by: "INEM",                    green_duration_s: 35, detected_at: "2026-06-14T16:05:55Z", resolved_at: "2026-06-14T16:06:30Z", status: "resolved" },
    { id: "evt-005", intersection_id: "alb-003", intersection_name: "R. Cândido dos Reis × R. da Igreja", triggered_by: "PSP",                     green_duration_s: 22, detected_at: "2026-06-13T08:33:20Z", resolved_at: "2026-06-13T08:33:42Z", status: "resolved" },
    { id: "evt-006", intersection_id: "alb-001", intersection_name: "Av. 5 de Outubro × R. Liberdade",    triggered_by: "INEM",                    green_duration_s: 38, detected_at: "2026-06-12T19:58:01Z", resolved_at: null,                   status: "active"   },
    { id: "evt-007", intersection_id: "alb-004", intersection_name: "Av. Sá Carneiro × Acesso Aeroporto", triggered_by: "Bombeiros Voluntários",   green_duration_s: 29, detected_at: "2026-06-12T11:14:47Z", resolved_at: "2026-06-12T11:15:16Z", status: "resolved" },
    { id: "evt-008", intersection_id: "alb-002", intersection_name: "EN125 × Estrada do Peneco",          triggered_by: "INEM",                    green_duration_s: 44, detected_at: "2026-06-11T07:29:33Z", resolved_at: "2026-06-11T07:30:17Z", status: "resolved" },
    { id: "evt-009", intersection_id: "alb-005", intersection_name: "R. de Paderne × Estrada Real",       triggered_by: "PSP",                     green_duration_s: 19, detected_at: "2026-06-10T15:02:12Z", resolved_at: "2026-06-10T15:02:31Z", status: "resolved" },
    { id: "evt-010", intersection_id: "alb-001", intersection_name: "Av. 5 de Outubro × R. Liberdade",    triggered_by: "INEM",                    green_duration_s: 33, detected_at: "2026-06-09T10:41:58Z", resolved_at: "2026-06-09T10:42:31Z", status: "resolved" },
    { id: "evt-011", intersection_id: "alb-003", intersection_name: "R. Cândido dos Reis × R. da Igreja", triggered_by: "Bombeiros Voluntários",   green_duration_s: 27, detected_at: "2026-06-08T18:17:44Z", resolved_at: "2026-06-08T18:18:11Z", status: "resolved" },
    { id: "evt-012", intersection_id: "alb-002", intersection_name: "EN125 × Estrada do Peneco",          triggered_by: "INEM",                    green_duration_s: 36, detected_at: "2026-06-07T13:55:22Z", resolved_at: "2026-06-07T13:56:01Z", status: "resolved" },
    { id: "evt-013", intersection_id: "alb-004", intersection_name: "Av. Sá Carneiro × Acesso Aeroporto", triggered_by: "PSP",                     green_duration_s: 31, detected_at: "2026-06-06T23:08:09Z", resolved_at: null,                   status: "active"   },
    { id: "evt-014", intersection_id: "alb-001", intersection_name: "Av. 5 de Outubro × R. Liberdade",    triggered_by: "INEM",                    green_duration_s: 25, detected_at: "2026-06-05T06:44:37Z", resolved_at: "2026-06-05T06:45:02Z", status: "resolved" },
    { id: "evt-015", intersection_id: "alb-005", intersection_name: "R. de Paderne × Estrada Real",       triggered_by: "Bombeiros Voluntários",   green_duration_s: 43, detected_at: "2026-06-04T20:31:18Z", resolved_at: "2026-06-04T20:32:01Z", status: "resolved" },
  ];

  let nextId = 200;

  /* ── Response helper ─────────────────────────────────────── */
  function json(data, status) {
    return new Promise(resolve =>
      setTimeout(() =>
        resolve(new Response(JSON.stringify(data), {
          status: status || 200,
          headers: { "Content-Type": "application/json" },
        })),
      DELAY)
    );
  }

  /* ── Intercept fetch ─────────────────────────────────────── */
  const _fetch = window.fetch.bind(window);
  window.fetch = function (url, opts) {
    const raw     = typeof url === "string" ? url : String(url);
    const base    = raw.split("?")[0];
    const qs      = raw.includes("?") ? raw.split("?")[1] : "";
    const params  = new URLSearchParams(qs);
    const method  = ((opts && opts.method) || "GET").toUpperCase();

    /* GET /api/intersections */
    if (base === "/api/intersections" && method === "GET") {
      return json({ data: intersections.slice() });
    }

    /* POST /api/intersections */
    if (base === "/api/intersections" && method === "POST") {
      var body = JSON.parse((opts && opts.body) || "{}");
      var item = Object.assign({ id: "alb-" + (++nextId), status: "pending", created_at: new Date().toISOString() }, body);
      intersections.push(item);
      return json(item, 201);
    }

    /* PUT /api/intersections/:id  or  DELETE /api/intersections/:id */
    var m = base.match(/^\/api\/intersections\/(.+)$/);
    if (m) {
      var id  = m[1];
      var idx = intersections.findIndex(function(x) { return x.id === id; });
      if (method === "PUT") {
        if (idx === -1) return json({ error: "Not found" }, 404);
        var upd = JSON.parse((opts && opts.body) || "{}");
        intersections[idx] = Object.assign({}, intersections[idx], upd);
        return json(intersections[idx]);
      }
      if (method === "DELETE") {
        if (idx === -1) return json({ error: "Not found" }, 404);
        intersections.splice(idx, 1);
        return json({ ok: true });
      }
    }

    /* GET /api/events */
    if (base === "/api/events" && method === "GET") {
      var result = events.slice();
      var intId  = params.get("intersection_id");
      var from   = params.get("from");
      var to     = params.get("to");
      var status = params.get("status");
      if (intId)  result = result.filter(function(e) { return e.intersection_id === intId; });
      if (status) result = result.filter(function(e) { return e.status === status; });
      if (from) {
        var fd = new Date(from + "T00:00:00Z");
        result = result.filter(function(e) { return new Date(e.detected_at) >= fd; });
      }
      if (to) {
        var td = new Date(to + "T23:59:59Z");
        result = result.filter(function(e) { return new Date(e.detected_at) <= td; });
      }
      return json({ data: result, total: result.length });
    }

    return _fetch(url, opts);
  };
})();
