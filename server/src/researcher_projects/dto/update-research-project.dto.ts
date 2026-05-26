export class UpdateResearchProjectDto {
  readonly title?: string;
  readonly course?: string;
  readonly researchLab?: string;
  readonly animalSpecies?: string;
  readonly totalAnimals?: number;
  readonly expectedShipments?: number;
  readonly preferredDate?: string;
  readonly examTypeIds?: number[];
}
