import { Color } from './Color';

export interface LogicField {
    color: Color;
    pos: Vec;
}

export interface Row {
    columns: LogicField[];
}

let {
    Orange,
    Blue,
    Purple,
    Pink,
    Yellow,
    Red,
    Green,
    Brown
} = Color;

let field_colors = [
    [Orange, Blue, Purple, Pink, Yellow, Red, Green, Brown],
    [Red, Orange, Pink, Green, Blue, Yellow, Brown, Purple],
    [Green, Pink, Orange, Red, Purple, Brown, Yellow, Blue],
    [Pink, Purple, Blue, Orange, Brown, Green, Red, Yellow],
    [Yellow, Red, Green, Brown, Orange, Blue, Purple, Pink],
    [Blue, Yellow, Brown, Purple, Red, Orange, Pink, Green],
    [Purple, Brown, Yellow, Blue, Green, Pink, Orange, Red],
    [Brown, Green, Red, Yellow, Pink, Purple, Blue, Orange]
];

export class Board {
    rows: Row[];

    constructor() {
        this.rows = this.initFields();
    }

    private initFields() {
        let fields: Row[] = [];

        for (let y = 0; y < 8; y++) {
            let row: LogicField[] = [];
            for (let x = 0; x < 8; x++) {
                row.push({ color: field_colors[y][x], pos: { x, y } });
            }
            fields.push({ columns: row });
        }

        return fields;
    }

    getField(x: number, y: number) {
        return this.rows[x].columns[y];
    }
}

export interface Vec {
    x: number;
    y: number;
}

export enum Player {
    _1, _2
}

export class LogicFigure {
    color: Color;
    pos: Vec;
    owner: Player;

    constructor(color: Color, pos: Vec, owner: Player) {
        this.color = color;
        this.pos = pos;
        this.owner = owner;
    }
}
