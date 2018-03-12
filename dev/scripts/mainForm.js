import React from 'react';

/**
 * Form that accepts input to add a new sighting
 */
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
                <label htmlFor="notes">Notes</label>
                <textarea value={props.data.notes} id="notes" onChange={props.handleChange}></textarea>
                <label htmlFor="file" className="fileLabel">
                {props.data.file ?
                <span>{props.data.file}</span>
                :
                <span>Select file</span>
                }
                </label>
                <input type="file" id="file" onChange={props.handleChange}/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}