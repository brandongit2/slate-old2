import React from 'react';

export default function EditableText(props) {
    const [text, setText] = React.useState(props.initialText);
    const [editing, toggleEditing] = React.useReducer(() => !editing, false);
    
    return (
        <div onClick={toggleEditing}>{
            editing
                ? <input type="text" value={text} onChange={e => setText(e.target.value)} onBlur={toggleEditing} />
                : <p>{text}</p>
        }</div>
    );
}
