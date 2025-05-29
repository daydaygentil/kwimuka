
import { supabase } from '@/integrations/supabase/client';

// Sample Rwanda location data based on common administrative divisions
const rwandaLocationsData = [
  // Kigali City
  { province: 'Kigali City', district: 'Gasabo', sector: 'Kimihurura', cell: 'Rugando', village: 'Rugando I' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Kimihurura', cell: 'Rugando', village: 'Rugando II' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Kimihurura', cell: 'Rugando', village: 'Rugando III' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Kinyinya', cell: 'Kagugu', village: 'Kagugu I' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Kinyinya', cell: 'Kagugu', village: 'Kagugu II' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Remera', cell: 'Kisimenti', village: 'Kisimenti I' },
  { province: 'Kigali City', district: 'Gasabo', sector: 'Remera', cell: 'Kisimenti', village: 'Kisimenti II' },
  
  { province: 'Kigali City', district: 'Kicukiro', sector: 'Niboye', cell: 'Kabuga', village: 'Kabuga I' },
  { province: 'Kigali City', district: 'Kicukiro', sector: 'Niboye', cell: 'Kabuga', village: 'Kabuga II' },
  { province: 'Kigali City', district: 'Kicukiro', sector: 'Gatenga', cell: 'Gatenga', village: 'Gatenga I' },
  { province: 'Kigali City', district: 'Kicukiro', sector: 'Gatenga', cell: 'Gatenga', village: 'Gatenga II' },
  
  { province: 'Kigali City', district: 'Nyarugenge', sector: 'Nyamirambo', cell: 'Rwezamenyo', village: 'Rwezamenyo I' },
  { province: 'Kigali City', district: 'Nyarugenge', sector: 'Nyamirambo', cell: 'Rwezamenyo', village: 'Rwezamenyo II' },
  { province: 'Kigali City', district: 'Nyarugenge', sector: 'Kimisagara', cell: 'Kimisagara', village: 'Kimisagara I' },
  { province: 'Kigali City', district: 'Nyarugenge', sector: 'Kimisagara', cell: 'Kimisagara', village: 'Kimisagara II' },

  // Southern Province
  { province: 'Southern Province', district: 'Huye', sector: 'Ngoma', cell: 'Ngoma', village: 'Ngoma I' },
  { province: 'Southern Province', district: 'Huye', sector: 'Ngoma', cell: 'Ngoma', village: 'Ngoma II' },
  { province: 'Southern Province', district: 'Huye', sector: 'Tumba', cell: 'Tumba', village: 'Tumba I' },
  { province: 'Southern Province', district: 'Huye', sector: 'Tumba', cell: 'Tumba', village: 'Tumba II' },
  
  { province: 'Southern Province', district: 'Muhanga', sector: 'Muhanga', cell: 'Muhanga', village: 'Muhanga I' },
  { province: 'Southern Province', district: 'Muhanga', sector: 'Muhanga', cell: 'Muhanga', village: 'Muhanga II' },
  { province: 'Southern Province', district: 'Muhanga', sector: 'Nyamabuye', cell: 'Nyamabuye', village: 'Nyamabuye I' },

  // Eastern Province
  { province: 'Eastern Province', district: 'Rwamagana', sector: 'Rwamagana', cell: 'Rwamagana', village: 'Rwamagana I' },
  { province: 'Eastern Province', district: 'Rwamagana', sector: 'Rwamagana', cell: 'Rwamagana', village: 'Rwamagana II' },
  { province: 'Eastern Province', district: 'Rwamagana', sector: 'Nyakariro', cell: 'Nyakariro', village: 'Nyakariro I' },
  
  { province: 'Eastern Province', district: 'Kayonza', sector: 'Kayonza', cell: 'Kayonza', village: 'Kayonza I' },
  { province: 'Eastern Province', district: 'Kayonza', sector: 'Kayonza', cell: 'Kayonza', village: 'Kayonza II' },

  // Western Province
  { province: 'Western Province', district: 'Karongi', sector: 'Bwishyura', cell: 'Bwishyura', village: 'Bwishyura I' },
  { province: 'Western Province', district: 'Karongi', sector: 'Bwishyura', cell: 'Bwishyura', village: 'Bwishyura II' },
  { province: 'Western Province', district: 'Karongi', sector: 'Rugabano', cell: 'Rugabano', village: 'Rugabano I' },
  
  { province: 'Western Province', district: 'Rusizi', sector: 'Kamembe', cell: 'Kamembe', village: 'Kamembe I' },
  { province: 'Western Province', district: 'Rusizi', sector: 'Kamembe', cell: 'Kamembe', village: 'Kamembe II' },

  // Northern Province
  { province: 'Northern Province', district: 'Musanze', sector: 'Musanze', cell: 'Musanze', village: 'Musanze I' },
  { province: 'Northern Province', district: 'Musanze', sector: 'Musanze', cell: 'Musanze', village: 'Musanze II' },
  { province: 'Northern Province', district: 'Musanze', sector: 'Cyuve', cell: 'Cyuve', village: 'Cyuve I' },
  
  { province: 'Northern Province', district: 'Gicumbi', sector: 'Byumba', cell: 'Byumba', village: 'Byumba I' },
  { province: 'Northern Province', district: 'Gicumbi', sector: 'Byumba', cell: 'Byumba', village: 'Byumba II' },
];

export const populateRwandaLocations = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Starting to populate Rwanda locations...');
    
    // First, check if data already exists
    const { data: existingData, error: checkError } = await supabase
      .from('rwanda_locations')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingData && existingData.length > 0) {
      console.log('Rwanda locations already populated');
      return { success: true };
    }

    // Insert the location data
    const { error: insertError } = await supabase
      .from('rwanda_locations')
      .insert(rwandaLocationsData);

    if (insertError) {
      throw insertError;
    }

    console.log(`Successfully inserted ${rwandaLocationsData.length} Rwanda locations`);
    return { success: true };

  } catch (error: any) {
    console.error('Error populating Rwanda locations:', error);
    return { success: false, error: error.message };
  }
};

// Auto-populate when this module is imported in development
if (typeof window !== 'undefined') {
  populateRwandaLocations().then(result => {
    if (result.success) {
      console.log('Rwanda locations populated successfully');
    } else {
      console.error('Failed to populate Rwanda locations:', result.error);
    }
  });
}
