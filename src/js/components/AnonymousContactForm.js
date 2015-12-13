import React, { Component, PropTypes } from 'react'

import { base_url } from '../config'


export default class AnonymousContactForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      mail: '',
      website: '',
      subject: '',
      message: '',
      //forward: true
    }
  }

  handleNameChange(e) {
    this.setState({name: e.target.value})
  }

  handleMailChange(e) {
    this.setState({mail: e.target.value})
  }

  handleWebsiteChange(e) {
    this.setState({website: e.target.value})
  }

  handleSubjectChange(e) {
    this.setState({subject: e.target.value})
  }

  handleMessageChange(e) {
    this.setState({message: e.target.value})
  }

  handleForwardChange(e) {
    this.setState({forward: ! this.state.forward})
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state)
    this.props.handleSubmit(this.state)
  }

  render() {
    return (
        <form 
          action={`${base_url}api/contact/messages/`}
          method="post"
          encType='application/json'
          onSubmit={this.handleSubmit.bind(this)}
        >
          {/* csrf protection */}
          <input type='hidden'
                 name='csrfmiddlewaretoken'
                 value={this.state.csrf}
          />
          <div className="field_wrapper">
            <label htmlFor="id_name">Name:<span className="red"> *</span></label>
            <input id="id_name"
                   name="name"
                   type="text"
                   value={this.state.name}
                   maxLength="254"
                   onChange={this.handleNameChange.bind(this)}
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_mail">Email:<span className="red"> *</span></label>
            <input id="id_mail"
                   name="mail"
                   type="email"
                   value={this.state.mail}
                   onChange={this.handleMailChange.bind(this)}
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_website">Website:</label>
            <input id="id_website"
                   name="website"
                   value={this.state.website}
                   onChange={this.handleWebsiteChange.bind(this)}
                   type="url"
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_subject">Subject:<span className="red"> *</span></label>
            <input id="id_subject"
                   name="subject"
                   type="text"
                   value={this.state.subject}
                   onChange={this.handleSubjectChange.bind(this)}
                   maxLength="254"
                   required
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_message">Message:<span className="red"> *</span></label>
            <textarea id="id_message"
                   name="message"
                   rows="15"
                   value={this.state.message}
                   onChange={this.handleMessageChange.bind(this)}
                   placeholder="Write your message here"
                   required
             />
          </div>
          <div className="field_wrapper checkbox">
            <label htmlFor="id_forward">Forward (check if you wish to receive a copy back)</label>
            <input id="id_forward"
                   name="forward"
                   type="checkbox"
                   value={this.state.forward}
                   onChange={this.handleForwardChange.bind(this)}
                   defaultChecked={true}
            />
          </div>
          <input type="submit"
                 value="Send"
          />
        </form>
    )
  }
}
