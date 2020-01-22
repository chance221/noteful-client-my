import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import '../UpdateFolder/UpdateFolder.css';
import {findFolder} from '../notes-helpers'



export default class UpdateFolder extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      name: {
        value: "",
        touched: false
      }
    }
  }
  static defaultProps = {
    history:{
      goBack: () => { }
    },
    match:{
      params: {}
    },
  }

  static contextType = ApiContext

  updateName(name){
    this.setState( {name: {value:name, touched: true} })
  }

  handleSubmit = (e) => {
      e.preventDefault();
      const name = this.state.name.value;
      
      const newFolder = {
        name: name,
        id: this.props.match.params.folderId
      };
      
      this.updateServerFolders(newFolder);
  }

  getFolder = () => {
  
    console.log(findFolder(this.props.match.params.folderId))
  
  }

  updateServerFolders = folder =>{
    
    console.log('this is the folder when updating database', folder)
      let folderId = parseInt(folder.id, 10) 
      fetch(`${config.API_ENDPOINT}/folders/${folderId}`, {
          method:'put',
          headers:{
              'content-type':'application/json',
          },
          body: JSON.stringify({
            name: folder.name
          })
      })
      .then((folderRes)=>{
        console.log('this is the server response', folderRes)
        this.context.updateFolder(folder) 
        alert(`The folder name has been changed to ${folder.name}`)
      })
      .then((folderRes1)=>{
          this.props.history.goBack()
          
      })
      .catch(e =>{
          console.error({e});
      })
  }
  

  validateName(){
    const name = this.state.name.value.trim();
    if(name.length ===0){
      return "Folder name is required"
    }
  }

  render (){
    const nameError = this.validateName()

    return(
      <div className = 'AddFolder'>
        <h2 className = 'AddFolder__title'>
          Enter the name of your updated folder.
        </h2>
        <form className="addFolder-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="lbl">Folder Name</label>
            <input 
              type='text' 
              className='form_input' 
              name='name' 
              id='name'

              onChange={e=>this.updateName(e.target.value)}
            />
            {this.state.name.touched && <ValidationError message={nameError}/>}
          </div>
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={this.validateName()}
            >Save</button>
            <button type="button" className="submit-btn" onClick={() => this.props.history.goBack()}>Cancel</button>
          </div>

        </form>
      </div>
  )
  }


}