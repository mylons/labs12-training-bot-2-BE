
exports.up = function(knex, Promise) {
  return knex.schema.table("training_series", tbl => {
    tbl.text("training_type").notNullable();
  }); 
};

exports.down = function(knex, Promise) {
  return knex.schema.table("training_series", tbl => {
    tbl.dropColumn("training_type");
  }); 
};
