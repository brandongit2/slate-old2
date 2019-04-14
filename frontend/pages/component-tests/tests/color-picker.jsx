import ColorPicker from '../../../components/adminPages/SiteContent/ColorPicker';

import css from './color-picker.scss';

export default function ColorPickerTest() {
    return (
        <div className={css['color-picker-test']}>
            <ColorPicker initialColor="000000" />
        </div>
    );
}
