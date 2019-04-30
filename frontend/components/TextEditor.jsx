import React from 'react';

export default function TextEditor(props) {
    const [text, setText] = React.useState(props.initialValue);
    
    return (
        <div>
            <textarea value={text} onChange={e => setText(e.target.value)} />
        </div>
    );
}

TextEditor.defaultProps = {
    initalValue: ''
};
