import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuantity, buildInquiry, createWhatsAppURL, filterItems } from '../dist/menu.js';

test('a consulta não promete pedido confirmado ou inventa preço', () => {
  const text = buildInquiry([{name:'Marmitex com bife',quantity:2}], 'retirada');
  assert.match(text, /2 × Marmitex com bife/);
  assert.match(text, /disponibilidade e valores/);
  assert.match(text, /retirada/);
  assert.doesNotMatch(text, /confirmado|R\$/);
});
test('a mensagem é codificada e usa apenas o número confirmado', () => {
  const url = new URL(createWhatsAppURL('Olá! Quero feijão & arroz.'));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/5531997552353');
  assert.equal(url.searchParams.get('text'), 'Olá! Quero feijão & arroz.');
});
test('quantidades inválidas não contaminam a mensagem', () => {
  for (const n of [0,-3,NaN,Infinity,'abc',null]) assert.equal(normalizeQuantity(n),1);
  assert.equal(normalizeQuantity('2'),2);
  assert.equal(normalizeQuantity(300),20);
  assert.equal(normalizeQuantity(2.7),2);
});
test('filtros mostram somente a categoria e todos é reversível', () => {
  const items=[{category:'almoco'},{category:'lanches'}];
  assert.equal(filterItems(items,'almoco').length,1);
  assert.deepEqual(filterItems(items,'todos'),items);
  assert.deepEqual(filterItems(items,'inexistente'),[]);
});
