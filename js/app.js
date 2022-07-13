// Анимации
AOS.init();

// Мобильное устройство?
const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

const hotGallery = new Swiper('.hot__gallery', {
    spaceBetween: 30,
    freeMode: true,
    pagination: {
        el: '.hot__gallery .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.hot__gallery-container .swiper-button-next',
        prevEl: '.hot__gallery-container .swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    },
    breakpoints: {
        1170: {
            slidesPerView: 4,
        },
        320: {
            slidesPerView: 'auto'
        }
    }
});

let myMap
if (document.querySelector('#map')) ymaps.ready(init)
function init() {
    // Создание карты.
    myMap = new ymaps.Map(
        "map",
        {
            center: centerMap,
            zoom: 12,
            controls: ['zoomControl', 'geolocationControl'],
        },
        {
            searchControlProvider: "yandex#search",
            zoomControlPosition: { right: 10, top: 250 },
            zoomControlSize: 'small',
            geolocationControlPosition: { right: 10, top: 330 }
        },
    )

    addresses.forEach(
        ({ balloonID, coordinates }, ind) => {
            const html = document.querySelector(balloonID).innerHTML;
            const balloonContentLayout = ymaps.templateLayoutFactory.createClass(html)
            myPlacemarkWithContent = new ymaps.Placemark(
                coordinates,
                {},
                {
                    iconImageHref: "./img/map-icon.svg",
                    iconImageSize: [38, 38],
                    iconLayout: "default#imageWithContent",
                    iconImageOffset: [-15, 5],
                    iconRotate: 99,
                    /* balloonLayout: MyBalloonLayout, */
                    balloonContentLayout,
                    balloonPanelMaxMapArea: 0,
                    hideIconOnBalloonOpen: false,
                    balloonMaxWidth: 1000,
                    balloonMaxHeight: 1000,
                }
            );
            myMap.geoObjects.add(myPlacemarkWithContent);
        }
    );
}

function openBallon(button) {
    if (!myMap) return
    const balloon = Number(button.dataset.map) - 1
    scrollToElement('#map')
    myMap.geoObjects.get(balloon).balloon.open()
}



// Рейтинг
class Rating {
    constructor(element) {
        this.rating = element
        this.ratingItems = this.rating.querySelectorAll('.rating__item')
        this.ratingActive
        this.ratingValue
        this.initRatingVars()
        this.setRatingActiveWidth()
        /* this.setEventListeners() */
    }
    // Инициализируем переменные
    initRatingVars() {
        this.ratingActive = this.rating.querySelector('.rating__active')
        this.ratingValue = Number(this.rating.dataset.rating)
    }
    // Обновление активных звёзд
    setRatingActiveWidth(index = this.ratingValue) {
        this.ratingActive.style.width = `${index / 0.05}%`
    }

    async setRatingValue(value) {
        if (!this.rating.classList.contains('rating_sending')) {
            this.rating.classList.add('rating_sending')


            // ОТправка данных (value) на сервер
            let response = await fetch('rating.json', {
                method: 'GET'
                // Здесь нужные параметры для сервера
            })

            // Ответ с сервера должен прилететь в формате json, с числовым значением рейтинга

            if (response.ok) {
                const result = await response.json()

                // Получаем новый рейтинг
                const newRating = result.newRating;

                // Обновление среднего результата
                this.ratingValue = newRating

                this.setRatingActiveWidth()

                this.rating.classList.remove('rating_sending')
            } else {
                alert('Ошибка');
                this.rating.classList.remove('rating_sending')
            }
        }
    }

    // Слушатели
    setEventListeners() {
        this.ratingItems.forEach((ratingItem, index) => {
            // Наведенные звёзды
            ratingItem.addEventListener('mouseenter', () => {
                this.initRatingVars()
                this.setRatingActiveWidth(ratingItem.value)
            })

            // Вернуть рейтинг, если передумали
            ratingItem.addEventListener('mouseleave', () => this.setRatingActiveWidth())

            // Клик по звезде
            ratingItem.addEventListener('click', () => {
                this.initRatingVars()

                // Если аякс (у блока рейтинга должен быть атрибут data-ajax="true") - отправляем на сервер,
                // иначе просто через js ставим новый рейтинг
                if (this.rating.dataset.ajax) {
                    this.setRatingValue(ratingItem.value)
                } else {
                    this.ratingValue = index + 1
                    this.setRatingActiveWidth()
                }
            })
        })
    }
}
const ratings = document.querySelectorAll('.rating')
if (ratings.length > 0) ratings.forEach(rating => new Rating(rating))


// Временно (потом удалить)
const monthItemsTest = document.querySelectorAll('.months__item')
if (monthItemsTest.length > 0) monthItemsTest.forEach((item, ind) => {
    item.querySelector('label').setAttribute('for', `${ind}`)
    item.querySelector('input').setAttribute('id', `${ind}`)
})

// Табы
function tabClick(tab) {
    // Не забыть в html указать класс для родителя табов, чтобы он понимал взаимосвязь
    const parent = tab.closest('.tabs-parent')
    const tabs = parent.querySelectorAll('.tabs__tab')
    const images = parent.querySelectorAll('.tabs__image')
    tabs.forEach(item => {
        item.classList.remove('tabs__tab_active')
        if (item === tab) tab.classList.add('tabs__tab_active')
    })

    images.forEach(item => {
        item.classList.remove('tabs__image_active')
        if (item.dataset.tab === tab.dataset.tab) item.classList.add('tabs__image_active')
    })
}

/* Спойлеры */
const spoilers = document.querySelectorAll('.spoiler')
if (spoilers.length > 0) {
    spoilers.forEach(spoiler => {
        const top = spoiler.querySelector('.spoiler__top')
        top.addEventListener('click', () => spoiler.classList.toggle('spoiler_open'))
    })
}


/* Селекты */
const selects = document.querySelectorAll('.select')
if (selects.length > 0) {
    selects.forEach((select, index) => {
        select.id = 'select-' + index
        const filter = select.closest('.filter__item')
        const choose = select.querySelector('.select__choose')
        const btn = select.querySelector('.select__btn')
        let chooseWrapper


        document.addEventListener('click', ({ target }) => {
            if (select.classList.contains('select_open') && !target.closest('#' + select.id)) select.classList.remove('select_open')
        })

        const chooseText = select.querySelector('.select__choose-text')
        if (choose) {
            chooseWrapper = choose.querySelector('.swiper-wrapper')
            choose.id = 'choose_' + index
            let params = {
                slidesPerView: "auto",
                freeMode: true,
                mousewheel: true,
            }
            const swiper = new Swiper("#" + choose.id, params)
        }

        btn.addEventListener('click', () => select.classList.toggle('select_open'))

        const points = select.querySelectorAll('.select__point')
        points.forEach(point => {
            const input = point.querySelector('input')
            const label = point.querySelector('label')

            function checkInputsChoose() {
                if (input.checked) {
                    chooseWrapper.insertAdjacentHTML('beforeend', `<li class="swiper-slide">${label.textContent}</li>`)
                } else {
                    Array.from(chooseWrapper.querySelectorAll('.swiper-slide')).find(li => li.textContent === label.textContent).remove()
                }
                if (chooseWrapper.querySelectorAll('.swiper-slide').length > 0) {
                    choose.classList.remove('dnone')
                    chooseText.classList.add('dnone')

                } else {
                    choose.classList.add('dnone')
                    chooseText.classList.remove('dnone')
                }
                swiper.update()
            }

            function checkInputsOther() {
                if (input.checked) chooseText.textContent = label.textContent
                chooseText.style.fontWeight = '700'
                select.classList.remove('select_open')
            }

            if (chooseWrapper) {
                input.addEventListener('click', checkInputsChoose)
            } else {
                input.addEventListener('click', checkInputsOther)
            }

        })

        if (filter) {
            const reset = filter.querySelector('.filter__item-reset')
            reset.addEventListener('click', () => {
                points.forEach(point => {
                    const input = point.querySelector('input')
                    if (input.checked) input.click()
                })
            })
        }
    })
}


const cart = document.querySelector('.table_cart')
if (cart) {
    const rows = document.querySelectorAll('tr:not(.table_cart tr:first-child)')
    if (rows.length > 0) {
        rows.forEach(row => {
            const rowTrash = row.querySelector('.table__element-trash .close')
            rowTrash.addEventListener('click', () => row.remove())

            const services = row.querySelectorAll('.table__service')
            services.forEach(service => {
                const trash = service.querySelector('.close')
                trash.addEventListener('click', () => service.remove())
            })
        })
    }
}


// Popups
class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this._closeButton = this.popupElement.querySelector('.popup__close');
        this._img = this.popupElement.querySelector('.popup__img') ?? '';
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this.popupElement.id}"]`)
        this.setEventListeners()
    }

    open(el) {
        document.body.style.overflow = "hidden";
        this.popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        if (el.dataset.image) this._img.src = el.src
    }

    close() {
        this.popupElement.classList.remove('popup_opened');
        document.body.style.overflow = "visible";
        document.removeEventListener('keydown', this._handleEscClose);
        if (this.popupElement.id === 'stories') stories.reset()
    }

    _handleEscClose(evt) {
        if (evt.keyCode === 27) {
            this.close();
        }
    }

    _handleOverlayClick(evt) {
        if (evt.target === evt.currentTarget) {
            this.close();
        }
    }

    setEventListeners() {
        this._openingLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); this.open(e.target) }))
        this._closeButton.addEventListener('click', () => this.close());
        this.popupElement.addEventListener('click', this._handleOverlayClick.bind(this));
    }
}

const popups = document.querySelectorAll('.popup')
let arrPopups = {}
document.addEventListener('DOMContentLoaded', () => {
    if (popups.length > 0) popups.forEach(item => arrPopups[item.id] = new Popup(item))
})


/* Добавление в корзину (полёт иконки) */

const basket = document.querySelector('.header__cart')

function move_to_cart(btn) {
    const picture = basket.cloneNode(true)
    picture.querySelector('span').remove()
    picture.querySelector('.header__cart-count').remove()
    btn.appendChild(picture)

    let picture_pos = picture.getBoundingClientRect();
    let cart_pos = basket.getBoundingClientRect();
    let picture2 = picture.cloneNode(true);
    picture2.style.visibility = "visible";
    picture2.style.background = "red";
    picture2.style.position = "fixed";
    picture2.style.width = "30px";
    picture2.style.height = "30px";
    picture2.style.left = picture_pos['x'] + "px";
    picture2.style.top = picture_pos['y'] + "px";
    picture2.style.border = "none";
    picture2.style.zIndex = 88888;

    let start_x = picture_pos['x'] + 0.5 * picture_pos['width'];
    let start_y = picture_pos['y'] + 0.5 * picture_pos['height'];

    let delta_x = (cart_pos['x'] + 0.5 * cart_pos['width']) - start_x;
    let delta_y = (cart_pos['y'] + 0.5 * cart_pos['height']) - start_y;

    document.body.appendChild(picture2);
    void picture2.offsetWidth;

    picture2.style.borderRadius = "50%";
    picture2.style.transform = "translateX(" + delta_x + "px)";
    picture2.style.transform += "translateY(" + delta_y + "px)";
    picture2.style.transform += "scale(0.001)"; // уменьшаем до 25%
    picture2.style.transition = "1s"; // всё происходит за 1 секунду

    setTimeout(() => document.body.removeChild(picture2), 960);
}


// Плавный скролл
const anchors = /* [].slice.call(document.querySelectorAll('[data-scroll]')), */
    animationTime = 500,
    framesCount = 50;

function scrollToElement(id) {
    let element = document.querySelector(id)
    if (!element) return

    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = element.getBoundingClientRect().top + window.pageYOffset;

    // запускаем интервал, в котором
    let scroller = setInterval(function () {
        // считаем на сколько скроллить за 1 такт
        let scrollBy = coordY / framesCount;

        // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
        // и дно страницы не достигнуто
        if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
            // то скроллим на к-во пикселей, которое соответствует одному такту
            window.scrollBy(0, scrollBy);
        } else {
            // иначе добираемся до элемента и выходим из интервала
            window.scrollTo(0, coordY);
            clearInterval(scroller);
        }
        // время интервала равняется частному от времени анимации и к-ва кадров
    }, animationTime / framesCount);

}


// Параллакс эффект при движении мыши
const parallax = document.querySelector('.parallax')
if (parallax && window.innerWidth >= 1170) {
    document.addEventListener('DOMContentLoaded', () => {
        // Коэффициенты
        const forBackground = 30

        // Скорость анимации
        const speed = 0.05

        // Объявление переменных
        let positionX = 0, positionY = 0
        let coordXprocent = 0, coordYprocent = 0

        const setMouseParallaxStyle = () => {
            const distX = coordXprocent - positionX;
            const distY = coordYprocent - positionY;

            positionX = positionX + (distX * speed)
            positionY = positionY + (distY * speed)

            // Передаем стили
            parallax.style.cssText = `transform: translate(${positionX / forBackground}%, ${positionY / forBackground}%);`
            requestAnimationFrame(setMouseParallaxStyle)
        }

        setMouseParallaxStyle()
        document.querySelector('.background').addEventListener('mousemove', (e) => {
            // Получение ширины и высоты блока
            const parallaxWidth = parallax.offsetWidth
            const parallaxHeight = parallax.offsetHeight

            // Ноль по середине
            const coordX = e.pageX - parallaxWidth / 2;
            const coordY = e.pageY - parallaxHeight / 2;

            //Получаем проценты
            coordXprocent = coordX / parallaxWidth * 100
            coordYprocent = coordY / parallaxHeight * 100
        })
    })
}   
