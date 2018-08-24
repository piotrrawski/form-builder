import React from 'react';
import FormCreator from '../FormCreator/';

class Start extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            test: "start",
        }
    }

    componentWillMount() {
        let db;
        let open = window.indexedDB.open("MyTestDatabase", 1);

        open.onerror = (event) => {
            alert("Why didn't you allow my web app to use IndexedDB?!");
        };
        open.onsuccess = (event) => {
            db = event.target.result;
        };
        open.onupgradeneeded = (event) => {
            let db = event.target.result;

            // Create an objectStore for this database
            let objectStore = db.createObjectStore("MyObjectStore", {autoIncrement: true});
            objectStore.createIndex("NameIndex", ["main.type", "main.quest", "subquest.questt"]);

            //testowe dodawanie
            // objectStore.put({
            //     main: {quest: "Ile masz lat", type: "number"},
            //     subquest: {questt: "subquest", questtt: "sub2"}
            // });
        };
    }

    handleClickStart = (event) => {
        this.setState({
            test: "create",
        });
    }

    render() {
        let test = this.state.test;
        switch (test) {
            case "start":
                return (
                    <div className={"butStart"}>
                        <button onClick={(event) => this.handleClickStart(event)}>Create new form</button>
                    </div>
                )
            case "create":
                return (
                    <div>
                        <FormCreator/>
                    </div>
                )
        }
    }
}


export default Start;