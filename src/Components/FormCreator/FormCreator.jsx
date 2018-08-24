import React from 'react';

class FormCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            question: "",
            last: "",
            dbQuest: [],
            hide: "hide",
            dbType: [],
            value: "text",
            subQ: [],
            subInput: "",
            names: "",
            test: "start",
        }
    }

    handleOpen(event) {
        let quests = this.state.question;
        let typs = this.state.value;
        let subquest = this.state.subQ;
        let indexedDB = window.indexedDB;
        let open = window.indexedDB.open("MyTestDatabase", 1);

        open.onsuccess = function () {
            let db = open.result;
            let tx = db.transaction("MyObjectStore", "readwrite");
            let store = tx.objectStore("MyObjectStore");
            let index = store.index("NameIndex");

            store.put({
                main: {quest: quests, type: typs}, subquest: {questt: subquest, questtt: subquest}
            });
        }
        this.setState({
            question: "",
            value: "text",
            subQ: [],
        })
    }

    handleClick(event) {
        let indexedDB = window.indexedDB;
        let open = window.indexedDB.open("MyTestDatabase", 1);

        open.onsuccess = () => {
            let db = open.result;
            let tx = db.transaction("MyObjectStore", "readwrite");
            let store = tx.objectStore("MyObjectStore");
            let index = store.index("NameIndex");
            let getData = store.getAll();

            getData.onsuccess = () => {
                let quest = getData.result.map(function (items, i) {
                    return items.main.quest
                });
                let typ = getData.result.map(function (item, i) {
                    return item.main.quest
                });

                this.setState({
                    dbQuest: quest,
                    dbType: typ,
                    hide: "butSend",
                })
            };
        };
    }

    handleChangeSub = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    handleAddSubQ = () => {
        this.setState({subQ: this.state.subQ.concat([{names: ''}])});
        console.log(this.state.subQ.map(function (items, i) {
            return items.names
        }))
    }

    handleSubQChange = (idx) => (evt) => {
        const subQs = this.state.subQ.map((sub, sidx) => {
            if (idx !== sidx) return sub;
            return {...sub, names: evt.target.value};
        });

        this.setState({
            subQ: subQs,
            subInput: evt.target.value,
        });
    }

    handleChange = (e) => {
        this.setState({
            question: e.target.value
        })
    }


    handleDeleteQuest = (e) => {
        this.setState({
            question: parseInt(e.currentTarget.parentElement.parentElement.getAttribute('data-key'))
        });
        let delQ = this.state.question;

        let r = indexedDB.open("MyTestDatabase", 1);
        r.onsuccess = function (event) {
            let db = event.target.result;
            let tx = db.transaction("MyObjectStore", "readwrite");
            let store = tx.objectStore("MyObjectStore");
            let index = store.index("NameIndex");
            store.delete(delQ);
        };
    }

    handleClickForm = (event) => {
        let indexedDB = window.indexedDB;
        let db;
        let open = window.indexedDB.open("MyTestDatabase2", 1);

        open.onerror = (event) => {
            alert("Why didn't you allow my web app to use IndexedDB?!");
        };
        open.onsuccess = (event) => {
            db = event.target.result;
        };
        open.onupgradeneeded = (event) => {
            let db = event.target.result;
            let objectStore = db.createObjectStore("MyObjectStore2", {autoIncrement: true});
            let index = objectStore.createIndex("NameIndex2", ["main.type", "main.quest", "subquest.questt"]);

            // objectStore.put({
            //     main: {quest: "Ile masz lat", type: "number"},
            //     subquest: {questt: "subquest", questtt: "sub2"}
            // });
        };
        this.setState({
            test: "form",
        });
        window.scrollTo(0, 0)
    }


    handleChangeForm = (e) => {
        this.setState({
            question: e.target.value
        })
    }

    handleBlur = (e) => {
        let quests = this.state.question;
        let types = this.state.value;
        let subquest = this.state.subQ;
        let indexedDB = window.indexedDB;
        let open = window.indexedDB.open("MyTestDatabase2", 1);

        open.onsuccess = function () {
            // Start a new transaction
            let db = open.result;
            let tx = db.transaction("MyObjectStore2", "readwrite");
            let store = tx.objectStore("MyObjectStore2");
            let index = store.index("NameIndex2");

            store.put({
                main: {quest: quests, type: types}, subquest: {questt: subquest, questtt: subquest}
            });
        }
    }

    handleSubmit = (e) => {
        alert("Sent")
    }

    render() {
        let test = this.state.test;
        switch (test) {
            case "start":
                return (
                    <div>
                        <div className={"cont"}>
                            <div className={"formCont"}>
                                <label className={"form"}>
                                    <div className={"label"}>Question:</div>
                                    <input onChange={this.handleChange} type="text" name="question"
                                           placeholder={"Your question"} value={this.state.question}/>

                                    {this.state.subQ.map((sub, idx) => (
                                        <div className="subQ">
                                            <input
                                                type="text"
                                                placeholder={`Sub question #${idx + 1}`}
                                                value={sub.name}
                                                onChange={this.handleSubQChange(idx)}
                                            />
                                        </div>
                                    ))}
                                </label>

                                <label>
                                    <div className={"label"}>Type:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    <select value={this.state.value} onChange={this.handleChangeSub}>
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="radio">Yes/No</option>
                                    </select>
                                </label>

                                <div className={"butCont"}>
                                    <button onClick={(event) => this.handleOpen(event)}>
                                        Add Question
                                    </button>
                                    <button onClick={(event) => this.handleClick(event)}>
                                        Form preview
                                    </button>
                                    <button onClick={this.handleAddSubQ}>
                                        SubInput
                                    </button>
                                </div>
                            </div>
                        </div>


                        <ul className={"formCont"}>{this.state.dbQuest.map((t, i) =>

                            <li key={i} data-key={i + 1}>
                                <div className={"formConten"}>
                                    <div className={"label"}>Question {i + 1}</div>
                                    <br/>
                                    <div className={"quest"}>{t}</div>
                                    <input type={this.state.dbType[i]}/>
                                </div>

                                <div className={"butCont"}>
                                    <button className={"butDel"} onClick={(event) => this.handleDeleteQuest(event)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        )}
                        </ul>
                        <div className={"formCont"}>
                            <div className={"butCont"}>
                                <button className={this.state.hide} onClick={(event) => this.handleClickForm(event)}>
                                    Create Form
                                </button>
                            </div>
                        </div>
                    </div>
                )
            case "form":
                return (
                    <div>
                        <ul className={"formCont"}>{this.state.dbQuest.map((t, i) =>
                            <li>
                                <div className={"formConten"}>
                                    <div className={"label"}>Question {i + 1}</div>
                                    <br/>
                                    <div className={"quest"}>{t}</div>
                                    <input onChange={this.handleChangeForm} onBlur={this.handleBlur}
                                           type={this.state.dbType[i]}/>
                                </div>
                            </li>
                        )}
                        </ul>

                        <div className={"formCont"}>
                            <div className={"butCont"}>
                                <button className={this.state.hide} onClick={(event) => this.handleSubmit(event)}>Send
                                    Form
                                </button>
                            </div>
                        </div>
                    </div>
                )

        }
    }
}
export default FormCreator;