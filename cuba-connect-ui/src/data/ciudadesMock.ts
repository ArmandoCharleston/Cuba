export interface Ciudad {
  id: string;
  nombre: string;
  provincia: string;
}

export const ciudadesMock: Ciudad[] = [
  { id: "1", nombre: "La Habana", provincia: "La Habana" },
  { id: "2", nombre: "Varadero", provincia: "Matanzas" },
  { id: "3", nombre: "Santiago de Cuba", provincia: "Santiago de Cuba" },
  { id: "4", nombre: "Trinidad", provincia: "Sancti Spíritus" },
  { id: "5", nombre: "Viñales", provincia: "Pinar del Río" },
  { id: "6", nombre: "Cienfuegos", provincia: "Cienfuegos" },
  { id: "7", nombre: "Camagüey", provincia: "Camagüey" },
  { id: "8", nombre: "Holguín", provincia: "Holguín" },
];
