"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("payments", function (table) {
    table.bigIncrements("id").primary();
    table.bigInteger("tenant_id").unsigned().notNullable().references("id").inTable("tenants").onDelete("RESTRICT").onUpdate("CASCADE");
    table.bigInteger("invoice_id").unsigned().notNullable().references("id").inTable("invoices").onDelete("CASCADE").onUpdate("CASCADE");
    table.decimal("amount", 12, 2).notNullable();
    table.enu("payment_method", ["cash", "gcash", "maya", "card", "bank_transfer", "hmo"], {
      useNative: false,
      enumName: "payments_method_enum"
    }).notNullable();
    table.string("reference_no", 80).nullable();
    table.enu("status", ["posted", "void"], {
      useNative: false,
      enumName: "payments_status_enum"
    }).notNullable().defaultTo("posted");
    table.dateTime("paid_at").notNullable().defaultTo(knex.fn.now());
    table.bigInteger("received_by_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL").onUpdate("CASCADE");
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    table.index(["tenant_id", "invoice_id"], "idx_payments_tenant_invoice");
    table.index(["payment_method", "paid_at"], "idx_payments_method_paid_at");
    table.index(["status"], "idx_payments_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("payments");
};