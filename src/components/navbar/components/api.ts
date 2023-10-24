import axios from 'axios';

export interface UserTypeFormInter {
  value: number;
  name: string;
}

export const userType: UserTypeFormInter[] = [
  {
    value: 0,
    name: '外部',
  },
  {
    value: 1,
    name: '开发',
  },
  {
    value: 2,
    name: '测试',
  },
  {
    value: 3,
    name: '应用',
  },
  {
    value: 4,
    name: '领导',
  },
  {
    value: 5,
    name: '其他',
  },
];

export interface ProductsFormInter {
  id: number;
  name: string;
  description: string;
  version: string;
  startTime: string;
  endTime: string;
}

export const products: ProductsFormInter[] = [
  {
    id: 2001,
    name: 'ZJRoad',
    description: 'BIM中心道路产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.9510171',
    endTime: '2023-07-14T11:49:26.9581874',
  },
  {
    id: 2002,
    name: 'CNCCBIM',
    description: '一公院道路产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.9582412',
    endTime: '2023-07-14T11:49:26.9582416',
  },
  {
    id: 2003,
    name: 'ZJBridge',
    description: 'BIM中心桥梁产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.9582424',
    endTime: '2023-09-14T11:49:26.9582424',
  },
  {
    id: 2004,
    name: 'ZJGeo',
    description: 'BIM中心地质产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.9582427',
    endTime: '2023-10-14T11:49:26.9582427',
  },
  {
    id: 2005,
    name: 'ZJTunnel',
    description: '二公院隧道产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.958243',
    endTime: '2023-11-14T11:49:26.9582431',
  },
  {
    id: 2006,
    name: 'ZJLim',
    description: 'BIM中心景观产品',
    version: '1.0',
    startTime: '2023-06-14T11:49:26.958244',
    endTime: '2023-12-14T11:49:26.9582441',
  },
];

export interface AddUserFormInter {
  Email: string;
  Name: string;
  Company: string;
  Products: number[];
  UserType: string;
  Days: '';
}

export function addUser(params: any) {
  return axios.post('/api/UserAdd', params);
}

export function viewUser(params: any) {
  return axios.get('/api/DeserializeFromXmlUser', { params });
}
