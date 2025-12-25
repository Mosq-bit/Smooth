document.addEventListener('DOMContentLoaded', function() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeMenuBtn = document.getElementById('closeMenu');
  const body = document.body;
  
  if (burgerBtn && mobileNav) {
    // Открытие меню
    burgerBtn.addEventListener('click', function() {
      burgerBtn.classList.add('active');
      mobileNav.classList.add('active');
      body.classList.add('menu-open');
      burgerBtn.setAttribute('aria-label', 'Закрыть меню');
      burgerBtn.setAttribute('aria-expanded', 'true');
    });
    
    // Закрытие меню
    function closeMenu() {
      burgerBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('menu-open');
      burgerBtn.setAttribute('aria-label', 'Открыть меню');
      burgerBtn.setAttribute('aria-expanded', 'false');
    }
    
    // Закрытие по кнопке
    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', closeMenu);
    }

    const mobileLinks = mobileNav.querySelectorAll('.header__nav-link, .header__btn--mobile');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('active') && 
          !mobileNav.contains(e.target) && 
          !burgerBtn.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMenu();
      }
    });
  }
});


     
     document.addEventListener('DOMContentLoaded', function() {
            // Элементы слайдера
            const slidesContainer = document.querySelector('.slides-container');
            const slides = document.querySelectorAll('.slide');
            const paginationButtons = document.querySelectorAll('.pagination-btn');
            const prevButton = document.querySelector('.prev-btn');
            const nextButton = document.querySelector('.next-btn');
            
            // Конфигурация
            let currentPage = 0;
            const totalSlides = slides.length;
            let slidesPerView = 3;
            
            // Инициализация
            updateSlidesPerView();
            updateSlider();
            
            // Функция определения количества видимых слайдов
            function updateSlidesPerView() {
                if (window.innerWidth <= 768) {
                    slidesPerView = 1;
                } else if (window.innerWidth <= 992) {
                    slidesPerView = 2;
                } else {
                    slidesPerView = 3;
                }
                
                // Обновляем ширину слайдов
                slides.forEach(slide => {
                    slide.style.flexBasis = `calc(${100 / slidesPerView}% - 20px)`;
                    slide.style.minWidth = `calc(${100 / slidesPerView}% - 20px)`;
                });
                
                return slidesPerView;
            }
            
            // Функция обновления слайдера
            function updateSlider() {
                const translateX = currentPage * (100 / slidesPerView);
                slidesContainer.style.transform = `translateX(-${translateX}%)`;
                
                // Обновляем активную кнопку пагинации
                paginationButtons.forEach((btn, index) => {
                    btn.classList.toggle('active', index === currentPage);
                });
                
                // Обновляем кнопки навигации
                prevButton.disabled = currentPage === 0;
                nextButton.disabled = currentPage >= Math.ceil(totalSlides / slidesPerView) - 1;
            }
            
            // Функция перехода к определенной странице
            function goToPage(pageIndex) {
                const maxPage = Math.ceil(totalSlides / slidesPerView) - 1;
                if (pageIndex >= 0 && pageIndex <= maxPage) {
                    currentPage = pageIndex;
                    updateSlider();
                }
            }
            
            // Функция следующей страницы
            function nextPage() {
                const maxPage = Math.ceil(totalSlides / slidesPerView) - 1;
                if (currentPage < maxPage) {
                    currentPage++;
                    updateSlider();
                }
            }
            
            // Функция предыдущей страницы
            function prevPage() {
                if (currentPage > 0) {
                    currentPage--;
                    updateSlider();
                }
            }
            
            // Обработчики событий для кнопок пагинации
            paginationButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const pageIndex = parseInt(this.getAttribute('data-index'));
                    goToPage(pageIndex);
                });
            });
            
            // Обработчики событий для кнопок навигации
            prevButton.addEventListener('click', prevPage);
            nextButton.addEventListener('click', nextPage);
            
            // Управление с клавиатуры
            document.addEventListener('keydown', function(event) {
                if (event.key === 'ArrowLeft') {
                    prevPage();
                } else if (event.key === 'ArrowRight') {
                    nextPage();
                }
            });
            
            // Автопрокрутка
            let autoPlayInterval;
            
            function startAutoPlay() {
                autoPlayInterval = setInterval(() => {
                    const maxPage = Math.ceil(totalSlides / slidesPerView) - 1;
                    if (currentPage < maxPage) {
                        nextPage();
                    } else {
                        goToPage(0);
                    }
                }, 4000);
            }
            
            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }
            
            // Запускаем автопрокрутку
            startAutoPlay();
            
            // Останавливаем автопрокрутку при наведении
            const sliderWrapper = document.querySelector('.slider-wrapper');
            sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
            sliderWrapper.addEventListener('mouseleave', startAutoPlay);
            
            // Обработка изменения размера окна
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    const newSlidesPerView = updateSlidesPerView();
                    const maxPage = Math.ceil(totalSlides / newSlidesPerView) - 1;
                    
                    // Корректируем текущую страницу если необходимо
                    if (currentPage > maxPage) {
                        currentPage = maxPage;
                    }
                    
                    updateSlider();
                }, 250);
            });
            
            // Добавляем поддержку свайпов для мобильных устройств
            let touchStartX = 0;
            let touchEndX = 0;
            
            sliderWrapper.addEventListener('touchstart', function(event) {
                touchStartX = event.touches[0].clientX;
            }, { passive: true });
            
            sliderWrapper.addEventListener('touchend', function(event) {
                touchEndX = event.changedTouches[0].clientX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Свайп влево - следующий слайд
                        nextPage();
                    } else {
                        // Свайп вправо - предыдущий слайд
                        prevPage();
                    }
                }
            }
        });


        // form
         document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('reservationForm');
            
            // Обработка отправки формы
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Собираем данные формы
                const formData = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                };
                
                // Валидация email
                const email = formData.email;
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!emailPattern.test(email)) {
                    alert('Please enter a valid email address');
                    document.getElementById('email').focus();
                    return;
                }
                
                // Валидация сообщения
                if (!formData.message.trim()) {
                    alert('Please enter your message');
                    document.getElementById('message').focus();
                    return;
                }
                
                // Эмуляция отправки данных
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Booking...';
                submitBtn.disabled = true;
                
                // Имитация задержки отправки
                setTimeout(() => {
                    // Здесь обычно отправка данных на сервер
                    console.log('Form submitted:', formData);
                    
                    // Показываем сообщение об успехе
                    alert('Thank you! Your EV reservation has been submitted successfully. We will contact you shortly.');
                    
                    // Сброс формы (кроме предзаполненных полей)
                    document.getElementById('email').value = '';
                    document.getElementById('message').value = '';
                    
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Фокус на первое поле
                    document.getElementById('email').focus();
                }, 1500);
            });
            
            // Добавляем анимацию при фокусе на полях
            const formInputs = document.querySelectorAll('.form-input');
            formInputs.forEach(input => {
                // Пропускаем предзаполненные поля
                if (!input.classList.contains('filled-field')) {
                    input.addEventListener('focus', function() {
                        this.parentElement.style.transform = 'translateY(-2px)';
                    });
                    
                    input.addEventListener('blur', function() {
                        this.parentElement.style.transform = 'translateY(0)';
                    });
                }
            });
            
            // Добавляем интерактивность для кнопки
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(0)';
            });
            
            submitBtn.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-2px)';
            });
        });