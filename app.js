(function () {
  "use strict";

  var data = window.DASHBOARD_DATA;
  if (!data) return;

  var STATUS_META = {
    todo: {
      label: "Не сделано",
      cls: "is-todo",
      icon:
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>'
    },
    progress: {
      label: "В работе",
      cls: "is-progress",
      icon:
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="4.5" y="4.5" width="7" height="7" rx="1.5" fill="currentColor"/></svg>'
    },
    done: {
      label: "Сделано",
      cls: "is-done",
      icon:
        '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.2 8.4l3.1 3.1 6.5-6.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    }
  };

  var SECTION_ICONS = {
    globe:
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 10h14M10 3c1.9 2 2.9 4.4 2.9 7s-1 5-2.9 7c-1.9-2-2.9-4.4-2.9-7s1-5 2.9-7z" stroke="currentColor" stroke-width="1.5"/></svg>',
    handshake:
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 11l2.5 2.5a2.1 2.1 0 003 0l3.8-3.8a2 2 0 000-2.8l-1.7-1.7a2 2 0 00-2.8 0L10 7 8.2 5.2a2 2 0 00-2.8 0L3.7 6.9a2 2 0 000 2.8L7 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    card:
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2.2" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 8.5h15M6 12.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    server:
      '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3.5" width="14" height="5.2" rx="1.6" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="11.3" width="14" height="5.2" rx="1.6" stroke="currentColor" stroke-width="1.6"/><rect x="5.4" y="5.3" width="1.8" height="1.8" fill="currentColor"/><rect x="5.4" y="13.1" width="1.8" height="1.8" fill="currentColor"/></svg>'
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeCell(val) {
    if (!val) {
      return {
        status: "na",
        date: null,
        dateLabel: null,
        note: null,
        tone: null
      };
    }
    if (typeof val === "string") {
      return {
        status: val,
        date: null,
        dateLabel: null,
        note: null,
        tone: null
      };
    }
    return {
      status: val.status || "todo",
      date: val.date || null,
      dateLabel: val.dateLabel || null,
      note: val.note || null,
      tone: val.tone || null
    };
  }

  function parseIsoDateUtc(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10);
    var m = parseInt(parts[1], 10);
    var d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return Date.UTC(y, m - 1, d);
  }

  function pluralDays(n) {
    var abs = Math.abs(n) % 100;
    var last = abs % 10;
    if (abs >= 11 && abs <= 19) return n + " дней";
    if (last === 1) return n + " день";
    if (last >= 2 && last <= 4) return n + " дня";
    return n + " дней";
  }

  function daysFromStart(targetIso) {
    var startUtc = parseIsoDateUtc(data.startDate);
    var endUtc = parseIsoDateUtc(targetIso);
    if (startUtc === null || endUtc === null) return null;
    return Math.max(0, Math.round((endUtc - startUtc) / 86400000));
  }

  function elapsedDaysSinceStart() {
    var startUtc = parseIsoDateUtc(data.startDate);
    if (startUtc === null) return 0;
    var now = new Date();
    var todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.round((todayUtc - startUtc) / 86400000));
  }

  function formatCellSubLine(cellObj) {
    if (!cellObj) return "";
    if (cellObj.dateLabel) {
      var diff = cellObj.date ? daysFromStart(cellObj.date) : null;
      return diff === null
        ? cellObj.dateLabel
        : cellObj.dateLabel + " (" + pluralDays(diff) + ")";
    }
    if (cellObj.note) {
      return cellObj.note;
    }
    return "";
  }

  function computeStats() {
    var total = 0;
    var done = 0;
    var progress = 0;
    var todo = 0;
    var byCol = {};

    for (var c = 0; c < data.columns.length; c++) {
      byCol[data.columns[c].id] = { total: 0, done: 0, progress: 0, todo: 0 };
    }

    for (var i = 0; i < data.sections.length; i++) {
      var rows = data.sections[i].rows;
      for (var j = 0; j < rows.length; j++) {
        var cells = rows[j].cells || {};
        for (var k = 0; k < data.columns.length; k++) {
          var colId = data.columns[k].id;
          var st = normalizeCell(cells[colId]).status;
          if (st === "na") continue;
          total++;
          byCol[colId].total++;
          if (st === "done") {
            done++;
            byCol[colId].done++;
          } else if (st === "progress") {
            progress++;
            byCol[colId].progress++;
          } else {
            todo++;
            byCol[colId].todo++;
          }
        }
      }
    }

    return {
      total: total,
      done: done,
      progress: progress,
      todo: todo,
      byCol: byCol
    };
  }

  function renderCell(rawCell) {
    var cell = normalizeCell(rawCell);
    if (!cell.status || cell.status === "na") {
      return '<span class="na-dash" aria-label="Не применяется">—</span>';
    }
    var meta = STATUS_META[cell.status] || STATUS_META.todo;
    var toneCls = cell.tone ? " tone-" + escapeHtml(cell.tone) : "";
    var subLine = formatCellSubLine(cell);

    if (subLine) {
      return (
        '<span class="status-badge ' +
        meta.cls +
        toneCls +
        ' has-sub">' +
        '<span class="badge-main-row">' +
        '<span class="badge-check" aria-hidden="true">' +
        meta.icon +
        "</span>" +
        "<span>" +
        escapeHtml(meta.label) +
        "</span>" +
        "</span>" +
        '<span class="badge-sub-line">' +
        escapeHtml(subLine) +
        "</span>" +
        "</span>"
      );
    }

    return (
      '<span class="status-badge ' +
      meta.cls +
      toneCls +
      '">' +
      '<span class="badge-check" aria-hidden="true">' +
      meta.icon +
      "</span>" +
      "<span>" +
      escapeHtml(meta.label) +
      "</span>" +
      "</span>"
    );
  }

  function renderPage() {
    document.getElementById("page-title").textContent = data.title;
    document.getElementById("page-subtitle").textContent = data.subtitle;
    document.getElementById("header-updated").textContent =
      "Обновлено: " + data.updatedAt;

    var launchTitleEl = document.getElementById("launch-title");
    var launchElapsedEl = document.getElementById("launch-elapsed");
    if (launchTitleEl && data.startTitle) {
      launchTitleEl.textContent = data.startTitle;
    }
    if (launchElapsedEl && data.startDate) {
      launchElapsedEl.textContent =
        "Прошло со старта проекта: " + pluralDays(elapsedDaysSinceStart());
    }

    var stats = computeStats();
    var pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    document.getElementById("kpi-overall").textContent =
      stats.done + " из " + stats.total;
    document.getElementById("kpi-pct").textContent = pct + "%";
    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("kpi-done").textContent = String(stats.done);
    document.getElementById("kpi-progress").textContent = String(stats.progress);
    document.getElementById("kpi-todo").textContent = String(stats.todo);

    var colCount = data.columns.length + 1;

    var colGroupHtml = '<col class="col-task">';
    var theadColsHtml =
      '<th scope="col" class="th-task">' +
      '<div class="th-task-label">Задача</div>' +
      '<div class="th-task-sub">Раздел и пункт сверки</div>' +
      "</th>";

    for (var c = 0; c < data.columns.length; c++) {
      var col = data.columns[c];
      var colStat = stats.byCol[col.id];
      var cntCls = colStat.done > 0 ? "th-proj-count has-done" : "th-proj-count";
      colGroupHtml += '<col class="col-proj">';
      theadColsHtml +=
        '<th scope="col" class="th-proj ' +
        escapeHtml(col.cls) +
        '">' +
        '<div class="th-proj-inner">' +
        '<div class="th-proj-title-row">' +
        '<span class="proj-sq ' +
        escapeHtml(col.cls) +
        '"></span>' +
        '<span class="th-proj-title">' +
        escapeHtml(col.title) +
        "</span>" +
        "</div>" +
        '<span class="' +
        cntCls +
        '">Готово: ' +
        colStat.done +
        " из " +
        colStat.total +
        "</span>" +
        "</div>" +
        "</th>";
    }

    var tbodyHtml = "";
    for (var i = 0; i < data.sections.length; i++) {
      var sec = data.sections[i];
      var secDone = 0;
      var secTotal = 0;

      for (var r = 0; r < sec.rows.length; r++) {
        var rc = sec.rows[r].cells || {};
        for (var m = 0; m < data.columns.length; m++) {
          var st = normalizeCell(rc[data.columns[m].id]).status;
          if (st !== "na") {
            secTotal++;
            if (st === "done") secDone++;
          }
        }
      }

      var secIcon = SECTION_ICONS[sec.icon] || "";
      tbodyHtml +=
        '<tr class="group-row">' +
        '<td colspan="' +
        colCount +
        '">' +
        '<div class="group-bar">' +
        '<div class="group-left">' +
        '<span class="group-badge">' +
        escapeHtml(sec.number) +
        "</span>" +
        '<span class="group-icon">' +
        secIcon +
        "</span>" +
        '<span class="group-title">' +
        escapeHtml(sec.title) +
        "</span>" +
        "</div>" +
        '<span class="group-counter">Готово: ' +
        secDone +
        " из " +
        secTotal +
        "</span>" +
        "</div>" +
        "</td>" +
        "</tr>";

      for (var j = 0; j < sec.rows.length; j++) {
        var row = sec.rows[j];
        var cellsHtml = "";
        for (var p = 0; p < data.columns.length; p++) {
          var pid = data.columns[p].id;
          cellsHtml +=
            '<td class="td-cell">' +
            renderCell((row.cells || {})[pid]) +
            "</td>";
        }

        tbodyHtml +=
          '<tr class="data-row">' +
          '<td class="td-task">' +
          '<div class="task-title">' +
          escapeHtml(row.title) +
          "</div>" +
          "</td>" +
          cellsHtml +
          "</tr>";
      }
    }

    document.getElementById("table-container").innerHTML =
      '<div class="table-card">' +
      '<div class="table-scroll">' +
      '<table class="status-table" aria-label="Таблица готовности по проектам">' +
      "<colgroup>" +
      colGroupHtml +
      "</colgroup>" +
      "<thead><tr>" +
      theadColsHtml +
      "</tr></thead>" +
      "<tbody>" +
      tbodyHtml +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>";
  }

  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2400);
  }

  function buildSummaryText() {
    var stats = computeStats();
    var lines = [];
    lines.push("📊 " + data.title + " (" + data.updatedAt + ")");
    if (data.startTitle && data.startDate) {
      lines.push(
        data.startTitle +
          " · Прошло со старта проекта: " +
          pluralDays(elapsedDaysSinceStart())
      );
    }
    lines.push("Готово: " + stats.done + " из " + stats.total);
    lines.push("");

    for (var c = 0; c < data.columns.length; c++) {
      var col = data.columns[c];
      var cs = stats.byCol[col.id];
      lines.push("▪ " + col.title + " (" + cs.done + " из " + cs.total + "):");
      for (var i = 0; i < data.sections.length; i++) {
        var sec = data.sections[i];
        for (var j = 0; j < sec.rows.length; j++) {
          var row = sec.rows[j];
          var cell = normalizeCell((row.cells || {})[col.id]);
          if (cell.status === "na") continue;
          var icon =
            cell.status === "done"
              ? "✅"
              : cell.status === "progress"
                ? "🔄"
                : "⬜";
          var lbl = (STATUS_META[cell.status] || STATUS_META.todo).label;
          var sub = formatCellSubLine(cell);
          lines.push(
            "  " +
              icon +
              " " +
              sec.title +
              " — " +
              row.title +
              ": " +
              lbl +
              (sub ? " (" + sub + ")" : "")
          );
        }
      }
      lines.push("");
    }
    lines.push("Ссылка: " + window.location.href);
    return lines.join("\n");
  }

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          showToast(okMsg);
        },
        function () {
          fallbackCopy(text, okMsg);
        }
      );
    } else {
      fallbackCopy(text, okMsg);
    }
  }

  function fallbackCopy(text, okMsg) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast(okMsg);
    } catch (e) {
      showToast("Не удалось скопировать");
    }
    document.body.removeChild(ta);
  }

  function bindEvents() {
    document
      .getElementById("btn-copy-link")
      .addEventListener("click", function () {
        copyText(window.location.href, "Ссылка скопирована");
      });

    document
      .getElementById("btn-copy-summary")
      .addEventListener("click", function () {
        copyText(buildSummaryText(), "Сводка скопирована для чата");
      });

    var themeBtn = document.getElementById("btn-theme");
    themeBtn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || "dark";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      document.getElementById("theme-label").textContent =
        next === "dark" ? "Светлая тема" : "Тёмная тема";
    });
  }

  renderPage();
  bindEvents();
})();
