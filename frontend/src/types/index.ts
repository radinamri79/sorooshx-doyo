// ── User Types ──
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_provider: boolean;
  auth_provider: string;
  avatar: string | null;
  phone: string;
  profile: UserProfile | null;
  created_at: string;
}

export interface UserProfile {
  bio: string;
  date_of_birth: string | null;
}

export interface UserAddress {
  id: string;
  title: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// ── Provider Types ──
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parent: string | null;
  children: ServiceCategory[];
  is_active: boolean;
}

export interface Provider {
  id: string;
  user: {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  business_name: string;
  description: string;
  categories: ServiceCategory[];
  city: string;
  average_rating: number;
  total_reviews: number;
  total_orders: number;
  is_verified: boolean;
  is_available: boolean;
}

export interface ProviderDetail extends Provider {
  address: string;
  services: ProviderService[];
  portfolio: PortfolioItem[];
  schedules: WorkSchedule[];
  created_at: string;
}

export interface ProviderService {
  id: string;
  category: string;
  category_name: string;
  title: string;
  description: string;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
}

export interface WorkSchedule {
  id: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// ── Order Types ──
export interface Order {
  id: string;
  customer: User;
  provider: string;
  provider_name: string;
  service: string | null;
  service_title: string | null;
  status: OrderStatus;
  price: number;
  scheduled_date: string | null;
  scheduled_time: string | null;
  created_at: string;
}

export interface OrderDetail extends Omit<Order, "provider" | "provider_name" | "service"> {
  provider: Provider;
  service: ProviderService | null;
  description: string;
  address: string;
  notes: string;
  status_logs: OrderStatusLog[];
  updated_at: string;
}

export interface OrderStatusLog {
  id: string;
  from_status: string;
  to_status: string;
  changed_by_email: string;
  note: string;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

// ── Conversation Types ──
export interface Conversation {
  id: string;
  type: "ai_chat" | "direct" | "order";
  title: string;
  participants: User[];
  last_message: Message | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: User | null;
  role: "user" | "ai" | "system";
  content: string;
  metadata: Record<string, unknown>;
  attachments: MessageAttachment[];
  created_at: string;
}

export interface MessageAttachment {
  id: string;
  file: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

// ── Review Types ──
export interface Review {
  id: string;
  order: string;
  reviewer: User;
  provider: string;
  rating: number;
  comment: string;
  response: ReviewResponse | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewResponse {
  id: string;
  responder: User;
  content: string;
  created_at: string;
}

// ── Notification Types ──
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ── API Types ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password1: string;
  password2: string;
}

// ── Chat Types ──
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  history?: { role: string; content: string }[];
}

export interface ChatResponse {
  reply: string;
  intent: string | null;
  providers: Provider[] | null;
  conversation_id: string | null;
}
