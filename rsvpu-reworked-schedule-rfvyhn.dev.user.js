// ==UserScript==
// @name         [DEV] Современное переработанное расписание РГППУ
// @namespace    Violentmonkey Scripts for RSVPU
// @version      1.2.1.1-dev
// @description  Обновленные UI и UX, новые фичи, фиксы, миграция на MDUI, собственная реализация большей части компонентов. С поддержкой PWA
// @author       Strange Vitec, Google Gemini
// @updateURL    https://github.com/StrangeVitec/rsvpu-reworked-schedule-rfvyhn/raw/refs/heads/main/rsvpu-reworked-schedule-rfvyhn.dev.user.js
// @downloadURL  https://github.com/StrangeVitec/rsvpu-reworked-schedule-rfvyhn/raw/refs/heads/main/rsvpu-reworked-schedule-rfvyhn.dev.user.js
// @match        https://rfvyhn.rsvpu.ru/mobile/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://timeline.rsvpu.ru/favicon.ico
// ==/UserScript==

(function () {
    'use strict';

    const ICON_SVG_DATA_URI = 'data:image/svg+xml;utf8,<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5ZM21 8.5v3.522A6.5 6.5 0 0 0 12.022 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18Z" fill="%231fcad6"/><path d="M23 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-5.5 0h2a.5.5 0 1 1 0 1H17a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v2.5Z" fill="%231fcad6"/></svg>';
    const ICON_PNG_BASE64_URI = 'data:image/png;base64,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';

    GM_addElement('link', {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
        rel: 'stylesheet',
    });

    // --- Подключаем MDUI и создаем Promise для ожидания ---
    GM_addElement('link', { href: 'https://unpkg.com/mdui@2/mdui.css', rel: 'stylesheet' });

    const mduiLoaded = new Promise((resolve, reject) => {
        // Загружаем скрипт как текст через Greasemonkey API, чтобы обойти ограничения
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://unpkg.com/mdui@2/mdui.global.js",
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        // Выполняем загруженный код в контексте страницы (window),
                        // где он гарантированно создаст глобальный объект mdui
                        unsafeWindow.eval(response.responseText);
                        console.log("MDUI script executed successfully via GM_xmlhttpRequest.");
                        resolve(unsafeWindow.mdui);
                    } catch (e) {
                        reject(new Error("Ошибка при выполнении скрипта MDUI: " + e));
                    }
                } else {
                    reject(new Error(`Не удалось загрузить скрипт MDUI. Статус: ${response.status}`));
                }
            },
            onerror: () => reject(new Error('Сетевая ошибка при загрузке MDUI.'))
        });
    });

    const designSystemStyles = `
    /* --- Переменные дизайн-системы --- */
    :root {
        --theme-color-light: #e9ecef;
        --theme-color-dark: #272727;


        /* Палитра Светлой Темы*/
        --bg-primary: #f8f9fa; --bg-secondary: #ffffff; --bg-header: #e9ecef; --bg-header-alt: #dee2e6;
        --text-primary: #212529; --text-secondary: #6c757d; --text-on-accent: #212529;
        --accent-color: #15B0BB; --border-color: #dee2e6;
        --btn-secondary-bg: #e9ecef;
        --btn-secondary-text: #495057;
        --card-padding-vertical: 12px;
        --card-padding-horizontal: 16px;
        --item-gap: 8px;
        --lesson-type-1-bg: #66bb6a; --lesson-type-2-bg: #ef5350; --lesson-type-3-bg: #26c6da; --lesson-type-text: #ffffff;
        --spacing-unit: 8px; --border-radius-small: 4px; --border-radius-medium: 12px; --border-radius-large: 16px;
        --shadow-elevation-1: 0 1px 2px rgba(0,0,0,0.05);
        --font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --border-radius-pill: 9999px;

        /* Цвета для календаря */
        --datepicker-selected-bg: #1D6970;
        --datepicker-selected-text: #FFFFFF;
    }
    `;

    const darkThemeStyles = `
    /* --- Адаптация для тёмной темы --- */
    @media (prefers-color-scheme: dark) {
        :root {
            --bg-primary: #121212; --bg-secondary: #1e1e1e; --bg-header: #272727; --bg-header-alt: #343a40;
            --text-primary: #e9ecef; --text-secondary: #adb5bd; --text-on-accent: #ffffff;
            --accent-color: #4dd0e1; --border-color: #495057;
            --btn-secondary-bg: #343a40;
            --btn-secondary-text: #f8f9fa;
            --lesson-type-1-bg: #388e3c; --lesson-type-2-bg: #c62828; --lesson-type-3-bg: #00838f;

            /* Цвета для календаря */
            --datepicker-selected-bg: #65D8E9;
            --datepicker-selected-text: #0B363C;
        }
    }
    `;

    const modeStyles = `
    /* --- Компактный режим (TODO - недостаточно меняет) --- */
    body.compact-mode {
        --card-padding-vertical: 6px;
        --card-padding-horizontal: 12px;
        --item-gap: 4px;
    }
    `;

    const globalStyles = `

    /* --- Общие стили --- */

    /* Класс для принудительного скрытия элементов */
    .is-hidden {
        display: none !important;
    }

    /* Принудительное переопределение общих шрифтов и фона */
    body, html {
      font-family: var(--font-family) !important;
      background-color: var(--bg-primary) !important;
    }


    /* Шапка */

    /* Шапка MDUI, для переопределений, MDUI всё нужное уже сам делает */
    mdui-top-app-bar {
      z-index: 2001 !important;
    }

    /* Полностью скрываем оригинальную шапку */
    .header {
        display: none !important;
    }

    /* Заполнитель в шапке */
    .header-spacer { flex-grow: 1 !important; }

    /* Название группы, имя преподавателя или номер аудитории в шапке. TODO: его бы заменить */
    .nameGroup {
        display: flex !important;
        align-items: center !important;
        cursor: pointer !important;
        height: 100% !important;
        /* Позволяем элементу сжиматься и предотвращаем его выход за границы */
        flex-shrink: 1;
        min-width: 0;
    }
    .nameGroup h3 {
        font-size: 16px !important;
        letter-spacing: -0.05em; /* Уменьшаем межбуквенный интервал ~ на 10% */
    }
    .nameGroup h3 {
      color: var(--text-on-accent) !important;
      flex-shrink: 1 !important;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .nameGroup h3::after { display: none !important; }
    .nameGroup .clickable-indicator { color: var(--text-on-accent); margin-left: var(--spacing-unit); }



    /* Основной контент */
    .content {
      padding-top: 0 !important;    /* Обнуляем верхний отступ */
      padding-bottom: 0 !important; /* Обнуляем нижний отступ */
      width: auto !important;
      flex-grow: 1; /* Растягиваем */
    }

    /* Стиль для сообщения об отсутствии пар */
    .content h4.empty {
        width: 100% !important;
        color: var(--text-primary) !important;
    }

    .dateBlock { background-color: var(--bg-secondary) !important; margin-bottom: calc(var(--spacing-unit) * 3) !important; border: 1px solid var(--border-color) !important; border-radius: var(--border-radius-large) !important; box-shadow: var(--shadow-elevation-1) !important; overflow: hidden; }
    .dateToday { background-color: var(--bg-header-alt) !important; color: var(--text-primary) !important; border-radius: 0 !important; box-shadow: none !important; font-weight: 500; }
    .tableRasp { background: var(--bg-secondary) !important; border-radius: 0 !important; box-shadow: none !important; border: none !important; margin-bottom: 0 !important; }
    .disciplina_cont { border-top: 1px solid var(--border-color) !important; }
    .disciplina_cont td { padding: var(--card-padding-vertical) var(--card-padding-horizontal); vertical-align: top; }
    .disciplina_info p { color: var(--text-primary) !important; font-size: 14px !important; }
    .disciplina_time p { color: var(--text-primary) !important; font-size: 20px !important; font-weight: 500 !important; }
    .end-time, .prepod, .auditioria, .allgroup { color: var(--text-secondary) !important; padding-top: var(--item-gap) !important; font-size: 12px; }
    .auditioria, .allgroup { margin: 0 !important; }
    .prepod i, .auditioria i, .allgroup i { color: var(--accent-color) !important; }
    .allgroup a { color: inherit !important; text-decoration: none !important; }
    .predmet-type { border-radius: var(--border-radius-small) !important; color: var(--lesson-type-text) !important; font-weight: 500 !important; padding: 2px 6px !important; font-size: 12px !important; margin-bottom: var(--item-gap) !important; }
    .color-1 { background: var(--lesson-type-1-bg) !important; } .color-2 { background: var(--lesson-type-2-bg) !important; } .color-3 { background: var(--lesson-type-3-bg) !important; }
    .side-nav { background-color: var(--bg-secondary) !important; } .side-nav .selectFunction > * { color: var(--text-primary) !important; } .side-nav .fa { color: var(--accent-color) !important; }

    /* Принудительно скрываем старый .selectBox, так как мы его заменяем */
    .selectBox, .selectBox.active {
        display: none !important;
    }

    /* Принудительно скрываем старую главную страницу, так как мы её заменяем */
    .indexPage{
      display: none !important;
    }

    /* Стилизация старого индикатора загрузки. TODO: заменить на свой */
    .loader-wrap {
      background-color: var(--bg-secondary) !important;
    }
    .loader {
      color: var(--accent-color) !important;
    }
    .loader::before, .loader::after {
      background: var(--accent-color) !important;
    }

    `;

    const layoutStyles = `

    /* Адаптивная сетка */
    @media screen and (min-width: 1000px) {
        /* Когда двухколоночный режим включен */
        body.two-column-enabled .content {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
        }
        body.two-column-enabled .dateBlock {
            width: 49% !important;
        }
        /* Когда он выключен или на узких экранах, блоки должны занимать всю ширину */
        .dateBlock {
            width: 100% !important;
        }
        .content {
            max-width: 1200px;
            margin: 0 auto;
        }
        .content.full-width {
            max-width: none !important;
            margin: 0 !important;
        }
    }
    `;

    const modalStyles = `

    /* Модальные окна */

    mdui-dialog {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }


    /* Стили для внутренних строк */
    .settings-body {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-unit);
        padding: 0 calc(var(--spacing-unit) * 2) !important; /* Добавляем горизонтальные отступы */
    }
    .settings-row {
        display: flex;
        align-items: center;
        gap: calc(var(--spacing-unit) * 2);
        padding: var(--spacing-unit) 0; /* Оставляем только вертикальный отступ */
        min-height: 60px;
    }
    .settings-row .material-icons { color: var(--text-secondary); }
    .settings-text {
        flex-grow: 1;
    }
    .settings-label { font-size: 16px; color: var(--text-primary); }
    .settings-description { font-size: 12px; color: var(--text-secondary); }



    `;

    const componentStyles = `

    /* Кнопка "Загрузить ещё" */
      #load-more-container {
      display: flex; /* Используем flex для центрирования */
      justify-content: center;
      padding: calc(var(--spacing-unit) * 2) 0;
    }

    /* Кастомный Date Picker */
    .datepicker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%; /* Растягиваем на всю ширину слота */
    }
    .datepicker-month-year {
        font-weight: 500;
        font-size: 18px;
        flex-grow: 1; /* Заставляет текст занять всё центральное пространство */
        text-align: center; /* Центрирует текст внутри этого пространства */
    }

    .datepicker-grid { display: grid; grid-template-columns: repeat(7, 1fr); place-items: center; gap: 4px; }
    .datepicker-day-name { text-align: center; font-size: 12px; font-weight: 500; color: var(--text-secondary); height: 40px; display: flex; align-items: center; justify-content: center; }
    .datepicker-day { background-color: transparent; border: 1px solid transparent; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
    .datepicker-day:hover { background-color: var(--border-color); }
    .datepicker-day.empty { pointer-events: none; }
    .datepicker-day.today { border-color: var(--accent-color); font-weight: bold; }
    .datepicker-day.selected {
        background-color: var(--datepicker-selected-bg) !important;
        color: var(--datepicker-selected-text) !important;
        border-color: var(--datepicker-selected-bg) !important;
        font-weight: bold;
    }
    .datepicker-footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-unit);
    }


    @media screen and (max-width: 415px) {
        .datepicker-grid {
            gap: 2px;
        }
        .datepicker-day, .datepicker-day-name {
            width: 32px;
            height: 32px;
        }
    }


    /* Разделитель недель */
    .week-separator { width: 100%; margin: calc(var(--spacing-unit) * 2) 0; }
    .week-separator-text { font-size: 12px; color: var(--text-secondary); padding-left: var(--spacing-unit); }
    .week-separator-line { height: 1px; width: 100%; background-color: var(--border-color); margin-top: 4px; }



    /* --- MDUI Навигация: Управление видимостью --- */

    mdui-navigation-drawer {
        position: fixed !important; /* Делаем боковое меню "плавающим" */
    }

    mdui-navigation-drawer mdui-list {
        margin: 0 0.5rem;
    }

    /* По умолчанию (старый стиль): показываем Drawer, скрываем Rail и Bar */
    mdui-navigation-rail,
    mdui-navigation-bar {
        display: none !important;
    }

    /* Когда включен "Новый стиль навигации" */
    body.new-nav-style mdui-navigation-drawer,
    body.new-nav-style #custom-burger-btn {
        display: none !important;
    }

    /* Адаптивность для "Нового стиля" */
    @media screen and (max-width: 839px) { /* Breakpoint MDUI для переключения */
        body.new-nav-style mdui-navigation-bar {
            display: flex !important;
        }
    }
    @media screen and (min-width: 840px) {
        body.new-nav-style mdui-navigation-rail {
            display: flex !important;
        }
    }



    /* --- Стили для главной страницы --- */
    .main-page-container {
        display: flex;
        flex-direction: column;
        justify-content: center; /* Центрирование по вертикали */
        height: 100%; /* Занимает всю высоту родителя */
        max-width: 1200px; /* Ограничиваем ширину, как у .content */
        margin: 0 auto; /* Центрируем по горизонтали */
        padding: 16px;
        gap: 24px;
    }
    .main-page-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
    }
    .main-page-actions mdui-card {
        flex: 1 1 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px 16px;
    }
    .main-page-actions mdui-icon {
        font-size: 32px;
        margin-bottom: 8px;
    }
    .main-page-actions .card-label {
        font-weight: 500;
    }
    #last-group-button {
        height: 56px; /* Устанавливаем фиксированную высоту */
    }

    .main-page-disclaimer {
        color: rgb(var(--mdui-color-on-surface-variant));
        font-size: var(--mdui-typescale-label-small-size);
        font-weight: var(--mdui-typescale-label-small-weight);
        letter-spacing: var(--mdui-typescale-label-small-tracking);
        text-align: center;
        margin-top: 24px;
    }


    /* --- Стили для страницы выбора (бывший .selectBox) --- */
    .select-page-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 1rem; /* Горизонтальные отступы */
    }
    .select-page-header {
        position: sticky;
        top: 0;
        background-color: inherit; /* Наследуем фон */
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 8px; /* Отступы между вложенными элементами */
        padding: 8px 0; /* Добавляем небольшой вертикальный отступ */
    }
    .select-page-titlebar {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .select-page-titlebar h2 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0;
        flex-grow: 1;
    }
    .select-page-list {
        flex-grow: 1;
        overflow-y: auto;
    }

    `;

    const allStyles = designSystemStyles + darkThemeStyles + modeStyles + globalStyles + layoutStyles + modalStyles + componentStyles;
    GM_addStyle(allStyles);

        window.addEventListener("DOMContentLoaded", async (event) => {

        // --- Глобальные переменные состояния ---
        let lastVisibleDate = null;
        let isLoading = false;
        let settings = {};
        // let previousActiveTarget = 'home';



        // --- Основная функция-инициализатор ---
        async function main() {
            try {

                cleanupOriginalPage();
                // Ждем наш Promise, который разрешится только после выполнения скрипта MDUI
                const mdui = await mduiLoaded;
                if (!mdui) {
                    // Эта ветка теперь почти невозможна, т.к. Promise уйдет в reject, но для надежности
                    throw new Error("Объект MDUI не был получен после загрузки скрипта.");
                }

                // Теперь, когда mdui 100% готов, запускаем остальную логику
                injectUI();
                setupMduiTheme(mdui);
                setupPWA();

                await loadAndApplySettings();
                attachEventListeners();
                initPageFeatures();
            } catch (error) {
                console.error("Критическая ошибка в main():", error);
                // Если MDUI не загрузился, пытаемся запустить скрипт без него
                console.warn("Попытка запуска скрипта в отказоустойчивом режиме без MDUI.");
                injectUI();
                await loadAndApplySettings();
                attachEventListeners();
                initPageFeatures();
            }
        }



        // --- 2. Внедрение HTML-элементов на страницу ---
        function injectUI() {
            const isHomePage = window.location.search === '';

            // --- 1. Объявляем переменные и скрываем оригинальные элементы ---
            const contentDiv = document.querySelector(".content");
            const originalHeader = document.querySelector(".header");
            const originalSideNav = document.querySelector('#slide-out');
            const originalIndexPage = document.querySelector('.indexPage');

            if (originalHeader) originalHeader.style.display = 'none';
            if (originalSideNav) originalSideNav.style.display = 'none';
            if (originalIndexPage) originalIndexPage.style.display = 'none';

            // --- 2. Создаем корневой элемент MDUI Layout ---
            const mduiLayout = document.createElement('mdui-layout');
            mduiLayout.setAttribute('full-height', '');

            // --- 3. Создаем и наполняем новую шапку MDUI ---
            const mduiAppBar = document.createElement('mdui-top-app-bar');
            mduiAppBar.setAttribute('variant', 'fixed');
            mduiAppBar.setAttribute('scroll-behavior', 'elevate');
            mduiAppBar.setAttribute('scroll-target', '#main-content-scroll');

            const burgerBtn = document.createElement("mdui-button-icon");
            burgerBtn.id = "custom-burger-btn";
            burgerBtn.innerHTML = `<i class="material-icons">menu</i>`;
            mduiAppBar.appendChild(burgerBtn);

            if (isHomePage) {
                const title = document.createElement('mdui-top-app-bar-title');
                title.textContent = 'Расписание';
                mduiAppBar.appendChild(title);
            } else {
                const nameGroup = originalHeader?.querySelector(".nameGroup");
                if (nameGroup) {
                    if (!nameGroup.querySelector('.clickable-indicator')) {
                        const indicator = document.createElement("i");
                        indicator.className = "material-icons clickable-indicator";
                        indicator.textContent = "expand_more";
                        nameGroup.appendChild(indicator);
                    }
                    mduiAppBar.appendChild(nameGroup);
                }
            }

            const spacer = document.createElement('div');
            spacer.style.flexGrow = '1';
            mduiAppBar.appendChild(spacer);

            if (!isHomePage) {
                const calendarBtn = document.createElement("mdui-button-icon");
                calendarBtn.id = "custom-calendar-btn";
                calendarBtn.innerHTML = '<i class="material-icons">calendar_today</i>';
                mduiAppBar.appendChild(calendarBtn);
            }

            const settingsBtn = document.createElement("mdui-button-icon");
            settingsBtn.id = "settings-btn";
            settingsBtn.innerHTML = '<i class="material-icons">settings</i>';
            mduiAppBar.appendChild(settingsBtn);

            mduiLayout.appendChild(mduiAppBar);

            // --- 4. Создаем ВСЕ ТРИ навигационных компонента ---
            // 4.1 Боковое меню (Drawer)
            const mduiDrawer = document.createElement('mdui-navigation-drawer');
            mduiDrawer.setAttribute('close-on-overlay-click', '');
            mduiDrawer.innerHTML = `
                <mdui-list>
                    <mdui-list-item rounded icon="home" data-target="home">Главная</mdui-list-item>
                    <mdui-list-item rounded icon="group" data-target="selectGroupNumber">Группы</mdui-list-item>
                    <mdui-list-item rounded icon="school" data-target="selectPepodNumber">Преподаватели</mdui-list-item>
                    <mdui-list-item rounded icon="door_front" data-target="selectCabinetNumber">Аудитории</mdui-list-item>
                </mdui-list>
            `;
            mduiLayout.appendChild(mduiDrawer);

            // 4.2 Боковая панель (Rail)
            const mduiRail = document.createElement('mdui-navigation-rail');
            mduiRail.innerHTML = `
                <mdui-navigation-rail-item icon="home" data-target="home">Главная</mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="group" data-target="selectGroupNumber">Группы</mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="school" data-target="selectPepodNumber">Преподав.</mdui-navigation-rail-item>
                <mdui-navigation-rail-item icon="door_front" data-target="selectCabinetNumber">Аудитории</mdui-navigation-rail-item>
            `;
            mduiLayout.appendChild(mduiRail);

            // 4.3 Нижняя панель (Bar)
            const mduiNavBar = document.createElement('mdui-navigation-bar');
            mduiNavBar.setAttribute('label-visibility', 'labeled');
            mduiNavBar.setAttribute('scroll-behavior', 'hide');
            mduiNavBar.setAttribute('scroll-target', '#main-content-scroll');
            mduiNavBar.innerHTML = `
                <mdui-navigation-bar-item icon="home" data-target="home">Главная</mdui-navigation-bar-item>
                <mdui-navigation-bar-item icon="group" data-target="selectGroupNumber">Группы</mdui-navigation-bar-item>
                <mdui-navigation-bar-item icon="school" data-target="selectPepodNumber">Преподав.</mdui-navigation-bar-item>
                <mdui-navigation-bar-item icon="door_front" data-target="selectCabinetNumber">Аудитории</mdui-navigation-bar-item>
            `;
            mduiLayout.appendChild(mduiNavBar);

            // --- 5. Создаем основной контейнер контента ---
            const mainLayout = document.createElement('mdui-layout-main');
            mainLayout.id = 'main-content-scroll';
            if (isHomePage) {
                const mainPageContainer = document.createElement('div');
                mainPageContainer.className = 'main-page-container';

                // Карточки действий (теперь идут первыми)
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'main-page-actions';
                actionsContainer.innerHTML = `
                    <mdui-card clickable variant="filled" class="nav-card" data-target="selectGroupNumber">
                        <mdui-icon name="group"></mdui-icon>
                        <span class="card-label">Группы</span>
                    </mdui-card>
                    <mdui-card clickable variant="filled" class="nav-card" data-target="selectPepodNumber">
                        <mdui-icon name="school"></mdui-icon>
                        <span class="card-label">Преподаватели</span>
                    </mdui-card>
                    <mdui-card clickable variant="filled" class="nav-card" data-target="selectCabinetNumber">
                        <mdui-icon name="door_front"></mdui-icon>
                        <span class="card-label">Аудитории</span>
                    </mdui-card>
                `;
                mainPageContainer.appendChild(actionsContainer);

                // Кнопка "Последняя группа" (теперь идёт последней)
                const lastGroupLink = document.querySelector('a.last-grop-is');
                if (lastGroupLink) {
                    const href = lastGroupLink.getAttribute('href');
                    const groupName = lastGroupLink.querySelector('span')?.textContent;
                    const lastGroupButton = document.createElement('mdui-button');
                    lastGroupButton.id = 'last-group-button'; // ID для стилизации
                    lastGroupButton.setAttribute('variant', 'tonal');
                    lastGroupButton.setAttribute('href', href);
                    lastGroupButton.innerHTML = `<mdui-icon slot="icon">history</mdui-icon>Последняя группа: ${groupName}`;
                    mainPageContainer.appendChild(lastGroupButton);
                }

                // Добавляем дисклеймер в самый низ
                const disclaimer = document.createElement('div');
                disclaimer.className = 'main-page-disclaimer';
                disclaimer.textContent = 'Данный сайт модифицирован внешним Userscript, который не является официальным и который призван лишь улучшить пользовательский опыт от использования сайта. Создано с использованием ИИ под тщательным контролем человека. Использованы библиотека веб-компонентов MDUI, иконки Material.';
                mainPageContainer.appendChild(disclaimer);


                mainLayout.appendChild(mainPageContainer);
            } else {
                if (contentDiv) {
                    mainLayout.appendChild(contentDiv);
                    const loadMoreContainer = document.createElement('div');
                    loadMoreContainer.id = 'load-more-container';
                    loadMoreContainer.innerHTML = '<mdui-button variant="elevated" id="load-more-btn">Загрузить ещё</mdui-button>';
                    mainLayout.appendChild(loadMoreContainer); // Кнопка "Загрузить ещё" добавляется только здесь
                }
            }
            mduiLayout.appendChild(mainLayout);



            // --- 7. Вставляем всю новую структуру в body ---
            document.body.prepend(mduiLayout);

            // --- 8. Внедрение модальных окон и остального HTML ---
            const modalHtml = `
                <div class="settings-overlay"></div>

                <mdui-dialog id="custom-confirm-dialog" close-on-esc close-on-overlay-click>
                    <span slot="headline">Подтвердите переход</span>
                    <span slot="description"></span>
                    <div slot="action">
                        <mdui-button variant="text" id="custom-dialog-close-btn">Закрыть</mdui-button>
                        <mdui-button variant="filled" id="custom-dialog-confirm-btn">Перейти</mdui-button>
                    </div>
                </mdui-dialog>

                <mdui-dialog id="custom-datepicker" close-on-esc close-on-overlay-click>
                  <div slot="headline" class="datepicker-header">
                    <mdui-button-icon id="datepicker-prev-month"
                      ><i class="material-icons">chevron_left</i></mdui-button-icon
                    >
                    <div class="datepicker-month-year" id="datepicker-month-year-label"></div>
                    <mdui-button-icon id="datepicker-next-month"
                      ><i class="material-icons">chevron_right</i></mdui-button-icon
                    >
                  </div>
                  <div class="settings-body">
                    <div class="datepicker-grid" id="datepicker-days-grid"></div>
                  </div>
                  <div slot="action" class="datepicker-footer">
                    <mdui-button variant="text" id="datepicker-today-btn">Сегодня</mdui-button>
                    <mdui-button variant="filled" id="datepicker-apply-btn"
                      >Применить</mdui-button
                    >
                  </div>
                </mdui-dialog>

                <mdui-dialog
                  id="settings-panel"
                  headline="Настройки"
                  close-on-esc
                  close-on-overlay-click
                >
                  <div class="settings-body">
                    <div class="settings-row">
                      <i class="material-icons">aspect_ratio</i>
                      <div class="settings-text">
                        <div class="settings-label">Расширить содержимое</div>
                        <div class="settings-description">
                          Уменьшает отступы по бокам на широких экранах.
                        </div>
                      </div>
                      <mdui-switch id="max-width-switch" data-setting="maxWidth"></mdui-switch>
                    </div>
                    <div class="settings-row">
                      <i class="material-icons">view_column</i>
                      <div class="settings-text">
                        <div class="settings-label">Двухколоночный режим</div>
                        <div class="settings-description">
                          Отображает расписание в 2 колонки на широких экранах.
                        </div>
                      </div>
                      <mdui-switch
                        id="two-column-switch"
                        data-setting="twoColumn"
                      ></mdui-switch>
                    </div>
                    <div class="settings-row">
                      <i class="material-icons">density_medium</i>
                      <div class="settings-text">
                        <div class="settings-label">Компактный режим</div>
                        <div class="settings-description">
                          Уменьшает отступы в карточках с расписанием.
                        </div>
                      </div>
                      <mdui-switch
                        id="compact-mode-switch"
                        data-setting="compactMode"
                      ></mdui-switch>
                    </div>
                    <div class="settings-row">
                      <i class="material-icons">downloading</i>
                      <div class="settings-text">
                        <div class="settings-label">Бесконечная прокрутка</div>
                        <div class="settings-description">
                          Автоматически загружает расписание при прокрутке вниз.
                        </div>
                      </div>
                      <mdui-switch
                        id="infinite-scroll-switch"
                        data-setting="infiniteScroll"
                      ></mdui-switch>
                    </div>
                    <div class="settings-row">
                      <i class="material-icons">date_range</i>
                      <div class="settings-text">
                        <div class="settings-label">Разделитель недель</div>
                        <div class="settings-description">
                          Показывает линию-разделитель между неделями.
                        </div>
                      </div>
                      <mdui-switch
                        id="week-separator-switch"
                        data-setting="weekSeparator"
                      ></mdui-switch>
                    </div>
                    <div class="settings-row">
                      <i class="material-icons">navigation</i>
                      <div class="settings-text">
                        <div class="settings-label">Новый стиль навигации</div>
                        <div class="settings-description">
                          Адаптивная панель: боковая на ПК, нижняя на смартфонах.
                        </div>
                      </div>
                      <mdui-switch
                        id="new-nav-style-switch"
                        data-setting="newNavStyle"
                      ></mdui-switch>
                    </div>
                  </div> </mdui-dialog
                >`

            document.body.insertAdjacentHTML("beforeend", modalHtml);


        }

        // --- 3. Управление настройками ---
        async function loadAndApplySettings() {
            const settingConfigs = {
                maxWidth: { key: 'setting_maxWidthEnabled', defaultValue: false, apply: (val) => document.querySelector(".content")?.classList.toggle("full-width", val) },
                twoColumn: { key: 'setting_twoColumnEnabled', defaultValue: true, apply: (val) => document.body.classList.toggle("two-column-enabled", val) },
                compactMode: { key: 'setting_compactModeEnabled', defaultValue: false, apply: (val) => document.body.classList.toggle("compact-mode", val) },
                infiniteScroll: { key: 'setting_infiniteScrollEnabled', defaultValue: false, apply: () => {} }, // Применяется при инициализации
                weekSeparator: { key: 'setting_weekSeparatorEnabled', defaultValue: true, apply: () => {} }, // Применяется при инициализации
                newNavStyle: { key: 'setting_newNavStyleEnabled', defaultValue: true, apply: (val) => document.body.classList.toggle("new-nav-style", val) }
            };

            for (const [name, config] of Object.entries(settingConfigs)) {
                const value = await GM_getValue(config.key, config.defaultValue);
                settings[name] = value;
                const switchEl = document.querySelector(`[data-setting="${name}"]`);
                if (switchEl) switchEl.checked = value;
                config.apply(value);
            }
        }

        // --- 4. Привязка обработчиков событий ---
        function attachEventListeners() {

            // --- Диалоги ---
            const datepickerModal = document.getElementById('custom-datepicker');
            const settingsModal = document.getElementById('settings-panel');
            document.getElementById('settings-btn')?.addEventListener('click', () => {
                 if (settingsModal) settingsModal.open = true;
            });

            // --- Настройки ---
            document.querySelectorAll('mdui-switch[data-setting]').forEach(el => {
                el.addEventListener('change', (e) => {
                    const settingName = e.target.dataset.setting;
                    const newValue = e.target.checked;
                    const config = {
                        maxWidth: { key: 'setting_maxWidthEnabled' },
                        twoColumn: { key: 'setting_twoColumnEnabled' },
                        compactMode: { key: 'setting_compactModeEnabled' },
                        infiniteScroll: { key: 'setting_infiniteScrollEnabled', reload: true },
                        weekSeparator: { key: 'setting_weekSeparatorEnabled', reload: true },
                        newNavStyle: { key: 'setting_newNavStyleEnabled', reload: true }
                    }[settingName];
                    if (config) {
                        GM_setValue(config.key, newValue);
                        if (config.reload) {
                            window.location.reload();
                        } else {
                            const applyFn = {
                                maxWidth: (val) => document.querySelector(".content")?.classList.toggle("full-width", val),
                                twoColumn: (val) => document.body.classList.toggle("two-column-enabled", val),
                                compactMode: (val) => document.body.classList.toggle("compact-mode", val)
                            }[settingName];
                            applyFn(newValue);
                        }
                    }
                });
            });

            // --- Календарь ---
            attachCalendarListeners();

            // --- ЕДИНАЯ ЛОГИКА НАВИГАЦИИ ---
            const burgerBtn = document.getElementById('custom-burger-btn');
            const drawer = document.querySelector('mdui-navigation-drawer');
            const menuIcon = burgerBtn?.querySelector('i.material-icons');

            burgerBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                if (drawer) drawer.open = !drawer.open;
            });

            drawer?.addEventListener('mdui-close', () => { if (menuIcon) menuIcon.textContent = 'menu'; });
            drawer?.addEventListener('mdui-open', () => { if (menuIcon) menuIcon.textContent = 'close'; });

            // Единая функция для всех навигационных действий
            // 3. Единая обработка кликов по всем навигационным элементам
            function handleNavAction(targetId) {
                const isSelectPageOpen = !!document.querySelector('.select-page-wrapper');
                const currentActiveInNav = document.querySelector('[data-target][active]')?.dataset.target;

                // Логика "Назад"
                if (isSelectPageOpen && targetId === currentActiveInNav) {
                    destroySelectPage();
                    return;
                }

                // Переход на главную
                if (targetId === 'home') {
                    window.location.href = '/mobile/';
                    return;
                }

                // Открытие страницы выбора (без запоминания)
                renderSelectPage(targetId);
            }

            // Привязываем обработчик ко всем элементам с data-target
            document.querySelectorAll('[data-target]').forEach(item => {
                item.addEventListener('click', () => handleNavAction(item.dataset.target));
            });

           // Отдельно вешаем обработчик на .nameGroup
            const nameGroup = document.querySelector(".nameGroup");
            nameGroup?.addEventListener('click', () => {
                const params = new URLSearchParams(window.location.search);
                let activeTarget = '';
                if (params.has('v_gru')) activeTarget = 'selectGroupNumber';
                else if (params.has('v_prep')) activeTarget = 'selectPepodNumber';
                else if (params.has('v_aud')) activeTarget = 'selectCabinetNumber';

                if (activeTarget) {
                    // Просто вызываем основную функцию, она сама разберется
                    handleNavAction(activeTarget);
                }
            });
        }

        // --- 5. Инициализация функций страницы ---
        function initPageFeatures() {
            initViewLinkHandlers();

            lastVisibleDate = findLastDate();
            if (lastVisibleDate && document.querySelector('.dateBlock')) {
                if (settings.infiniteScroll) {
                    const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && !isLoading) {
                            loadMoreDays();
                        }
                    }, { threshold: 0.5 });
                    observer.observe(document.getElementById('load-more-container'));
                } else {
                    document.getElementById('load-more-btn').addEventListener('click', loadMoreDays);
                }
            } else {
                 document.getElementById('load-more-container')?.remove();
            }

            if (settings.weekSeparator) {
                insertWeekSeparators();
            }

            updateActiveNavItems();
        }


        // --- Вспомогательные функции ---


        function cleanupOriginalPage() {
            // Удаляем счётчик Яндекс.Метрики
            // Сначала ищем все скрипты на странице
            document.querySelectorAll('script').forEach(script => {
                // Если внутри скрипта есть упоминание yaCounter, это наш клиент
                if (script.textContent.includes('yaCounter')) {
                    const noscript = script.nextElementSibling;
                    // Удаляем и сам скрипт, и следующий за ним элемент (обычно это <noscript>)
                    script.remove();
                    if (noscript && noscript.tagName === 'NOSCRIPT') {
                        noscript.remove();
                    }
                    console.log("Блок Яндекс.Метрики удален.");
                }
            });

            // Удаляем старую, небезопасную ссылку на Material Icons
            document.querySelectorAll('link[href="http://fonts.googleapis.com/icon?family=Material+Icons"]').forEach(el => el.remove());

            console.log("Страница очищена от старой ссылки на шрифты.");
        }

        function updateActiveNavItems(forceTargetId = null) {
            let activeTarget = forceTargetId;

            if (!activeTarget) {
                const params = new URLSearchParams(window.location.search);
                activeTarget = 'home';
                if (params.has('v_gru')) activeTarget = 'selectGroupNumber';
                else if (params.has('v_prep')) activeTarget = 'selectPepodNumber';
                else if (params.has('v_aud')) activeTarget = 'selectCabinetNumber';
            }

            // Снимаем активность со всех пунктов во всех меню
            document.querySelectorAll('mdui-list-item, mdui-navigation-bar-item, mdui-navigation-rail-item').forEach(item => {
                item.removeAttribute('active');
            });

            // Устанавливаем активность нужным пунктам
            document.querySelectorAll(`[data-target="${activeTarget}"]`).forEach(item => {
                item.setAttribute('active', '');
            });
        }


        // --- Функция для настройки темы и цвета MDUI ---
        function setupMduiTheme(mdui) {
            function applyTheme() {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                    mdui.setTheme('dark');
                    mdui.setColorScheme('#4dd0e1');
                } else {
                    mdui.setTheme('light');
                    mdui.setColorScheme('#15B0BB');
                }

                const mduiBgColor = getComputedStyle(document.documentElement).getPropertyValue('--mdui-color-background').trim();
                if (mduiBgColor) {
                    const finalColor = `rgb(${mduiBgColor})`;
                    document.documentElement.style.setProperty('background', finalColor, 'important');
                    document.body.style.setProperty('background', finalColor, 'important');
                }

            }
            // Применяем тему при загрузке
            applyTheme();
            // И следим за изменениями в системе
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
        }

        // Вызов модального окна перехода
        function initViewLinkHandlers(container = document) {
            const customDialog = document.getElementById('custom-confirm-dialog');
            if (!customDialog) return;

            const dialogDescription = customDialog.querySelector('[slot="description"]');
            const confirmBtn = document.getElementById('custom-dialog-confirm-btn');
            const closeBtn = document.getElementById('custom-dialog-close-btn');

            // Обработчик закрытия вешаем один раз, чтобы избежать дублирования
            if (!closeBtn.hasClickListener) {
                closeBtn.addEventListener('click', () => customDialog.open = false);
                closeBtn.hasClickListener = true;
            }

            const handleViewLinkClick = (e) => {
                const target = e.currentTarget;
                const articleText = target.getAttribute('article') || '';
                const dataValue = target.getAttribute('data');

                if (!dataValue) return;

                e.preventDefault();
                e.stopPropagation();

                if (dialogDescription) {
                    dialogDescription.innerHTML = `Вы хотите перейти на страницу с расписанием <strong>${articleText}</strong>`;
                }

                confirmBtn.onclick = () => {
                    const baseUrl = window.location.origin + window.location.pathname;
                    window.location.href = `${baseUrl}?${dataValue}`;
                };

                customDialog.open = true;
            };

            // Находим view-link только внутри указанного контейнера
            container.querySelectorAll('.view-link').forEach(link => {
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                newLink.addEventListener('click', handleViewLinkClick);
            });
        }


        function renderSelectPage(targetId) {
            // Перед созданием нового, всегда уничтожаем старый, если он есть
            destroySelectPage(false);

            // --- 1. Скрываем основной контент ---
            const mainLayout = document.querySelector('mdui-layout-main');
            const mainPageContainer = mainLayout?.querySelector('.main-page-container');
            const contentDiv = mainLayout?.querySelector('.content');
            const loadMoreContainer = document.getElementById('load-more-container');

            // Используем style.setProperty для надежного скрытия
            mainPageContainer?.style.setProperty('display', 'none', 'important');
            contentDiv?.style.setProperty('display', 'none', 'important');
            loadMoreContainer?.style.setProperty('display', 'none', 'important');

            // --- 2. Создаем "скелет" псевдо-страницы ---
            const wrapper = document.createElement('div');
            wrapper.className = 'select-page-wrapper';

            const originalSelectItem = document.getElementById(targetId);
            if (!originalSelectItem) return;

            const title = originalSelectItem.querySelector('h3').textContent;
            const inputPlaceholder = originalSelectItem.querySelector('input.search').getAttribute('placeholder');
            const divSelection = originalSelectItem.querySelector('.divSelection');
            const dataType = divSelection.getAttribute('data-type');

            const header = document.createElement('div');
            header.className = 'select-page-header';
            header.innerHTML = `
                <div class="select-page-titlebar">
                    <mdui-button-icon icon="arrow_back" id="select-page-back-btn"></mdui-button-icon>
                    <h2>${title}</h2>
                </div>
                <mdui-text-field variant="outlined" clearable placeholder="${inputPlaceholder}" style="width: 100%;">
                    <mdui-icon slot="icon" name="search"></mdui-icon>
                </mdui-text-field>
            `;
            wrapper.appendChild(header);

            const list = document.createElement('mdui-list');
            list.className = 'select-page-list';
            list.setAttribute('data-type', dataType);

            const items = divSelection.children;
            for (const item of items) {
                if (item.classList.contains('libuild')) {
                    const subheader = document.createElement('mdui-list-subheader');
                    subheader.textContent = item.textContent;
                    list.appendChild(subheader);
                } else if (item.classList.contains('li')) {
                    const listItem = document.createElement('mdui-list-item');
                    listItem.setAttribute('rounded', '');
                    listItem.textContent = item.textContent;
                    listItem.setAttribute('data-value', item.getAttribute('data'));
                    listItem.addEventListener('click', () => {
                        const baseUrl = window.location.origin + window.location.pathname;
                        const finalUrl = `${baseUrl}?${dataType}=${item.getAttribute('data')}`;
                        window.location.href = finalUrl;
                    });
                    list.appendChild(listItem);
                }
            }
            wrapper.appendChild(list);

            const backBtn = header.querySelector('#select-page-back-btn');
            backBtn.addEventListener('click', destroySelectPage);

            const searchInput = header.querySelector('mdui-text-field');
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                list.querySelectorAll('mdui-list-item').forEach(li => {
                    const text = li.textContent.toLowerCase();
                    li.style.display = text.includes(query) ? '' : 'none';
                });
            });

            mainLayout.appendChild(wrapper);
            updateActiveNavItems(targetId);
        }

        function destroySelectPage(restoreActiveState = true) {
            // --- 1. Удаляем нашу псевдо-страницу ---
            const wrapper = document.querySelector('.select-page-wrapper');
            if (wrapper) wrapper.remove();

            // --- 2. Показываем обратно основной контент ---
            const mainPageContainer = document.querySelector('.main-page-container');
            const contentDiv = document.querySelector('.content');
            const loadMoreContainer = document.getElementById('load-more-container');

            mainPageContainer?.style.removeProperty('display');
            contentDiv?.style.removeProperty('display');
            loadMoreContainer?.style.removeProperty('display');

            // --- 3. Восстанавливаем активный пункт, только если это действие "Назад" ---
            if (restoreActiveState) {
                // Выполняем с задержкой, чтобы победить внутреннюю логику MDUI
                setTimeout(() => {
                    updateActiveNavItems(); // Восстанавливаем по URL
                }, 0);
            }
        }

        // --- 6. PWA Setup (TODO: рассмотреть дальнейшие улучшения) ---

        function setupPWA() {
            try {
                // Получаем актуальные цвета напрямую из палитры MDUI
                const themeColor = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--mdui-color-surface-container').trim()})`;
                const backgroundColor = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--mdui-color-background').trim()})`;

                const manifestJson = {
                    id: window.location.pathname + window.location.search,
                    name: "Расписание РГППУ (веб)",
                    short_name: "Расписание РГППУ",
                    description: "Обновленное расписание РГППУ с дополнительными функциями.",
                    start_url: window.location.pathname + window.location.search,
                    scope: "/mobile/",
                    display: "standalone",
                    display_override: ["minimal-ui", "standalone"],
                    background_color: backgroundColor,
                    theme_color: themeColor,
                    icons: [
                        {
                            src: ICON_SVG_DATA_URI,
                            sizes: "any",
                            type: "image/svg+xml",
                        },
                        {
                            src: ICON_PNG_BASE64_URI,
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any"
                        }
                    ]
                };

                const manifestString = JSON.stringify(manifestJson);
                const manifestBlob = new Blob([manifestString], { type: 'application/json' });
                const manifestUrl = URL.createObjectURL(manifestBlob);

                // Удаляем старые теги, если они есть
                document.querySelectorAll('link[rel="manifest"], meta[name="theme-color"]').forEach(el => el.remove());

                // Вставляем <link rel="manifest">
                const manifestLink = document.createElement('link');
                manifestLink.rel = 'manifest';
                manifestLink.href = manifestUrl;
                document.head.appendChild(manifestLink);

                // Вставляем <meta name="theme-color">
                const themeMeta = document.createElement('meta');
                themeMeta.name = 'theme-color';
                themeMeta.content = themeColor;
                document.head.appendChild(themeMeta);

                console.log("PWA Manifest with custom icons and colors injected.");

            } catch (error) {
                console.error("Ошибка при настройке PWA:", error);
            }
        }






        function parseDate(dateStr) {
            if (!dateStr) return null;
            const dateMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
            if (!dateMatch) return null;
            const [, day, month, year] = dateMatch;
            return new Date(year, month - 1, day);
        }

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}.${month}`;
        }

        function insertWeekSeparators() {
            document.querySelectorAll('.week-separator').forEach(el => el.remove());
            if (!settings.weekSeparator) return;

            const dateBlocks = document.querySelectorAll('.content .dateBlock');
            for (let i = 0; i < dateBlocks.length; i++) {
                const currentBlock = dateBlocks[i];
                const currentDate = parseDate(currentBlock.querySelector('.dateToday')?.textContent);
                if (!currentDate) continue;

                let isNewWeek = false;
                if (i === 0) {
                    isNewWeek = true;
                } else {
                    const previousDate = parseDate(dateBlocks[i - 1].querySelector('.dateToday')?.textContent);
                    if (previousDate) {
                        const currentDayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
                        const previousDayOfWeek = previousDate.getDay() === 0 ? 6 : previousDate.getDay() - 1;
                        if (currentDayOfWeek < previousDayOfWeek) {
                            isNewWeek = true;
                        }
                    }
                }

                if (isNewWeek) {
                    const weekStart = new Date(currentDate);
                    const diff = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
                    weekStart.setDate(currentDate.getDate() - diff);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);

                    const separator = document.createElement('div');
                    separator.className = 'week-separator';
                    separator.innerHTML = `
                        <span class="week-separator-text">${formatDate(weekStart)} - ${formatDate(weekEnd)}</span>
                        <div class="week-separator-line"></div>`;
                    currentBlock.before(separator);
                }
            }
        }

        function findLastDate() {
            const dateBlocks = document.querySelectorAll('.content .dateBlock');
            if (dateBlocks.length === 0) return null;
            return parseDate(dateBlocks[dateBlocks.length - 1].textContent);
        }

        async function loadMoreDays() {
            if (isLoading || !lastVisibleDate) return;
            isLoading = true;
            const loadMoreBtn = document.getElementById('load-more-btn');

            if (loadMoreBtn) {
            loadMoreBtn.loading = true; // Включаем спиннер
            }

            const nextDate = new Date(lastVisibleDate);
            nextDate.setDate(nextDate.getDate() + 1);
            const formattedDate = `${nextDate.getDate()}.${nextDate.getMonth() + 1}.${nextDate.getFullYear()}`;
            const url = new URL(window.location.href);
            url.searchParams.set('v_date', formattedDate);

            try {
                const response = await fetch(url.toString());
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const newDateBlocks = doc.querySelectorAll('.content .dateBlock');

                if (newDateBlocks.length > 0) {
                    const contentDiv = document.querySelector('.content');
                    newDateBlocks.forEach(block => {
                        contentDiv.appendChild(block);
                        // "Оживляем" ссылки только в этом новом блоке
                        initViewLinkHandlers(block);
                    });
                    lastVisibleDate = findLastDate();
                    if (settings.weekSeparator) insertWeekSeparators();
                    if (loadMoreBtn) {
                        loadMoreBtn.loading = false; // Выключаем спиннер
                    }
                } else {
                    document.getElementById('load-more-container')?.remove();
                }
            } catch (error) {
                console.error('Ошибка при загрузке расписания:', error);
                if (loadMoreBtn) {
                    loadMoreBtn.loading = false; // Выключаем спиннер
                }
            } finally {
                isLoading = false;
            }
        }

        function attachCalendarListeners() {
            const datepickerModal = document.getElementById('custom-datepicker');
            const monthYearLabel = document.getElementById('datepicker-month-year-label');
            const daysGrid = document.getElementById('datepicker-days-grid');
            const today = new Date();
            let currentYear = today.getFullYear();
            let currentMonth = today.getMonth();
            let selectedDate = null;
            const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
            const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

            function renderCalendar(year, month) {
                currentYear = year; currentMonth = month;
                monthYearLabel.textContent = `${monthNames[month]} ${year}`;
                daysGrid.innerHTML = '';
                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

                dayNames.forEach(name => { daysGrid.insertAdjacentHTML('beforeend', `<div class="datepicker-day-name">${name}</div>`); });
                for (let i = 0; i < startOffset; i++) { daysGrid.insertAdjacentHTML('beforeend', '<div class="datepicker-day empty"></div>'); }

                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const dayEl = document.createElement('div');
                    dayEl.className = 'datepicker-day';
                    dayEl.textContent = day;
                    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayEl.classList.add('today');
                    if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) dayEl.classList.add('selected');
                    dayEl.addEventListener('click', () => { selectedDate = date; renderCalendar(year, month); });
                    daysGrid.appendChild(dayEl);
                }
            }

            function updateUrlWithDate(date) {
                const url = new URL(window.location.href);
                if (date) { url.searchParams.set('v_date', `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`); }
                else { url.searchParams.delete('v_date'); }
                window.location.href = url.toString();
            }

            document.getElementById('custom-calendar-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                const params = new URLSearchParams(window.location.search);
                const dateParam = params.get('v_date');
                if (dateParam) {
                    const parts = dateParam.split('.').map(p => parseInt(p, 10));
                    selectedDate = new Date(parts[2], parts[1] - 1, parts[0]);
                } else { selectedDate = new Date(); }
                renderCalendar(selectedDate.getFullYear(), selectedDate.getMonth());
                if (datepickerModal) datepickerModal.open = true; // Прямое открытие MDUI-диалога
            });

            document.getElementById('datepicker-prev-month')?.addEventListener('click', () => renderCalendar(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1));
            document.getElementById('datepicker-next-month')?.addEventListener('click', () => renderCalendar(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1));
            // Обработчики футера календаря
            const todayBtn = document.getElementById('datepicker-today-btn');
            const applyBtn = document.getElementById('datepicker-apply-btn');
            if (todayBtn) todayBtn.addEventListener('click', () => updateUrlWithDate(null));
            if (applyBtn) applyBtn.addEventListener('click', () => updateUrlWithDate(selectedDate));
        }

        // --- Запуск ---
        main();
    });


})();
