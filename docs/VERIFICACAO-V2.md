# Verificação da revisão 2

30/10/2026. Alterações solicitadas: mais scroll motion, resposta da abertura ao cursor, mesa de feijoada com enquadramento aberto, cozinha mineira no amarelo, textura no cardápio, remoção do xadrez e correção do vazio no ciclo da faixa.

## Resultado

- Sintaxe verificada por `npm.cmd run check`.
- 8 testes de lógica aprovados: os 4 do menu e 4 novos sobre cobertura da faixa, medidas inválidas, cursor limitado e progresso de cena.
- 43 checks de fluxos e fallbacks do navegador aprovados, em `qa/browser-results.json`.
- 32 checks específicos de movimento aprovados, em `qa/v2-motion/results.json`.
- Legenda e captura finais em 320 e 390px verificadas separadamente após corrigir a quebra de linha.
- Revisão independente de código: nenhum achado importante nesta revisão estática. O revisor não fez QA visual; as capturas foram conferidas pelo implementador.

## Evidência de movimento

O navegador recebeu eventos reais de mouse em posições opostas da abertura. Mesa, lettering e fundo produziram transforms distintos; o botão principal permaneceu clicável. A pausa global interrompeu a resposta ao cursor.

A faixa foi redimensionada para 1920, 2560, 390 e 2160px. As duas metades permaneceram idênticas e cada uma cobriu a largura visível. Foram conferidos os momentos 0%, 50%, 95% e 99,99% de cada ciclo; não houve cauda vazia. O teste busca o defeito no fim do ciclo diretamente, sem depender de esperar minutos de reprodução.

A foto narrativa permaneceu na mesma posição vertical ao avançar dentro da seção; a imagem mudou seu deslocamento e o capítulo ativo avançou. O pin termina junto da própria seção. No mobile, a leitura segue no fluxo, sem pin longo.

O clipe novo decodificou em 1280 × 720, reproduziu e pausou corretamente. O enquadramento mostra a mesa e o ambiente; o zoom é de no máximo 1,5%. A legenda ficou fora do vídeo. O servidor manteve byte-range 206 e rejeição 416 para faixa inválida.

## Visual e responsividade

Capturas abertas e conferidas em `qa/v2-final/`, com topo em 1440, 768 e 390px e quadros da página. Capturas adicionais de 320px e páginas completas estão em `qa/`.

Foram conferidos: mesa completa com os pés visíveis; distanciamento dos pratos; cozinha em amarelo sutil; texto legível; cardápio com papel; ausência de elementos `.checker`; botão circular preservado; legenda mobile com quebra de linha; composição completa sem JS; ausência de overflow horizontal.

Taste inspector: 0 falhas com as exceções da composição já registradas na primeira entrega. Dois avisos mantidos: papel claro quente, pedido explícito do cliente; tamanhos tipográficos fluidos herdados do template. Impeccable detector: apenas avisos de padding, Inter e marquee. Padding foi conferido nas capturas; Inter é a fonte fornecida; marquee é solicitado e tem pausa.

Autoavaliação subjetiva: design 8,2/10, usabilidade 8/10, criatividade 7,5/10, conteúdo 7,5/10. Ponderação 40/30/20/10: 7,93/10. Não é avaliação externa.

## Acesso e limites

Movimento reduzido remove animações e deslocamentos. O menu continua acessível por teclado; links e botões têm nomes no AX tree. Sem JavaScript, texto e destinos reais aparecem e a faixa não anima. Sem IntersectionObserver e ResizeObserver, conteúdo e resize continuam funcionais.

As imagens são ilustrativas, inclusive a cozinha; não documentam instalações reais. Não houve medição em celular físico, auditoria WCAG completa nem alegação de FPS em aparelho real. A resposta ao cursor foi verificada em desktop com ponteiro fino.

WhatsApp, endereço, Instagram, ausência de preços/horários inventados e consulta de disponibilidade permanecem preservados. Nenhuma mensagem foi enviada a terceiros. Esta revisão foi feita localmente; o bloqueio anterior de publicação externa continua sem nova autorização e não foi contornado.
