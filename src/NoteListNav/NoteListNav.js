import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import ApiContext from '../ApiContext'
import { countNotesForFolder } from '../notes-helpers'
import PropTypes from 'prop-types';
import config from '../config';
import './NoteListNav.css'

export default class NoteListNav extends React.Component {
  
  static defaultProps ={
    onDeleteFolder: () => {},
    
    match: {
      params: {}
    },

    history:{
      goBack: () => { }
    },
  }
  
  static contextType = ApiContext;


  handleClickDelete1 = (folderId) => {
    
    console.log("this is the folder being deleted" , folderId)

    fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
      method: 'DELETE'
    })
      .then(res => {
        console.log(res)
        
      })
      .then(() => {
        this.context.handleDeleteFolder(folderId)
      })
      .then(() =>{
        this.props.history.push('/')
        
      })

      .catch(error => {
        console.error({ error })
      })
      this.context.updateComponent();
  }


  render() {
    
    const { folders=[], notes=[] } = this.context
    return (
      <div className='NoteListNav'>
        <ul className='NoteListNav__list'>
          {folders.map(folder =>
          
            <li key={folder.id} className ='folderContainer'>
              <NavLink
                className='NoteListNav__folder-link'
                to={`/folder/${folder.id}`}
              >
                {folder.name}
              </NavLink>
              <button
                className='Note__delete'
                type='button'
                onClick={() =>this.handleClickDelete1(folder.id) }
                
                key={folder.id}
              >
                <FontAwesomeIcon icon='trash-alt' />
                {' '}
                remove
              </button>
              <Link to={`update-folder/${folder.id}`}>
                <button
                  className='Note__delete'
                  type='button'
                  key={folder.id}
                >
                <FontAwesomeIcon icon='edit' />
                  {' '}
                  edit
                </button>
              </Link>
              <span className='NoteListNav__num-notes'>
                {countNotesForFolder(notes, folder.id)}
              </span>
                
            </li>
          )}
        </ul>
        <div className='NoteListNav__button-wrapper'>
          <CircleButton
            tag={Link}
            to='/add-folder'
            type='button'
            className='NoteListNav__add-folder-button'
          >
            <FontAwesomeIcon icon='plus' />
            <br />
            Folder
          </CircleButton>
        </div>
      </div>
    )
  }
}
NoteListNav.propTypes = {
  path: PropTypes.string
}