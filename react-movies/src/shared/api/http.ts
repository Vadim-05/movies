import axios from "axios";
import { apiConfig } from "@/shared/config/apiConfig";

export const api = axios.create({
  baseURL: apiConfig.baseURL,
  withCredentials: true,
});