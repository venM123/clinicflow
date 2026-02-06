"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("guardians", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.string("full_name", 150).notNullable();
    table.string("relationship", 60).notNullable();
    table.string("mobile", 30).nullable();
    table.string("email", 150).nullable();
    table.string("address", 255).nullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "full_name"], "idx_guardians_tenant_full_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("guardians");
};