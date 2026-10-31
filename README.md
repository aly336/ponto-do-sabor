# Restaurante Ponto do Sabor

Site responsivo adaptado do template fornecido. A revisão 3 restaura a mão com o prato, mantém a cozinha mineira amarela e o papel do cardápio, reduz o cursor a um efeito sutil e distribui scroll motion pela página. Lenis local suaviza a roda no desktop, preservando touch, teclado, foco, histórico, áreas internas e movimento reduzido. O xadrez continua removido.

## Abrir e editar

Requer Node.js 22 ou superior para o servidor local. Não há dependências para instalar.

```powershell
npm.cmd start
```

Abra http://localhost:5173. `dist/index.html` também permite leitura direta, com os links reais funcionando; filtros e controles de animação precisam de HTTP para carregar o módulo JavaScript.

Arquivos:
- `dist/index.html`: conteúdo, links e estrutura.
- `dist/styles.css`: identidade, responsividade e animações.
- `dist/ambiente.css`: revisão visual de cozinha, textura e composição da mesa.
- `dist/app.js`: filtros, seleção, navegação, flip, movimento e vídeo.
- `dist/motion.js`: faixa contínua, cálculo de repetição, movimento em camadas e cursor.
- `dist/smooth-scroll.js`: instância única do Lenis, adaptação do scroll nativo e cleanup.
- `dist/vendor/`: Lenis 1.3.27, CSS, source map e licença MIT.
- `dist/menu.js`: composição da consulta ao WhatsApp.
- `dist/assets/`: mídia otimizada e fontes locais.
- `source-assets/`: PNGs originais das duas revisões, preservados.
- `docs/MIDIA-E-PROMPTS.md`: procedência e prompts de criação.
- `docs/PROMPTS-V2.md`: imagens novas e edição da mesa completa.
- `docs/SMOOTH-SCROLL.md`: integração, código de encaixe, seletores, parâmetros e teste manual.
- `docs/VERIFICACAO-V3.md`: evidência e limites da revisão atual; os documentos anteriores registram o histórico.
- `PRODUCT.md` e `DESIGN.md`: fatos e contrato visual.

## Verificar código

```powershell
npm.cmd run check
npm.cmd test
```

## Conteúdo comercial

WhatsApp confirmado pelo usuário: **+55 31 99755-2353**. A seleção do cardápio compõe uma consulta com quantidade e preferência por retirada/entrega. Ela não confirma pedido, disponibilidade ou pagamento.

Fotos e clipe são ilustrativos; essa informação aparece no site. Frango, churrasco e bife constam no material fornecido. Hambúrguer e feijoada são apresentações permitidas no briefing e exigem consulta. Não foram inventados preços, horários, avaliações, taxa ou cobertura de entrega.

O endereço e o telefone fixo fornecidos coincidem com o cadastro consultado em [Bendito Guia](https://www.benditoguia.com.br/empresa/restaurante-ponto-do-sabor-florenca-ribeirao-das-neves-mg). O site prioriza o WhatsApp corrigido pelo usuário. O Instagram vem do material fornecido.

## Publicação

O site é estático. Publique o conteúdo de `dist/` em uma hospedagem estática. `server.mjs` é apenas o servidor de desenvolvimento e suporta byte-range para o vídeo. A configuração privada do Sites está em `.openai/hosting.json`; ela não contém credenciais.
