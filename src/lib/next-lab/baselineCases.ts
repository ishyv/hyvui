export const baselineCaseIds = [
  "sparse",
  "dense",
  "image-dominant",
  "type-dominant",
  "atmospheric-motion",
] as const;

export type BaselineCaseId = (typeof baselineCaseIds)[number];

export type BaselineCase = {
  id: BaselineCaseId;
  title: string;
  kicker: string;
  description: string;
  signature: string;
  weight: "field-notebook" | "mission-control" | "archive";
};

export const baselineCases: BaselineCase[] = [
  {
    id: "sparse",
    title: "a room held open",
    kicker: "01 / sparse field",
    description: "one signal with room around it.",
    signature: "baseline-sparse",
    weight: "field-notebook",
  },
  {
    id: "dense",
    title: "the active register",
    kicker: "02 / dense readout",
    description: "many readings kept visible around one focal value.",
    signature: "baseline-dense",
    weight: "mission-control",
  },
  {
    id: "image-dominant",
    title: "the recovered surface",
    kicker: "03 / image dominant",
    description: "the image leads. the caption marks its edge.",
    signature: "baseline-image-dominant",
    weight: "archive",
  },
  {
    id: "type-dominant",
    title: "the sentence sets the measure",
    kicker: "04 / type dominant",
    description: "scale and line breaks set the hierarchy.",
    signature: "baseline-type-dominant",
    weight: "field-notebook",
  },
  {
    id: "atmospheric-motion",
    title: "a signal with weather",
    kicker: "05 / atmospheric motion",
    description: "one raised object while the field moves slowly.",
    signature: "baseline-atmospheric-motion",
    weight: "mission-control",
  },
];

export function getBaselineCase(id: BaselineCaseId): BaselineCase {
  return baselineCases.find((item) => item.id === id) ?? baselineCases[0];
}
