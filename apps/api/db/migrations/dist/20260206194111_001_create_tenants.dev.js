"use strict";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function _callee(knex) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(knex.schema.createTable('tenants', function (table) {
            table.bigIncrements('id').primary();
            table.string('code', 50).notNullable().unique();
            table.string('name', 150).notNullable();
            table.string('legal_name', 200).nullable();
            table.string('email', 150).nullable();
            table.string('phone', 30).nullable();
            table.enu('subscription_plan', ['starter', 'growth', 'pro'], {
              useNative: false,
              enumName: 'tenants_subscription_plan_enum'
            }).notNullable().defaultTo('starter');
            table.enu('status', ['active', 'suspended', 'trial', 'closed'], {
              useNative: false,
              enumName: 'tenants_status_enum'
            }).notNullable().defaultTo('trial');
            table.string('timezone', 64).notNullable().defaultTo('Asia/Manila');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('deleted_at').nullable();
            table.index(['status'], 'idx_tenants_status');
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.down = function _callee2(knex) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", knex.schema.dropTableIfExists('tenants'));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};