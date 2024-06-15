import { remove, render, RenderPosition } from '../framework/render.js';
import TripSort from '../view/trip-sort.js';
import TripPointsList from '../view/trip-points-list.js';
import ListEmpty from '../view/list-empty.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { isEmpty, sortByPrice, sortByTime, sortDefaultByDay } from '../utils/task.js';
import { SortTypes, ALL_TYPES, } from '../const.js';
import { UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/task.js';

export default class MainPresenter {
  #mainPage = null;
  #pointModel = null;
  #eventListComponent = new TripPointsList();
  #loadingComponent = null;
  #sortComponent = null;
  #listEmpty = null;
  #allPresenters = new Map();
  #sortTypes = SortTypes;
  #currentSortType = this.#sortTypes.DAY;
  #allTypes = ALL_TYPES;
  #filterModel = null;
  #filterType = FilterType.EVERYTHING;
  #newPointPresenter = null;
  #isLoading = true;
  #newPointButtonComponent = null;

  constructor({ boardMainContainer, pointModel, filterModel, onNewPointDestroy, newPointButtonComponent }) {
    this.#mainPage = boardMainContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#newPointButtonComponent = newPointButtonComponent;

    this.#newPointPresenter = new NewPointPresenter({
      pointsModel: this.#pointModel,
      pointsListComponent: this.#eventListComponent,
      renderEmptyMessageView: this.#renderListEmpty,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard(this.points);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortTypes.TIME:
        return sortByTime(filteredPoints);
      case SortTypes.PRICE:
        return sortByPrice(filteredPoints);
    }
    return sortDefaultByDay(filteredPoints);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#allPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#allPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard(this.points);
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard(this.points);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard(this.points);
        this.#newPointButtonComponent.element.disabled = false;
        break;
    }
  };

  createPoint() {
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    if (this.#listEmpty !== null) {
      remove(this.#listEmpty);
      this.#listEmpty = null;
      render(this.#listEmpty, this.#mainPage);
    }
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#mainPage, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, this.#pointModel.offers, this.#pointModel.destinations, this.#allTypes);
    this.#allPresenters.set(point.id, pointPresenter);
  }

  #renderListEmpty = () => {
    this.#listEmpty = new ListEmpty({
      filterType: this.#filterType
    });
    render(this.#listEmpty, this.#mainPage);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard(this.points);
  };

  #renderSort() {
    this.#sortComponent = new TripSort({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#mainPage, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#allPresenters.forEach((presenter) => presenter.destroy());
    this.#allPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#eventListComponent) {
      remove(this.#eventListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #renderBoard(points) {
    if (this.#isLoading) {
      this.#newPointButtonComponent.element.disabled = true;
      render(this.#eventListComponent, this.#mainPage);
      this.#renderLoading();
      return;
    }

    if (isEmpty(points)) {
      remove(this.#eventListComponent);
      this.#renderListEmpty();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#mainPage);

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }
}
