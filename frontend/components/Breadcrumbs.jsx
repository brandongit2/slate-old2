import {Fragment} from 'react';
import {generate} from 'shortid';

import './Breadcrumbs.scss';

export default function Breadcrumbs(props) {
    return (
        <div className="breadcrumbs">
            {props.children.map((crumb, i) => (
                <Fragment key={generate()}>
                    {crumb}
                    {i < props.children.length - 1 ? <i className="material-icons">chevron_right</i> : null}
                </Fragment>
            ))}
        </div>
    );
}

export function Crumb(props) {
    return <div className="crumb">{props.children}</div>;
}
