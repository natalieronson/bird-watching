import React from 'react';

export default function (props) {
    return (
        <div className="filterFormContainer">
        <form action="" className="filterForm" onSubmit={props.filterItems}>
            <div className="filterItem">
                <label htmlFor="speciesFilter">Species</label>
                <input type="text" value={props.data.speciesFilter} id="speciesFilter" onChange={props.handleChange} />
            </div>
            <div className="filterItem">
                <label htmlFor="locationFilter">Location</label>
                <input type="text" id="locationFilter" value={props.data.locationFilter} onChange={props.handleChange} />
            </div>
            <div className="filterItem">
                <label htmlFor="dateFilterStart">Start date</label>
                <input type="date" id="dateFilterStart" value={props.data.dateFilterStart} onChange={props.handleChange} />
            </div>
            <div className="filterItem">
                <label htmlFor="dateFilterEnd">End date</label>
                <input type="date" id="dateFilterEnd" value={props.data.dateFilterEnd} onChange={props.handleChange} />
            </div>
            <div className="filter-button-container">
                <input className="filter-button" type="submit" />
                <button onClick={props.resetFilters}>Reset Filters</button>
            </div>
        </form>
        </div>
    )
}