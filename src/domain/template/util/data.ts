import { CommentInformation } from '../dto/response/CommentInformation';
import { TemplateContent } from '../dto/response/TemplateContent';

export const sortCompanyPublic = (data: any[]): TemplateContent[] | CommentInformation[] => {
  return data.map((item) => {
    if (Number(item.getCompanyPublic()) === 0) {
      item.changeCompany(null);
    }
    return item;
  });
};

export const sortCompanyPublicForObject = (data: any[]): any[] => {
  return data.map((item) => {
    if (Number(item.companyPublic) === 0) {
      item.changeCompany(null);
    }
    return item;
  });
};

export const sortCompanyPublicArray = (datas: TemplateContent[][]): TemplateContent[][] => {
  return datas.map((items) => {
    return items.map((item) => {
      if (Number(item.getCompanyPublic()) === 0) {
        item.changeCompany(null);
      }
      return item;
    });
  });
};

export const sortCompanyPublicArrayForObject = (datas: any[][]): any[][] => {
  return datas.map((items) => {
    console.log(items);
    return items.map((item) => {
      if (Number(item.companyPublic) === 0) {
        item.changeCompany(null);
      }
      return item;
    });
  });
};
