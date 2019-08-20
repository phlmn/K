import * as React from 'react';


import Intro from './pages/Intro';
import Game from './pages/Game';


interface AppProps {

}

interface FormData {
    repo: string;
    token: string;
}

interface AppState {
    username: string;
}

export class Settings {
    username: string;

    save() {
        localStorage.setItem("k-game-settings", JSON.stringify(this));
    }

    static load(): Settings {
        return JSON.parse(localStorage.getItem("k-game-settings"));
    }
}

export class App extends React.Component<AppProps, AppState> {

    settings: Settings;

    constructor(props: AppProps) {
        super(props);

        let loggedIn = false;

        this.settings = Settings.load();

        if (this.settings == null) {
            this.settings = new Settings();
        }

        this.state = {
            username: null
        };
    }

    render() {
        let page: React.ReactNode;

        let { username } = this.state;

        if (username != null) {
            page = <Game username={username} />;
        } else {
            page = <Intro onSelect={this.onSelect} />;
        }

        return (
            <div className="k-game">
                {page}
            </div>
        );
    }

    onSelect = (username: string) => {
        this.setState({
            username: username
        });
    }
}
