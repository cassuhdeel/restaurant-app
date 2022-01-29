import React from "react";
import { tableComplete } from "../utils/api";

export default function Tables({ table, loadDashboard }) {
  if (!table) return null;


  function handleComplete() {
    if (
      window.confirm(
        "Is this table ready to seat new guests?"
      )
    ) {
      const abortController = new AbortController();
      tableComplete(table.table_id, abortController.signal).then(loadDashboard);
      return () => abortController.abort();
    }
  }


  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td className="text-center">{table.table_name}</td>
      <td className="text-center">{table.capacity}</td>
      <td className="text-center" data-table-id-status={table.table_id}>
        {table.status}
      </td>
      <td className="text-center">
        {table.reservation_id ? table.reservation_id : "--"}
      </td>

      {table.status === "occupied" && (
        <td className="text-center">
          <button
            className="btn btn-sm btn-danger"
            data-table-id-finish={table.table_id}
            onClick={handleComplete}
            type="button"
          >
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
