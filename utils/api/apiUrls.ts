// const BASE_URL = 'https://pevperu-server-production.up.railway.app/api/V1';

export const BASE_URL = "https://pevperu-server.jocargames.com/api/V1";
// export const BASE_URL = "http://127.0.0.1:8001/api/V1";

export const pagination = (page: number, per_page: number) => {
  return `per_page=${per_page}&page=${page}`;
};

export const apiUrls = {
  admin: {
    approve: (model: string, id: string) =>
      `${BASE_URL}/approve/${model}/${id}`,
    disapprove: (model: string, id: string) =>
      `${BASE_URL}/disapprove/${model}/${id}`,
    pending: (model: string, id: string) =>
      `${BASE_URL}/pending/${model}/${id}`,
    suspend: (model: string, id: string) =>
      `${BASE_URL}/suspend/${model}/${id}`,
  },
  auth: {
    register: `${BASE_URL}/auth/register`,
    registerWithCompany: `${BASE_URL}/auth/register-with-company`,
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/logout`,
    me: `${BASE_URL}/me`,
    refresh: `${BASE_URL}/refresh`,
    expoToken:  `${BASE_URL}/update-expo-token`,
  },
  profession: {
    create: `${BASE_URL}/professions`,
    getAll: `${BASE_URL}/professions`,
    getOne: (id: string) => `${BASE_URL}/professions/${id}`,
    update: (id: string) => `${BASE_URL}/professions/${id}`,
    delete: (id: string) => `${BASE_URL}/professions/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/professions?per_page=${per_page}&page=${page}`,
  },
  businessField: {
    create: `${BASE_URL}/business-fields`,
    getAll: `${BASE_URL}/business-fields`,
    getOne: (id: string) => `${BASE_URL}/business-fields/${id}`,
    update: (id: string) => `${BASE_URL}/business-fields/${id}`,
    delete: (id: string) => `${BASE_URL}/business-fields/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/business-fields?per_page=${per_page}&page=${page}`,
  },
  password: {
    forgotPassword: `${BASE_URL}/password/recovery`,
    resetPassword: `${BASE_URL}/password/reset`,
  },
  user: {
    create: `${BASE_URL}/user`,
    getAll: `${BASE_URL}/user`,
    getOne: (id: string) => `${BASE_URL}/user/${id}`,
    update: (id: string) => `${BASE_URL}/user/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/user/${id}`,
    password: (id: string) => `${BASE_URL}/users/${id}/change-password`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/user?per_page=${per_page}&page=${page}`,
  },
  company: {
    create: `${BASE_URL}/companies`,
    getAll: `${BASE_URL}/companies`,
    getOne: (id: string) => `${BASE_URL}/companies/${id}`,
    update: (id: string) => `${BASE_URL}/companies/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/companies/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/companies?per_page=${per_page}&page=${page}`,
  },
  product: {
    create: `${BASE_URL}/products`,
    getAll: `${BASE_URL}/products`,
    getOne: (id: string) => `${BASE_URL}/products/${id}`,
    update: (id: string) => `${BASE_URL}/products/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/products/${id}`,
    pendingProducts: `${BASE_URL}/pending-products`,
    myProducts: (companyId: string) =>
      `${BASE_URL}/companies/${companyId}/product`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/products?per_page=${per_page}&page=${page}`,
    makeFeatured: (id: string) => `${BASE_URL}/products/${id}/make-featured`,
    removeFeatured: (id: string) =>
      `${BASE_URL}/products/${id}/remove-featured`,
    linkCompany: (id: string) => `${BASE_URL}/products/${id}/link-company`,
    byCategory: (id: string) => `${BASE_URL}/categories/${id}/products`,
    featuredProduct: (id: string, number: number) =>
      `${BASE_URL}/categories/${id}/products/featured-approved?number=${number}`,
    searchProductByCompany: `${BASE_URL}/products/by-companies`,
    searchProductByLabels: `${BASE_URL}/products/by-labels`,
  },
  label: {
    create: `${BASE_URL}/labels`,
    getAll: `${BASE_URL}/labels`,
    getOne: (id: string) => `${BASE_URL}/labels/${id}`,
    update: (id: string) => `${BASE_URL}/labels/${id}`,
    delete: (id: string) => `${BASE_URL}/labels/${id}`,
  },
  category: {
    create: `${BASE_URL}/categories`,
    getAll: `${BASE_URL}/categories`,
    getOne: (id: string) => `${BASE_URL}/categories/${id}`,
    update: (id: string) => `${BASE_URL}/categories/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/categories/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/categories?per_page=${per_page}&page=${page}`,
  },
  categoryFile: {
    create: `${BASE_URL}/categories-files`,
    getAll: `${BASE_URL}/categories-files`,
    getOne: (id: string) => `${BASE_URL}/categories-files/${id}`,
    update: (id: string) => `${BASE_URL}/categories-files/${id}`,
    delete: (id: string) => `${BASE_URL}/categories-files/${id}`,
  },
  subscription: {
    create: `${BASE_URL}/subscriptions`,
    getAll: `${BASE_URL}/subscriptions`,
    getOne: (id: string) => `${BASE_URL}/subscriptions/${id}`,
    update: (id: string) => `${BASE_URL}/subscriptions/${id}`,
    delete: (id: string) => `${BASE_URL}/subscriptions/${id}`,
    renew: (id: string) => `${BASE_URL}/subscriptions/${id}/renew`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/subscriptions?per_page=${per_page}&page=${page}`,
  },
  event: {
    create: `${BASE_URL}/events`,
    getAll: `${BASE_URL}/events`,
    getOne: (id: string) => `${BASE_URL}/events/${id}`,
    update: (id: string) => `${BASE_URL}/events/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/events/${id}`,
    myEvents: (companyId: string) =>
      `${BASE_URL}/companies/${companyId}/events`,
    myEventsPagination: (companyId: string, page: number, per_page: number) =>
      `${BASE_URL}/companies/${companyId}/events?per_page=${per_page}&page=${page}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/events?per_page=${per_page}&page=${page}`,
    eventsByType: (type: string, page: number, per_page: number) =>
      `${BASE_URL}/events?type=${type}&per_page=${per_page}&page=${page}`,
  },
  news: {
    create: `${BASE_URL}/news`,
    getAll: `${BASE_URL}/news`,
    getOne: (id: string) => `${BASE_URL}/news/${id}`,
    update: (id: string) => `${BASE_URL}/news/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/news/${id}`,
    myNews: (companyid: string) => `${BASE_URL}/companies/${companyid}/news`,
    myNewsPagination: (companyid: string, page: number, per_page: number) =>
      `${BASE_URL}/companies/${companyid}/news?per_page=${per_page}&page=${page}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/news?per_page=${per_page}&page=${page}`,
  },
  courses: {
    create: `${BASE_URL}/courses`,
    getAll: `${BASE_URL}/courses`,
    getOne: (id: string) => `${BASE_URL}/courses/${id}`,
    update: (id: string) => `${BASE_URL}/courses/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/courses/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/courses?per_page=${per_page}&page=${page}`,
  },
  filter: {
    create: `${BASE_URL}/filters`,
    getAll: `${BASE_URL}/filters`,
    getOne: (id: string) => `${BASE_URL}/filters/${id}`,
    update: (id: string) => `${BASE_URL}/filters/${id}?_method=PUT`,
    delete: (id: string) => `${BASE_URL}/filters/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/filters?per_page=${per_page}&page=${page}`,
  },
  plan: {
    create: `${BASE_URL}/plans`,
    getAll: `${BASE_URL}/plans`,
    getOne: (id: string) => `${BASE_URL}/plans/${id}`,
    update: (id: string) => `${BASE_URL}/plans/${id}`,
    delete: (id: string) => `${BASE_URL}/plans/${id}`,
    pagination: (page: number, per_page: number) =>
      `${BASE_URL}/plans?per_page=${per_page}&page=${page}`,
  },
  review: {
    create: `${BASE_URL}/reviews`,
    getAll: `${BASE_URL}/reviews`,
    getOne: (id: string) => `${BASE_URL}/reviews/${id}`,
    update: (id: string) => `${BASE_URL}/reviews/${id}`,
    delete: (id: string) => `${BASE_URL}/reviews/${id}`,
  },
  search: {
    search: `${BASE_URL}/search`,
    globalSearch: `${BASE_URL}/global-search`,
  },
  help: {
    create: `${BASE_URL}/companies-help-modules`,
    getAll: `${BASE_URL}/companies-help-modules`,
    getOne: (id: string) => `${BASE_URL}/companies-help-modules/${id}`,
    update: (id: string) => `${BASE_URL}/companies-help-modules/${id}`,
    delete: (id: string) => `${BASE_URL}/companies-help-modules/${id}`,
  },
  location: {
    department: `${BASE_URL}/departaments`,
    province: (id: string) => `${BASE_URL}/departaments/${id}`,
    district: (id: string) => `${BASE_URL}/provinces/${id}`,
    allDistricts: `${BASE_URL}/districts`,
  },
  notifications: {
    get: `${BASE_URL}/notifications`,
    read: (id: string) => `${BASE_URL}/notifications/${id}/read`,
    observation: (id: string) => `${BASE_URL}/notifications/${id}/observation`,
  },
  product_file:{
    getAll: `${BASE_URL}/product-files`,
    delete: (id: string) => `${BASE_URL}/product-files/${id}`,
    update: (id: string) => `${BASE_URL}/product-files/${id}/approve`,
  },
};
