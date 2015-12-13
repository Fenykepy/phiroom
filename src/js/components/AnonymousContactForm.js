import React, { Component, PropTypes } from 'react'

//import { getCookie } from '../helpers/cookieManager'
import { base_url } from '../config'


export default class AnonymousContactForm extends Component {
  render() {
    return (
        <form action={`${base_url}api/contact/messages/`} method="post">
          {/* csrf protection */}
          {/*<input type='hidden'
                 name='csrfmiddlewaretoken'
                 value={getCookie('csrftoken')} />*/}
          <div className="field_wrapper">
            <label htmlFor="id_name">Name:<span className="red"> *</span></label>
            <input id="id_name"
                   name="name"
                   type="text"
                   maxLength="254"
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_mail">Email:<span className="red"> *</span></label>
            <input id="id_mail"
                   name="mail"
                   type="email"
                   required
            />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_website">Website:</label>
            <input id="id_website"
                   name="website"
                   type="url"
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_subject">Subject:<span className="red"> *</span></label>
            <input id="id_subject"
                   name="subject"
                   type="text"
                   maxLength="254"
                   required
             />
          </div>
          <div className="field_wrapper">
            <label htmlFor="id_message">Message:<span className="red"> *</span></label>
            <textarea id="id_message"
                   name="message"
                   rows="15"
                   placeholder="Write your message here"
                   required
             />
          </div>
          <div className="field_wrapper checkbox">
            <label htmlFor="id_forward">Forward (check if you wish to receive a copy back)</label>
            <input id="id_forward"
                   name="forward"
                   type="checkbox"
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
