// Tipos
export type TProfession = {
  id: number;
  name: string;
};
export type Tbenefit = {
  id: number;
  title: string;
  description: string;
};
export type TLabel = {
  id: string;
  name: string;
  background_color: string;
  text_color: string;
};

export type TSubCategory = {
  id: number | null;
  name: string;
  labels: TLabel[];
};
type TSpecification = {
  title: string;
  description: string;
};
type TOption = {
  id: string;
  filter_id: string;
  option_name: string;
};
type TFile = {
  id: number;
  file_type: string;
  file_url: string;
  file_label: string;
  show: number;
};
type TPhotos = {
  id: number;
  photo_url: string;
};
export type TDistrict = {
  id: number;
  name: string;
  province_id: number;
  province: TProvince;
};
export type TProvince = {
  id: number;
  name: string;
  department_id: number;
  districts: TDistrict[];
};
export type TDepartment = {
  id: number;
  name: string;
  provinces: TProvince[];
};
export type TIngredient = {
  ingredient: string;
  percentage: string;
};
export type TExternType = {
  id: number;
  name: string;
};
export type TCategoryLimits = {
  id: number;
  plan_id: string;
  category_id: string;
  product_limit: string;
};

// Interfaces

export interface IBranchData {
  department: string;
  province: string;
  district: string;
  address: string;
  name: string;
  phone: string;
  email: string;
}

export interface ICompany {
  id: string;
  branches_info: IBranchData[] | null;
  business_field_id: string;
  description: string;
  email: string;
  logo: string;
  name: string;
  phone_number: string;
  ruc: string;
  status: boolean;
  website: string;
  schedule: string;
  business_hours: string;
  full_name: string;
  owner_full_name: string;
}

export interface IUser {
  id: string;
  full_name: string;
  profession_id: string;
  phone_number: string;
  email: string;
  company_id: string | null;
  work_for_company: string;
  type: string;
  status: string;
  company: ICompany;
  photo: string;
  extern_types: TExternType[];
}

export interface INotification {
  id: number;
  message: string;
  url: string;
  status: "read" | "unread";
  type: string;
  id_item: string;
}
export interface IPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  featured_products: number;
  events_limit: number;
  news_limit: number;
  products_limit: number;
  jobs_limit: number;
  benefits: Tbenefit[];
  banners_home_limit: number;
  banners_intern_limit: number;
  banners_product_limit: number;
  show_product_specifications: boolean;
  show_supplier_description: boolean;
  supplier_branches_limit: number;
  show_in_directory: boolean;
  related_products_limit: number;
  show_phone: boolean;
  show_email: boolean;
  show_website: boolean;
  category_limits: TCategoryLimits[];
}
export interface ISubscription {
  company: ICompany;
  company_id: number;
  end_date: Date | string;
  id: number;
  is_active: boolean;
  plan: IPlan;
  plan_id: number;
  start_date: Date | string;
}
export interface IFilter {
  id: number;
  icon: string | null;
  name: string;
  category_id: string;
  options: TOption[];
}

export interface ICategory {
  id: number;
  name: string;
  icon: string | null;
  labels: TLabel[];
  type: string;
  filters: IFilter[] | null;
  files: TFile[] | null;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  status: string;
  labels: TLabel[];
  photos: TPhotos[];
  companies: ICompany[];
  category: ICategory;
  files: TFile[];
  featured_product: boolean;
  specifications: TSpecification[];
  filter_options: TOption[];
  senasa_title: string;
  senasa_number: string;
  senasa_url: string;
  chemical_classification_code: string;
  chemical_classification_title: string;
  chemical_classification_url: string;
  ingredients: TIngredient[];
  toxicological_category: string;
}

export interface IEvents {
  id: number;
  company_id: number;
  name: string;
  description: string;
  date: Date | string;
  end_date: Date | string;
  location: string | null;
  photos: TPhotos[];
  content: string;
  status: string;
  type: string;
  company: ICompany;
  updated_at: Date | string;
  link: string;
  extern_user_id: number;
  extern_user: IUser;
}
export interface INews {
  id: string;
  company: ICompany;
  company_id: string;
  title: string;
  description: string;
  content: string;
  published_at: Date | string;
  photos: TPhotos[];
  status: string;
  updated_at: Date | string;
  link: string;
  extern_user_id: number;
  extern_user: IUser;
}
export interface ICourse {
  id: string;
  title: string;
  company_id: string;
  published_at: Date | string;
  photos: TPhotos[];
  description: string;
  content: string;
  modality: string;
  hours: string;
  cost: string;
  start_date: Date | string;
  phone_number: string;
  company: ICompany;
  updated_at: Date | string;
  link: string;
  email: string;
  extern_user_id: number;
  extern_user: IUser;
}

// export interface IExternUser {
//   id: string;

// }

export interface IHelpCompany {
  whatsapp_link: string;
  help_phone_number: string;
  help_landline_number: string;
  help_address: string;
  help_email_contact: string;
  help_email_suscriptions: string;
  help_email_courses: string;
  help_email_support: string;
  company_id: string;
  id: number;
  link_web: string;
  link_admin_app: string;
  fb_link: string;
  ig_link: string;
  lkdin_link: string;
}

export interface IAds {
  id: string;
  banner_url: string;
  company_id: number;
  type: string;
  product_id: string;
  // home_ads: Tphotos[];
}

export interface ICrops {
  id: string;
  name: string;
  icon_url: string;
}
export interface IPublisher {
  id: string;
  name: string;
  permisses: string[];
}

export interface IAdviser {
  id: number;
  names: string;
  last_names: string;
  banner_url: string;
  photo_url: string;
  education_background: string[];
  nationality: string;
  specialty: string;
  availability: string;
  experience_years: number;
  description: string;
  crops: ICrops[];
  email_1: string;
  email_2: string;
  phone_number: string;
  linkedin: string;
  web: string;
  user: IUser;
}
export interface IJobs {
  id: number;
  title: string;
  modality: string;
  type: string;
  content: string;
  salary: string;
  address: string;
  email: string;
  link: string;
  company_id: number;
  company: ICompany;
  extern_user_id: number;
  extern_user: IUser;
}
