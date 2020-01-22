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
import UpdateFolder from '../UpdateFolder/UpdateFolder';
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

    updateFolder = (updatedFolder) =>{
        
        let folders = this.state.folders.filter(folder => {
            
            return folder.id != updatedFolder.id
        })

        folders.push(updatedFolder)

        this.setState({
            folders: folders
        })
    }

    updateNote = (newNote) => {
       
       let notes = this.state.notes.filter(note =>{
           return note.id != newNote.id
       })

       notes.push(newNote)

       this.setState({
           notes:notes
       })

    }

    // addFolder = (folderName) => {
        
    //     newFolder.name= folderName;
    //     return newFolder
    // }

    // ***Still need to this. API call may happen in the new folder component***
    handleFolderSubmit = (folder) =>{
        this.setState({
            folders:[...this.state.folders, folder]
        })

        this.forceUpdate();
    }

    handleNoteSubmit = (note) =>{
        this.setState({
            notes:[...this.state.notes, note]
        })
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id != noteId)
        });

        this.forceUpdate();
        
    };

    handleDeleteFolder = folderId => {
        this.setState({
            folders: this.state.folders.filter(folder => folder.id != folderId),
            notes: this.state.notes.filter(notes=> notes.folderId != folderId)
        })
        
    }

    updateComponent = () => {
        this.forceUpdate();
    }



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
                <Route path="/update-folder/:folderId" component = {UpdateFolder}/>
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
            handleDeleteFolder: this.handleDeleteFolder,
            addFolder: this.addFolder,
            updateFolder: this.updateFolder,
            updateNote: this.updateNote,
            updateComponent: this.updateComponent 
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
