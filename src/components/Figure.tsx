import * as React from 'react';
import * as classNames from 'classnames';
import { Motion, spring } from 'react-motion';

import { Color } from '../Color';
import { LogicFigure, Player } from '../logic';

export interface FigureProps {
    onClick?: () => void;
    x: number;
    y: number;
    owner: Player;
    color: Color;
    selected: boolean;
}

export default function({ color, owner, x, y, onClick, selected }: FigureProps) {
    let scale = selected ? 1.1 : 1.0;
    return (
        <div
            className={classNames(
                'figure',
                Color[color].toLowerCase(),
                owner == Player._1 ? 'player-1' : 'player-2',
                {selected: selected}
            )}
            style={{
                top: y / 8 * 100 + '%',
                left: x / 8 * 100 + '%'
            }}
            onClick={() => {
                if(onClick) {
                    onClick();
                }
            }}
        >
            <div className="circle">
                <div className="marker"></div>
            </div>
            <div className="selection-ring"></div>
        </div>
    );
}
