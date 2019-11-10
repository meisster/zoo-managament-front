export interface Animal {
  id: string;
  name: string;
  species: Species;
  room: Room;
}

export interface Species {
  name: string;
  naturalHabit: string;
  description: string;
  food: string;
  price: number;
}

export interface Room {
  id: number;
  locatorsMaxNumber: number;
  species: Species[];
  surface: number;
  price: number;
}
