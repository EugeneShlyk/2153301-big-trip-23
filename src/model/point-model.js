import Observable from '../framework/observable';
import { defaultEventPoint, UpdateType } from '../const.js';

export default class PointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #defaultPoint = [];
  #pointsApiService = null;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = await this.#pointsApiService.offers;
      this.#destinations = await this.#pointsApiService.destinations;

    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
      return;
    }
    this._notify(UpdateType.INIT);
    this.#defaultPoint = defaultEventPoint;
  }

  get points() {
    return this.#points;
  }

  get defaultPoint() {
    return this.#defaultPoint;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points[index] = updatedPoint;
      // this.#points = [
      //   ...this.#points.slice(0, index),
      //   update,
      //   ...this.#points.slice(index + 1)
      // ];
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }

    this._notify(updateType, update);
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }


  set points(points) {
    this.#points = points;
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type)?.offers ?? [];
  }

  calculateTotalPrice() {
    return this.#points.reduce((total, point) => total + point.basePrice +
      this.#calculatePointOffersPrice(point), 0);
  }

  #calculatePointOffersPrice(point) {
    const ids = new Set(point.offers);
    const offers = this.getOffersByType(point.type);
    return offers.reduce((total, offer) => {
      const added = ids.has(offer.id) ? offer.price : 0;
      return total + added;
    }, 0);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: Number(point['base_price']),
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
