import React, { Component, Proptypes } from 'react'


import { base_url } from '../config'

export default class ContactMessageForm extends Component {
  
  getFieldErrors(field = 'non_field_errors') {
    if (this.props.errors && this.props.errors[field]) {
      let errors = this.props.errors[field]
      return (
        <ul className="error-list">
          {errors.map(error =>
            <li
              key={error}
            >{error}</li>
          )}
        </ul>
      )
    }
    return null
  }

  getAnonymousFields() {
    if (this.props.user && this.props.user.is_authenticated) {
      return null
    }
    return (
        <div>
          <div className="field_wrapper">
            <label htmlFor="id_name">Name:<span className="red"> *</span></label>
            {this.getFieldErrors('name')}
            <input id="id_name"
                   name="name"
                   type="text"
                   value={this.props.name}
                   maxLength="254"
                   onChange={this.props.handleNameChange}
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_mail">Email:<span className="red"> *</span></label>
            {this.getFieldErrors('mail')}
            <input id="id_mail"
                   name="mail"
                   type="email"
                   value={this.props.mail}
                   onChange={this.props.handleMailChange}
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_website">Website:</label>
            {this.getFieldErrors('website')}
            <input id="id_website"
                   name="website"
                   value={this.props.website}
                   onChange={this.props.handleWebsiteChange}
                   type="url"
             />
          </div>
        </div>
    )
  }

  render() {
    //console.log(this.props)
    return (
      <form
        action={`${base_url}api/contact/messages/`}
        method="post"
        encType="multipart/form-data"
        onSubmit={this.props.handleSubmit}
      >
        <p><span className="red">*</span> : required fields.</p>
          {/* csrf protection */}
          <input type='hidden'
                 name='csrfmiddlewaretoken'
                 value={this.props.csrf}
          />
          {this.getFieldErrors()}
          {this.getAnonymousFields()}
          <div className="field_wrapper">
            <label htmlFor="id_subject">Subject:<span className="red"> *</span></label>
            {this.getFieldErrors('subject')}
            <input id="id_subject"
                   name="subject"
                   type="text"
                   value={this.props.subject}
                   onChange={this.props.handleSubjectChange}
                   maxLength="254"
                   required
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_message">Message:<span className="red"> *</span></label>
            {this.getFieldErrors('message')}
            <textarea id="id_message"
                   name="message"
                   rows="15"
                   value={this.props.message}
                   onChange={this.props.handleMessageChange}
                   placeholder="Type your message here"
                   required
             />
          </div>
          <div className="field_wrapper">
            {this.getFieldErrors('forward')}
            <div className="checkbox">
              <label htmlFor="id_forward"><input id="id_forward"
                     name="forward"
                     type="checkbox"
                     value={this.props.forward}
                     onChange={this.props.handleForwardChange}
                     defaultChecked={true}
              />Forward (check if you wish to receive a copy back)
  </label>
            </div>
          </div>
          <div className="centered">
          <input type="submit"
                 value="Send"
          />
          </div>
      </form>
    )
  }
}
