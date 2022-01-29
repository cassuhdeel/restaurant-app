import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <div>
      <nav className="navbar navbar-dark align-items-start p-0">
        <div className="container-fluid d-flex flex-column p-0">
          <ul className="nav navbar-nav">
            <li className="nav-item pl-1">
              <button
                type="button"
                className="btn text-white"
                title="Home"
              >
                <Link className="nav-link" to="/dashboard">
              <span className="oi oi-dashboard" />
              &nbsp;Home
            </Link>
              </button>
            </li>

            <li className="nav-item pl-1">
              <button
                type="button"
                className="btn text-white"
                title="Search"
              >
               <Link className="nav-link" to="/search">
              <span className="oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
              </button>
            </li>
            <li className="nav-item pl-1">
              <button
                type="button"
                className="btn text-white"
                title="New Reservation"
              >
               <Link className="nav-link" to="/reservations/new">
              <span className="oi oi-plus" />
              &nbsp;New Reservation
            </Link>
              </button>
            </li>
            <li className="nav-item pl-1">
              <button
                type="button"
                className="btn text-white"
                title="New Table"
              >
                <Link className="nav-link " to="/tables/new">
                <span className="oi oi-layers" />
              &nbsp;New Table
                </Link>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Menu;
