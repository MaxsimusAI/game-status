// Canonical status matrix for the public project readiness dashboard.
// Cell values can be a status string ("done" | "progress" | "todo" | "na")
// or an object: { status, date, dateLabel, note, tone }.
window.DASHBOARD_DATA = {
  title: "Дашборд готовности проектов",
  subtitle: "Сверка выполнения по социальным сетям, партнёрке, платёжкам и серверам",
  updatedAt: "16.11.2026",
  startDate: "2026-10-25",
  startTitle: "Старт проекта с 25 октября",
  columns: [
    {
      id: "bt-cis",
      title: "Битва Титанов СНГ",
      cls: "col-bt-cis"
    },
    {
      id: "bt-en",
      title: "Битва Титанов зарубежная",
      cls: "col-bt-en"
    },
    {
      id: "ti-cis",
      title: "Titan Idols СНГ",
      cls: "col-ti-cis"
    },
    {
      id: "ti-en",
      title: "Titan Idols зарубежная",
      cls: "col-ti-en"
    }
  ],
  sections: [
    {
      id: "socials",
      number: "01",
      title: "Социальные сети",
      icon: "globe",
      rows: [
        {
          id: "soc-yandex",
          title: "Яндекс",
          cells: {
            "bt-cis": {
              status: "todo",
              note: "Жду"
            },
            "bt-en": "na",
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": "na"
          }
        },
        {
          id: "soc-crazygames",
          title: "Crazy Games",
          cells: {
            "bt-cis": "na",
            "bt-en": {
              status: "todo",
              note: "Жду партнёрку Xsolla"
            },
            "ti-cis": "na",
            "ti-en": {
              status: "todo",
              note: "Жду"
            }
          }
        },
        {
          id: "soc-vk",
          title: "ВКонтакте",
          cells: {
            "bt-cis": {
              status: "todo",
              note: "Жду"
            },
            "bt-en": "na",
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": "na"
          }
        },
        {
          id: "soc-frvr",
          title: "FRVR",
          cells: {
            "bt-cis": "na",
            "bt-en": {
              status: "todo",
              note: "Нет сервера и партнёрки"
            },
            "ti-cis": "na",
            "ti-en": {
              status: "todo",
              note: "Нет сервера и партнёрки"
            }
          }
        },
        {
          id: "soc-other",
          title: "Другие соцсети",
          cells: {
            "bt-cis": {
              status: "todo",
              note: "Жду"
            },
            "bt-en": {
              status: "todo",
              note: "Жду"
            },
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": {
              status: "todo",
              note: "Жду"
            }
          }
        }
      ]
    },
    {
      id: "partner",
      number: "02",
      title: "Партнёрка",
      icon: "handshake",
      rows: [
        {
          id: "prt-project",
          title: "Завести проект в партнёрке",
          cells: {
            "bt-cis": {
              status: "done",
              date: "2026-11-03",
              dateLabel: "3 ноября"
            },
            "bt-en": {
              status: "todo",
              note: "Жду"
            },
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": {
              status: "todo",
              note: "Жду"
            }
          }
        }
      ]
    },
    {
      id: "payments",
      number: "03",
      title: "Платёжки",
      icon: "card",
      rows: [
        {
          id: "pay-yookassa",
          title: "ЮKassa",
          cells: {
            "bt-cis": {
              status: "done",
              date: "2026-11-03",
              dateLabel: "3 ноября"
            },
            "bt-en": "na",
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": "na"
          }
        },
        {
          id: "pay-xsolla",
          title: "Xsolla",
          cells: {
            "bt-cis": {
              status: "todo",
              note: "Чиним с Вовой",
              tone: "yellow"
            },
            "bt-en": {
              status: "todo",
              note: "Жду"
            },
            "ti-cis": {
              status: "todo",
              note: "Жду"
            },
            "ti-en": {
              status: "todo",
              note: "Жду"
            }
          }
        }
      ]
    },
    {
      id: "servers",
      number: "04",
      title: "Сервер",
      icon: "server",
      rows: [
        {
          id: "srv-world",
          title: "Игровой сервер",
          cells: {
            "bt-cis": {
              status: "done",
              date: "2026-10-27",
              dateLabel: "27 октября"
            },
            "bt-en": {
              status: "todo",
              note: "Ещё сам не написал Вите"
            },
            "ti-cis": {
              status: "todo",
              note: "Ещё сам не написал Вите"
            },
            "ti-en": {
              status: "todo",
              note: "Ещё сам не написал Вите"
            }
          }
        }
      ]
    }
  ]
};
