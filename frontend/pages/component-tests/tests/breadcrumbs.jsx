import React from 'react';

import {Breadcrumbs} from '../../../components';
import {Crumb} from '../../../components/Breadcrumbs';

import css from './breadcrumbs.scss';

export default function BreadcrumbTest() {
    return (
        <div className={css['breadcrumb-test']}>
            <Breadcrumbs>
                <Crumb>Home</Crumb>
                <Crumb>Page 1</Crumb>
                <Crumb>Page 2</Crumb>
            </Breadcrumbs>
        </div>
    );
}
