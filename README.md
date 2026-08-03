<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/50e0d18b-988f-4c56-994f-80c9f67a4db2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Personalização do convite (nomes, data, local, textos, PIX...)

Toda a personalização do convite fica em [`src/invitation.config.json`](src/invitation.config.json). Não existe mais um painel de edição dentro do site — para mudar qualquer texto, edite esse arquivo diretamente e publique de novo (`git push`, o GitHub Actions já builda e reimplanta sozinho).

## Banco de dados (Confirmações e Mural)

As confirmações de presença e as mensagens do mural são salvas direto em uma planilha do Google Sheets, através de um Apps Script publicado como App da Web. O código desse script fica em [`apps-script/Code.gs`](apps-script/Code.gs).

Se precisar atualizar o script (por exemplo, para uma nova funcionalidade), cole o conteúdo desse arquivo no editor do Apps Script da planilha e publique uma **nova versão** da implantação existente (Implantar > Gerenciar implantações > editar > Nova versão), para manter a mesma URL.

A URL da implantação atual já vem configurada por padrão em `src/services/storage.ts`. Também é possível sobrescrevê-la pelo campo "Webhook do Google Sheets" no Painel do Casal, dentro do próprio site.
