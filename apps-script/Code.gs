// =============================================================================
// Apps Script do Convite Virtual — usa a própria planilha como banco de dados.
//
// Novidades em relação à versão anterior:
// - doGet agora retorna também o número da linha ("row") de cada registro.
// - doPost agora aceita "type": "DELETE_RSVP" e "DELETE_MURAL" para excluir
//   uma linha específica (usado pelo botão de excluir no Painel do Casal).
//
// Depois de colar este código, vá em "Implantar > Gerenciar implantações",
// edite a implantação existente (ícone de lápis) e escolha "Nova versão"
// para publicar a atualização mantendo a mesma URL.
// =============================================================================

// Manipula o envio de dados do site para a planilha (POST)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Excluir uma confirmação de presença (usado pelo Painel do Casal)
    if (data.type === 'DELETE_RSVP') {
      var sheetRsvpDel = ss.getSheetByName("Confirmacoes");
      if (sheetRsvpDel && data.row) {
        sheetRsvpDel.deleteRow(Number(data.row));
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Confirmação removida!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Excluir uma mensagem do mural (usado pelo Painel do Casal)
    if (data.type === 'DELETE_MURAL') {
      var sheetMuralDel = ss.getSheetByName("Mural");
      if (sheetMuralDel && data.row) {
        sheetMuralDel.deleteRow(Number(data.row));
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Mensagem removida!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Se for mensagem enviada para o Mural de Recados
    if (data.type === 'MURAL') {
      var sheetMural = ss.getSheetByName("Mural") || ss.insertSheet("Mural");
      if (sheetMural.getLastRow() === 0) {
        sheetMural.appendRow(["Data", "Autor", "Mensagem"]);
      }
      sheetMural.appendRow([
        data.dataEnvio || new Date().toLocaleString("pt-BR"),
        data.autor || "",
        data.mensagem || ""
      ]);
    }
    // Se for confirmação de presença (RSVP)
    else {
      var sheetRsvp = ss.getSheetByName("Confirmacoes") || ss.insertSheet("Confirmacoes");
      if (sheetRsvp.getLastRow() === 0) {
        sheetRsvp.appendRow(["Data", "Nome", "Status", "Adultos", "Crianças", "Acompanhantes", "Telefone", "Mensagem"]);
      }
      sheetRsvp.appendRow([
        data.dataEnvio || new Date().toLocaleString("pt-BR"),
        data.nome || "",
        data.confirmacao || "",
        data.adultos || 0,
        data.criancas || 0,
        data.acompanhantesNomes || "",
        data.telefone || "",
        data.mensagem || ""
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Registrado com sucesso!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite buscar os dados registrados da planilha em formato JSON (GET)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "all";
    var result = {};

    // Buscar mensagens do mural
    if (action === "mural" || action === "all") {
      var sheetMural = ss.getSheetByName("Mural");
      var messages = [];
      if (sheetMural) {
        var values = sheetMural.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          messages.push({
            row: i + 1, // número real da linha na planilha (1 = cabeçalho)
            data: values[i][0],
            autor: values[i][1],
            mensagem: values[i][2]
          });
        }
      }
      result.messages = messages;
    }

    // Buscar confirmações de presença
    if (action === "confirmacoes" || action === "all") {
      var sheetRsvp = ss.getSheetByName("Confirmacoes");
      var rsvps = [];
      if (sheetRsvp) {
        var valuesRsvp = sheetRsvp.getDataRange().getValues();
        for (var j = 1; j < valuesRsvp.length; j++) {
          rsvps.push({
            row: j + 1, // número real da linha na planilha (1 = cabeçalho)
            data: valuesRsvp[j][0],
            nome: valuesRsvp[j][1],
            status: valuesRsvp[j][2],
            adultos: valuesRsvp[j][3],
            criancas: valuesRsvp[j][4],
            acompanhantes: valuesRsvp[j][5],
            telefone: valuesRsvp[j][6],
            mensagem: valuesRsvp[j][7]
          });
        }
      }
      result.rsvps = rsvps;
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
