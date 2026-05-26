export class CreateResearchProjectDto {
  readonly title: string;
  readonly course: string;
  readonly researchLab: string;
  readonly animalSpecies: string;
  readonly totalAnimals: number;
  readonly expectedShipments: number;
  readonly date: Date;
  readonly researcherId: number;
  readonly examTypes: string[];
  readonly createdAt: Date;
}
