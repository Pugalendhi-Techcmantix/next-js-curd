import type { DefaultOptionType } from "antd/es/select";
export const APP_NAME = "Inventory Management";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;


export const toSelectOptions = (
  data: any[] = [],
  valueKey = "id",
  labelKey = "name"
): DefaultOptionType[] => {
  return data.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
};


export const formatDate = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "-";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateTime = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "-";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};