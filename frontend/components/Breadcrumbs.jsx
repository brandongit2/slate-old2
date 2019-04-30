import {Fragment} from 'react';
import {generate} from 'shortid';

import './Breadcrumbs.scss';

export default function Breadcrumbs(props) {
    const children = Array.isArray(props.children)
        ? props.children.filter(child => child != null)
        : props.children;
    
    return (
        <nav className="breadcrumbs">
            {Array.isArray(children)
                ? children.map((crumb, i) => (
                    <Fragment key={generate()}>
                        {crumb}
                        {i < children.length - 1 ? <i className="material-icons">chevron_right</i> : null}
                    </Fragment>
                )) : children
            }
        </nav>
    );
}

export function Crumb(props) {
    return <div className="crumb">{props.children}</div>;
}
