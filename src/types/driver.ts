export interface DriverRegistration {
  id: string;
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  vehicleType: 'motorbike' | 'car' | 'truck' | 'van';
  vehicleSize: 'small' | 'medium' | 'large';
  plateNumber: string;
  workingLocation: {
    province: string;
    district: string;
    sector: string;
  };
  registrationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  statusComment?: string;
  
  // File paths in storage
  profilePhotoUrl: string;
  vehiclePhotoUrl: string;
  platePhotoUrl: string;
  licenceFrontUrl: string;
  licenceBackUrl: string;
  insuranceDocUrl?: string;
  
  // Metadata
  smsStatus?: 'sent' | 'failed';
  smsError?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export const VEHICLE_TYPES = ['motorbike', 'car', 'truck', 'van'] as const;
export const VEHICLE_SIZES = ['small', 'medium', 'large'] as const;
