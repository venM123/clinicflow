exports.up = function (knex) {
  return knex.schema.createTable("invoices", function (table) {
    table.bigIncrements("id").primary();

    table
      .bigInteger("tenant_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tenants")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .bigInteger("branch_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("branches")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .bigInteger("patient_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("patients")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE");

    table
      .bigInteger("encounter_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("encounters")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");

    table.string("invoice_no", 50).notNullable();

    table.decimal("subtotal", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("discount_amount", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("tax_amount", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("total_amount", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("amount_paid", 12, 2).notNullable().defaultTo(0.0);
    table.decimal("balance_due", 12, 2).notNullable().defaultTo(0.0);

    table
      .enu("status", ["draft", "issued", "partially_paid", "paid", "void"], {
        useNative: false,
        enumName: "invoices_status_enum",
      })
      .notNullable()
      .defaultTo("issued");

    table.dateTime("issued_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("due_at").nullable();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .dateTime("updated_at")
      .notNullable()
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));

    table.unique(["tenant_id", "invoice_no"], "uq_invoices_tenant_invoice_no");
    table.index(["tenant_id", "branch_id", "issued_at"], "idx_invoices_tenant_branch_issued");
    table.index(["patient_id", "status"], "idx_invoices_patient_status");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("invoices");
};
