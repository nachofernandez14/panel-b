// Configuración base para las APIs
const API_BASE_URL = 'http://localhost:3001/api';

// Clase para manejar las respuestas de las APIs
class ApiResponse<T = any> {
  constructor(
    public data: T | null = null,
    public error: string | null = null,
    public success: boolean = true
  ) {}
}

// Función helper para hacer peticiones HTTP
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return new ApiResponse<T>(data, null, true);
    
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    return new ApiResponse<T>(null, error instanceof Error ? error.message : 'Error desconocido', false);
  }
}

// ===== SERVICIOS DE BOTS =====

export interface BotStatus {
  active: boolean;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
}

export interface BotsStatus {
  whatsapp: BotStatus;
  facebook: BotStatus;
  instagram: BotStatus;
  telegram: BotStatus;
}

export class BotService {
  // Obtener estado de todos los bots
  static async getStatus(): Promise<ApiResponse<BotsStatus>> {
    return apiRequest<BotsStatus>('/bots/status');
  }

  // WhatsApp Bot
  static async startWhatsApp(): Promise<ApiResponse<{ message: string; status: string }>> {
    return apiRequest('/bots/whatsapp/start', {
      method: 'POST'
    });
  }

  static async stopWhatsApp(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('/bots/whatsapp/stop', {
      method: 'POST'
    });
  }

  // Obtener QR de WhatsApp
  static async getWhatsAppQR(): Promise<ApiResponse<{ qr: string | null; message: string }>> {
    return apiRequest('/bots/whatsapp/qr');
  }

  // Crear conexión SSE para updates de QR en tiempo real
  static createWhatsAppQRStream(): EventSource {
    return new EventSource(`${API_BASE_URL}/bots/whatsapp/qr-stream`);
  }

  // Facebook Bot
  static async startFacebook(): Promise<ApiResponse<{ message: string; status: string }>> {
    return apiRequest('/bots/facebook/start', {
      method: 'POST'
    });
  }

  static async stopFacebook(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('/bots/facebook/stop', {
      method: 'POST'
    });
  }

  // Instagram Bot
  static async startInstagram(): Promise<ApiResponse<{ message: string; status: string }>> {
    return apiRequest('/bots/instagram/start', {
      method: 'POST'
    });
  }

  static async stopInstagram(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('/bots/instagram/stop', {
      method: 'POST'
    });
  }

  // Telegram Bot
  static async startTelegram(): Promise<ApiResponse<{ message: string; status: string }>> {
    return apiRequest('/bots/telegram/start', {
      method: 'POST'
    });
  }

  static async stopTelegram(): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('/bots/telegram/stop', {
      method: 'POST'
    });
  }
}

// ===== SERVICIO DE IA =====
export interface AITestResponse {
  message: string;
  response: string;
}

export class AIService {
  static async testAI(message: string): Promise<ApiResponse<AITestResponse>> {
    return apiRequest<AITestResponse>('/ai/test', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
}

// ===== SERVICIO DE CONFIGURACIÓN =====
export interface ConfigStatus {
  googleAI: boolean;
  instagramUsername: boolean;
  telegramToken: boolean;
  facebookToken: boolean;
  supabaseUrl: boolean;
  supabaseKey: boolean;
}

export class ConfigService {
  static async getConfig(): Promise<ApiResponse<ConfigStatus>> {
    return apiRequest<ConfigStatus>('/config');
  }
}

// ===== SERVICIO DE SALUD DEL SERVIDOR =====
export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export class HealthService {
  static async checkHealth(): Promise<ApiResponse<HealthResponse>> {
    return apiRequest<HealthResponse>('/health');
  }
}

// ===== SERVICIO DE MENSAJES =====

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
  platform: string;
  platformIcon: string;
  platformColor: string;
  tags: string[];
  messages: any[];
}

export const MessageService = {
  async getConversaciones(): Promise<ApiResponse<{ conversaciones: Chat[] }>> {
    return apiRequest('/conversaciones');
  },
  
  async getMensajes(): Promise<ApiResponse<{ mensajes: any[] }>> {
    return apiRequest('/mensajes');
  }
};

// Exportar todo como servicio principal
export const apiService = {
  bot: BotService,
  ai: AIService,
  config: ConfigService,
  health: HealthService,
  message: MessageService,
};

export default apiService;