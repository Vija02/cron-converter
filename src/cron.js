'use strict';

var moment = require('moment');

var Part = require('./part');
var Seeker = require('./seeker');
var units = require('./units');

/**
 * Creates an instance of Cron.
 * Cron objects each represent a cron schedule.
 *
 * @constructor
 * @this {Cron}
 */
function Cron() {
  this.parts = null;
  this.seeker = new Seeker(this);
}

/**
 * Parses a cron string.
 *
 * @this {Cron}
 * @param {string} str The string to parse.
 */
Cron.prototype.fromString = function(str) {
  if (typeof str !== 'string') {
    throw new Error('Invalid cron string');
  }
  var parts = str.replace(/\s+/g, ' ').trim().split(' ');
  if (parts.length === 5) {
    this.parts = parts.map(function(str, idx) {
      var part = new Part(units[idx]);
      part.fromString(str);
      return part;
    });
  } else {
    throw new Error('Invalid cron string format');
  }
  return this;
};

/**
 * Returns the cron schedule as a string.
 *
 * @this {Cron}
 * @return {string} The cron schedule as a string.
 */
Cron.prototype.toString = function() {
  if (this.parts === null) {
    throw new Error('No schedule found');
  }
  return this.parts.join(' ');
};

/**
 * Parses a 2-dimentional array of integers as a cron schedule.
 *
 * @this {Cron}
 * @param {array} cronArr The array to parse.
 */
Cron.prototype.fromArray = function(cronArr) {
  if (cronArr.length === 5) {
    this.parts = cronArr.map(function(partArr, idx) {
      var part = new Part(units[idx]);
      part.fromArray(partArr);
      return part;
    });
  } else {
    throw new Error('Invalid cron array');
  }
  return this;
};

/**
 * Returns the cron schedule as
 * a 2-dimentional array of integers.
 *
 * @this {Cron}
 * @return {array} The cron schedule as an array.
 */
Cron.prototype.toArray = function() {
  if (this.parts === null) {
    throw new Error('No schedule found');
  }
  return this.parts.map(function(part) {
    return part.toArray();
  });
};

/**
 * Returns the time the schedule would run next.
 *
 * @this {Cron}
 * @param {Date} now A Date object
 * @return {Date} The time the schedule would run next.
 */
Cron.prototype.next = function(now) {
  return this.seeker.next(now);
};

/**
 * Returns the time the schedule would have last run at.
 *
 * @this {Cron}
 * @param {Date} now A Date object
 * @return {Date} The time the schedule would have last run at.
 */
Cron.prototype.prev = function(now) {
  return this.seeker.prev(now);
};

module.exports = Cron;
