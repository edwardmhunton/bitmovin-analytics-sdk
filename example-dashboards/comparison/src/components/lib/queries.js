import TimeCell from '../TimeCell.js';
import AmountCell from '../AmountCell.js';

const dimensions = [
  { name: 'STARTUPTIME', label: 'Total Startup Time' },
  { name: 'PLAYER_STARTUPTIME', label: 'Player Startup Time' },
  { name: 'VIDEO_STARTUPTIME', label: 'Video Startup Time' }
];

const aggregations = [
  { name: 'median', label: 'median' },
  { name: 'percentile', param: 95, label: '95th percentile' }
]

let queries = dimensions
  .map(dimension => aggregations.map((aggregation) => ({
    dimension: dimension.name,
    aggregation: aggregation.name,
    aggregationParam: aggregation.param,
    filters: [
      [dimension.name, 'GT', 0],
      ['PAGE_LOAD_TYPE', 'EQ', 1],
    ],
    cellType: TimeCell,
    label: `${dimension.label} (${aggregation.label})`,
  })))
  .reduce((totalArray, dimArray) => [...totalArray, ...dimArray], []); // flatten

queries = [
  ...queries,
  {
    label: 'Impressions',
    dimension: 'IMPRESSION_ID',
    aggregation: 'count',
    filters: [['VIDEO_STARTUPTIME', 'GT', 0]],
    cellType: AmountCell,
  },
  {
    label: 'Unique Users',
    dimension: 'USER_ID',
    aggregation: 'count',
    filters: [['VIDEO_STARTUPTIME', 'GT', 0]],
    cellType: AmountCell,
  },
  {
    label: 'Total page loads',
    dimension: 'IMPRESSION_ID',
    aggregation: 'count',
    filters: [['PLAYER_STARTUPTIME', 'GT', 0]],
    cellType: AmountCell,
  },
];

export default queries;
