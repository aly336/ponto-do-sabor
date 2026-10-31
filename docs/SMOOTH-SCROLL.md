# Smooth scroll — integração completa

Implementação em `dist/smooth-scroll.js`, chamada por `dist/app.js`. O contêiner escolhido para `[CONTÊINER]` é a rolagem principal do documento: `wrapper: window`, `content: document.documentElement`. A posição real de scroll continua sendo a do navegador; o conteúdo não é transportado por um wrapper com transform.

Não havia Lenis, Locomotive ou equivalente. Foi incluído o Lenis **1.3.27**, versão fixa consultada no registro npm, com módulo e CSS servidos localmente em `dist/vendor/`. O pacote foi baixado sem scripts de instalação. Não há dependência de CDN nem instalação necessária para rodar o site.

Fonte oficial: [documentação e código do Lenis](https://github.com/darkroomengineering/lenis). Licença MIT preservada em `dist/vendor/LICENSE`.

## Código de encaixe

O arquivo `dist/smooth-scroll.js` contém a implementação completa e já está conectado ao site. O encaixe no módulo principal é:

```js
import { initSmoothScroll } from './smooth-scroll.js';

const lifecycle = new AbortController();
const smoothScroll = initSmoothScroll({ signal: lifecycle.signal });

// Ao desmontar definitivamente:
lifecycle.abort();
// Ou: smoothScroll.destroy();
```

No projeto real, `lifecycle` é reutilizado por todo `app.js`; `pagehide` faz o cleanup definitivo quando a página não vai para o bfcache. Em navegação com bfcache, a instância é retirada na saída e recriada em `pageshow`. Não adicione outro loop de RAF: a instância usa `autoRaf: true`.

O HTML carrega o CSS local:

```html
<link rel="stylesheet" href="vendor/lenis.css">
```

O CSS da página contém:

```css
html {
  scroll-behavior: auto;
  scroll-padding-top: 24px;
}
```

Não reaplicar `scroll-behavior: smooth` ao `html`. A preferência de movimento reduzido também conserva `auto`.

## Valores ajustáveis

No início de `dist/smooth-scroll.js`:

```js
export const SCROLL_SETTINGS = Object.freeze({
  lerp: 0.1,
  wheelMultiplier: 1,
  nativeResumeDelay: 220,
  preventSelector: '[data-native-scroll], dialog, [role="dialog"], input, textarea, select, [contenteditable="true"]'
});
```

- `lerp`: intensidade da interpolação da roda do mouse. Valor final 0,1. Alterações pequenas, como 0,09–0,12, mudam a sensação sem criar arrasto excessivo.
- `wheelMultiplier`: distância recebida da roda; mantida em 1.
- `nativeResumeDelay`: espera de 220ms depois de o movimento nativo terminar, antes de retomar a suavização da roda. Não atrasa teclado, foco ou scroll programático.
- `preventSelector`: áreas que mantêm seu comportamento nativo.

Não foi configurado `duration` junto de `lerp`: a roda usa a interpolação moderada, sem duas temporizações concorrentes. Âncoras com mouse usam a mesma instância e o mesmo ritmo.

## Estados e compatibilidade

- **Inicial:** documento e controles visíveis; comportamento nativo enquanto o módulo local carrega.
- **Desktop com ponteiro fino:** uma instância, `smoothWheel: true`, `syncTouch: false`, `lerp: 0.1`.
- **Touch:** nenhuma instância própria; gestos e inércia do navegador permanecem nativos.
- **Movimento reduzido:** a instância própria é destruída; a alteração da preferência é aplicada sem reload.
- **Pausa geral:** muda para scroll nativo; não bloqueia a rolagem.
- **Sem JS, biblioteca indisponível ou APIs insuficientes:** mantém HTML e scroll nativos.
- **Desmontagem:** remove observers, listeners, RAF da instância, timers e as pontes temporárias de API.

Uma chave `Symbol.for('ponto-do-sabor.smooth-scroll')` impede inicialização duplicada. Uma instância Lenis já exposta em `window.lenis` é reutilizada, sem criar outro RAF; suas opções anteriores são restauradas ao desmontar o adaptador.

As âncoras de mouse atualizam o hash e preservam o histórico; ao concluir, o destino recebe foco sem novo scroll. Ativação por teclado permanece nativa. `popstate` e `hashchange` entregam a restauração ao navegador.

Antes de teclado, foco, touch, modais ou APIs programáticas, a inércia própria é cancelada. Existem pontes temporárias para `window.scrollTo`, `scroll`, `scrollBy` e `Element.scrollIntoView`: elas evitam que um frame do Lenis cancele uma animação nativa iniciada por outro código. As funções originais são restauradas no cleanup, sem sobrescrever uma eventual alteração posterior de outro código.

## Áreas internas e modais

O projeto usa `allowNestedScroll: true`. Uma área específica pode ser marcada explicitamente:

```html
<div data-native-scroll style="max-height:20rem; overflow:auto">
  <!-- conteúdo com scroll próprio -->
</div>
```

`dialog[open]`, modais ARIA visíveis e mudanças de overflow no documento suspendem a instância própria. Mudanças de `open`, `aria-modal`, `hidden`, classe e estilo do modal são acompanhadas. O site atual não adicionou um modal apenas para demonstrar o recurso.

## Teste manual breve

1. **Desktop:** usar a roda, inverter o sentido e clicar pela primeira vez em Cardápio. Conferir resposta inicial rápida e desaceleração; voltar/avançar deve restaurar posição e hash.
2. **Teclado:** Tab, PageDown, setas, Home/End e âncora com Enter. Conferir foco visível e ausência de puxão para a posição anterior.
3. **Mobile:** arrastar normalmente a página e uma área interna. Nenhuma suavização adicional deve interferir no touch.
4. **Movimento reduzido:** mudar a preferência com a página aberta; a instância deve desaparecer, mantendo todo o conteúdo e os links utilizáveis.
5. **Programação/modal:** chamar `window.scrollTo({top:2600,behavior:'smooth'})` durante a inércia e abrir um modal. O navegador deve completar a operação sem disputa.

Os resultados executados estão em `docs/qa/v3-scroll/results.json`. Testes em hardware móvel físico permanecem fora da validação realizada nesta sessão.
