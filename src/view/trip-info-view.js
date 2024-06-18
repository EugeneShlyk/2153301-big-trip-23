import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { sortDefaultByDay, humanizeTaskDueDateDayMonth } from '../utils/task';

const createTripInfoTemplate = (total, pointModel) => {
  const {points, destinations} = pointModel;

  const sortedTripDate = sortDefaultByDay(points);

  const startTripDate = humanizeTaskDueDateDayMonth(sortedTripDate.at(0).dateFrom);

  const finishTripDate = humanizeTaskDueDateDayMonth(sortedTripDate.at(-1).dateTo);

  const viewTotalTripDate = () => `${startTripDate} - ${finishTripDate}`;

  const tripDestinationId = sortDefaultByDay(points).map((elem) => elem.destination);

  const createTripDestinationList = () => {
    const destinationList = [];
    for(let i = 0; i < tripDestinationId.length; i++) {
      for(let j = 0; j < destinations.length; j++) {
        if(tripDestinationId[i] === destinations[j].id) {
          destinationList.push(destinations[j].name);
        }
      }
    } return destinationList;
  };

  const viewTripDestination = () => {
    if(createTripDestinationList().length <= 3) {
      return createTripDestinationList().join(' - ');
    } else {
      return `${createTripDestinationList()[0]}  . . .  ${createTripDestinationList()[createTripDestinationList().length - 1]}`;
    }
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${viewTripDestination()}</h1>

      <p class="trip-info__dates">${viewTotalTripDate()}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>
  </section>`);
};
export default class TripInfoView extends AbstractStatefulView {

  #pointModel = null;

  constructor ({pointModel}) {
    super();
    this.#pointModel = pointModel;
  }

  get template() {
    return createTripInfoTemplate(
      this.#pointModel.calculateTotalPrice(),
      this.#pointModel);
  }
}
