import countryList from 'country-list';

const countries = countryList();

export const attributeValue = (attribute, value) => {
  switch (attribute) {
    case 'COUNTRY':
      return countries.getName(value) || 'Unknown';
    default:
      return value || 'None';
  }
};

export default [
  Object.freeze({ collectionName: 'countries', singleName: 'country', attribute: 'COUNTRY' }),
  Object.freeze({ collectionName: 'players', singleName: 'player', attribute: 'PLAYER' }),
  Object.freeze({ collectionName: 'CDN providers', singleName: 'CDN provider', attribute: 'CDN_PROVIDER' }),
  Object.freeze({ collectionName: 'browsers', singleName: 'browser', attribute: 'BROWSER' }),
  Object.freeze({ collectionName: 'experiments', singleName: 'experiment', attribute: 'EXPERIMENT_NAME' }),
]
