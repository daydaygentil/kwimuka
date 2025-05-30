
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useRwandaLocations from '@/hooks/useRwandaLocations';

export interface LocationSelection {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface RwandaLocationSelectorProps {
  label: string;
  value: LocationSelection;
  onChange: (location: LocationSelection) => void;
  required?: boolean;
}

const RwandaLocationSelector: React.FC<RwandaLocationSelectorProps> = ({
  label,
  value,
  onChange,
  required = false
}) => {
  const { hierarchy, isLoading, error } = useRwandaLocations();

  const handleProvinceChange = (province: string) => {
    onChange({
      province,
      district: '',
      sector: '',
      cell: '',
      village: ''
    });
  };

  const handleDistrictChange = (district: string) => {
    onChange({
      ...value,
      district,
      sector: '',
      cell: '',
      village: ''
    });
  };

  const handleSectorChange = (sector: string) => {
    onChange({
      ...value,
      sector,
      cell: '',
      village: ''
    });
  };

  const handleCellChange = (cell: string) => {
    onChange({
      ...value,
      cell,
      village: ''
    });
  };

  const handleVillageChange = (village: string) => {
    onChange({
      ...value,
      village
    });
  };

  const getFullAddress = () => {
    const parts = [value.village, value.cell, value.sector, value.district, value.province].filter(Boolean);
    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        <p className="text-sm text-gray-500">Loading Rwanda locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Failed to load locations. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Province Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Province</label>
        <Select value={value.province} onValueChange={handleProvinceChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            {hierarchy.provinces.map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District Selection */}
      {value.province && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
          <Select value={value.district} onValueChange={handleDistrictChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {(hierarchy.districts[value.province] || []).map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sector Selection */}
      {value.district && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sector</label>
          <Select value={value.sector} onValueChange={handleSectorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {(hierarchy.sectors[value.district] || []).map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Cell Selection */}
      {value.sector && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Cell</label>
          <Select value={value.cell} onValueChange={handleCellChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cell" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {(hierarchy.cells[value.sector] || []).map((cell) => (
                <SelectItem key={cell} value={cell}>
                  {cell}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Village Selection */}
      {value.cell && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Village</label>
          <Select value={value.village} onValueChange={handleVillageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Village" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {(hierarchy.villages[value.cell] || []).map((village) => (
                <SelectItem key={village} value={village}>
                  {village}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Full Address Display */}
      {getFullAddress() && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Full Address:</strong> {getFullAddress()}
          </p>
        </div>
      )}
    </div>
  );
};

export default RwandaLocationSelector;
