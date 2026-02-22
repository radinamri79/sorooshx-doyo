import {
  AuthTokens,
  User,
  Provider,
  ProviderDetail,
  ServiceCategory,
  Order,
  OrderDetail,
  Conversation,
  Message,
  Review,
  Notification,
  PaginatedResponse,
  ChatRequest,
  ChatResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";
const RAG_URL = process.env.NEXT_PUBLIC_RAG_URL || "http://localhost/rag";

function getTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("auth-storage");
  if (!stored) return null;
  try {
    const data = JSON.parse(stored);
    return data.state?.tokens || null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (tokens?.access) {
    headers["Authorization"] = `Bearer ${tokens.access}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ access: string; refresh: string; user: User }>(
      `${API_URL}/auth/login/`,
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  register: (data: { email: string; username: string; password1: string; password2: string }) =>
    apiFetch<{ access: string; refresh: string; user: User }>(
      `${API_URL}/auth/registration/`,
      { method: "POST", body: JSON.stringify(data) }
    ),

  refreshToken: (refresh: string) =>
    apiFetch<{ access: string }>(`${API_URL}/auth/token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh }),
    }),

  getMe: () => apiFetch<User>(`${API_URL}/users/me/`),

  updateMe: (data: Partial<User>) =>
    apiFetch<User>(`${API_URL}/users/me/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Providers API
export const providersApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<Provider>>(`${API_URL}/providers/${query}`);
  },

  get: (id: string) =>
    apiFetch<ProviderDetail>(`${API_URL}/providers/${id}/`),

  categories: () =>
    apiFetch<ServiceCategory[]>(`${API_URL}/providers/categories/`),
};

// Orders API
export const ordersApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<Order>>(`${API_URL}/orders/${query}`);
  },

  get: (id: string) =>
    apiFetch<OrderDetail>(`${API_URL}/orders/${id}/`),

  create: (data: Record<string, unknown>) =>
    apiFetch<Order>(`${API_URL}/orders/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string, note?: string) =>
    apiFetch<OrderDetail>(`${API_URL}/orders/${id}/update_status/`, {
      method: "POST",
      body: JSON.stringify({ status, note }),
    }),
};

// Conversations API
export const conversationsApi = {
  list: () =>
    apiFetch<PaginatedResponse<Conversation>>(`${API_URL}/conversations/`),

  get: (id: string) =>
    apiFetch<Conversation & { messages: Message[] }>(`${API_URL}/conversations/${id}/`),

  startAiChat: () =>
    apiFetch<Conversation>(`${API_URL}/conversations/start_ai_chat/`, {
      method: "POST",
    }),

  sendMessage: (conversationId: string, content: string) =>
    apiFetch<Message>(`${API_URL}/conversations/${conversationId}/messages/`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

// Reviews API
export const reviewsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<Review>>(`${API_URL}/reviews/${query}`);
  },

  create: (data: { order: string; rating: number; comment: string }) =>
    apiFetch<Review>(`${API_URL}/reviews/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  respond: (reviewId: string, content: string) =>
    apiFetch<Review>(`${API_URL}/reviews/${reviewId}/respond/`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

// Notifications API
export const notificationsApi = {
  list: () =>
    apiFetch<PaginatedResponse<Notification>>(`${API_URL}/notifications/`),

  markRead: (id: string) =>
    apiFetch<Notification>(`${API_URL}/notifications/${id}/mark_read/`, {
      method: "POST",
    }),

  markAllRead: () =>
    apiFetch<void>(`${API_URL}/notifications/mark_all_read/`, {
      method: "POST",
    }),

  unreadCount: () =>
    apiFetch<{ count: number }>(`${API_URL}/notifications/unread_count/`),
};

// RAG API
export const ragApi = {
  chat: (data: ChatRequest) =>
    apiFetch<ChatResponse>(`${RAG_URL}/chat`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
