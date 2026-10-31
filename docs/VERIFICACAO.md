# Verificação — primeira entrega

Histórico da versão inicial. A revisão atual está documentada em [VERIFICACAO-V2.md](VERIFICACAO-V2.md).

Data: 30/10/2026. Implementação local estática, sem dependências em runtime.

## Código e interação

- `npm.cmd run check`: verificação de sintaxe de app.js, menu.js e server.mjs.
- `npm.cmd test`: 4 testes de lógica — mensagem de consulta sem preço/compra fictícia, número confirmado, codificação da mensagem, quantidades inválidas e filtros.
- Chrome local via CDP: 43 checks funcionais, sem falhas no resultado final em `qa/browser-results.json`.
- Viewports: 320, 390, 768 e 1440px. Sem overflow horizontal, fotos e fontes carregadas, sem exceções JavaScript.
- Filtros Almoço/Lanches/Tudo; seleção e quantidade; mensagem de retirada; limpeza com foco; flip com face oculta fora da árvore acessível; nomes acessíveis de links/botões no AX tree.
- Menu mobile abre com Enter, fecha com Escape e mantém foco no acionador.
- Vídeo decodificado em 1280 × 720, reprodução e pausa verificadas. Servidor retorna 206 para byte-range válido e 416 para faixa fora do arquivo.
- Conteúdo visível com movimento reduzido, JavaScript ausente e IntersectionObserver ausente. Em no-JS, navegação não cobre o título; faixa permanece parada e links reais são preservados.
- Revisão independente de código encontrou link WhatsApp sem nome no mobile e faixa sem pausa no no-JS; ambos corrigidos antes da entrega.

Os checks de navegador exercitam destinos e mensagens sem enviar mensagens a terceiros. Não houve teste de pedido real, telefone, atendimento, pagamento ou entrega.

## Revisão visual

Capturas do topo, página inteira e fallbacks estão em `qa/`. Foram abertas e comparadas com a imagem `reference.png` do template fornecido. Correções incluíram: condensação do lettering, prato central mais alto no desktop, remoção de azul na foto de hambúrguer, xadrez em duas fileiras, textos maiores, rodapé dentro da tela e braços ancorados à borda no mobile.

Taste lint: 0 falhas, aviso sobre Inter — mantido por ser a fonte exata fornecida no template. Impeccable detector foi executado; avisos de Inter/marquee seguem o briefing e a faixa tem pausa. Os avisos de padding em seções usam análise estática e não representam o espaçamento renderizado, conferido nas capturas.

Taste inspector: 0 falhas com exceções documentadas, um aviso de quantidade de tamanhos tipográficos. A escala varia por breakpoint para preservar o cartaz do template. Exceções:
- `headline-lines`: o slogan lateral mantém o empilhamento do template.
- `covered-text`: o medidor usa caixas tipográficas; identificou caixas de glifos sobrepostas no wordmark condensado, número de endereço e face traseira 3D oculta. As capturas e o controle de face foram conferidos; nenhum controle ou texto de leitura fica sob foto.
- `eyebrow`: falso positivo em localização funcional, faixa e link de rota; esses elementos não são etiquetas decorativas acima de títulos.

Autoavaliação visual, subjetiva: design 8/10, usabilidade 8/10, criatividade 7/10 (reprodução solicitada), conteúdo 7,5/10 (imagens ilustrativas e cardápio diário a consultar). Ponderação 40/30/20/10: 7,75/10. Limites: wordmark é uma adaptação tipográfica, não a arte original do pequeno avatar; fotos ilustrativas não comprovam a composição real dos pratos; clipe anima foto. Não houve teste em aparelho físico, leitor de tela ou auditoria WCAG completa.

## Conteúdo e estado

WhatsApp confirmado pelo usuário: +55 31 99755-2353. Endereço e Instagram vêm do material fornecido. Sem preços, horários, avaliações ou depoimentos inventados. O texto visível e os metadados do site não usam a antiga atividade comercial. Consulte a equipe para confirmar cardápio, disponibilidade, entrega e horários.

Publicação pendente: a revisão automática rejeitou o envio de código ao repositório externo do Sites por falta de autorização explícita desse destino. Nenhum código foi enviado pelo workflow e não houve deploy. O identificador de projeto criado é apenas registro de configuração; a URL esperada não é uma publicação confirmada. Para prosseguir, é necessária autorização do usuário para enviar o código e publicar privadamente no Sites.
