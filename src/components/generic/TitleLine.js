import React from 'react';

export default function TitleLine(props) {
    return  <div style={{display: "flex", justifyContent: "space-between"}}>
                <span>{props.title}</span>
                { props.session ? <span style={{fontSize: '10px', color: 'gray', alignSelf: "center"}}>ID: {props.id ? props.id : 'null'}</span> : null }
            </div>
}