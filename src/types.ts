export interface InvitationConfig {
  brideName: string;
  groomName: string;
  subtitle: string;
  quote: string;
  quoteReference: string;
  eventDateText: string;
  eventTimeText: string;
  eventLocationName: string;
  eventAddress: string;
  googleMapsUrl: string;
  countdownTargetDate: string; // ISO string e.g. 2026-12-20T19:30:00
  dressCodeTitle: string;
  dressCodeDescription: string;
  forbiddenColorsText: string;
  forbiddenColorHexes: string[];
  pixKey: string;
  pixKeyType: string; // 'CPF', 'CNPJ', 'E-mail', 'Telefone', 'Chave Aleatória'
  pixReceiverName: string;
  bankName: string;
  bgMusicUrl?: string;
  googleSheetsWebhookUrl?: string;
  confirmDeadlineText: string;
}

export interface RSVP {
  id: string;
  guestName: string;
  attending: 'confirmed' | 'declined';
  companionCount: number;
  companionNames?: string;
  adultsCount: number;
  childrenCount: number;
  phone: string;
  message?: string;
  createdAt: string;
  syncedToSheets?: boolean;
  row?: number; // número da linha na planilha do Google Sheets (usado para excluir)
}

export interface GuestMessage {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  row?: number; // número da linha na planilha do Google Sheets (usado para excluir)
}

export interface VirtualGift {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}
