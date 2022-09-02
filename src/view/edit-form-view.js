import { humanizeDateDDMMYYHHmm, ucFirst } from '../utils/points.js';
import { TYPES, CITIES } from '../mock/consts.js';
import { destinations } from '../mock/destination.js';
import { mockOffersByType } from '../mock/offers.js';
import AbstractView from '../framework/view/abstract-view.js';

const editPointTemplate = (point) => {
  const { dateFrom, dateTo, type, destination, basePrice, offers } = point;

  const isOfferChecked = (offer) => offers.includes(offer.id) ? 'checked' : '';

  const createEditOfferTemplate = () => {
    const destOffers = [];

    for (const mockOffer of mockOffersByType) {

      if (offers.includes(mockOffer.id)) {
        destOffers.push(mockOffer);
      }
    }

    return destOffers.map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isOfferChecked(offer)}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
     `).join(' ');
  };

  const offersTemplate = createEditOfferTemplate();

  const createEditTypeTemplate = (currentType) =>
    TYPES.map((iterationType) => `
      <div class="event__type-item">
        <input id="event-type-${iterationType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${iterationType}" ${currentType === iterationType ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${iterationType}" for="event-type-${iterationType}-1">${ucFirst(iterationType)}</label>
      </div>
      `).join('');

  const typesTemplate = createEditTypeTemplate(type);

  const createDestinationListTemplate = (selectedCity) =>
    CITIES.map((city) => `
    <option value="${city}" ${selectedCity === city ? 'selected' : ''}></option>
       `).join('');

  const destListTemplate = createDestinationListTemplate(destinations[destination].name);

  return (`
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typesTemplate}
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[destination].name}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${destListTemplate}
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDateDDMMYYHHmm(dateTo)}">
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDateDDMMYYHHmm(dateFrom)}">
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offersTemplate}
      </div>
    </section>
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinations[destination].description}</p>
    </section>
  </section>
 </form>
  `);
};

export default class EditFormView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return editPointTemplate(this.#point);
  }

  setCancelEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#clickHandler);
  };

  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    this.element.addEventListener('submit', this.#submitHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submit();
  };
}
