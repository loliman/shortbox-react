import React from "react";

interface TitleLineProps {
  title: string;
  session?: unknown;
  id?: string | number;
}

export default function TitleLine(props: Readonly<TitleLineProps>) {
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
