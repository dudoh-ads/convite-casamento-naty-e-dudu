import { InvitationConfig, VirtualGift } from './types';
import invitationConfigData from './invitation.config.json';
import couplePhotoUrl from '../assets/foto_casamento_naty_dudu.jpeg';

const invitationConfig = invitationConfigData as InvitationConfig;

export const defaultInvitationConfig: InvitationConfig = {
  ...invitationConfig,
  couplePhotoUrl: invitationConfig.couplePhotoUrl?.includes('/assets/') || invitationConfig.couplePhotoUrl?.includes('assets/')
    ? couplePhotoUrl
    : invitationConfig.couplePhotoUrl || couplePhotoUrl,
};

export const defaultVirtualGifts: VirtualGift[] = [
  {
    id: "1",
    title: "Curso: Como Dobrar Lençol de Elástico Juntos Sem Terminar o Casamento",
    description: "",
    price: 150,
    icon: "UtensilsCrossed",
  },
  {
    id: "2",
    title: "Kit Sobrevivência Pós-Festa para os Noivos (dorflex + arnica)",
    description: "",
    price: 80,
    icon: "Wine",
  },
  {
    id: "3",
    title: "Café da Manhã na Cama na Lua de Mel (com bastante lactose)",
    description: "",
    price: 100,
    icon: "Coffee",
  },
  {
    id: "4",
    title: "Poção de Vida Extra (HP) pro Noivo Gamer",
    description: "",
    price: 250,
    icon: "Camera",
  },
  {
    id: "5",
    title: "Protetor Auricular para Noiva Dormir em Paz",
    description: "",
    price: 300,
    icon: "Home",
  },
];
