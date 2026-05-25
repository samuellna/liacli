export function buildApprovalEmailHtml(params: {
  pesquisadorNome: string;
  protocolo: string;
  dataAgendada: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Agendamento Confirmado</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;">
          <tr><td style="background-color:#2a6496;height:4px;line-height:4px;">&nbsp;</td></tr>
          <tr>
            <td style="padding:28px 40px 20px 40px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#1a3a5c;">LIACLI</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#666666;">Laboratório Integrado de Análises Clínicas</p>
            </td>
          </tr>
          <tr><td style="border-top:1px solid #e0e0e0;"></td></tr>
          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 20px 0;font-size:22px;color:#1a3a5c;">Agendamento Confirmado</h1>
              <p style="margin:0 0 16px 0;font-size:15px;color:#2d2d2d;">Olá, ${params.pesquisadorNome},</p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#2d2d2d;">Seu agendamento foi aprovado. Confira os detalhes abaixo:</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf3fb;border-radius:4px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="6" border="0">
                      <tr>
                        <td style="font-size:14px;color:#666666;width:100px;">Protocolo:</td>
                        <td style="font-size:14px;font-weight:bold;color:#1a3a5c;">${params.protocolo}</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;color:#666666;">Data:</td>
                        <td style="font-size:14px;color:#2d2d2d;">${params.dataAgendada}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:14px;color:#2d2d2d;">Guarde o número de protocolo acima. Ele será necessário para acompanhar o status da sua solicitação.</p>
            </td>
          </tr>
          <tr><td style="border-top:1px solid #e0e0e0;"></td></tr>
          <tr>
            <td style="padding:20px 40px;background-color:#f9f9f9;">
              <p style="margin:0;font-size:12px;color:#999999;">LIACLI – Laboratórios Integrados de Análises Clínicas | UFPE</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Este é um email automático. Por favor, não responda.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildResultEmailHtml(params: {
  pesquisadorNome: string;
  protocolo: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Laudo Disponível</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;">
          <tr><td style="background-color:#2a6496;height:4px;line-height:4px;">&nbsp;</td></tr>
          <tr>
            <td style="padding:28px 40px 20px 40px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#1a3a5c;">LIACLI</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#666666;">Laboratórios Integrados de Análises Clínicas</p>
            </td>
          </tr>
          <tr><td style="border-top:1px solid #e0e0e0;"></td></tr>
          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 20px 0;font-size:22px;color:#1a3a5c;">Laudo Disponível</h1>
              <p style="margin:0 0 16px 0;font-size:15px;color:#2d2d2d;">Olá, ${params.pesquisadorNome},</p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#2d2d2d;">As análises referentes ao protocolo abaixo foram concluídas e o laudo está disponível em anexo.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf3fb;border-radius:4px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="6" border="0">
                      <tr>
                        <td style="font-size:14px;color:#666666;width:100px;">Protocolo:</td>
                        <td style="font-size:14px;font-weight:bold;color:#1a3a5c;">${params.protocolo}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:14px;color:#2d2d2d;">O documento em PDF está anexado a este email. Caso tenha dificuldades para abri-lo, entre em contato com a equipe do laboratório.</p>
            </td>
          </tr>
          <tr><td style="border-top:1px solid #e0e0e0;"></td></tr>
          <tr>
            <td style="padding:20px 40px;background-color:#f9f9f9;">
              <p style="margin:0;font-size:12px;color:#999999;">LIACLI – Laboratórios Integrados de Análises Clínicas | UFPE</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">Este é um email automático. Por favor, não responda.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildRejectionEmailHtml(params: {
  pesquisadorNome: string;
  protocolo: string;
  motivoReprovacao: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Solicitação Não Aprovada</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:30px 0;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:4px;overflow:hidden;">
          
          <tr>
            <td style="background-color:#c0392b;height:4px;line-height:4px;">&nbsp;</td>
          </tr>

          <tr>
            <td style="padding:28px 40px 20px 40px;">
              <p style="margin:0;font-size:20px;font-weight:bold;color:#1a3a5c;">LIACLI</p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#666666;">
                Laboratórios Integrados de Análises Clínicas
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #e0e0e0;"></td>
          </tr>

          <tr>
            <td style="padding:32px 40px;">
              <h1 style="margin:0 0 20px 0;font-size:22px;color:#c0392b;">
                Solicitação Não Aprovada
              </h1>

              <p style="margin:0 0 16px 0;font-size:15px;color:#2d2d2d;">
                Olá, ${params.pesquisadorNome},
              </p>

              <p style="margin:0 0 24px 0;font-size:15px;color:#2d2d2d;">
                Após análise da solicitação enviada ao laboratório, informamos que o agendamento referente ao protocolo abaixo não pôde ser aprovado neste momento.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fbeaea;border-radius:4px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="6" border="0">
                      <tr>
                        <td style="font-size:14px;color:#666666;width:100px;">
                          Protocolo:
                        </td>
                        <td style="font-size:14px;font-weight:bold;color:#c0392b;">
                          ${params.protocolo}
                        </td>
                      </tr>

                      <tr>
                        <td style="font-size:14px;color:#666666;vertical-align:top;">
                          Motivo:
                        </td>
                        <td style="font-size:14px;color:#2d2d2d;">
                          ${params.motivoReprovacao}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0;font-size:14px;color:#2d2d2d;">
                Caso necessário, realize os ajustes indicados e envie uma nova solicitação. Em caso de dúvidas, entre em contato com a equipe responsável pelo laboratório.
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top:1px solid #e0e0e0;"></td>
          </tr>

          <tr>
            <td style="padding:20px 40px;background-color:#f9f9f9;">
              <p style="margin:0;font-size:12px;color:#999999;">
                LIACLI – Laboratórios Integrados de Análises Clínicas | UFPE
              </p>
              <p style="margin:4px 0 0 0;font-size:12px;color:#999999;">
                Este é um email automático. Por favor, não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
