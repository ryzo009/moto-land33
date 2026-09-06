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

    // Ссылки
    const aboutLink = document.getElementById('aboutLink');
    const contactsLink = document.getElementById('contactsLink');
    const catalogLink = document.getElementById('catalogLink');

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
    const compareModal = document.getElementById('compareModal');
    const compareTable = document.getElementById('compareTable');
    let selectedBikes = [];

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const compareLabel = document.createElement('label');
        compareLabel.className = 'card-compare-label';
        compareLabel.innerHTML = `
            <input type="checkbox" class="compare-checkbox" data-title="${title}">
            Сравнить
        `;
        card.appendChild(compareLabel);
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('compare-checkbox')) {
            const title = e.target.getAttribute('data-title');
            
            if (e.target.checked) {
                selectedBikes.push(title);
            } else {
                selectedBikes = selectedBikes.filter(item => item !== title);
            }

            if (selectedBikes.length > 0) {
                compareBar.style.display = 'flex';
                compareCount.textContent = `Выбрано для сравнения: ${selectedBikes.length}`;
            } else {
                compareBar.style.display = 'none';
            }
        }
    });

    if (openCompareBtn && compareModal && compareTable) {
        openCompareBtn.addEventListener('click', () => {
            let html = `
                <tr>
                    <th>Параметр</th>
                    ${selectedBikes.map(title => `<th>${title}</th>`).join('')}
                </tr>
                <tr>
                    <td>Фото</td>
                    ${selectedBikes.map(title => {
                        const key = title.toLowerCase().trim();
                        const card = Array.from(cards).find(c => c.querySelector('h3').textContent.toLowerCase().trim() === key);
                        const imgSrc = card ? card.querySelector('img').src : '';
                        return `<td><img src="${imgSrc}" alt="${title}"></td>`;
                    }).join('')}
                </tr>
                <tr>
                    <td>Цена</td>
                    ${selectedBikes.map(title => `<td><strong style="color: #00ff88;">${bikeData[title.toLowerCase().trim()]?.price || '—'}</strong></td>`).join('')}
                </tr>
                <tr>
                    <td>Мощность</td>
                    ${selectedBikes.map(title => {
                        const card = Array.from(cards).find(c => c.querySelector('h3').textContent.toLowerCase().trim() === title.toLowerCase().trim());
                        return `<td>${card ? card.dataset.power + ' л.с.' : '—'}</td>`;
                    }).join('')}
                </tr>
                <tr>
                    <td>Разгон 0-100</td>
                    ${selectedBikes.map(title => `<td>${bikeData[title.toLowerCase().trim()]?.accel100 || '—'}</td>`).join('')}
                </tr>
                <tr>
                    <td>Макс. скорость</td>
                    ${selectedBikes.map(title => `<td>${bikeData[title.toLowerCase().trim()]?.topSpeed || '—'}</td>`).join('')}
                </tr>
            `;

            compareTable.innerHTML = html;
            compareModal.style.display = 'flex';
        });
    }

    // ЛОГИКА АВТОРИЗАЦИИ И РЕГИСТРАЦИИ
    const authModal = document.getElementById('authModal');
    const authBtn = document.querySelector('.button1');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const regError = document.getElementById('regError');

    let users = JSON.parse(localStorage.getItem('motoUsers')) || [];
    let currentUser = JSON.parse(localStorage.getItem('motoCurrentUser')) || null;

    function updateAuthButton() {
        if (!authBtn) return;
        if (currentUser) {
            authBtn.textContent = `👤 ${currentUser.username} (Выйти)`;
            authBtn.classList.add('user-profile-btn');
        } else {
            authBtn.textContent = 'Авторизоваться';
            authBtn.classList.remove('user-profile-btn');
        }
    }

    updateAuthButton();

    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (currentUser) {
                if (confirm('Вы действительно хотите выйти?')) {
                    currentUser = null;
                    localStorage.removeItem('motoCurrentUser');
                    updateAuthButton();
                }
            } else if (authModal) {
                authModal.style.display = 'flex';
            }
        });
    }

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
            loginError.textContent = '';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.style.display = 'flex';
            loginForm.style.display = 'none';
            regError.textContent = '';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                regError.textContent = 'Пользователь с таким именем уже существует!';
                return;
            }

            const newUser = { username, password };
            users.push(newUser);
            localStorage.setItem('motoUsers', JSON.stringify(users));

            currentUser = newUser;
            localStorage.setItem('motoCurrentUser', JSON.stringify(currentUser));
            
            updateAuthButton();
            authModal.style.display = 'none';
            registerForm.reset();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

            if (!foundUser) {
                loginError.textContent = 'Неверное имя пользователя или пароль!';
                return;
            }

            currentUser = foundUser;
            localStorage.setItem('motoCurrentUser', JSON.stringify(currentUser));

            updateAuthButton();
            authModal.style.display = 'none';
            loginForm.reset();
        });
    }

    // НАВИГАЦИЯ
    if (catalogLink && catalogSection) {
        catalogLink.addEventListener('click', (e) => {
            e.preventDefault();
            catalogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (aboutLink && aboutModal) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            aboutModal.style.display = 'flex';
        });
    }

    if (contactsLink && contactsModal) {
        contactsLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactsModal.style.display = 'flex';
        });
    }

    // МОДАЛКА КАРТОЧКИ
    cards.forEach(card => {
        const btn = card.querySelector('.card-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const imgSrc = card.querySelector('img').src;
            const specsP = card.querySelectorAll('.specs p');

            const type = specsP[0] ? specsP[0].innerText.replace('Тип:', '').trim() : '';
            const year = specsP[1] ? specsP[1].innerText.replace('Год:', '').trim() : '';
            const engine = specsP[2] ? specsP[2].innerText.replace('Объем:', '').trim() : '';
            const power = specsP[3] ? specsP[3].innerText.replace('Мощность:', '').trim() : '';
            const weight = specsP[4] ? specsP[4].innerText.replace('Вес:', '').trim() : '';

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImg').src = imgSrc;
            document.getElementById('modalType').textContent = type;
            document.getElementById('modalYear').textContent = year;
            document.getElementById('modalEngine').textContent = engine;
            document.getElementById('modalPower').textContent = power;
            document.getElementById('modalWeight').textContent = weight;

            const key = title.toLowerCase().trim();
            const info = bikeData[key];

            if (info) {
                document.getElementById('modalDesc').textContent = info.desc;
                document.getElementById('modalPrice').textContent = info.price;
                document.getElementById('modalTopSpeed').textContent = info.topSpeed;
                document.getElementById('modalAccel100').textContent = info.accel100;
                document.getElementById('modalAccel200').textContent = info.accel200;
                document.getElementById('modalQuarterMile').textContent = info.quarterMile;
            }

            bikeModal.style.display = 'flex';
        });
    });

    // ЗАКРЫТИЕ МОДАЛОК
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});