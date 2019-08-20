import * as React from 'react';
import * as classNames from 'classnames';

import { Color } from '../Color';
import { LogicField } from '../logic';

export interface FieldProps {
    field: LogicField;
    onClick?: (figure: LogicField) => void;
}

export default function({ field, onClick }: FieldProps) {
    return (
        <div
            className={classNames(
                'field',
                Color[field.color].toLowerCase(),
            )}
            style={{
                top: field.pos.y / 8 * 100 + '%',
                left: field.pos.x / 8 * 100 + '%'
            }}
            onClick={() => {
                if(onClick) {
                    onClick(field);
                }
            }}
        ></div>
    );
}

