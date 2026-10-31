import test from 'node:test';
import assert from 'node:assert/strict';
import { ribbonRepeats, pointerPosition, sceneProgress, heroPointerPose } from '../dist/motion.js';

test('cada metade da faixa cobre telas maiores que a frase original',()=>{
  for(const width of [320,390,1440,1920,2560,3840]){
    const phrase=870;
    assert.ok(ribbonRepeats(phrase,width)*phrase>=width+phrase);
  }
});
test('medidas ainda indisponíveis não geram repetição infinita',()=>{
  for(const value of [0,-1,NaN,Infinity])assert.equal(ribbonRepeats(value,1920),1);
});
test('cursor é centralizado e limitado, mesmo fora da cena',()=>{
  const rect={left:100,top:50,width:800,height:400};
  assert.deepEqual(pointerPosition(500,250,rect),{x:0,y:0});
  assert.deepEqual(pointerPosition(2000,-500,rect),{x:1,y:-1});
  assert.deepEqual(pointerPosition(30,20,{left:0,top:0,width:0,height:0}),{x:0,y:0});
});
test('progresso da cena não extrapola nem divide por zero',()=>{
  assert.equal(sceneProgress(-100,0,1000),0);
  assert.equal(sceneProgress(500,0,1000),.5);
  assert.equal(sceneProgress(1400,0,1000),1);
  assert.equal(sceneProgress(100,100,100),0);
});
test('a mão reage só alguns pixels e menos de meio grau',()=>{
  const extreme=heroPointerPose({x:12,y:-12});
  assert.equal(extreme.x,3);
  assert.equal(extreme.y,-2);
  assert.equal(extreme.rotateX,.25);
  assert.equal(extreme.rotateY,.35);
  const center=heroPointerPose({x:0,y:0});
  assert.equal(Math.abs(center.x)+Math.abs(center.y)+Math.abs(center.rotateX)+Math.abs(center.rotateY),0);
});
