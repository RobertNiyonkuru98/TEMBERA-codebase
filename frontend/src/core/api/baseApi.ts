import { requestHelper } from "./requestHelper";
import { API_BASE_URL, getAuthHeaders } from "./config";

export class BaseApiService<T, BackendT> {
  protected endpoint: string;
  protected mapper: (data: BackendT) => T;

  constructor(
    endpoint: string,
    mapper: (data: BackendT) => T
  ) {
    this.endpoint = endpoint;
    this.mapper = mapper;
  }

  protected getUrl(path: string = "") {
    // endpoint usually starts with a slash, e.g., "/api/companies"
    return `${API_BASE_URL}${this.endpoint}${path}`;
  }

  async getAll(token?: string, query?: string): Promise<T[]> {
    const url = this.getUrl(query ? `?${query}` : "");
    const parsed = await requestHelper<BackendT[]>({
      method: "GET",
      url,
      token,
      headers: token ? getAuthHeaders(token) : undefined,
    });
    return parsed.data.map(this.mapper);
  }

  async getById(id: string, token?: string): Promise<T> {
    const parsed = await requestHelper<BackendT>({
      method: "GET",
      url: this.getUrl(`/${id}`),
      token,
      headers: token ? getAuthHeaders(token) : undefined,
    });
    return this.mapper(parsed.data);
  }

  async create<CreatePayload>(
    payload: CreatePayload,
    token: string,
    isJson = true
  ): Promise<T> {
    const parsed = await requestHelper<BackendT>({
      method: "POST",
      url: this.getUrl(),
      token,
      headers: isJson ? getAuthHeaders(token) : { Authorization: `Bearer ${token}` },
      data: payload,
    });
    return this.mapper(parsed.data);
  }

  async update<UpdatePayload>(
    id: string,
    payload: UpdatePayload,
    token: string,
    isJson = true
  ): Promise<T> {
    const parsed = await requestHelper<BackendT>({
      method: "PUT",
      url: this.getUrl(`/${id}`),
      token,
      headers: isJson ? getAuthHeaders(token) : { Authorization: `Bearer ${token}` },
      data: payload,
    });
    return this.mapper(parsed.data);
  }

  async delete(id: string, token: string): Promise<void> {
    await requestHelper<null>({
      method: "DELETE",
      url: this.getUrl(`/${id}`),
      token,
      headers: getAuthHeaders(token),
    });
  }
}
