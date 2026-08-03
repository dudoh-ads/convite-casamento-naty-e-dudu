import { InvitationConfig, VirtualGift } from './types';
import invitationConfigData from './invitation.config.json';

export const defaultInvitationConfig: InvitationConfig = invitationConfigData as InvitationConfig;


export const defaultVirtualGifts: VirtualGift[] = [
  {
    id: "1",
    title: "Jantar Romântico na Lua de Mel",
    description: "Um jantar à luz de velas para os noivos comemorarem no destino dos sonhos.",
    price: 150,
    icon: "UtensilsCrossed",
  },
  {
    id: "2",
    title: "Rodada de Drinks na Praia",
    description: "Para brindar ao amor e relaxar à beira-mar.",
    price: 80,
    icon: "Wine",
  },
  {
    id: "3",
    title: "Café da Manhã na Cama",
    description: "Um despertar especial para o casal durante a viagem de núpcias.",
    price: 100,
    icon: "Coffee",
  },
  {
    id: "4",
    title: "Passeio Turístico Inesquecível",
    description: "Um dia inteiro de aventuras e fotos para guardar para sempre.",
    price: 250,
    icon: "Camera",
  },
  {
    id: "5",
    title: "Cota para o Ninho do Casal",
    description: "Contribuição especial para ajudar na montagem do novo lar dos noivos.",
    price: 300,
    icon: "Home",
  },
];
