import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import Reservations from "../dashboard/Reservations";

export default function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);


  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

 
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }

  const searchResults = () => {
    return reservations.length > 0 ? (
      reservations.map((reservation) => (
        <Reservations
          key={reservation.reservation_id}
          reservation={reservation}
        />
      ))
    ) : (
      <tr>
        <td>No reservations found</td>
      </tr>
    );
  };

  return (
    <div
      className="w-80 ml-2 pr-4 mr-4 pt-4"
    >
       <h1 className="font-weight-bold d-flex justify-content-center mt-4 mb-4 pb-4">
          Search
        </h1>
      <form>
        <ErrorAlert error={error} />
        <div className="input-group w-50">
          <input
            className="form-control mr-2 rounded"
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={FormData.mobile_number}
            required
          />
          <button
            className="btn-xs rounded px-2 pb-1"
            type="submit"
            onClick={handleSubmit}
          >
           Submit
          </button>
        </div>
      </form>

      <table className="table table-hover mt-4">
        <thead className="thead-dark">
          <tr className="text-center">
            <th scope="col">ID</th>
            <th scope="col text-center">First Name</th>
            <th scope="col text-center">Last Name</th>
            <th scope="col text-center">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
            <th scope="col">Seat</th>
          </tr>
        </thead>

        <tbody>{searchResults()}</tbody>
      </table>
    </div>
  );
}
