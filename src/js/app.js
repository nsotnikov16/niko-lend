

/* Спойлеры */
const spoilers = document.querySelectorAll('.spoiler')
spoilers.forEach(spoiler => {
    const click = spoiler.querySelector('.spoiler__click')
    click.addEventListener('click', () => {
        spoiler.classList.toggle('open')
    })
})

/* Фотогаллерея */
var gallery = new Swiper(".gallery", {
    loop: true,
    centeredSlides: true,
    grabCursor: true,
    spaceBetween: 100,
    navigation: {
        nextEl: ".gallery .swiper-button-next",
        prevEl: ".gallery .swiper-button-prev",
    },
    breakpoints: {
        1280: {
            slidesPerView: 2
        }
    }
});


/* Карточки */
var cards = new Swiper('.cards', {
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    },
    breakpoints: {
        1280: {
            spaceBetween: 30,
            slidesPerView: 4,
        },

        820: {
            spaceBetween: 30,
            slidesPerView: 3,
        },
        480: {
            spaceBetween: 20,
            slidesPerView: 2,
        },
        320: {
            spaceBetween: 20,
            slidesPerView: 'auto',
        }
    }
})

/* Показать все */
const btns = document.querySelectorAll('.btn_all')
btns.forEach(btn => {
    const section = btn.closest('section')
    const items = section.querySelectorAll('.services__item')

    function display(value) {
        items.forEach((item, ind) => ind > 2 ? item.style.display = value : '')
    }

    if (items.length > 3) {
        display('none')
        btn.addEventListener('click', () => {
            display('block')
            btn.remove()
        })
    } else {
        btn.remove()
    }
})

/* Позвонить на мобильнике */
const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
if (isMobile) {
    const mobileBottom = document.querySelector('.mobile')
    if (mobileBottom) {
        window.addEventListener('scroll', () => {
            const scroll = Math.ceil(window.scrollY)
            if (scroll >= 400) mobileBottom.classList.add('show')
            if (scroll < 400) mobileBottom.classList.remove('show')
        })
    }
}

const signups = document.querySelectorAll('.btn_signup')
const messengers = document.querySelector('.messengers')
signups.forEach(item => item.addEventListener(isMobile ? 'click' : 'mouseenter', () => {
    item.append(messengers)
    setTimeout(() => messengers.classList.add('open'), 100)
}))

const signupHeader = document.querySelector('.header .btn_signup')
const inserted = signupHeader.parentNode.insertBefore(messengers.cloneNode(true), signupHeader)
inserted.classList.add('open', 'header__messengers')
const firstLi = inserted.querySelector('li').cloneNode(true)
inserted.prepend(firstLi)
firstLi.querySelector('a').setAttribute('href', '#')
firstLi.addEventListener('click', () => {
    inserted.classList.toggle('open-list')
})

document.addEventListener(isMobile ? 'click' : 'mousemove', (e) => {
    if (!e.target.closest('.messengers') && !e.target.closest('.btn_signup')) messengers.classList.remove('open')
    if (!e.target.closest('.header__messengers')) inserted.classList.remove('open-list')
})

const burgerOpen = document.querySelector('.header__container .burger')
const menu = document.querySelector('.menu')
const burgerClose = document.querySelector('.menu .burger')

const closeMenu = () => {
    menu.classList.remove('open');
    burgerClose.classList.remove('burger_close')
    burgerOpen.classList.remove('.burger_close')
}
burgerOpen.addEventListener('click', () => {
    if (burgerOpen.classList.contains('burger_close')) {
        closeMenu()
        burgerOpen.classList.remove('burger_close')
        return
    }
    menu.classList.add('open');
    burgerClose.classList.add('burger_close')
    window.innerWidth < 560 ? burgerOpen.classList.add('burger_close') : ''

})
burgerClose.addEventListener('click', () => closeMenu())

if (!window.innerWidth < 560) document.addEventListener('click', ({ target }) => {
    if (!target.closest('.menu') && !target.closest('.header__container .burger') && !target.closest('.header__messengers')) closeMenu()
})

window.addEventListener('resize', () => {
    if (window.innerWidth >= 560) {
        burgerOpen.classList.remove('burger_close')
    } else if (menu.classList.contains('open') && window.innerWidth < 560) {
        burgerOpen.classList.add('burger_close')
    }
})

// Плавный скролл
const anchors = [].slice.call(document.querySelectorAll('.scroll')),
    animationTime = 400,
    framesCount = 30;

function scroll(item) {
    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = document.querySelector('#' + item.dataset.scroll).getBoundingClientRect().top + window.pageYOffset;

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

anchors.forEach(item => item.addEventListener('click', () => scroll(item)))

// Popups
class Popup {
    constructor(popupElement) {
        this._popupElement = popupElement;
        this._closeButton = this._popupElement.querySelector('.popup__close');
        this._img = this._popupElement.id === "photo" ? this._popupElement.querySelector('.popup__img') : null;
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this._popupElement.id}"]`)
        this.title = this._popupElement.querySelector('.detail__title')
        this.content = this._popupElement.querySelector('.detail__content')
        this.time = this._popupElement.querySelector('.detail__time')
        this.price = this._popupElement.querySelector('.detail__price')
        this.htmlElements = [this.title, this.content, this.time, this.price]
        this.setEventListeners()
    }

    open(el) {
        if (this._img) this._img.src = el.src
        document.body.style.overflow = "hidden";
        this._popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        this.htmlElements.forEach(item => {
            item.innerHTML = ''
            item.innerHTML = details[el.dataset.detail][item.dataset.props]
        })
    }

    close() {
        if (this._img) this._img.src = ""
        this._popupElement.classList.remove('popup_opened');
        document.body.style.overflow = "visible";
        document.removeEventListener('keydown', this._handleEscClose);

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
        this._popupElement.addEventListener('click', this._handleOverlayClick.bind(this));
    }
}
const popups = document.querySelectorAll('.popup')
let popupsObj = {}
if (popups.length > 0) popups.forEach(item => { popupsObj[item.id] = new Popup(item) })


// Скролл программы детально

var swiper = new Swiper(".detail-swiper", {
    direction: "vertical",
    slidesPerView: "auto",
    freeMode: true,
    scrollbar: {
        el: ".detail-swiper .swiper-scrollbar",
    },
    mousewheel: true,
});

/* Анимация при скролле */

let titles = [...document.querySelectorAll('.section__title'), ... document.querySelectorAll('.section__subtitle')]
titles.push(document.querySelector('.banner__title'))
titles.forEach(item => item.classList.add('_anim-items', '_anim-no-hide'))

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);
    function animOnScroll() {
        for (let index = 0; index < animItems.length; index++) {
            const animItem = animItems[index];
            const animItemHeight = animItem.offsetHeight;
            const animItemOffset = offset(animItem).top;
            const animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if (animItemHeight > window.innerHeight) {
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                animItem.classList.add('_animate');
            } else {
                if (!animItem.classList.contains('_anim-no-hide')) {
                    animItem.classList.remove('_animate');
                }
            }
        }
    }
    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    setTimeout(() => {
        animOnScroll();
    }, 10);
}

