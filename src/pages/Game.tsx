import * as React from 'react';
import * as classNames from 'classnames';
import { List, fromJS } from 'immutable';
import { clone, merge } from 'lodash';
import { Motion, spring } from 'react-motion';

import { Board, LogicField, LogicFigure, Player, Vec } from '../logic';
import { Color } from '../Color';

import Figure from '../components/Figure';
import Field from '../components/Field';

import { current } from '../i18n';

export interface GameProps {
    username: string;
}

interface GameState {
    board: Board;
    figures: List<LogicFigure>;
    turn: Player;
    selectedFigure: number;
}

const springParams = {
    stiffness: 170,
    damping: 22,
    precision: 0.01
};

export default class Game extends React.Component<GameProps, GameState> {

    move: number;

    constructor(props: GameProps) {
        super(props);

        let board = new Board();

        this.state = {
            board: board,
            figures: fromJS(this.generateFigures(board)),
            turn: Player._1,
            selectedFigure: null
        };

        this.move = 0;
    }

    generateFigures(board: Board) {
        let figures = [];
        let id = 0;
        figures.push(...board.rows[0].columns.map((field, i) => new LogicFigure(
            field.color,
            { x: i, y: 0 },
            Player._1
        )));
        figures.push(...board.rows[7].columns.map((field, i) => new LogicFigure(
            field.color,
            { x: i, y: 7 },
            Player._2
        )));
        return figures;
    }

    cssClassFromColor(color: Color) {
        return Color[color].toLowerCase();
    }

    render() {
        let { turn, board, figures, selectedFigure } = this.state;

        return (
            <div>
                <div className="username">
                    {this.props.username}
                </div>
                <div className="turn-indicator">
                    {turn == Player._1 ? current.gameplay.turn_player_1 : current.gameplay.turn_player_2}
                </div>
                <div className="board-wrapper">
                    <div className="board">
                        <div className="fields">
                            {board.rows.map((row, i) =>
                                <div key={i} className="row">
                                    {row.columns.map((field, j) =>
                                        <Field key={j} field={field} onClick={() => this.fieldClicked(field)} />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="figures">
                            {figures.map((figure, index) => (
                                <Motion key={index} style={{x: spring(figure.pos.x, springParams), y: spring(figure.pos.y, springParams)}}>
                                    {value =>
                                        <Figure
                                            x={value.x}
                                            y={value.y}
                                            selected={index == selectedFigure}
                                            color={figure.color}
                                            owner={figure.owner}
                                            onClick={() => this.figureClicked(index)} />
                                    }
                                </Motion>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    fieldClicked(field: LogicField) {
        let { figures, selectedFigure } = this.state;

        if(selectedFigure != null) {
            let figure = figures.get(selectedFigure);

            if(this.checkMove(figure.pos, field.pos, figure.owner)) {
                this.performMove(field);
            }
        }
    }

    getFigureWithColor(figures: List<LogicFigure>, color: Color, player: Player) {
        return figures.findEntry(fig => fig.color == color && fig.owner == player);
    }

    figureClicked(index: number) {
        let { selectedFigure, figures, turn } = this.state;

        if(this.move == 0) { // first move
            if(selectedFigure == null) {
                let chosenFigure = figures.get(index);

                if(chosenFigure.owner == turn) {
                    this.setState({
                        selectedFigure: index
                    });
                }
            } else if (index == selectedFigure) {
                this.setState({
                    selectedFigure: null
                });
            }
        }
    }

    performMove(field: LogicField) {
        let { turn, figures, selectedFigure } = this.state;

        this.setState({
            figures: figures.update(selectedFigure, (figure: LogicFigure) => {
                return merge({}, figure, { pos: clone(field.pos) });
            })
        });

        let newTurn = turn == Player._1 ? Player._2 : Player._1;
        let newSelectedFigIdx = figures.findEntry(fig => fig.color == field.color && fig.owner == newTurn)[0];

        this.move++;

        this.setState({
            turn: newTurn,
            selectedFigure: newSelectedFigIdx
        });

        let newFig = figures.get(newSelectedFigIdx);
        if(this.getPossibleMoves(figures, newFig).length == 0) {
            console.log('No possible moves!!!');
            // this.performMove(this.state.board.getField(newFig.pos.x, newFig.pos.y));
        }
    }

    switchPlayer(newColor: Color) {

    }

    getPossibleMoves(figures: List<LogicFigure>, figure: LogicFigure) {
        let moves = [];

        if(figure.owner == Player._1) {
            moves.push(...this.getMovesForDirection({x: 0, y: 1}, figure, figures));
            moves.push(...this.getMovesForDirection({x: -1, y: 1}, figure, figures));
            moves.push(...this.getMovesForDirection({x: 1, y: 1}, figure, figures));
        } else {
            moves.push(...this.getMovesForDirection({x: 0, y: -1}, figure, figures));
            moves.push(...this.getMovesForDirection({x: -1, y: -1}, figure, figures));
            moves.push(...this.getMovesForDirection({x: 1, y: -1}, figure, figures));
        }

        return moves;
    }

    getMovesForDirection(direction: Vec, figure: LogicFigure, figures: List<LogicFigure>) {
        let moves: Vec[] = [];

        let i = 1;
        while(true) {
            let pos : Vec = {
                x: figure.pos.x + direction.x * i,
                y: figure.pos.y + direction.y * i
            };

            if(pos.x > 7 || 0 > pos.x || pos.y > 7 || 0 > pos.y) {
                break;
            }

            if(this.getFigureAtPos(figures, pos) == null) {
                moves.push(pos);
            } else {
                break;
            }

            i++;
        }

        return moves;
    }

    checkMove(from: Vec, to: Vec, player: Player) {
        let deltaX = to.x - from.x;
        let deltaY = to.y - from.y;

        let { figures } = this.state;

        // check if upwards or downwards
        if(player == Player._1) {
            if(deltaY <= 0) {
                return false;
            }
        } else {
            if(deltaY >= 0) {
                return false;
            }
        }

        // check direction and collisions
        if(deltaX == 0) {
            if(this.getCollisions(from, to, figures).length == 0) {
                return true;
            }
        } else {
            if(Math.abs(deltaX) == Math.abs(deltaY)) {
                if(this.getCollisions(from, to, figures).length == 0) {
                    return true;
                }
            }
        }

        return false;
    }

    getCollisions(from: Vec, to: Vec, figures: List<LogicFigure>) {
        return this.getPath(from, to).filter(pos => this.getFigureAtPos(figures, pos) != null);
    }

    getPath(from: Vec, to: Vec): Vec[] {
        let deltaY = to.y - from.y;
        let deltaX = to.x - from.x;

        let positions = [];

        function sign(val: number) {
            if(val == 0) {
                return 0;
            }

            return val > 0 ? 1 : -1;
        }

        for(let i = 1; i <= Math.abs(deltaY); i++) {
            let pos: Vec = {
                x: from.x + i * sign(deltaX),
                y: from.y + i * sign(deltaY)
            };

            positions.push(pos);
        }

        console.log(positions);

        return positions;
    }

    getFigureAtPos(figures: List<LogicFigure>, pos: Vec) {
        return figures.find((fig) => {
            return fig.pos.x == pos.x && fig.pos.y == pos.y;
        })
    }

}
