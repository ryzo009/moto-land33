document.addEventListener('DOMContentLoaded', () => {
    // Элементы UI
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');
    const catalogSection = document.getElementById('catalogSection');

    cards.forEach((card, index) => {
        card.dataset.index = index;
    });

    // Модалки
    const bikeModal = document.getElementById('modal');
    const aboutModal = document.getElementById('aboutModal');
    const contactsModal = document.getElementById('contactsModal');
    const authModal = document.getElementById('authModal');
    const compareModal = document.getElementById('compareModal');

    // Ссылки в меню
    const aboutLink = document.getElementById('aboutLink');
    const contactsLink = document.getElementById('contactsLink');
    const catalogLink = document.getElementById('catalogLink');
    const authBtn = document.getElementById('authBtn');

    // Мобильное меню (Гамбургер)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('nav ul li a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Открытие модалок через ссылки в меню
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (aboutModal) aboutModal.style.display = 'flex';
        });
    }

    if (contactsLink) {
        contactsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (contactsModal) contactsModal.style.display = 'flex';
        });
    }

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'flex';
        });
    }

    // Закрытие всех модалок по крестику
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        });
    });

    // Закрытие модалки по клику вне контента
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Темы
    const themeToggleBtn = document.getElementById('themeToggle');
    const themes = [
        { name: 'theme-orange', label: '🔥 Огонь' },
        { name: 'theme-cyan', label: '💎 Киберпанк' },
        { name: 'theme-green', label: '⚡ Неон' }
    ];
    let currentThemeIndex = 0;

    const savedTheme = localStorage.getItem('motoLandTheme');
    if (savedTheme) {
        const foundIndex = themes.findIndex(t => t.name === savedTheme);
        if (foundIndex !== -1) {
            currentThemeIndex = foundIndex;
            applyTheme(themes[currentThemeIndex]);
        }
    }

    function applyTheme(themeObj) {
        document.body.classList.remove('theme-orange', 'theme-cyan', 'theme-green');
        if (themeObj.name !== 'theme-orange') {
            document.body.classList.add(themeObj.name);
        }
        if (themeToggleBtn) {
            themeToggleBtn.textContent = themeObj.label;
        }
        localStorage.setItem('motoLandTheme', themeObj.name);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(themes[currentThemeIndex]);
        });
    }

    // База данных байков
    const bikeData = {
        'yamaha yzf-r1': {
            desc: 'Легендарный супербайк, созданный с использованием технологий MotoGP. Оснащен 4-цилиндровым двигателем Crossplane и передовой электроникой.',
            price: '$17,999',
            topSpeed: '299 км/ч (ограничитель)',
            accel100: '3.1 сек',
            accel200: '4.8 сек',
            quarterMile: '10.2 сек'
        },
        'kawasaki ninja h2': {
            desc: 'Уникальный гипербайк с компрессорным наддувом (Supercharged). Обладает невероятным разгоном, космическим дизайном и впечатляющей мощностью.',
            price: '$32,000',
            topSpeed: '337 км/ч',
            accel100: '2.6 сек',
            accel200: '3.9 сек',
            quarterMile: '9.6 сек'
        },
        'bmw r 1250 gs': {
            desc: 'Эталон среди туристических эндуро. Двигатель Boxer с системой ShiftCam обеспечивает уверенную тягу как на асфальте, так и на тяжелом бездорожье.',
            price: '$20,500',
            topSpeed: '215 км/ч',
            accel100: '3.6 сек',
            accel200: '9.2 сек',
            quarterMile: '11.7 сек'
        },
        'ducati panigale v4': {
            desc: 'Флагманский супербайк Ducati с V-образным 4-цилиндровым двигателем Desmosedici Stradale.',
            price: '$24,995',
            topSpeed: '299+ км/ч',
            accel100: '3.0 сек',
            accel200: '4.5 сек',
            quarterMile: '9.9 сек'
        }
    };

    // Открытие модального окна подробной информации о байке
    cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const detailBtn = card.querySelector('.card-btn');
        const imgEl = card.querySelector('img');

        const openDetails = () => {
            const title = titleEl.textContent.trim();
            const key = title.toLowerCase();
            const data = bikeData[key] || {
                desc: 'Информация о данном мотоцикле уточняется.',
                price: 'По запросу',
                topSpeed: 'н/д',
                accel100: 'н/д',
                accel200: 'н/д',
                quarterMile: 'н/д'
            };

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImg').src = imgEl.src;
            document.getElementById('modalDesc').textContent = data.desc;
            document.getElementById('modalType').textContent = card.querySelector('.specs p:nth-child(1)').textContent.replace('Тип:', '').trim();
            document.getElementById('modalYear').textContent = card.querySelector('.specs p:nth-child(2)').textContent.replace('Год:', '').trim();
            document.getElementById('modalEngine').textContent = card.querySelector('.specs p:nth-child(3)').textContent.replace('Объем:', '').trim();
            document.getElementById('modalPower').textContent = card.querySelector('.specs p:nth-child(4)').textContent.replace('Мощность:', '').trim();
            document.getElementById('modalWeight').textContent = card.querySelector('.specs p:nth-child(5)').textContent.replace('Вес:', '').trim();
            
            document.getElementById('modalTopSpeed').textContent = data.topSpeed;
            document.getElementById('modalAccel100').textContent = data.accel100;
            document.getElementById('modalAccel200').textContent = data.accel200;
            document.getElementById('modalQuarterMile').textContent = data.quarterMile;
            document.getElementById('modalPrice').textContent = data.price;

            if (bikeModal) bikeModal.style.display = 'flex';
        };

        if (detailBtn) detailBtn.addEventListener('click', openDetails);
        if (imgEl) imgEl.addEventListener('click', openDetails);
    });

    // ЛОГИКА ИЗБРАННОГО
    let favorites = JSON.parse(localStorage.getItem('motoFavorites')) || [];

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.trim();
        const favBtn = document.createElement('button');
        favBtn.className = 'favorite-btn';
        
        if (favorites.includes(title)) {
            favBtn.innerHTML = '❤️';
            favBtn.classList.add('active');
        } else {
            favBtn.innerHTML = '🤍';
        }

        favBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (favorites.includes(title)) {
                favorites = favorites.filter(fav => fav !== title);
                favBtn.innerHTML = '🤍';
                favBtn.classList.remove('active');
            } else {
                favorites.push(title);
                favBtn.innerHTML = '❤️';
                favBtn.classList.add('active');
            }
            localStorage.setItem('motoFavorites', JSON.stringify(favorites));
            filterCards();
        });

        card.appendChild(favBtn);
    });

    // ФИЛЬТРАЦИЯ И ПОИСК
    let currentCategory = 'all';

    function filterCards() {
        const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.trim();
            const titleLower = title.toLowerCase();
            const specsText = card.querySelector('.specs').textContent.toLowerCase();

            const matchesSearch = titleLower.includes(searchText) || specsText.includes(searchText);

            let matchesCategory = false;
            if (currentCategory === 'all') {
                matchesCategory = true;
            } else if (currentCategory === 'favorite') {
                matchesCategory = favorites.includes(title);
            } else {
                matchesCategory = specsText.includes(currentCategory.toLowerCase());
            }

            if (matchesSearch && matchesCategory) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterCards);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            filterCards();
        });
    });

    // СОРТИРОВКА
    if (sortButtons.length > 0 && catalogSection) {
        sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                sortButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const sortType = btn.getAttribute('data-sort');
                const cardsArray = Array.from(catalogSection.querySelectorAll('.card'));

                if (sortType === 'power-desc') {
                    cardsArray.sort((a, b) => Number(b.dataset.power) - Number(a.dataset.power));
                } else if (sortType === 'accel-asc') {
                    cardsArray.sort((a, b) => Number(a.dataset.accel) - Number(b.dataset.accel));
                } else {
                    cardsArray.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
                }

                cardsArray.forEach(card => catalogSection.appendChild(card));
            });
        });
    }

    // СРАВНЕНИЕ
    const compareBar = document.getElementById('compareBar');
    const compareCount = document.getElementById('compareCount');
    const openCompareBtn = document.getElementById('openCompareBtn');
    const compareTable = document.getElementById('compareTable');
    let selectedBikes = [];

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.trim();
        const compareLabel = document.createElement('label');
        compareLabel.className = 'card-compare-label';
        compareLabel.innerHTML = `
            <input type="checkbox" class="compare-checkbox" data-title="${title}">
            Сравнить
        `;
        card.appendChild(compareLabel);

        const checkbox = compareLabel.querySelector('input');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (selectedBikes.length >= 3) {
                    alert('Можно сравнивать не более 3 байков одновременно!');
                    checkbox.checked = false;
                    return;
                }
                selectedBikes.push(title);
            } else {
                selectedBikes = selectedBikes.filter(t => t !== title);
            }

            if (compareBar) {
                if (selectedBikes.length > 0) {
                    compareBar.style.display = 'flex';
                    if (compareCount) compareCount.textContent = `Выбрано для сравнения: ${selectedBikes.length}`;
                } else {
                    compareBar.style.display = 'none';
                }
            }
        });
    });

    if (openCompareBtn) {
        openCompareBtn.addEventListener('click', () => {
            if (selectedBikes.length === 0) return;

            let html = `
                <tr>
                    <th>Параметр</th>
                    ${selectedBikes.map(title => `<th>${title}</th>`).join('')}
                </tr>
            `;

            const specsList = ['Тип', 'Год', 'Объем', 'Мощность', 'Вес'];
            specsList.forEach((specName, idx) => {
                html += `<tr><td><strong>${specName}</strong></td>`;
                selectedBikes.forEach(title => {
                    const card = Array.from(cards).find(c => c.querySelector('h3').textContent.trim() === title);
                    const specText = card ? card.querySelectorAll('.specs p')[idx].innerHTML : '';
                    html += `<td>${specText.replace(/<span>.*?<\/span>/, '')}</td>`;
                });
                html += `</tr>`;
            });

            if (compareTable) compareTable.innerHTML = html;
            if (compareModal) compareModal.style.display = 'flex';
        });
    }

    // Авторизация / Регистрация переключение вкладок
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tabLogin && tabRegister && loginForm && registerForm) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.style.display = 'flex';
            loginForm.style.display = 'none';
        });
    }
});
