import {TextEditor} from '../../../components';

import css from './text-editor.scss';

export default function TextEditorTest() {
    return (
        <div className={css['text-editor-test']}>
            <TextEditor />
        </div>
    );
}
