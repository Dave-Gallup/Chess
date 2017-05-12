var expect = require('chai').expect;
var Move = require('../move').Move;

describe('Move', function(){

  var move;

  before(function(){
    //move = new Move('black');
  });

  it('should parse move reponse string', function(){

    let obj1 = Move.parseMoveResponse('pd3');
    expect(obj1.type).to.equal('p');
    expect(obj1.modifier).to.be.undefined;
    expect(obj1.target).to.equal('d3');

    let obj2 = Move.parseMoveResponse('qxc5');
    expect(obj2.type).to.equal('q');
    expect(obj2.modifier).to.be.undefined;
    expect(obj2.target).to.equal('c5');

    let obj3 = Move.parseMoveResponse('raxa4');
    expect(obj3.type).to.equal('r');
    expect(obj3.modifier).to.equal('a');
    expect(obj3.target).to.equal('a4');

    let obj4 = Move.parseMoveResponse('n5xb7');
    expect(obj4.type).to.equal('n');
    expect(obj4.modifier).to.equal('5');
    expect(obj4.target).to.equal('b7');

    let obj5 = Move.parseMoveResponse('n5xb7+');
    expect(obj5.type).to.equal('n');
    expect(obj5.modifier).to.equal('5');
    expect(obj5.target).to.equal('b7');

    let obj6 = Move.parseMoveResponse('++n+5x++++b7++');
    expect(obj6.type).to.equal('n');
    expect(obj6.modifier).to.equal('5');
    expect(obj6.target).to.equal('b7');
  });



});
