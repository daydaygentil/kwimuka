
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  id: string;
  province: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  full_address: string;
}

interface HierarchicalAddressSelectorProps {
  onAddressSelect: (address: string, locationData: Partial<LocationData>) => void;
  placeholder?: string;
  value?: string;
}

const HierarchicalAddressSelector = ({ 
  onAddressSelect, 
  placeholder = "Select address",
  value = ""
}: HierarchicalAddressSelectorProps) => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const { data, error } = await supabase
        .from('rwanda_locations')
        .select('province')
        .order('province');

      if (error) throw error;

      const uniqueProvinces = [...new Set(data.map(item => item.province))];
      setProvinces(uniqueProvinces);
    } catch (error) {
      console.error('Error loading provinces:', error);
      toast({
        title: "Error",
        description: "Failed to load provinces",
        variant: "destructive"
      });
    }
  };

  const loadDistricts = async (province: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rwanda_locations')
        .select('district')
        .eq('province', province)
        .not('district', 'is', null)
        .order('district');

      if (error) throw error;

      const uniqueDistricts = [...new Set(data.map(item => item.district).filter(Boolean))];
      setDistricts(uniqueDistricts);
    } catch (error) {
      console.error('Error loading districts:', error);
      toast({
        title: "Error",
        description: "Failed to load districts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSectors = async (province: string, district: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rwanda_locations')
        .select('sector')
        .eq('province', province)
        .eq('district', district)
        .not('sector', 'is', null)
        .order('sector');

      if (error) throw error;

      const uniqueSectors = [...new Set(data.map(item => item.sector).filter(Boolean))];
      setSectors(uniqueSectors);
    } catch (error) {
      console.error('Error loading sectors:', error);
      toast({
        title: "Error",
        description: "Failed to load sectors",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCells = async (province: string, district: string, sector: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rwanda_locations')
        .select('cell')
        .eq('province', province)
        .eq('district', district)
        .eq('sector', sector)
        .not('cell', 'is', null)
        .order('cell');

      if (error) throw error;

      const uniqueCells = [...new Set(data.map(item => item.cell).filter(Boolean))];
      setCells(uniqueCells);
    } catch (error) {
      console.error('Error loading cells:', error);
      toast({
        title: "Error",
        description: "Failed to load cells",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadVillages = async (province: string, district: string, sector: string, cell: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rwanda_locations')
        .select('village')
        .eq('province', province)
        .eq('district', district)
        .eq('sector', sector)
        .eq('cell', cell)
        .not('village', 'is', null)
        .order('village');

      if (error) throw error;

      const uniqueVillages = [...new Set(data.map(item => item.village).filter(Boolean))];
      setVillages(uniqueVillages);
    } catch (error) {
      console.error('Error loading villages:', error);
      toast({
        title: "Error",
        description: "Failed to load villages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict('');
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    setDistricts([]);
    setSectors([]);
    setCells([]);
    setVillages([]);
    
    if (province) {
      loadDistricts(province);
    }
    updateSelectedAddress(province, '', '', '', '');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedSector('');
    setSelectedCell('');
    setSelectedVillage('');
    setSectors([]);
    setCells([]);
    setVillages([]);
    
    if (district && selectedProvince) {
      loadSectors(selectedProvince, district);
    }
    updateSelectedAddress(selectedProvince, district, '', '', '');
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
    setSelectedCell('');
    setSelectedVillage('');
    setCells([]);
    setVillages([]);
    
    if (sector && selectedProvince && selectedDistrict) {
      loadCells(selectedProvince, selectedDistrict, sector);
    }
    updateSelectedAddress(selectedProvince, selectedDistrict, sector, '', '');
  };

  const handleCellChange = (cell: string) => {
    setSelectedCell(cell);
    setSelectedVillage('');
    setVillages([]);
    
    if (cell && selectedProvince && selectedDistrict && selectedSector) {
      loadVillages(selectedProvince, selectedDistrict, selectedSector, cell);
    }
    updateSelectedAddress(selectedProvince, selectedDistrict, selectedSector, cell, '');
  };

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    updateSelectedAddress(selectedProvince, selectedDistrict, selectedSector, selectedCell, village);
  };

  const updateSelectedAddress = (province: string, district: string, sector: string, cell: string, village: string) => {
    const parts = [province, district, sector, cell, village].filter(Boolean);
    const fullAddress = parts.join(', ');
    
    onAddressSelect(fullAddress, {
      province,
      district: district || undefined,
      sector: sector || undefined,
      cell: cell || undefined,
      village: village || undefined
    });
  };

  const displayValue = value || [selectedProvince, selectedDistrict, selectedSector, selectedCell, selectedVillage].filter(Boolean).join(', ') || placeholder;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-left bg-white"
      >
        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        <span className={value || selectedProvince ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue}
        </span>
        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Province Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <select
                value={selectedProvince}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* District Selection */}
            {selectedProvince && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sector Selection */}
            {selectedDistrict && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Select Sector</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Cell Selection */}
            {selectedSector && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cell</label>
                <select
                  value={selectedCell}
                  onChange={(e) => handleCellChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Select Cell</option>
                  {cells.map(cell => (
                    <option key={cell} value={cell}>{cell}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Village Selection */}
            {selectedCell && villages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                <select
                  value={selectedVillage}
                  onChange={(e) => handleVillageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  <option value="">Select Village (Optional)</option>
                  {villages.map(village => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalAddressSelector;
