/* jslint node: true, sub: true */
/* global describe: false, it: false */
'use strict';

var kbalance = require('../'),
    expect  = require('chai').expect;

// Tests

describe('gwp-emergencies', function() {

  // find
  describe('get()', function() {
    it('should get a emergency info with given date 2018-05-08', function(done) {
      kbalance.get({date: '2018-05-08', street_name: 'პოლიტკოვსკაია'}, function(err, result) {
        if(err) return done(err);

        expect(err).to.be.equal(null);
        expect(result).to.be.a('array');
        expect(result).to.have.deep.property('[0].address', 'პოლიტკოვსკაიას ქ.');

        done();
      });
    });

    it('should fail to get a information (missing options)', function(done) {
      kbalance.get(null, function(err, result) {
        if(!err) return done('No error!');

        expect(result).to.be.equal(undefined);
        done();
      });
    });

    it('should not return any information (bad date)', function(done) {
      kbalance.get({date: '.'}, function(err, result) {
        if(!err) return done('No error!');

        expect(result).to.be.equal(undefined);
        done();
      });
    });
  });

});