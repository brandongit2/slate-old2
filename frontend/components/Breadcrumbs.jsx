import {Fragment} from 'react';
import {generate} from 'shortid';

import './Breadcrumbs.scss';

export default function Breadcrumbs(props) {
    return (
        <nav className="breadcrumbs">
            {Array.isArray(props.children)
                ? props.children.map((crumb, i) => (
                    <Fragment key={generate()}>
                        {crumb}
                        {i < props.children.length - 1 ? <i className="material-icons">chevron_right</i> : null}
                    </Fragment>
                )) : props.children
            }
        </nav>
    );
}

export function Crumb(props) {
    return <div className="crumb">{props.children}</div>;
}
