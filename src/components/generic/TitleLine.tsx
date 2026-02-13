import React from "react";

export default function TitleLine(props) {
  return (
    <div>
      <span>{props.title}</span>
      {props.session ? (
        <span>
          {props.id ? "#" + props.id : ""}
        </span>
      ) : null}
    </div>
  );
}
