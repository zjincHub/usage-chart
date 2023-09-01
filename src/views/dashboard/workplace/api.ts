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
  [key: string]: any;
}
export interface Product {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  version: string;
}
export interface UseageBrowseData {
  id: number;
  productName: string;
  macAdd: number;
  maxOfNode: number;
  sumOfNode: number;
  useCmdCount: number;
  [key: string]: any;
}

export interface DosageQueryData {
  id: number;
  name: string;
  value: number;
  valueCmdCount: number;
  [key: string]: any;
}

export interface UserStatisticsData {
  cmdCount: number;
  company: string;
  computerName: string;
  mac: string;
  machineId: string;
  userName: string;
  [key: string]: any;
}

export interface FunctionRecordData {
  cmdName: string;
  cmdSum: number;
  company: null;
  [key: string]: any;
}

export interface DropdownListData {
  id: number;
  name: string;
  description: string;
  version: string;
  startTime: string;
  endTime: string;
}

export function useageBrowse(params: UseageParams) {
  return axios.post<UseageBrowseData>('/api/UseageBrowse', params);
}
export function usageQuery(params: UseageParams) {
  return axios.post<DosageQueryData>(
    '/api/EChartProductUseageBaeChart',
    params
  );
}
export function userStatistics(params: UseageParams) {
  return axios.post<UserStatisticsData>('/api/UserStatistics', params);
}
export function featureLog(params: UseageParams) {
  return axios.post<FunctionRecordData>('/api/CmdStatistics', params);
}
export function getCompanys() {
  return axios.get<string[]>('/api/Companys');
}
export function getProduct() {
  return axios.get<DropdownListData>('/api/Products');
}
