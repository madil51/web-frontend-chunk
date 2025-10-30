import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JunkRemovalRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  title: string;
  description: string;
  pickupAddress: string;
  pickupCoordinates?: {
    latitude: number;
    longitude: number;
  };
  scheduledTime: Date;
  estimatedDuration: number;
  estimatedWeight: number;
  estimatedValue: number;
  photos: string[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'residential' | 'commercial' | 'construction' | 'yard_waste' | 'electronics';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  specialInstructions?: string;
}

export interface CreateRequestData {
  title: string;
  description: string;
  pickupAddress: string;
  scheduledTime: Date;
  estimatedWeight: number;
  type: 'residential' | 'commercial' | 'construction' | 'yard_waste' | 'electronics';
  photos: string[];
  specialInstructions?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface RequestEstimate {
  baseCost: number;
  weightCost: number;
  distanceCost: number;
  typeMultiplier: number;
  priorityMultiplier: number;
  totalCost: number;
  confidence: number;
  breakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  preferredPaymentMethod?: string;
  totalRequests: number;
  completedRequests: number;
  totalSpent: number;
  averageRating: number;
  memberSince: Date;
  lastRequestDate?: Date;
}

export interface CustomerAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = '/api/customer';

  constructor(private http: HttpClient) {}

  /**
   * Create a new junk removal request
   */
  createRequest(requestData: CreateRequestData): Observable<JunkRemovalRequest> {
    return this.http.post<JunkRemovalRequest>(`${this.apiUrl}/requests`, requestData);
  }

  /**
   * Get all requests for the current customer
   */
  getMyRequests(status?: string, page: number = 1, limit: number = 10): Observable<{
    requests: JunkRemovalRequest[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = {
      ...(status && { status }),
      page: page.toString(),
      limit: limit.toString()
    };

    return this.http.get<{
      requests: JunkRemovalRequest[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.apiUrl}/requests`, { params });
  }

  /**
   * Get a specific request by ID
   */
  getRequest(requestId: string): Observable<JunkRemovalRequest> {
    return this.http.get<JunkRemovalRequest>(`${this.apiUrl}/requests/${requestId}`);
  }

  /**
   * Cancel a request
   */
  cancelRequest(requestId: string, reason?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}/cancel`, { reason });
  }

  /**
   * Get request estimate based on photos and details
   */
  getEstimate(requestData: Partial<CreateRequestData>): Observable<RequestEstimate> {
    return this.http.post<RequestEstimate>(`${this.apiUrl}/requests/estimate`, requestData);
  }

  /**
   * Get AI-powered estimate from image analysis
   */
  getAIEstimate(imageUrls: string[], description: string): Observable<RequestEstimate> {
    return this.http.post<RequestEstimate>(`${this.apiUrl}/requests/ai-estimate`, {
      images: imageUrls,
      description
    });
  }

  /**
   * Get customer profile
   */
  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}/profile`);
  }

  /**
   * Update customer profile
   */
  updateProfile(profileData: Partial<CustomerProfile>): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(`${this.apiUrl}/profile`, profileData);
  }

  /**
   * Add a new address
   */
  addAddress(address: Omit<CustomerAddress, 'id'>): Observable<CustomerAddress> {
    return this.http.post<CustomerAddress>(`${this.apiUrl}/addresses`, address);
  }

  /**
   * Update an existing address
   */
  updateAddress(addressId: string, address: Partial<CustomerAddress>): Observable<CustomerAddress> {
    return this.http.put<CustomerAddress>(`${this.apiUrl}/addresses/${addressId}`, address);
  }

  /**
   * Delete an address
   */
  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/addresses/${addressId}`);
  }

  /**
   * Set default address
   */
  setDefaultAddress(addressId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/addresses/${addressId}/default`, {});
  }

  /**
   * Get all addresses
   */
  getAddresses(): Observable<CustomerAddress[]> {
    return this.http.get<CustomerAddress[]>(`${this.apiUrl}/addresses`);
  }

  /**
   * Rate a completed job
   */
  rateDriver(requestId: string, rating: number, review?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests/${requestId}/rate`, {
      rating,
      review
    });
  }

  /**
   * Get request history with statistics
   */
  getRequestHistory(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    type?: string;
  }): Observable<{
    requests: JunkRemovalRequest[];
    statistics: {
      totalRequests: number;
      completedRequests: number;
      totalSpent: number;
      averageCost: number;
      mostCommonType: string;
    }
  }> {
    const params = {
      ...(filters?.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters?.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type })
    };

    return this.http.get<{
      requests: JunkRemovalRequest[];
      statistics: {
        totalRequests: number;
        completedRequests: number;
        totalSpent: number;
        averageCost: number;
        mostCommonType: string;
      }
    }>(`${this.apiUrl}/requests/history`, { params });
  }

  /**
   * Get favorite drivers (drivers customer has worked with before)
   */
  getFavoriteDrivers(): Observable<{
    driverId: string;
    driverName: string;
    driverPhone: string;
    rating: number;
    jobsCompleted: number;
    lastJobDate: Date;
  }[]> {
    return this.http.get<{
      driverId: string;
      driverName: string;
      driverPhone: string;
      rating: number;
      jobsCompleted: number;
      lastJobDate: Date;
    }[]>(`${this.apiUrl}/favorite-drivers`);
  }

  /**
   * Request a specific driver for a job
   */
  requestSpecificDriver(requestId: string, driverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requests/${requestId}/request-driver`, {
      driverId
    });
  }

  /**
   * Get payment history
   */
  getPaymentHistory(page: number = 1, limit: number = 10): Observable<{
    payments: {
      id: string;
      requestId: string;
      amount: number;
      status: string;
      paymentMethod: string;
      createdAt: Date;
      description: string;
    }[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = {
      page: page.toString(),
      limit: limit.toString()
    };

    return this.http.get<{
      payments: {
        id: string;
        requestId: string;
        amount: number;
        status: string;
        paymentMethod: string;
        createdAt: Date;
        description: string;
      }[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.apiUrl}/payments/history`, { params });
  }

  /**
   * Add special instructions to a request
   */
  addSpecialInstructions(requestId: string, instructions: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}/instructions`, {
      specialInstructions: instructions
    });
  }

  /**
   * Reschedule a request
   */
  rescheduleRequest(requestId: string, newScheduledTime: Date, reason?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${requestId}/reschedule`, {
      newScheduledTime,
      reason
    });
  }

  /**
   * Get customer dashboard statistics
   */
  getDashboardStats(): Observable<{
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    totalSpent: number;
    averageRating: number;
    favoriteDriver?: {
      driverId: string;
      driverName: string;
      rating: number;
      jobsCompleted: number;
    };
    recentActivity: {
      type: string;
      description: string;
      timestamp: Date;
    }[];
  }> {
    return this.http.get<{
      totalRequests: number;
      completedRequests: number;
      pendingRequests: number;
      totalSpent: number;
      averageRating: number;
      favoriteDriver?: {
        driverId: string;
        driverName: string;
        rating: number;
        jobsCompleted: number;
      };
      recentActivity: {
        type: string;
        description: string;
        timestamp: Date;
      }[];
    }>(`${this.apiUrl}/dashboard/stats`);
  }
}