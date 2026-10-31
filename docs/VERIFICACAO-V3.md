# Verificação da revisão 3

30/10/2026. Requisitos acumulados: restaurar a mão original na homepage, reduzir a reação ao cursor, melhorar nitidez, distribuir scroll motion pela página inteira e integrar smooth scroll na rolagem principal.

## Alterações e causa da nitidez

A medição anterior encontrou clipe de 1280 × 720 exibido com 1920px de largura: ampliação horizontal de 1,5×. O clipe foi reexportado a partir do PNG original para 1672 × 940, VP9, taxa-alvo de 10Mbps, suavização de amostragem em qualidade alta e zoom máximo de 0,8%. O palco agora limita a largura a 1600px e preserva a proporção. Não é uma imagem 4K nem adiciona detalhe inexistente na fonte.

O PNG original sem perda da mão foi restaurado na hero. O PNG original da cozinha também é utilizado no poster e na fotografia narrativa. A imagem da mesa não aparece na abertura. A cozinha amarela, papel do cardápio e ausência de xadrez permanecem.

O cursor desloca apenas a imagem principal até 3px na horizontal, 2px na vertical e menos de 0,4 grau; letras ficam fixas. O botão magnético foi limitado a 2px. O scroll movimenta imagens do cardápio, a cena narrativa, o palco do clipe, o cartaz de endereço e a assinatura do rodapé.

## Evidência

- `npm.cmd run check`: sintaxe dos módulos e servidor.
- `npm.cmd test`: 9 testes de lógica aprovados, incluindo limite do cursor.
- `qa/browser-results.json`: 43 checks do site, quatro larguras (320, 390, 768 e 1440px), fluxos de consulta, teclado, imagens/fontes, vídeo, ranges e fallbacks.
- `qa/v3-scroll/results.json`: 34 checks específicos aprovados.
- `qa/v3-scroll/cleanup.json`: 3 verificações adicionais aprovadas — pontes instaladas, APIs originais restauradas e cleanup por AbortSignal.
- Cursor real de desktop: imagem dentro dos limites, títulos fixos e PNG original confirmado.
- Scroll motion detectado separadamente no menu, narrativa, clipe, endereço e rodapé.
- Lenis: uma instância, `lerp: 0.1`, CSS `scroll-behavior: auto`, touch nativo.
- Roda: resposta intermediária antes do destino e desaceleração até a posição pedida.
- Primeiro clique com mouse em âncora: animação, hash e foco corretos. Back/Forward restauram posição e hash.
- `window.scrollTo` instantâneo e suave durante inércia: destino preservado.
- PageDown e foco: nativos, sem puxão de volta.
- Rolagem interna: conteúdo interno se move, documento permanece parado.
- Modal nativo e modal ARIA já existente: suspensão e retomada verificadas.
- Alteração ao vivo de movimento reduzido: instância destruída; retomada sem reload.
- Touch em emulação: página se move sem instância Lenis.
- Cleanup: remoção de instância e classe Lenis; listeners, observers, timers e pontes de API têm cleanup no módulo.
- Vídeo decodificado na resolução nova, sem ampliação horizontal; captura em `qa/v3-scroll/film-1920.jpg`.

A revisão independente encontrou problemas no foco de mouse antes de âncoras e na observação de modal ARIA; ambos foram corrigidos e têm regressões cobertas nos checks de navegador.

## Visual e limites

Capturas de desktop, tablet, mobile e quadros da página em `qa/v3-final/` foram abertas e conferidas. Inspector: 0 falhas com as exceções documentadas da composição; avisos de papel quente e escala tipográfica fluida mantidos por seguirem o briefing. Não há afirmação de auditoria WCAG completa, leitor de tela testado ou medição em aparelho físico.

Todos os recursos fotográficos permanecem ilustrativos. O clipe é animação de fotografia, não filmagem real. Fatos comerciais e WhatsApp confirmado foram preservados. Nenhuma mensagem foi enviada a terceiros e nenhuma publicação externa foi realizada nesta revisão.
