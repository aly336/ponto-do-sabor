# Mídia e prompts

Este documento registra a mídia da primeira entrega. A mesa completa, o fundo de cozinha, o papel e o clipe substituído estão descritos em [PROMPTS-V2.md](PROMPTS-V2.md).

## Procedência

Cinco fotos foram criadas com a ferramenta integrada ImageGen. São imagens de referência de comida, não registros de pratos, pessoas, equipe ou instalações reais do restaurante. As legendas do site informam o caráter ilustrativo.

| Arquivo usado no site | Original preservado | Conteúdo |
|---|---|---|
| `assets/prato-nas-maos.webp` | `source-assets/prato-nas-maos.png` | Feijoada com arroz, couve, farofa, torresmo e laranja, oferecida nas mãos, fundo transparente |
| `assets/frango.webp` | `source-assets/frango.png` | Prato ilustrativo com frango assado e acompanhamentos |
| `assets/churrasco.webp` | `source-assets/churrasco.png` | Prato ilustrativo com carne grelhada e acompanhamentos |
| `assets/hamburguer.webp` | `source-assets/hamburguer.png` | Hambúrguer ilustrativo sobre papel preto e fundo amarelo |
| `assets/feijoada.webp` | `source-assets/feijoada.png` | Tigela de feijoada e acompanhamentos sobre fundo vermelho |

WebP foi codificado pelo navegador em qualidade 90%, preservando as dimensões e a transparência. Não há fotos de banco ou imagens externas carregadas em runtime. Fontes Teko e Inter vieram do ZIP fornecido. Wordmark tipográfico, ícones geométricos e xadrez foram implementados em código.

O Canva também gerou uma proposta complementar de prato com frango grelhado. A versão de produção usa a foto de frango assado gerada no ImageGen para manter a composição consistente. A proposta do Canva está disponível em [Open generated image](https://www.canva.com/M/MAHZhMJ524c?utm_source=OC-AaBlKrqBJJNF&utm_campaign=agent_connector_create_image_asset_opened).

## Conjunto de prompts de criação

### Prato nas mãos — photorealistic-natural

Create a premium photorealistic food advertising CUTOUT for a Brazilian comida mineira restaurant homepage. Isolated with fully transparent background. A beautiful generous round matte black ceramic plate, held up toward the camera by TWO realistic adult Brazilian hands and forearms entering from the bottom edge, one under each side of the plate. No face, no body. 3/4 front overhead view so the FOOD is clearly visible, like a big elevated lunch offering. Plate contains traditional feijoada black beans and sausage, a generous mound of white rice, finely sliced sauteed collard greens, golden farofa, crispy pork crackling and two orange slices arranged naturally. Very appetizing real handmade food, rich texture, realistic proportions, warm campaign lighting, crisp focused food. Full plate completely visible with generous transparent padding left and right. Tall portrait composition around 2:3 with food plate in upper half and natural hands/forearms below, reaching the bottom edge. This asset replaces a central hand holding a burger in a bold typographic website, so keep silhouette compact and central. No text, no lettering, no logos, no utensils, no pizza, no table, no background, no circular backdrop. Accurate human hands, realistic food, avoid toy or plastic appearance.

### Churrasco — photorealistic-natural

Photorealistic premium Brazilian comida mineira lunch campaign photograph, horizontal 3:2 composition. A generous oval matte white ceramic plate on a solid bold golden yellow studio table, with grilled beef strips lightly charred and juicy, fluffy white rice, traditional beans, farofa, sauteed collard greens and simple tomato salad. Three-quarter overhead view, plate fully visible, no human, no utensils, no text, no logos, no packaging, no pizza. Beautiful authentic everyday Brazilian lunch, natural portions, warm side light, crisp real food texture. Editorial food advertising consistent with a black red yellow Brazilian restaurant website. This is illustrative cuisine photography, not an actual business dish. Fill frame generously with plate, very minimal background.

### Feijoada — photorealistic-natural

Photorealistic editorial Brazilian comida mineira feijoada campaign image, landscape 3:2. Overhead three-quarter view of a black rustic ceramic bowl filled with glossy traditional black bean feijoada and sliced smoked sausage, gentle natural steam, beside a white ceramic plate with fluffy rice, crisp pork crackling, thin collard greens, golden farofa and orange wedges. Solid rich red studio table with warm natural light, authentic homemade textures, no text, no logos, no pizza, no humans, no mock restaurant interior. Main food centered filling the frame with a little breathing room. This is illustrative cuisine photography for a Brazilian restaurant website. Premium but honest and delicious, not fine dining tiny portions.

### Frango assado — photorealistic-natural

Premium photorealistic Brazilian lunch food advertising photograph, horizontal 3:2 crop. Generous round white ceramic plate of golden roasted chicken thigh and drumstick, fluffy white rice, brown beans, sauteed collard greens and golden farofa, simple homemade Brazilian comida mineira. Plate fully visible on solid rich golden yellow background. Three quarter overhead angle, warm directional studio sunlight, delicious real texture, no text, no lettering, no brand, no human, no utensils, no pizza. Large plate occupies almost whole frame, consistent polished food campaign, natural realistic food not plastic, no fake restaurant interior. Illustrative cuisine photograph.

### Hambúrguer — photorealistic-natural

Professional photorealistic Brazilian hamburger food campaign photograph, horizontal 3:2 image. One generous beautiful handmade hamburger with toasted golden bun, juicy beef patty, melted yellow cheese, a fresh lettuce leaf, tomato and mayonnaise, on a simple matte BLACK paper square, on a solid rich golden YELLOW studio table and background. Three-quarter view, burger centered and fills most of the image, warm directional soft light, realistic delicious food texture. No packaging, NO BLUE, no text, no logos, no box, no hands, no pizza. Illustrative product photo for a Brazilian comida mineira and lanches restaurant website, consistent with editorial food photos of generous lunch plates on golden yellow.

## Clipe

`dist/assets/sabor-em-movimento.webm`: 1280 × 720, VP9, sem áudio, aproximadamente 8 segundos. É uma animação da fotografia de feijoada: zoom e deslocamento suaves, curva cossenoidal de ida e volta com estados inicial/final iguais. Não é filmagem real nem vídeo generativo. Poster, pausa e movimento reduzido estão implementados.

A tentativa de geração por Figma/Weave retornou conta não vinculada. Não houve geração nem consumo aprovado nesse serviço. A animação de fotografia é a alternativa efetivamente entregue.

## Referências recebidas

O template do ZIP governa a homepage. O documento Karl fornecido contribuiu com apresentação por camadas e campos de cor, sem importar o tema azul ou reconstruir um portfólio ilustrado. O documento de animações fornecido foi adaptado aos elementos reais: rotação, zoom, fade, slide, stagger, máscara, flip, split por trechos, parallax decorativo e botão magnético. Scroll é nativo e suave; o quadro da feijoada é sticky no desktop. Não há captura de wheel/touch nem espera por uma sequência para acessar o conteúdo.
