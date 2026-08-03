import React, { useState, useEffect } from 'react';
import { Settings, FileSpreadsheet, Download, RefreshCw, Trash2, Smartphone, Monitor, CheckCircle, AlertCircle, Save, HelpCircle, X } from 'lucide-react';
import { InvitationConfig, RSVP } from '../types';
import { loadRSVPs, deleteRSVP, downloadRSVPsCSV } from '../services/storage';

interface AdminCustomizerModalProps {
  config: InvitationConfig;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConfig: (newConfig: InvitationConfig) => void;
  isMobilePreviewMode: boolean;
  onToggleMobilePreview: () => void;
}

export const AdminCustomizerModal: React.FC<AdminCustomizerModalProps> = ({
  config,
  isOpen,
  onClose,
  onUpdateConfig,
  isMobilePreviewMode,
  onToggleMobilePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'texts' | 'sheets' | 'rsvps'>('texts');
  const [formData, setFormData] = useState<InvitationConfig>(config);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [summary, setSummary] = useState({ totalResponses: 0, totalConfirmedCount: 0, totalDeclinedCount: 0, totalGuestsCount: 0 });
  const [isLoadingRSVPs, setIsLoadingRSVPs] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const fetchRSVPs = async () => {
    setIsLoadingRSVPs(true);
    setLoadError(null);
    try {
      const data = await loadRSVPs(config.googleSheetsWebhookUrl);
      setRsvps(data);

      const totalResponses = data.length;
      const confirmed = data.filter(r => r.attending === 'confirmed');
      const totalConfirmedCount = confirmed.length;
      const totalDeclinedCount = data.filter(r => r.attending === 'declined').length;
      const totalGuestsCount = confirmed.reduce((acc, r) => acc + (r.adultsCount || 1) + (r.childrenCount || 0), 0);

      setSummary({ totalResponses, totalConfirmedCount, totalDeclinedCount, totalGuestsCount });
    } catch (err) {
      console.error('Erro ao buscar lista de RSVPs da planilha:', err);
      setLoadError('Não foi possível carregar os dados da planilha. Confira a URL do Webhook e se o Apps Script está publicado como "Qualquer pessoa".');
    } finally {
      setIsLoadingRSVPs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRSVPs();
      setFormData(config);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleDownloadCSV = () => {
    downloadRSVPsCSV(rsvps);
  };

  const handleDeleteRSVP = async (rsvp: RSVP) => {
    if (rsvp.row == null) {
      alert('Este registro não pôde ser localizado na planilha.');
      return;
    }
    if (!confirm('Deseja excluir este registro de confirmação? Isso remove a linha na planilha.')) return;
    try {
      await deleteRSVP(rsvp.row, formData.googleSheetsWebhookUrl);
      await fetchRSVPs();
    } catch (err) {
      console.error('Erro ao excluir confirmação na planilha:', err);
      alert('Não foi possível excluir na planilha agora. Tente novamente em instantes.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0e0d0c]/85 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF9F6] text-[#2D2926] rounded-2xl shadow-2xl border border-sep flex flex-col overflow-hidden font-sans-clean">
        {/* Modal Top Header Bar */}
        <div className="bg-[#2D2926] text-[#FAF9F6] p-4 sm:p-5 flex items-center justify-between border-b border-[#B89C7D]/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded bg-[#B89C7D]/20 text-[#B89C7D]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-base sm:text-lg italic text-[#FAF9F6] tracking-wide">
                Painel do Casal &amp; Configuração
              </h3>
              <p className="micro-label !text-stone-400 !text-[9px]">
                Personalize os textos, integre o Google Sheets e gerencie os convidados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Mobile Preview */}
            <button
              onClick={onToggleMobilePreview}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#B89C7D]/40 text-[#FAF9F6] hover:bg-[#B89C7D] hover:text-[#2D2926] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Simular visualização no celular"
            >
              {isMobilePreviewMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-[#B89C7D]" />
                  <span className="hidden sm:inline">Visão Computador</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#B89C7D]" />
                  <span className="hidden sm:inline">Visão Celular</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#FAF9F6] border-b border-sep flex px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('texts')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap micro-label ${
              activeTab === 'texts'
                ? '!border-[#2D2926] !text-[#2D2926]'
                : '!border-transparent !text-[#8E8A85] hover:!text-[#2D2926]'
            }`}
          >
            Editar Textos &amp; Dados
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 micro-label ${
              activeTab === 'sheets'
                ? '!border-[#2D2926] !text-[#2D2926]'
                : '!border-transparent !text-[#8E8A85] hover:!text-[#2D2926]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Planilha Google Sheets
          </button>

          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 micro-label ${
              activeTab === 'rsvps'
                ? '!border-[#2D2926] !text-[#2D2926]'
                : '!border-transparent !text-[#8E8A85] hover:!text-[#2D2926]'
            }`}
          >
            Confirmações ({summary.totalConfirmedCount})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#FAF9F6] text-xs">
          {saveToast && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Alterações salvas com sucesso! O convite foi atualizado em tempo real.
            </div>
          )}

          {/* TAB 1: EDIT TEXTS */}
          {activeTab === 'texts' && (
            <form onSubmit={handleSaveConfig} className="space-y-6">
              <div className="bg-[#FAF9F6] p-5 rounded-xl border border-sep space-y-4">
                <span className="micro-label block border-b border-sep pb-2">
                  1. Nomes dos Noivos &amp; Citação
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label block mb-1">Nome da Noiva</label>
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div>
                    <label className="micro-label block mb-1">Nome do Noivo</label>
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-1">Subtítulo do Convite</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="micro-label block mb-1">Frase / Versículo Bíblico</label>
                    <input
                      type="text"
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div>
                    <label className="micro-label block mb-1">Referência</label>
                    <input
                      type="text"
                      value={formData.quoteReference}
                      onChange={(e) => setFormData({ ...formData, quoteReference: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF9F6] p-5 rounded-xl border border-sep space-y-4">
                <span className="micro-label block border-b border-sep pb-2">
                  2. Data, Horário e Local
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label block mb-1">Texto da Data</label>
                    <input
                      type="text"
                      value={formData.eventDateText}
                      onChange={(e) => setFormData({ ...formData, eventDateText: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div>
                    <label className="micro-label block mb-1">Texto do Horário</label>
                    <input
                      type="text"
                      value={formData.eventTimeText}
                      onChange={(e) => setFormData({ ...formData, eventTimeText: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label block mb-1">Nome do Local</label>
                    <input
                      type="text"
                      value={formData.eventLocationName}
                      onChange={(e) => setFormData({ ...formData, eventLocationName: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>

                  <div>
                    <label className="micro-label block mb-1">Data-Alvo da Contagem Regressiva</label>
                    <input
                      type="datetime-local"
                      value={formData.countdownTargetDate ? formData.countdownTargetDate.substring(0, 16) : ''}
                      onChange={(e) => setFormData({ ...formData, countdownTargetDate: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-sm italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={formData.eventAddress}
                    onChange={(e) => setFormData({ ...formData, eventAddress: e.target.value })}
                    className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-serif-title text-base italic text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div>
                  <label className="micro-label block mb-1">Link do Google Maps</label>
                  <input
                    type="url"
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    className="w-full p-2.5 bg-transparent border-b border-[#2D2926]/20 font-mono text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              <div className="bg-[#F8F7F4] p-5 rounded-xl border border-sep space-y-4">
                <span className="micro-label block border-b border-sep pb-2 text-[#8A2E63]">
                  3. Chave PIX, Música &amp; Traje
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="micro-label block mb-1 text-[#8A2E63]">Tipo de Chave PIX</label>
                    <select
                      value={formData.pixKeyType}
                      onChange={(e) => setFormData({ ...formData, pixKeyType: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#6B1124]/20 font-sans-clean text-xs text-[#4A4A4A] focus:outline-none focus:border-[#6B1124]"
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="E-mail">E-mail</option>
                      <option value="Telefone">Telefone</option>
                      <option value="Chave Aleatória">Chave Aleatória</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="micro-label block mb-1 text-[#8A2E63]">Chave PIX</label>
                    <input
                      type="text"
                      value={formData.pixKey}
                      onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#6B1124]/20 font-mono font-bold text-sm text-[#6B1124] focus:outline-none focus:border-[#6B1124]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="micro-label block mb-1 text-[#8A2E63]">Favorecido (Nome)</label>
                    <input
                      type="text"
                      value={formData.pixReceiverName}
                      onChange={(e) => setFormData({ ...formData, pixReceiverName: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#6B1124]/20 font-serif-title text-base italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124]"
                    />
                  </div>

                  <div>
                    <label className="micro-label block mb-1 text-[#8A2E63]">Aviso do Traje / Cores Reservadas</label>
                    <input
                      type="text"
                      value={formData.forbiddenColorsText}
                      onChange={(e) => setFormData({ ...formData, forbiddenColorsText: e.target.value })}
                      className="w-full p-2.5 bg-transparent border-b border-[#6B1124]/20 font-serif-title text-base italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124]"
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-1 text-[#8A2E63]">Link da Música de Fundo (MP3 / Audio URL)</label>
                  <input
                    type="url"
                    value={formData.bgMusicUrl || ''}
                    onChange={(e) => setFormData({ ...formData, bgMusicUrl: e.target.value })}
                    placeholder="https://exemplo.com/musica-casamento.mp3"
                    className="w-full p-2.5 bg-transparent border-b border-[#6B1124]/20 font-mono text-xs text-[#4A4A4A] focus:outline-none focus:border-[#6B1124]"
                  />
                  <p className="micro-label !text-[#8A2E63] !text-[9px] mt-1">
                    Cole qualquer link público direto de arquivo de áudio (MP3/WAV/AAC) para tocar de fundo no convite.
                  </p>
                </div>
              </div>


              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2D2926] text-[#FAF9F6] font-sans-clean text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#B89C7D] hover:text-[#2D2926] transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#B89C7D]" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: GOOGLE SHEETS SYNC & WEBHOOK */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="bg-[#FAF9F6] border border-sep rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-[#2D2926]">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  <span className="micro-label">Integração Automática com Google Sheets</span>
                </div>
                <p className="font-serif-title text-sm italic text-[#8E8A85] leading-relaxed">
                  Seu convite virtual já grava direto na sua planilha do Google Sheets: as confirmações e as mensagens do mural moram lá, não mais neste navegador. Sempre que um convidado confirmar a presença ou deixar um recado, uma nova linha aparece na planilha na hora.
                </p>
              </div>

              {/* Webhook Configuration Card */}
              <div className="bg-[#FAF9F6] p-5 rounded-xl border border-sep space-y-4">
                <span className="micro-label block border-b border-sep pb-2">
                  URL do Webhook do Google Apps Script
                </span>

                <div>
                  <label className="micro-label block mb-1">
                    Cole o Link do Webhook do Apps Script aqui:
                  </label>
                  <input
                    type="url"
                    value={formData.googleSheetsWebhookUrl || ''}
                    onChange={(e) => setFormData({ ...formData, googleSheetsWebhookUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full p-3 bg-transparent border-b border-[#2D2926]/30 font-mono text-xs text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      onUpdateConfig(formData);
                      setSaveToast(true);
                      setTimeout(() => setSaveToast(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-[#2D2926] text-[#FAF9F6] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#B89C7D] hover:text-[#2D2926] transition-colors cursor-pointer"
                  >
                    Salvar Webhook
                  </button>

                  <button
                    onClick={fetchRSVPs}
                    disabled={isLoadingRSVPs}
                    className="px-4 py-2.5 bg-emerald-800 text-white font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-emerald-900 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRSVPs ? 'animate-spin' : ''}`} />
                    Recarregar da Planilha
                  </button>

                  <button
                    onClick={handleDownloadCSV}
                    className="px-4 py-2.5 border border-sep text-[#2D2926] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#2D2926] hover:text-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar CSV / Excel
                  </button>
                </div>
              </div>

              {/* Instructions on how to get Google Apps Script Webhook */}
              <div className="bg-[#FAF9F6] p-5 rounded-xl border border-sep space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B89C7D]" />
                  <span className="micro-label">Como criar o Webhook gratuito no Google Sheets</span>
                </div>

                <ol className="list-decimal list-inside space-y-2 font-serif-title text-sm italic text-[#8E8A85] leading-relaxed">
                  <li>Abra sua planilha no <strong>Google Sheets</strong>.</li>
                  <li>Clique no menu <strong>Extensões &gt; Apps Script</strong>.</li>
                  <li>Cole o conteúdo do arquivo <strong>apps-script/Code.gs</strong> (na pasta do projeto) substituindo o código atual.</li>
                  <li>Clique em <strong>Implantar &gt; Gerenciar implantações</strong>, edite a implantação existente (ícone de lápis) e escolha <strong>Nova versão</strong> para publicar a atualização.</li>
                  <li>Confirme que o acesso está configurado para <em>"Qualquer pessoa"</em> (Anyone) e salve.</li>
                </ol>

                <p className="font-serif-title text-sm italic text-[#8E8A85] leading-relaxed">
                  Essa versão do script adiciona suporte para excluir uma confirmação ou recado direto pelo Painel do Casal (o código anterior só sabia adicionar linhas).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RSVP LIST & HEADCOUNT */}
          {activeTab === 'rsvps' && (
            <div className="space-y-5">
              {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loadError}
                </div>
              )}
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-sep text-center">
                  <span className="font-serif-display font-bold text-2xl text-[#2D2926] block">
                    {summary.totalResponses}
                  </span>
                  <span className="micro-label !text-[8px] !text-[#8E8A85]">Respostas</span>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-sep text-center">
                  <span className="font-serif-display font-bold text-2xl text-emerald-800 block">
                    {summary.totalConfirmedCount}
                  </span>
                  <span className="micro-label !text-[8px] !text-emerald-800">Confirmados</span>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-sep text-center">
                  <span className="font-serif-display font-bold text-2xl text-stone-600 block">
                    {summary.totalDeclinedCount}
                  </span>
                  <span className="micro-label !text-[8px] !text-stone-500">Não Irão</span>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#B89C7D] text-center">
                  <span className="font-serif-display font-bold text-2xl text-[#2D2926] block">
                    {summary.totalGuestsCount}
                  </span>
                  <span className="micro-label !text-[8px] !text-[#B89C7D]">Total Pessoas</span>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex justify-between items-center">
                <span className="micro-label">
                  Lista de Convidados
                </span>
                <button
                  onClick={handleDownloadCSV}
                  className="px-3 py-1.5 border border-sep text-[#2D2926] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#2D2926] hover:text-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar CSV
                </button>
              </div>

              {/* RSVP Table */}
              <div className="bg-[#FAF9F6] rounded-xl border border-sep overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2D2926] text-[#FAF9F6] micro-label border-b border-sep">
                    <tr>
                      <th className="p-3">Convidado</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Pessoas</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Mensagem</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sep">
                    {isLoadingRSVPs ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center font-serif-title italic text-[#8E8A85]">
                          Carregando confirmações da planilha...
                        </td>
                      </tr>
                    ) : rsvps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center font-serif-title italic text-[#8E8A85]">
                          Nenhuma confirmação recebida ainda.
                        </td>
                      </tr>
                    ) : (
                      rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-[#FAF9F6]/80">
                          <td className="p-3 font-serif-title font-semibold text-sm italic text-[#2D2926]">
                            {rsvp.guestName}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                rsvp.attending === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-700'
                              }`}
                            >
                              {rsvp.attending === 'confirmed' ? 'Confirmado' : 'Não irá'}
                            </span>
                          </td>
                          <td className="p-3 font-serif-title text-xs italic">
                            {rsvp.attending === 'confirmed' ? (
                              <span>
                                {rsvp.adultsCount} ad. / {rsvp.childrenCount} cri.
                                {rsvp.companionNames && (
                                  <span className="block text-[10px] text-[#8E8A85]">
                                    ({rsvp.companionNames})
                                  </span>
                                )}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="p-3 font-mono text-[11px]">{rsvp.phone || '-'}</td>
                          <td className="p-3 font-serif-title text-xs italic text-[#8E8A85] max-w-xs truncate">{rsvp.message || '-'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteRSVP(rsvp)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded cursor-pointer"
                              title="Excluir confirmação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
