import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import UpdateNote from '../UpdateNote/UpdateNote';
import ErrorBoundry from '../ErrorBoundaries/ErrorBoundries';
import config from '../config';
import './App.css';


// const shortid = require('shortid');

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error})
                alert(`could not connect with server`)
                return error;
            });
    }

    makeTheApiCall(){
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

    updateFolder(updatedFolder){
        const {id} = updatedFolder
        
        Promise(
            fetch(`${config.API_ENDPOINT}/folders/${id}`, {
                method: 'patch',
                body: JSON.stringify(updatedFolder)
            }).then(response =>{
                if(!response.ok){
                    return response.json().then(e => Promise.reject(e));
                }
                return Promise(response);
            }).then(updatedFldr => {
                console.log('updated folder:', updatedFldr)
            })    
        )
    }

    updateNote(){
        return console.log("Note updating")
        //this is where you would make the api call to update the note but this can take place in the update note component
    }

    addFolder = (folderName) => {
        let newFolder = {
            name: ''
            //id:''
        };
        
        newFolder.name= folderName;
        //newFolder.id = shortid.generate();
        console.log(newFolder)
        return newFolder
    }

    // ***Still need to this. API call may happen in the new folder component***
    handleFolderSubmit = (folder) =>{
        this.setState({
            folders:[...this.state.folders, folder]
        })
    }

    handleNoteSubmit = (note) =>{
        this.setState({
            notes:[...this.state.notes, note]
        })
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={AddFolder} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route exact path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-note" component={AddNote} />
                <Route path="/update-note/:noteId" component={UpdateNote} />
                <Route path="/folder/update-note/:noteId" component={UpdateNote} />
                <Route path="/note/update-note/:noteId" component={UpdateNote} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote,
            handleNoteSubmit: this.handleNoteSubmit,
            handleFolderSubmit: this.handleFolderSubmit,
            addFolder: this.addFolder,
            updateFolder: this.updateFolder,
            updateNotes: this.updateNote 
        };
        
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <ErrorBoundry>
                        <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    </ErrorBoundry>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <ErrorBoundry>
                        <main className="App__main">{this.renderMainRoutes()}</main>
                    </ErrorBoundry>
                    
                </div>
            </ApiContext.Provider>
        );
    }
}


export default App;
