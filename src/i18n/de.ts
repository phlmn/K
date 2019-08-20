import { Translation } from '.';

export const translation: Translation = {
    common: {
        player_1: 'Weiß',
        player_2: 'Schwarz'
    },
    gameplay: {
        turn_player_1: 'Weiß ist am Zug.',
        turn_player_2: 'Schwarz ist am Zug.',
        score: (score: number) => `Punkte: ${score}`
    }
};
