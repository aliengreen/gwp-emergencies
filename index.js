/* jslint node: true, sub: true */
'use strict';

var request = require('request');
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');

// Init the module
module.exports = (function () {

  var defTimeout = 10000,
      url        = 'https://www.gwp.ge/en/gadaudebeli-new';

  var checkDate = function (date) {
    if (date.length === 10) {
      if (date.indexOf("-") !== -1) {
        return date;
      }
    } 
    return undefined;
  };

  var normallizeAddress = function (address) {
    var norm = address.split(';');
    
    if(norm.length == 2) {
      return norm[1].trim();
    }

    return address;
  };

  var normallizeDistrict = function (address) {
    var norm = address.split(';');
    
    if(norm.length == 2) {
      return norm[0].trim();
    }

    return '';
  };

  var normallizeDate = function (date) {
    var norm = date.replace(/\n/g, '');
    norm += " GMT+0400"; // Explicit set timezone +4 for parsing correctly 
    var dt = new Date(Date.parse(norm));
    // return dt.toISOString();

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; // Offset in milliseconds
    return (new Date(dt - tzoffset)).toISOString();
  };

  var calculateDuration = function (restriction_date, recovery_date) {
    restriction_date  = restriction_date.replace(/\n/g, '');
    restriction_date += " GMT+0400"; // Explicit set timezone +4 for parsing correctly 
    var res_date = new Date(Date.parse(restriction_date));

    recovery_date  = recovery_date.replace(/\n/g, '');
    recovery_date += " GMT+0400"; // Explicit set timezone +4 for parsing correctly 
    var rec_date = new Date(Date.parse(recovery_date));

    var tmp  = (rec_date - res_date) / 1000;
    var hour = parseInt((tmp / 60) / 60);
    var min  = parseInt((tmp / 60) % 60);
    return hour + ':' + min;
  };
  

  var get = function get(options, callback) {

    if (typeof callback !== 'function')
      callback = function callback(err, result) {
        return err || result;
      };

    if (!options || typeof options !== 'object')
      return callback('Invalid options');

    if (!options.date)
      return callback('Missing date input');

    var requestDate = checkDate(options.date);
    if (requestDate === undefined) {
      return callback('Invalid date. Format should be YYYY-MM-DD');
    }

    var timeout = options.timeout || defTimeout;

    request.post({url: url, timeout: timeout, form: {date: requestDate, district: '', submit: ''}}, function (err, res, body) {

      if (err) return callback(err);
      if (res.statusCode !== 200) return callback(new Error('request failed (' + res.statusCode + ')'));
      if (!body) return callback(new Error('failed to get body content'));

      // Check body content
      if (body.indexOf('<') !== 0) {
        if (body.search(/not found/i) !== -1) {
          return callback(null, {});
        }
        return callback(new Error('Invalid body content'));
      }

      var $ = cheerio.load(body);
      cheerioTableparser($);
      var data = $(".results").parsetable(true, true, true);

      if(data === undefined || data.length == 0) {
        return callback(new Error('No result'));
      }

      var result = [];

      /* 
       * Calculate total record count. Exclude first 
       * row of header and last 3 rows. The last 3 records represent the data of the table, not related to our actual data.
       * The total is 4 row
       */
      var count = data[0].length - 4;

      for(var i = 0; i < count; i++) {

        var record = {
            date: requestDate,
            district: normallizeDistrict(data[0][i + 1]),
            address: normallizeAddress(data[0][i + 1]),
            building: data[1][i + 1],
            street_number: data[2][i + 1],
            restriction_date: normallizeDate(data[3][i + 1]),
            recovery_date: normallizeDate(data[4][i + 1]),
            duration: calculateDuration(data[3][i + 1], data[4][i + 1]),
            postponement: data[5][i + 1],
            reason: data[6][i + 1],
            place_of_work: data[7][i + 1]
        };

        if(options.street_name !== undefined) {
          if(record.address.indexOf(options.street_name) > -1) {
            result.push(record);
          }
        } else {
           result.push(record);
        }
      }

      // console.log(result);

      return callback(null, result);
    });
  };

  return {
    get: get
  };
})();