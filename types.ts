
export type UserRole = 'admin' | 'employee';

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  latitude: number;
  longitude: number;
  allowedRadius: number; // in meters
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  companyId: string;
  department?: string;
  employeeId?: string;
  createdAt: any;
}

export type RecordType = 'entry' | 'pause_start' | 'pause_end' | 'exit';

export interface PointRecord {
  id: string;
  userId: string;
  userName: string;
  companyId: string;
  timestamp: any;
  type: RecordType;
  location: {
    lat: number;
    lng: number;
  };
  selfieUrl: string;
  ip: string;
  deviceInfo: string;
  status: 'valid' | 'warning' | 'rejected';
  distanceFromOffice: number; // in meters
}

export interface SystemStats {
  totalEmployees: number;
  pointsToday: number;
  pendingAdjustments: number;
  lateArrivals: number;
}
