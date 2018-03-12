import React from 'react';

/**
 * Information to be displayed for each bird sighting
 */
export default function(props) {
    return (

        <div className="bird-entry-container">
            {props.data.species ?
            <h2>Species: {props.data.species}</h2>
            : null
            }
            {props.data.location ? 
            <h3>Location: {props.data.location}</h3>
            : null
            }
            {props.data.date ? 
            <h4>Date: {props.data.date}</h4>
            : null
            }
            {props.data.number ?
            <h5>Number: {props.data.numberSeen}</h5>
            : null
            }
            {props.data.notes ?
            <p>Notes: {props.data.notes}</p>
            : null
            }
            {props.data.file ?
            <img src={props.data.file} alt=""/>:
            null
            }
            <p className="delete-entry" onClick={() => props.deleteEntry(props.data.id)}>Delete</p>
        </div>


    )
}


