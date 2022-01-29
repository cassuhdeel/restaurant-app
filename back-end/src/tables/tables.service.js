const knex = require("../db/connection");

function create(table) {
  return knex("tables").insert(table).returning("*");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

function updateReservation(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}

function list() {
  return knex("tables").select("*");
}

function readReservation(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function full(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: "occupied" });
}

function open(table_id) {
  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id: null, status: "free" });
}

module.exports = {
  list,
  create,
  read,
  full,
  open,
  readReservation,
  updateReservation,
};

