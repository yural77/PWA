    // Переменная для отслеживания состояния меню
    let isMenuOpen = false;

    // Функция для переключения меню
    function toggleMenu() {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (isMenuOpen) {
        dropdownMenu.classList.remove('active'); // Скрыть меню
      } else {
        dropdownMenu.classList.add('active'); // Показать меню
      }
      isMenuOpen = !isMenuOpen;
    }

    // Функция для выбора опции и изменения видимости элементов
    function selectOption(option) {
      document.getElementById('terminal').textContent = '';
      const createButton = document.getElementById('createButton');
      const writeButton = document.getElementById('writeButton');
      const readButton = document.getElementById('readButton');
      const secretInput = document.getElementById('secretInput');
      const selectMenuOption = document.getElementById('selectMenuOption');
      const mainHeader = document.getElementById('mainHeader');
      

      // Обновляем значение в невидимом поле
      const selectedOptionField = document.getElementById('selectedOptionField');
      selectedOptionField.value = option;

      console.log(`Выбранная опция: ${selectedOptionField.value}`); // Для отладки

      // Скрываем информационное поле после выбора опции
      selectMenuOption.classList.add('hidden');

      // Показываем текстовое поле
      secretInput.classList.remove('hidden');

      // Скрываем все кнопки
      createButton.classList.add('hidden');
      writeButton.classList.add('hidden');
      readButton.classList.add('hidden');

      // Показываем нужные кнопки в зависимости от выбранной опции
      if (option === 'credBlob') {
        mainHeader.textContent = "Демо credBlob";
        createButton.textContent = "Записать секрет";
        createButton.classList.remove('hidden');
        readButton.classList.remove('hidden');
      } else if (option === 'largeBlob') {
        mainHeader.textContent = "Демо largeBlob";
        createButton.textContent = "Создать секрет";
        createButton.classList.remove('hidden');
        writeButton.classList.remove('hidden');
        readButton.classList.remove('hidden');
      }

      // Закрываем меню после выбора опции
      const dropdownMenu = document.querySelector('.dropdown-menu');
      dropdownMenu.classList.remove('active');
      isMenuOpen = false;
    }

    // Функция для добавления текста в терминал
    function appendToTerminal(message, color = "limegreen") {
      const terminal = document.getElementById('terminal');
     const timestamp = new Date().toLocaleTimeString();

    // Создаем новый span элемент
      const span = document.createElement('span');
      span.style.color = color; // Устанавливаем цвет
      span.textContent = `\n>>> [${timestamp}] ${message}\n-----------------------\n\n`;

    // Добавляем span в div#terminal
       terminal.appendChild(span);

       terminal.scrollTop = terminal.scrollHeight; // Прокрутка вниз
    }

    // Закрыть меню при клике вне его области
    document.addEventListener('click', (event) => {
      const menuButton = document.querySelector('.menu-button');
      const dropdownMenu = document.querySelector('.dropdown-menu');

      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('active');
        isMenuOpen = false;
      }
    });
