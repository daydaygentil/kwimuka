import { LocationData } from '../types/locations';

const rwandaLocations: LocationData = {
  provinces: [
    {
      name: "Eastern Province",
      districts: [
        {
          name: "Bugesera",
          sectors: [
            {
              name: "Gashora",
              cells: [
                {
                  name: "Biryogo",
                  villages: ["Bidudu", "Biryogo", "Buhoro", "Gihanama", "Kagarama", "Kanyonyomba", "Karutete", "Kivugiza", "Rugunga"]
                },
                {
                  name: "Kabuye",
                  villages: ["Bidudu", "Kabuye", "Karizinge", "Rwagasiga", "Rweteto"]
                },
                {
                  name: "Kagomasi",
                  villages: ["Akagako", "Kagomasi", "Kiruhura", "Kuruganda", "Runzenze", "Rushubi"]
                }
                // ...more cells
              ]
            }
            // ...more sectors
          ]
        },
        // ...more districts
      ]
    },
    {
      name: "Kigali City",
      districts: [
        {
          name: "Gasabo",
          sectors: [
            {
              name: "Kimironko",
              cells: [
                {
                  name: "Bibare",
                  villages: ["Bibare"]
                },
                {
                  name: "Kibagabaga",
                  villages: ["Kibagabaga"]
                }
              ]
            }
            // ...more sectors
          ]
        },
        {
          name: "Kicukiro",
          sectors: [
            {
              name: "Niboye",
              cells: [
                {
                  name: "Niboye",
                  villages: ["Niboye"]
                },
                {
                  name: "Kabuga",
                  villages: ["Kabuga"]
                }
              ]
            }
            // ...more sectors
          ]
        }
        // ...more districts
      ]
    }
    // ...more provinces
  ]
};

export default rwandaLocations;

// Helper function to convert hierarchical data to flat format
export function flattenLocations(data: LocationData): Array<{
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}> {
  const flattened: Array<{
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  }> = [];

  data.provinces.forEach(province => {
    province.districts.forEach(district => {
      district.sectors.forEach(sector => {
        sector.cells.forEach(cell => {
          cell.villages.forEach(village => {
            flattened.push({
              province: province.name,
              district: district.name,
              sector: sector.name,
              cell: cell.name,
              village: village
            });
          });
        });
      });
    });
  });

  return flattened;
}
