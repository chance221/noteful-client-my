import React from 'react'

export default React.createContext({
  notes: [],
  folders: [],
  addFolder: () => {},
  addNote: () => {},
  deleteNote: () => {},
  deleteFolder: () => {},
  handleNoteSubmit:() => {},
  handleFolderSubmit:() => {},
  addFolderName: "",
  addNoteName:"",
  updateFolder: () =>{},
  updateNote: () =>{},
  forceUpdate: () => {},
})
