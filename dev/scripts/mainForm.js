import React from 'react';

export default function (props) {
    return (
        <div className="newBirdContainer">
            <form action="" className="newBird" onSubmit={props.addBird}>
                <label htmlFor="species">Species</label>
                <input type="text" value={props.data.species} id="species" onChange={ props.handleChange} />
                <label htmlFor="numberSeen">Number of birds seen</label>
                <input type="number" value={props.data.numberSeen} id="numberSeen" onChange= { props.handleChange} />
                <label htmlFor="location">Location</label>
                <input type="text" value={props.data.location} id="location" onChange={ props.handleChange} />
                <label htmlFor="date">Date</label>
                <input type="date" value={props.data.date} id="date" onChange={props.handleChange} />
                <label htmlFor="image"></label>
                {/* <input type="file" id="image" /> */}
                <label htmlFor="notes">Notes</label>
                <textarea value={props.data.notes} id="notes" onChange={props.handleChange}></textarea>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}