// OpenFreeMap MapLibre Styles & Configurations

export interface MapStyleOption {
  id: string;
  name: string;
  url: string;
  theme: 'dark' | 'light' | 'tactical';
}

// Built-in instant tactical dark style using 100% free OpenStreetMap with WebGL raster shading (Zero API keys, zero watermarks)
export const INSTANT_TACTICAL_DARK_STYLE: any = {
  version: 8,
  name: 'ResQAI EOC Tactical Dark',
  sources: {
    'eoc-base-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: ''
    }
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#080C14'
      }
    },
    {
      id: 'eoc-base-layer',
      type: 'raster',
      source: 'eoc-base-tiles',
      minzoom: 0,
      maxzoom: 19,
      paint: {
        'raster-saturation': -0.85,
        'raster-contrast': 0.2,
        'raster-brightness-max': 0.45,
        'raster-brightness-min': 0.05
      }
    }
  ]
};

export const OPENFREEMAP_STYLES: MapStyleOption[] = [
  {
    id: 'ofm-dark',
    name: 'OpenFreeMap Vector Dark',
    url: 'https://tiles.openfreemap.org/styles/dark',
    theme: 'dark'
  },
  {
    id: 'liberty',
    name: 'OpenFreeMap Liberty',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    theme: 'tactical'
  },
  {
    id: 'positron',
    name: 'OpenFreeMap Positron',
    url: 'https://tiles.openfreemap.org/styles/positron',
    theme: 'tactical'
  },
  {
    id: 'bright',
    name: 'OpenFreeMap Bright',
    url: 'https://tiles.openfreemap.org/styles/bright',
    theme: 'light'
  },
  {
    id: 'osm-fast',
    name: 'Fast OSM Tactical',
    url: 'instant-dark',
    theme: 'dark'
  }
];

export const DEFAULT_MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

export const OSM_ATTRIBUTION = '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';

// Layer IDs used in MapLibre for dynamic GeoJSON layers
export const MAP_LAYER_IDS = {
  HAZARD_ZONES_FILL: 'resqai-hazard-zones-fill',
  HAZARD_ZONES_LINE: 'resqai-hazard-zones-line',
  INCIDENT_HEATMAP: 'resqai-incident-heatmap',
  INCIDENT_CLUSTERS: 'resqai-incident-clusters',
  INCIDENT_CLUSTER_COUNT: 'resqai-incident-cluster-count',
  INCIDENT_UNCLUSTERED: 'resqai-incident-unclustered',
  VEHICLE_ROUTE_LINE: 'resqai-vehicle-route-line',
  VEHICLE_ROUTE_CASING: 'resqai-vehicle-route-casing',
  VEHICLE_TRACK_HISTORY: 'resqai-vehicle-track-history'
};
