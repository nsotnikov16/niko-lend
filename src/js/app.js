

const hotGallery = new Swiper('.hot__gallery', {

    spaceBetween: 30,
    // Optional parameters
    /* loop: true, */

    // If we need pagination
    pagination: {
        el: '.hot__gallery .swiper-pagination',
        clickable: true,
    },

    // Navigation arrows
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

/* Яндекс карты */
var addresses = [
    {
       /*  balloonContentLayout: document.querySelector('template').innerHTML,  */coordinates: [43.428791, 39.919685]
    }
];

if (document.querySelector('#map')) ymaps.ready(init)
function init() {
    // Создание карты.
    var myMap = new ymaps.Map(
        "map",
        {
            center: [43.585472, 39.723098],
            zoom: 12,
            controls: ['zoomControl', 'geolocationControl'],
        },
        {
            searchControlProvider: "yandex#search",
            zoomControlPosition: { right: 10, top: 250 },
            zoomControlSize: 'small',
            geolocationControlPosition: { right: 10, top: 330 }
        }
    )


    // Создание макета балуна на основе Twitter Bootstrap.
    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="popover top">' +
        '<a class="close" href="#">&times;</a>' +
        '<div class="arrow"></div>' +
        '<div class="popover-inner">' +
        '$[[options.contentLayout minWidth=235 maxWidth=235 maxHeight=350]]' +
        '</div>' +
        '</div>', {
        /**
         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
         * @function
         * @name build
         */
        build: function () {
            this.constructor.superclass.build.call(this);

            this._$element = $('.popover', this.getParentElement());

            this.applyElementOffset();

            this._$element.find('.close')
                .on('click', $.proxy(this.onCloseClick, this));
        },

        /**
         * Удаляет содержимое макета из DOM.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
         * @function
         * @name clear
         */
        clear: function () {
            this._$element.find('.close')
                .off('click');

            this.constructor.superclass.clear.call(this);
        },

        /**
         * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
         * @function
         * @name onSublayoutSizeChange
         */
        onSublayoutSizeChange: function () {
            MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

            if (!this._isElement(this._$element)) {
                return;
            }

            this.applyElementOffset();

            this.events.fire('shapechange');
        },

        /**
         * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
         * @function
         * @name applyElementOffset
         */
        applyElementOffset: function () {
            this._$element.css({
                left: -(this._$element[0].offsetWidth / 2),
                top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
            });
        },

        /**
         * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
         * @function
         * @name onCloseClick
         */
        onCloseClick: function (e) {
            e.preventDefault();

            this.events.fire('userclose');
        },

        /**
         * Используется для автопозиционирования (balloonAutoPan).
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
         * @function
         * @name getClientBounds
         * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
         */
        getShape: function () {
            if (!this._isElement(this._$element)) {
                return MyBalloonLayout.superclass.getShape.call(this);
            }

            var position = this._$element.position();

            return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                [position.left, position.top], [
                    position.left + this._$element[0].offsetWidth,
                    position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                ]
            ]));
        },

        /**
         * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
         * @function
         * @private
         * @name _isElement
         * @param {jQuery} [element] Элемент.
         * @returns {Boolean} Флаг наличия.
         */
        _isElement: function (element) {
            return element && element[0] && element.find('.arrow')[0];
        }
    }),

        addresses.forEach(
            ({ balloonContentLayout, coordinates }, ind) => {
                myPlacemarkWithContent = window.myPlacemarkWithContent = new ymaps.Placemark(
                    coordinates,
                    {},
                    {
                        iconImageHref: "/img/map-icon.svg",
                        iconImageSize: [38, 38],
                        iconLayout: "default#imageWithContent",
                        iconImageOffset: [-15, 5],
                        balloonLayout: MyBalloonLayout,
                        balloonContentLayout: ymaps.templateLayoutFactory.createClass(balloonContentLayout),
                        balloonPanelMaxMapArea: 0,
                        hideIconOnBalloonOpen: false,
                    }
                );

                myMap.geoObjects.add(myPlacemarkWithContent);
            }
        );
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
        this.setEventListeners()
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
        top.addEventListener('click', () => {
            spoiler.classList.toggle('spoiler_open')
        })
    })
}


/* Селекты */
const selects = document.querySelectorAll('.select')
if (selects.length > 0) {
    selects.forEach((select, index) => {
        const filter = select.closest('.filter__item')
        const choose = select.querySelector('.select__choose')
        const chooseText = select.querySelector('.select__choose-text')
        const chooseWrapper = choose.querySelector('.swiper-wrapper')
        const btn = select.querySelector('.select__btn')
        choose.id = 'choose_' + index

        let params = {
            slidesPerView: "auto",
            freeMode: true,
            mousewheel: true,
        }

        const swiper = new Swiper("#" + choose.id, params)
        btn.addEventListener('click', () => select.classList.toggle('select_open'))

        const points = select.querySelectorAll('.select__point')
        points.forEach(point => {
            const input = point.querySelector('input')
            const label = point.querySelector('label')

            function checkInputs() {
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

            input.addEventListener('click', checkInputs)
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