import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import config from '../config';
import './Note.css';

export default class Note extends React.Component {
  static defaultProps ={
    //onDeleteNote: () => {},
    noteId:0
  }

  static propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
      
  }

  static contextType = ApiContext;

  handleClickDelete = () => {
    
    //e.preventDefault()
    
    const noteId = this.props.id
    
    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
    })
    .then(() => {
      this.context.deleteNote(noteId)
      console.log(this.context.notes)
    })
      .catch(error => {
        console.error({ error })
      })
      
      
  }

  render() {
    const { name, id, modified } = this.props
    //console.log('name id', name, id, modified)
    return (

      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <Link to={`update-note/${id}`}>
        <button
          className='Note__delete'
          type='button'
        >
          <FontAwesomeIcon icon='edit' />
          {' '}
          edit
        </button>
        </Link>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
