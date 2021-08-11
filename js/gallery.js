import galleryItems from './app.js';

const refs = {
    body: document.querySelector('body'),
    galleryContainer: document.querySelector('.js-gallery'),
    modal: document.querySelector('.js-lightbox'),
    modalImg: document.querySelector('.lightbox__image'),
    modalCloseBtn: document.querySelector('[data-action="close-lightbox"]'),
    modalOverlay: document.querySelector('.lightbox__overlay'),
};

// Создание и рендер разметки по массиву данных и предоставленному шаблону.

function createGallery(array, elementRef) {
    let liArray = array.map(element => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let img = document.createElement('img');

        a.append(img);
        li.append(a);

        li.classList.add('gallery__item');
        a.classList.add('gallery__link');
        a.setAttribute('href', `${element.original}`);
        img.classList.add('gallery__image');
        img.setAttribute('src', `${element.preview}`);
        img.setAttribute('data-source', `${element.original}`);
        img.setAttribute('alt', `${element.description}`);

        return li;
    });
    
    elementRef.append(...liArray);
}

createGallery(galleryItems, refs.galleryContainer);

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

refs.galleryContainer.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
    event.preventDefault();

    if (event.target.nodeName === 'IMG') {
        const originalImgUrl = event.target.dataset?.source;
        const ImgDescr = event.target.getAttribute('alt');
        openModal(originalImgUrl, ImgDescr);
    }
}

// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.

function openModal(url, descr) {
    refs.modal.classList.toggle('is-open');
    refs.body.style.overflow = 'hidden';
    refs.modalImg.src = url;
    refs.modalImg.alt = descr;
}

// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Очистка значения атрибута src элемента img.lightbox__image.
// Удаление слушателей после закрытия модалки

refs.modalCloseBtn.addEventListener('click', closeModal);

function closeModal() {
    refs.modal.classList.toggle('is-open');
    refs.body.removeAttribute('style');
    refs.modalImg.src = '';
    refs.modalImg.alt = '';
    window.removeEventListener('keydown', leafModalImg);
    refs.modalOverlay.removeEventListener('click', closeModal);
}

// Закрытие модального окна по клику на div.lightbox__overlay.

refs.modalOverlay.addEventListener('click', closeModal);

// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
// --- else --- Пролистывание по кругу.

window.addEventListener('keydown', leafModalImg);

function leafModalImg(event) {
    if (!refs.modal.classList.contains('is-open')) return;

    switch (event.code) {
        case 'Escape':
            closeModal();
        break;
        case 'ArrowRight':
            const nextIndex = galleryItems.findIndex(item => item.original === refs.modalImg.src) + 1;
            if (nextIndex < galleryItems.length) refs.modalImg.src = galleryItems[nextIndex].original;
            else refs.modalImg.src = galleryItems[0].original;
        break;
        case 'ArrowLeft': 
            const prevIndex = galleryItems.findIndex(item => item.original === refs.modalImg.src) - 1;
            if (prevIndex >= 0) refs.modalImg.src = galleryItems[prevIndex].original;
            else refs.modalImg.src = galleryItems[galleryItems.length - 1].original;
        break;
    }
}
