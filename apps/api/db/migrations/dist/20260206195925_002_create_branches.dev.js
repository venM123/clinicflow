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
          return regeneratorRuntime.awrap(knex.schema.createTable('branches', function (table) {
            table.bigIncrements('id').primary();
            table.bigInteger('tenant_id').unsigned().notNullable().references('id').inTable('tenants').onDelete('RESTRICT').onUpdate('CASCADE');
            table.string('branch_code', 40).notNullable();
            table.string('name', 150).notNullable();
            table.string('address_line1', 200).notNullable();
            table.string('address_line2', 200).nullable();
            table.string('city', 100).notNullable();
            table.string('province', 100).notNullable();
            table.string('postal_code', 20).nullable();
            table.string('phone', 30).nullable();
            table.string('email', 150).nullable();
            table["boolean"]('is_main').notNullable().defaultTo(false);
            table.enu('status', ['active', 'inactive'], {
              useNative: false,
              enumName: 'branches_status_enum'
            }).notNullable().defaultTo('active');
            table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
            table.dateTime('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.dateTime('deleted_at').nullable();
            table.unique(['tenant_id', 'branch_code'], 'uq_branches_tenant_branch_code');
            table.index(['tenant_id', 'status'], 'idx_branches_tenant_status');
            table.index(['city', 'province'], 'idx_branches_city_province');
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
          _context2.next = 2;
          return regeneratorRuntime.awrap(knex.schema.dropTableIfExists('branches'));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};