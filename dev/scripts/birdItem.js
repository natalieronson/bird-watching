import React from 'react';

export default function(props) {
    return (
        

        <div className="bird-entry-container">
            <h2>{props.data.species}</h2>
            <h3>{props.data.location}</h3>
            <h4>{props.data.date}</h4>
            <h5>{props.data.numberSeen}</h5>
            <p>{props.data.notes}</p>
            {/* <p onClick={() => props.editEntry(props.data.id)}>Edit</p> */}
            <p onClick={() => props.deleteEntry(props.data.id)}>Delete</p>
        </div>


    )
}


