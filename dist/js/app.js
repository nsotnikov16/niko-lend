

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
        },
    )
    addresses.forEach(
        ({ balloonID, coordinates, id }, ind) => {
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
                    balloonContentLayout: ymaps.templateLayoutFactory.createClass(document.querySelector(balloonID).innerHTML),
                    balloonPanelMaxMapArea: 0,
                    hideIconOnBalloonOpen: false,
                    balloonMaxWidth: 1000,
                    balloonMaxHeight: 460,
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
        const btn = select.querySelector('.select__btn')
        let chooseWrapper
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