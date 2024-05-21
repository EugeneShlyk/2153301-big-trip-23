const CITIES = ['Vladivostok', 'Nackhodka', 'Khabarovsk', 'Seoul', 'Tokio', 'Busan',];
const TYPE_POINT = ['taxi', 'bus', 'train'];
const OFFERS = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 1,
        'title': 'sing',
        'price': 20
      },
      {
        'id': 2,
        'title': 'sit',
        'price': 10
      },
      {
        'id': 3,
        'title': 'stand',
        'price': 1
      }
    ]
  },
  {
    'type': 'Bus',
    'offers': [
      {
        'id': 4,
        'title': 'lie',
        'price': 50
      },
      {
        'id': 5,
        'title': 'smoke',
        'price': 100
      },
      {
        'id': 6,
        'title': 'fart',
        'price': 1000
      },
    ]
  },
  {
    'type': 'Train',
    'offers': [
      {
        'id': 7,
        'title': 'eat',
        'price': 60
      },
      {
        'id': 8,
        'title': 'drink',
        'price': 90
      },
      {
        'id': 9,
        'title': 'love',
        'price': 0
      },
      {
        'id': 10,
        'title': 'play',
        'price': 20
      },
    ]
  }
];
const BASE_PRICES = [111, 222, 333, 444, 555];
const BOOLEAN = [true, false];
const DATES_FROM = ['2024-06-10T14:30', '2024-07-12T07:00', '2024-08-15T18:30'];
const DATES_TO = ['2024-10-10T14:30', '2024-11-12T01:30', '2024-12-15T16:00'];
const DESTINATIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];
const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const EmptyMessageTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export {
  CITIES,
  BASE_PRICES,
  DATES_FROM,
  DATES_TO,
  DESTINATIONS,
  BOOLEAN,
  OFFERS,
  TYPE_POINT,
  FilterType,
  EmptyMessageTextType
};
