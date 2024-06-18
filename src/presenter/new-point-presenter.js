import {remove, render, RenderPosition} from '../framework/render.js';
import TripCreateView from '../view/trip-create-view.js';
import { ALL_TYPES, UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointsModel = null;
  #pointsListComponent = null;
  #renderEmptyMessageView = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #eventTypes = ALL_TYPES;

  #newPointComponent = null;

  constructor({pointsModel, pointsListComponent, renderEmptyMessageView, onDataChange, onDestroy}) {
    this.#pointsModel = pointsModel;
    this.#pointsListComponent = pointsListComponent;
    this.#renderEmptyMessageView = renderEmptyMessageView;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newPointComponent = new TripCreateView({
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      point: this.#pointsModel.defaultPoint,
      eventTypes: this.#eventTypes,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteButtonClick: this.#handleDeleteClick,
    });

    render(this.#newPointComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    if(this.#pointsListComponent.element.childElementCount === 0) {
      remove(this.#pointsListComponent);
      this.#renderEmptyMessageView();
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );

  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  // #calculateOffers(allOffers, type) {
  //   const offersType = allOffers.filter((item))
  // }


}

