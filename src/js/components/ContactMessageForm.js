import React, { Component, Proptypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'

import settings from '../config'

let base_url = settings.base_url

export default class ContactMessageForm extends Component {
  
  getAnonymousFields() {
    if (this.props.user && this.props.user.is_authenticated) {
      return null
    }
    return (
        <div>
          <div className="field_wrapper">
            <label htmlFor="id_name">Name:<span className="red"> *</span></label>
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'name'}
            />
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
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'mail'}
            />
            <input id="id_mail"
                   name="mail"
                   type="email"
                   value={this.props.email}
                   onChange={this.props.handleEmailChange}
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_website">Website:</label>
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'website'}
            />
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
          <FormFieldErrors
            errors_list={this.props.errors}
            field={'non_field_errors'}
          />
          {this.getAnonymousFields()}
          <div className="field_wrapper">
            <label htmlFor="id_subject">Subject:<span className="red"> *</span></label>
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'subject'}
            />
            <input id="id_subject"
                   name="subject"
                   type="text"
                   value={this.props.subject}
                   onChange={this.props.handleSubjectChange}
                   maxLength="254"
                   placeholder="Enter subject of your message here…"
                   required
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_message">Message:<span className="red"> *</span></label>
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'message'}
            />
            <textarea id="id_message"
                   name="message"
                   rows="15"
                   value={this.props.message}
                   onChange={this.props.handleMessageChange}
                   placeholder="Type your message here…"
                   required
             />
          </div>
          <div className="field_wrapper">
            <FormFieldErrors
              errors_list={this.props.errors}
              field={'forward'}
            />
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
