const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// Validation middleware for reservations //

async function validData(req, res, next) {
  if (!req.body.data) {
    return next({ 
      status: 400, 
      message: "Body must include a data object" });
  }
  next();
}


async function validBody(req, res, next) {
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of requiredFields) {
    if (
      !req.body.data.hasOwnProperty(field) ||
      req.body.data[field] === ""
    ) {
      return next({ 
        status: 400, 
        message: `Field required: '${field}'` });
    }
  }

  if (
    Number.isNaN(
      Date.parse(
        `${req.body.data.reservation_date} ${req.body.data.reservation_time}`
      )
    )
  ) {
    return next({
      status: 400,
      message:
        "'reservation_date' or 'reservation_time' field is in an incorrect format",
    });
  }

  if (typeof req.body.data.people !== "number") {
    return next({ 
      status: 400, 
      message: "'people' field must be a number" });
  }

  if (req.body.data.people < 1) {
    return next({ 
      status: 400, 
      message: "'people' field must be at least 1" });
  }

  if (req.body.data.status && req.body.data.status !== "booked") {
    return next({
      status: 400,
      message: `'status' field cannot be ${req.body.data.status}`,
    });
  }

  next();
}


async function validDate(req, res, next) {
  const reserveDate = new Date(
    `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
  );
  const todaysDate = new Date();

  if (reserveDate.getDay() === 2) {
    return next({
      status: 400,
      message: "'reservation_date' field: restaurant is closed on tuesday",
    });
  }

  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message:
        "'reservation_date' and 'reservation_time' field must be in the future",
    });
  }

  if (
    reserveDate.getHours() < 10 ||
    (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is not open until 10:30AM",
    });
  }

  if (
    reserveDate.getHours() > 22 ||
    (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: "'reservation_time' field: restaurant is closed after 10:30PM",
    });
  }

  if (
    reserveDate.getHours() > 21 ||
    (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
  ) {
    return next({
      status: 400,
      message:
        "'reservation_time' field: reservation must be made at least an hour before closing (10:30PM)",
    });
  }

  next();
}


async function validReservation(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation id ${reservation_id} does not exist`,
    });
  }
  res.locals.reservation = reservation;
  next();
}


async function validUpdatedBody(req, res, next) {
  if (!req.body.data.status) {
    return next({ 
      status: 400, 
      message: "body must include a status field" });
  }

  if (
    req.body.data.status !== "booked" &&
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "cancelled"
  ) {
    return next({
      status: 400,
      message: `'status' field cannot be ${req.body.data.status}`,
    });
  }

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  }
  next();
}


// CRUDL operations for reservations //

async function list(req, res, next) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const reservations = await service.list(date, mobile_number);
  const response = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  res.json({ data: response });
}

async function create(req, res) {
  req.body.data.status = "booked";
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response[0] });
}


async function update(req, res) {
  await service.updateStatus(
    res.locals.reservation.reservation_id,
    req.body.data.status
  );

  res.status(200).json({ data: { status: req.body.data.status } });
}

async function updateReservation(req, res) {
  const response = await service.updateReservation(
    res.locals.reservation.reservation_id,
    req.body.data
  );
  res.status(200).json({ data: response[0] });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validData),
    asyncErrorBoundary(validBody),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validData),
    asyncErrorBoundary(validReservation),
    asyncErrorBoundary(validUpdatedBody),
    asyncErrorBoundary(update),
  ],
  updateReservation: [
    asyncErrorBoundary(validData),
    asyncErrorBoundary(validReservation),
    asyncErrorBoundary(validBody),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(updateReservation),
  ],
  read: [asyncErrorBoundary(validReservation), asyncErrorBoundary(read)],
};