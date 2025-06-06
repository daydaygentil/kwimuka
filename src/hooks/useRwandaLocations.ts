import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import rwandaLocations, { flattenLocations } from '../lib/rwanda-locations';

export interface RwandaLocation {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

export interface LocationHierarchy {
  provinces: string[];
  districts: { [province: string]: string[] };
  sectors: { [district: string]: string[] };
  cells: { [sector: string]: string[] };
  villages: { [cell: string]: string[] };
}

// Use the full location data as fallback
const fallbackRwandaData: RwandaLocation[] = flattenLocations(rwandaLocations);

const useRwandaLocations = () => {
  const [hierarchy, setHierarchy] = useState<LocationHierarchy>({
    provinces: [],
    districts: {},
    sectors: {},
    cells: {},
    villages: {}
  });

  const { data: locations, isLoading, error } = useQuery({
    queryKey: ['rwanda-locations'],
    queryFn: async () => {
      try {
        const response = await fetch('https://default-application-10650333.rapidapi.com/rwanda-locations', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'be5e642957mshcdee31e7a0e62dbp181757jsn0077906dae06',
            'X-RapidAPI-Host': 'default-application-10650333.rapidapi.com'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Rwanda locations');
        }

        const data = await response.json();
        console.log('Successfully fetched Rwanda locations from API:', data);
        return data as RwandaLocation[];
      } catch (error) {
        console.error('Error fetching Rwanda locations from API:', error);
        console.log('Using fallback Rwanda location data');
        // Return fallback data when API fails
        return fallbackRwandaData;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    retry: 1 // Reduce retries to fail faster and use fallback
  });

  useEffect(() => {
    const dataToProcess = locations || fallbackRwandaData;
    console.log('Processing location data:', dataToProcess);
    
    if (dataToProcess && dataToProcess.length > 0) {
      const newHierarchy: LocationHierarchy = {
        provinces: [],
        districts: {},
        sectors: {},
        cells: {},
        villages: {}
      };

      dataToProcess.forEach((location) => {
        // Add province
        if (!newHierarchy.provinces.includes(location.province)) {
          newHierarchy.provinces.push(location.province);
        }

        // Add district under province
        if (!newHierarchy.districts[location.province]) {
          newHierarchy.districts[location.province] = [];
        }
        if (!newHierarchy.districts[location.province].includes(location.district)) {
          newHierarchy.districts[location.province].push(location.district);
        }

        // Add sector under district
        if (!newHierarchy.sectors[location.district]) {
          newHierarchy.sectors[location.district] = [];
        }
        if (!newHierarchy.sectors[location.district].includes(location.sector)) {
          newHierarchy.sectors[location.district].push(location.sector);
        }

        // Add cell under sector
        if (!newHierarchy.cells[location.sector]) {
          newHierarchy.cells[location.sector] = [];
        }
        if (!newHierarchy.cells[location.sector].includes(location.cell)) {
          newHierarchy.cells[location.sector].push(location.cell);
        }

        // Add village under cell
        if (!newHierarchy.villages[location.cell]) {
          newHierarchy.villages[location.cell] = [];
        }
        if (!newHierarchy.villages[location.cell].includes(location.village)) {
          newHierarchy.villages[location.cell].push(location.village);
        }
      });

      // Sort all arrays alphabetically
      newHierarchy.provinces.sort();
      Object.keys(newHierarchy.districts).forEach(key => {
        newHierarchy.districts[key].sort();
      });
      Object.keys(newHierarchy.sectors).forEach(key => {
        newHierarchy.sectors[key].sort();
      });
      Object.keys(newHierarchy.cells).forEach(key => {
        newHierarchy.cells[key].sort();
      });
      Object.keys(newHierarchy.villages).forEach(key => {
        newHierarchy.villages[key].sort();
      });

      console.log('Generated hierarchy:', newHierarchy);
      setHierarchy(newHierarchy);
    }
  }, [locations]);

  return {
    hierarchy,
    isLoading,
    error,
    locations: locations || fallbackRwandaData
  };
};

export default useRwandaLocations;
