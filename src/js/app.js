const hotGallery = new Swiper('.hot__gallery', {
    slidesPerView: 4,
    spaceBetween: 30,
    // Optional parameters
    loop: true,

    // If we need pagination
    pagination: {
        el: '.hot__gallery .swiper-pagination',
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
        balloonContentLayout: `
        <div style="background-color: white; color: black; z-index:999; width: 500px; height: 300px;">
            <h5>Рекламный щит 3x6 (статика)</h5>
            <p>N1455-A</p>
            <p>г.Сочи, напротив дома Ленина 51. </p>
        </div>
    `, coordinates: [43.428791, 39.919685]
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
            console.log(balloonContentLayout)
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