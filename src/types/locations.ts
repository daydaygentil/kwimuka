export interface LocationData {
  provinces: Province[];
}

export interface Province {
  name: string;
  districts: District[];
}

export interface District {
  name: string;
  sectors: Sector[];
}

export interface Sector {
  name: string;
  cells: Cell[];
}

export interface Cell {
  name: string;
  villages: string[];
}
