import axios from "axios";
import { HOST } from "../utlis/constant";

export const apiClient = axios.create({ baseURL: HOST });
