import * as React from 'react';


interface FormData {
    username: string;
}

interface AppState {
    form_data: FormData;
}

export interface LoginProps {
    onSelect: (username: string) => void;
}

export default class Login extends React.Component<LoginProps, AppState> {

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            form_data: {
                username: ""
            }
        };
    }

    render() {
        return (
            <div>
                <div className="text-container">
                    <input
                        placeholder="Username"
                        type="text"
                        value={this.state.form_data.username}
                        onChange={this.handleChange('username')} />
                    <button onClick={this.submit} type="button">Start</button>
                </div>
            </div>
        );
    }

    handleChange = <K extends keyof FormData>(param: K) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let form_data = { ...this.state.form_data };
        form_data[param] = event.target.value;
        this.setState({ form_data });
    }

    submit = () => {
        this.props.onSelect(this.state.form_data.username);
    }
}
