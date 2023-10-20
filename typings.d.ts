type GeoJson = {
  type: "FeatureCollection";
  name: string;
  crs?: {};
  features: Feature<Geometry, GeoJsonProperties>[];
};

type Legislations = "Statewide RTC" | "Defend RTC" | "Winter Eviction Moratorium"

type Districts = "assembly" | "senate"

type Organizations = "Members" | "Supporters" | "Endorsers"

type dataType = {
  "Statewide RTC": string;
  "Defend RTC": string;
  "Winter Eviction Moratorium": string;
  House: string;
  Party: string;
};
