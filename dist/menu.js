export const WHATSAPP = '5531997552353';
export function normalizeQuantity(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 ? Math.min(20, Math.floor(number)) : 1;
}
export function buildInquiry(items = [], mode = 'a combinar') {
  const choices = items.length ? '\nTenho interesse em:\n' + items.map(item => `${normalizeQuantity(item.quantity)} × ${item.name}`).join('\n') : '';
  return `Olá, Ponto do Sabor!${choices}\nPodem me informar as opções de hoje, disponibilidade e valores?\nAtendimento: ${mode}.`;
}
export function createWhatsAppURL(message = buildInquiry()) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
export function filterItems(items, category) {
  return category === 'todos' ? [...items] : items.filter(item => item.category === category);
}
