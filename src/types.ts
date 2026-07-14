/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProvinceType = 
  | 'Banten' 
  | 'DKI Jakarta' 
  | 'Jawa Barat' 
  | 'Jawa Tengah' 
  | 'DI Yogyakarta' 
  | 'Jawa Timur';

export type CategoryType = 
  | 'Alam' 
  | 'Sejarah & Budaya' 
  | 'Taman Rekreasi' 
  | 'Kuliner';

export interface Destination {
  id: string;
  name: string;
  province: ProvinceType;
  city: string;
  category: CategoryType;
  description: string;
  imageUrl: string;
  entranceFee: number; // in IDR
  rating: number; // 1-5
  reviewsCount: number;
  featured: boolean;
  locationCoordinates: string;
  googleMapsUrl?: string;
  gallery?: string[];
  bestTimeToVisit: string;
  recommendedTips: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  readTime: string;
  tags: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  nickname: string;
}

export interface AdminSession {
  loggedIn: boolean;
  nickname?: string;
}
