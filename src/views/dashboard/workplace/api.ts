import axios from 'axios';

export interface UseageParams {
  Companys: string[];
  StartTime: string;
  EndTime: string;
  Statistics: string;
  TimeSelect: string;
  ProductName: string;
  PageIndex?: number;
  PageSize?: number;
  Entity?: string;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  version: string;
}
export interface useageBrowseData {
  id: number;
  productName: string;
  macAdd: number;
  maxOfNode: number;
  sumOfNode: number;
  useCmdCount: number;
  [key: string]: any;
}

export function useageBrowse(params: UseageParams) {
  return axios.post<useageBrowseData>('/api/UseageBrowse', params);
}

export function usageQuery(params: UseageParams) {
  return axios.post('/api/EChartProductUseageBaeChart', params);
}
export function userStatistics(params: UseageParams) {
  return axios.post('/api/UserStatistics', params);
}
export function featureLog(params: UseageParams) {
  return axios.post('/api/CmdStatistics', params);
}
export function getCompanys() {
  return axios.get('/api/Companys');
}
export function getProduct() {
  return axios.get('/api/Products');
}
