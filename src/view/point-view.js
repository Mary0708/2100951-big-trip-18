import { createElement } from '../render.js';
import { mockOffers } from '../mock/offers.js';
import { destinations } from '../mock/destination.js';
import { humanizeDateHHmm, humanizeDateMMMDD } from '../view/utils.js';

const listPointTemplate = (point) => {
  const { dateFrom, dateTo, type, destination, basePrice, offers, isFavorite } = point;

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  const getDestinationName = () => {
    for (const dest of destinations) {
      if (destination === dest.id) {
        return dest.name;
      }
    }
  };

  const createOfferTemplate = () => {
    const destOffers = [];
    for (const mockOffer of mockOffers) {
      if (offers.includes(mockOffer.id)) {
        destOffers.push(mockOffer);
      }
    }
    return destOffers
      .map((offer) => `
        <li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
         &plus;&euro;&nbsp;
         <span class="event__offer-price">${offer.price}</span>
        </li>
      `).join(' ');
  };

  return (`
   <div class="event">
     <time class="event__date" datetime="${dateFrom}">${humanizeDateMMMDD(dateFrom)}</time>
     <div class="event__type">
       <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
     </div>
     <h3 class="event__title">${type} ${getDestinationName()}</h3>
     <div class="event__schedule">
       <p class="event__time">
         <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeDateHHmm(dateTo)}</time>
         —
         <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeDateHHmm(dateFrom)}</time>
       </p>
       <p class="event__duration">${dateTo - dateFrom}</p>
     </div>
     <p class="event__price">
       €&nbsp;<span class="event__price-value">${basePrice}</span>
     </p>
     <h4 class="visually-hidden">Offers:</h4>
     <ul class="event__selected-offers">
      ${createOfferTemplate()}
     </ul>
     <button class="event__favorite-btn ${favoriteClassName}" type="button">
       <span class="visually-hidden">Add to favorite</span>
       <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
         <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
       </svg>
     </button>
     <button class="event__rollup-btn" type="button">
       <span class="visually-hidden">Open event</span>
     </button>
   </div>
  `);
};

export default class ListPointView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return listPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }
  removeElement() {
    this.element = null;
  }
}