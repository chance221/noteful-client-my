import React from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError';
import './AddFolder.css';



export default class AddFolder extends React.Component{
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
    }  
  }

  static contextType = ApiContext

  updateName(name){
    this.setState( {name: {value:name, touched: true} })
  }

  handleSubmit = (e) => {
      e.preventDefault();
      const name = this.state.name.value;
      
      this.updateServerFolders(name);
  }

  updateServerFolders = name =>{
      
      fetch(`${config.API_ENDPOINT}/folders`, {
          method:'post',
          headers:{
              'content-type':'application/json',
          },
          body: JSON.stringify({
            name
          })
      })
      .then((folderRes)=>{
        
          if (!folderRes.ok)
            return folderRes.json().then(e=> Promise.reject(e))
          return folderRes.json()
      })
      .then((folderRes1)=>{
        //addFolder(folderRes1);
        console.log(folderRes1)
      const { handleFolderSubmit } = this.context;
        
        handleFolderSubmit(folderRes1[0])
          alert(`A new folder has been added`)
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
          Enter the name of your new folder.
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
