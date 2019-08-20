export interface Translation {
    common: {
        player_1: string,
        player_2: string
    },
    gameplay: {
        turn_player_1: string,
        turn_player_2: string,
        score: (score: number) => string
    }
}

export let current: Translation;

export enum Locales {
    de
}

export function initialize(locale: Locales) {
    return new Promise((resolve, reject) => {
        import('./' + Locales[locale]).then((module) => {
            current = module.translation;
            console.log(`Translation loaded: ${JSON.stringify(module)}`);
            resolve();
        }).catch(() => {
            reject();
        });
    });
}
