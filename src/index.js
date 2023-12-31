import axios from 'axios';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.load-more');

let lightbox = new SimpleLightbox('.gallery__link', {
  caption: true,
  captionDelay: 250,
  captionsData: 'alt',
});
const API_KEY = '40728025-816c059da6666ef8bc43bfdc5';
let page = 1;

const res = async e => {
  e.preventDefault();
  try {
    gallery.innerHTML = '';

    if (e.target.type === 'button') page++;
    else page = 1;
    const inp = form.elements[0].value;

    const { data } = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: inp,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
      },
    });

    if (data.totalHits < 1)
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

    const arr = addElements(data.hits);
    gallery.insertAdjacentHTML('beforeend', arr.join(''));
    lightbox.refresh();
    if (page < Math.ceil(data.totalHits / 20))
      btn.classList.toggle('hidden', false);
    else btn.classList.toggle('hidden', true);

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } catch (error) {
    console.error('Error:', error);
  }
};

const loadMore = e => {
  gallery.innerHTML = '';
  lightbox.refresh();
  res(e);
};

const addElements = arr => {
  return arr.map(
    el => `
      <div class="photo-card">
        <a class="gallery__link" href="${el.largeImageURL}">
          <img src="${el.webformatURL}" alt="${el.tags}" class="photo-img" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${el.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${el.downloads}
          </p>
        </div>
      </div>
    `
  );
};

btn.addEventListener('click', loadMore);

form.addEventListener('submit', e => res(e));
