import AbstractView from '../framework/view/abstract-view.js';

const createListEmpty = () =>
  `<p class="trip-events__msg">
  Click New Event to create your first point
  </p>`;

export default class ListEmpty extends AbstractView {
  get template() {
    return createListEmpty();
  }
}

