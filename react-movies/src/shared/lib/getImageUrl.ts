import { apiConfig } from "@/shared/config/apiConfig";

export const getImageUrl = (path: string) =>
  `${apiConfig.baseURL}${path}`;