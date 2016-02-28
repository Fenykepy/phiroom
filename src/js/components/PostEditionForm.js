import React, { Component, PropTypes } from 'react'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'


export default class PostEditionForm extends Component {

  listTags() {
    // if we have tags we list them
    if (this.props.edited.tags) {
      return this.props.edited.tags.map(tag =>
        <div 
          className="tag"
          key={tag}
        >{tag}<button
            className="del"
            type="button"
            onClick={() => this.props.handleDeleteTag(tag)}
        >×</button></div>
      )
    }
    return null
  }


  render() {
    //console.log('post edition form', this.props)
    
    return (
      <form
        id="post-form"
      >
        <FormRequiredFields />
        <FormFieldErrors
          errors_list={this.props.edited.errors}
          field={'non_field_errors'}
        />
        <div className="field_wrapper">
          <label htmlFor="id_title">Title:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'title'}
          />
          <input id="id_title"
                 name="title"
                 type="text"
                 value={this.props.edited.title}
                 placeholder="title"
                 maxLength="254"
                 required
                 onChange={this.props.handleTitleChange}
          />
          <div className="help-text">Title of the post, should be unique.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_description">Description:</label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'description'}
          />
          <input id="id_description"
                 name="description"
                 type="text"
                 value={this.props.edited.description}
                 placeholder="description"
                 maxLength="254"
                 onChange={this.props.handleDescriptionChange}
          />
          <div className="help-text">Description of the post, shown under title in detail view.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_source">Source:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'source'}
          />
          <textarea id="id_source"
                 name="source"
                 rows="15"
                 value={this.props.edited.source}
                 placeholder="source"
                 required
                 onChange={this.props.handleSourceChange}
          />
          <div className="help-text">Source of the post, markdown syntax.</div>
        </div>

        <div className="field_wrapper">
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'draft'}
          />
          <div className="checkbox">
            <label htmlFor="id_draft"><input id="id_draft"
                   name="draft"
                   type="checkbox"
                   value={this.props.edited.draft}
                   onChange={this.props.handleDraftChange}
                   defaultChecked={false}
            />Draft (won't be published yet.)
</label>
          </div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_pubdate">Publication date:</label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'pub_date'}
          />
          <input id="id_pubdate"
                 name="pub_date"
                 type="datetime"
                 value={this.props.edited.pub_date}
                 onChange={this.props.handlePubdateChange}
          />
          <div className="help-text">Leave blank to publish on save.</div>
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_tags">Keywords:</label>
          <FormFieldErrors
            errors_list={this.props.edited.errors}
            field={'tags_flat_list'}
          />
          <div className="tags-container">
            <input id="id_tags"
              name="tags_flat_list"
              type="text"
              placeholder="add tags..."
              onKeyDown={this.props.handleAddTag}
              onKeyPress={this.props.handleAddTag}
            />
            {this.listTags()}
          </div>
        </div>
      </form>
    )
  }
}
