import { RSVP, GuestMessage } from '../types';

// URL padrão da planilha (Google Apps Script). O valor definitivo vem de
// src/invitation.config.json (campo googleSheetsWebhookUrl); isso aqui é
// só uma rede de segurança caso o campo esteja vazio.
const DEFAULT_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwAQ6DT7oMxX3x9-i1H5LEi50_zl38ii433aOI--n1Ow6p5cwd8PN4yVi7mxYPwQ8P5/exec';

function getSheetUrl(webhookUrl?: string): string {
  return (webhookUrl && webhookUrl.trim()) || DEFAULT_SHEET_API_URL;
}

// ---------------------------------------------------------------------------
// Confirmações (RSVP) e Mural de Recados: agora moram de verdade na planilha
// do Google Sheets, via o Apps Script publicado como App da Web.
// ---------------------------------------------------------------------------

async function fetchSheet(action: 'confirmacoes' | 'mural', webhookUrl?: string): Promise<any> {
  const url = `${getSheetUrl(webhookUrl)}?action=${action}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Falha ao buscar dados da planilha (HTTP ${res.status})`);
  }
  return res.json();
}

// Usamos Content-Type: text/plain para evitar o preflight (OPTIONS) do CORS,
// já que o Apps Script não responde a esse tipo de requisição. O Apps Script
// já faz JSON.parse(e.postData.contents), então o conteúdo continua sendo JSON.
async function postToSheet(payload: Record<string, any>, webhookUrl?: string): Promise<any> {
  const res = await fetch(getSheetUrl(webhookUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status === 'error') {
    throw new Error(json.error || 'Erro ao gravar na planilha');
  }
  return json;
}

function mapRowToRSVP(item: any): RSVP {
  const status = String(item.status || '').toUpperCase();
  const adultsCount = Number(item.adultos) || 0;
  const childrenCount = Number(item.criancas) || 0;
  return {
    id: `sheet-row-${item.row}`,
    row: item.row,
    guestName: item.nome || '',
    attending: status === 'CONFIRMADO' ? 'confirmed' : 'declined',
    companionCount: Math.max(0, adultsCount - 1) + childrenCount,
    companionNames: item.acompanhantes || '',
    adultsCount,
    childrenCount,
    phone: item.telefone || '',
    message: item.mensagem || '',
    createdAt: item.data || '',
    syncedToSheets: true,
  };
}

function mapRowToMessage(item: any): GuestMessage {
  return {
    id: `sheet-row-${item.row}`,
    row: item.row,
    author: item.autor || '',
    message: item.mensagem || '',
    createdAt: item.data || '',
  };
}

// Carrega todas as confirmações direto da planilha (mais recentes primeiro)
export async function loadRSVPs(webhookUrl?: string): Promise<RSVP[]> {
  const data = await fetchSheet('confirmacoes', webhookUrl);
  return (data.rsvps || []).map(mapRowToRSVP).reverse();
}

// Registra uma nova confirmação de presença como uma linha na planilha
export async function submitRSVP(rsvpData: {
  guestName: string;
  attending: 'confirmed' | 'declined';
  adultsCount: number;
  childrenCount: number;
  companionNames?: string;
  phone: string;
  message?: string;
  webhookUrl?: string;
}): Promise<RSVP> {
  const now = new Date();
  const payload = {
    dataEnvio: now.toISOString(),
    nome: rsvpData.guestName,
    confirmacao: rsvpData.attending === 'confirmed' ? 'CONFIRMADO' : 'NÃO PODERÁ IR',
    adultos: rsvpData.adultsCount,
    criancas: rsvpData.childrenCount,
    acompanhantesNomes: rsvpData.companionNames || '',
    telefone: rsvpData.phone || '',
    mensagem: rsvpData.message || '',
  };

  await postToSheet(payload, rsvpData.webhookUrl);

  return {
    id: `RSVP-${now.getTime().toString(36).toUpperCase()}`,
    guestName: rsvpData.guestName,
    attending: rsvpData.attending,
    companionCount: Math.max(0, rsvpData.adultsCount - 1) + rsvpData.childrenCount,
    companionNames: rsvpData.companionNames,
    adultsCount: rsvpData.adultsCount,
    childrenCount: rsvpData.childrenCount,
    phone: rsvpData.phone,
    message: rsvpData.message,
    createdAt: now.toISOString(),
    syncedToSheets: true,
  };
}

// Exclui a linha correspondente na planilha (requer o Apps Script atualizado)
export async function deleteRSVP(row: number, webhookUrl?: string): Promise<void> {
  await postToSheet({ type: 'DELETE_RSVP', row }, webhookUrl);
}

// Baixa em CSV a lista de confirmações já carregada na tela
export function downloadRSVPsCSV(rsvps: RSVP[]): void {
  if (rsvps.length === 0) {
    alert('Nenhuma confirmação cadastrada para baixar.');
    return;
  }

  const headers = ['ID', 'Data', 'Nome', 'Status', 'Adultos', 'Crianças', 'Acompanhantes', 'Telefone', 'Mensagem'];
  const rows = rsvps.map(r => [
    r.id,
    r.createdAt,
    `"${(r.guestName || '').replace(/"/g, '""')}"`,
    r.attending === 'confirmed' ? 'Confirmado' : 'Não Irá',
    r.adultsCount,
    r.childrenCount,
    `"${(r.companionNames || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `confirmacoes_casamento_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Mural de Recados
// ---------------------------------------------------------------------------

export async function loadMessages(webhookUrl?: string): Promise<GuestMessage[]> {
  const data = await fetchSheet('mural', webhookUrl);
  const messages: GuestMessage[] = (data.messages || []).map(mapRowToMessage).reverse();

  if (messages.length === 0) {
    return [
      {
        id: 'welcome',
        author: 'Nathallia & Matheus',
        message: 'Sejam bem-vindos ao nosso convite virtual! Deixem uma mensagem com todo o carinho de vocês.',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  return messages;
}

export async function submitMessage(author: string, message: string, webhookUrl?: string): Promise<GuestMessage[]> {
  const payload = {
    type: 'MURAL',
    dataEnvio: new Date().toISOString(),
    autor: author.trim(),
    mensagem: message.trim(),
  };

  await postToSheet(payload, webhookUrl);
  return loadMessages(webhookUrl);
}

// Exclui a linha correspondente no Mural (requer o Apps Script atualizado)
export async function deleteMessage(row: number, webhookUrl?: string): Promise<void> {
  await postToSheet({ type: 'DELETE_MURAL', row }, webhookUrl);
}
