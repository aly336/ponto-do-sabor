# Direção: o almoço no centro

Autoridade visual: template-caixa-quente-smash-v1.zip, especialmente assets/reference.png, hero.css e as fontes fornecidas. A referência explícita prevalece sobre sorteios e restrições de estilo das skills. Não houve sorteio de direção nem seed: reprodução dirigida pelo usuário.

A revisão 3 conserva cabeçalho simples, letras condensadas em dois lados e CTA circular. A mão com o prato original ocupa novamente o centro, sobre fundo fotográfico sutil de cozinha mineira com banho amarelo. Xadrez permanece removido. O cardápio usa textura fotográfica de papel claro, o preto sustenta a cena narrativa e o vermelho identifica ações.

Nesta página, o prato oferecido nas mãos transforma o nome Ponto do Sabor em um convite para o almoço do bairro Florença. O endereço 430 ancora o fechamento e o caminho até o restaurante.

## Sistema
- Amarelo #ffd21b; preto #181713; vermelho #c72520; branco #ffffff.
- Teko 700 do próprio template para títulos e wordmark; Inter 400/800 do template para leitura e controles. Duas famílias, arquivos locais.
- Botões preenchidos arredondados; controles de pelo menos 44px; foco contrastante, sem depender de hover.
- Sem preços fictícios; legendas de fotos ilustrativas junto da seleção.
- Mobile recompõe o cartaz: título acima, mão com o prato ao centro, CTA sobre o campo visual e localização junto do cabeçalho; textos de leitura ficam fora da fotografia.

## Argumento e conteúdo
1. Hero: comida mineira em Florença; prova por identidade/endereço fornecidos, foto ilustrativa; ação consultar pedido.
2. Seleção: tipos de marmitex informados, mais lanches ilustrativos; filtro e seleção compõem uma mensagem real de consulta.
3. Feijoada: mesa em cozinha ilustrativa com dois momentos de leitura; fotografia fixa dentro da seção no desktop, avançando sutilmente com a rolagem; controle revela detalhes, sem afirmar dia de disponibilidade.
4. Filme: imagem em movimento explicita que é clipe ilustrativo; pausa disponível.
5. Visita: endereço exato, mapa externo, Instagram e WhatsApp confirmado.

## Movimento
Rotation entry de 650ms no recorte principal; zoom 550ms nas fotos; fade 450ms; slide lateral 600ms; stagger 80ms limitado a 240ms; máscara 750ms; split por trechos na hero. Animações CSS transitórias são aplicadas apenas quando o observer dispara a 20%, sem esconder conteúdo na espera. Foco/pointer revela imediatamente. Parallax decorativo até 12px; botão magnético até 8px somente mouse fino. Sticky limitado à área da feijoada no desktop, sem captura de rolagem. Flip por botão com altura estável e faces não interativas. Motivo geométrico muda de forma apenas no controle da faixa. Scroll nativo suave, sem sequestrar wheel/touch. Movimento reduzido remove deslocamentos e autoplay. Pausa interrompe faixa, vídeo e movimento decorativo.

## Exceções justificadas
Títulos do cartaz mantêm empilhamento e escala da referência mesmo onde o inspetor genérico prefere duas linhas. A textura de papel e o amarelo contextual são pedidos explícitos desta revisão e prevalecem sobre alertas genéricos de paleta. O vídeo é animação de fotografia, não filmagem documental nem vídeo generativo.

## Movimento da revisão 3

O cursor afeta apenas a imagem principal: até 3px por 2px, inclinação inferior a 0,4 grau, sem deslocar as letras. Botão magnético limitado a 2px. O peso de movimento passa para o scroll do cardápio, da narrativa, do clipe, do endereço e do rodapé. Foco e pausa interrompem movimento; redução de movimento mantém tudo estático e acessível.

A rolagem principal usa uma instância local do Lenis 1.3.27, `lerp: 0.1`, sem CSS smooth concorrente. Touch, teclado, foco, histórico, caixas internas e APIs nativas recebem handoff. Ao desmontar, timers, observers, listeners, RAF e pontes de API são removidos. Detalhes e seletores em `docs/SMOOTH-SCROLL.md`.

A mão e a cena narrativa usam os PNGs originais. O clipe mantém resolução próxima da fonte e largura exibida máxima de 1600px; evita a ampliação 1,5× da versão anterior.

## Movimento da revisão 2 — histórico

A cena reage ao mouse fino com spring de massa 1, rigidez 100 e amortecimento 10: mesa até 14px, fundo até 9px, letras até 9px e inclinação da mesa até 3,2 graus. Camadas separadas evitam conflito entre entrada, scroll e cursor. Dados e controles continuam estáveis. O foco de teclado reinicia o desvio do cursor.

O scroll move o plano da mesa até 42px, imagens do cardápio até 13px por direção e foto narrativa até 14px por direção. Geometria é lida em resize/mudança de conteúdo; frames escrevem apenas transform. O loop do cursor para ao acomodar, fora da cena, com aba oculta, pausa ou movimento reduzido.

A faixa tem duas metades idênticas. Cada metade repete a frase até superar a largura visível mais uma frase. Recalcula após fontes e resize, sem cauda vazia perto de 100% do ciclo. Controle de pausa preservado. Sem JS, fica estática.
