import React from 'react';

export default function(props) {
    return (

        <div className="bird-entry-container">
            <h2>Species: {props.data.species}</h2>
            <h3>Location: {props.data.location}</h3>
            <h4>Date: {props.data.date}</h4>
            <h5>Number: {props.data.numberSeen}</h5>
            <p>Notes: {props.data.notes}</p>
            {/* <p onClick={() => props.editEntry(props.data.id)}>Edit</p> */}
            <p className="delete-entry" onClick={() => props.deleteEntry(props.data.id)}>Delete</p>
        </div>


    )
}


