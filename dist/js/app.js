const hotGallery = new Swiper('.hot__gallery', {
    slidesPerView: 4,
    spaceBetween: 30,
    // Optional parameters
    loop: true,

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
});

/* Яндекс карты */
var addresses = [
    {
       /*  balloonContentLayout: document.querySelector('template').innerHTML, */ coordinates: [43.428791, 39.919685]
    }
];

ymaps.ready(init)
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

    addresses.forEach(
        ({ balloonContentLayout, coordinates }, ind) => {
            myPlacemarkWithContent = new ymaps.Placemark(
                coordinates,
                {},
                {
                    iconImageHref: "/img/map-icon.svg",
                    iconImageSize: [38, 38],
                    iconLayout: "default#imageWithContent",
                    /* iconContentOffset: [-20, 2], */
                    iconImageOffset: [-15, 5],
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
    const tabs = document.querySelectorAll('.tabs__tab')
    const images = document.querySelectorAll('.tabs__image')
    tabs.forEach(item => {
        item.classList.remove('tabs__tab_active')
        if (item === tab) tab.classList.add('tabs__tab_active')
    })

    images.forEach(item => {
        item.classList.remove('tabs__image_active')
        if (item.dataset.tab === tab.dataset.tab) item.classList.add('tabs__image_active')
    })
}