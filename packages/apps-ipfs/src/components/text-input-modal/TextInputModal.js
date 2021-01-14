// [object Object]
// SPDX-License-Identifier: Apache-2.0
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import ComponentLoader from '../../loader/ComponentLoader';
import Button from '../button/Button';
import { Modal, ModalActions, ModalBody } from '../modal/Modal';

class TextInputModal extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onInputChange: PropTypes.func,
    title: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
    description: PropTypes.node,
    submitText: PropTypes.string,
    validate: PropTypes.func,
    defaultValue: PropTypes.string,
    mustBeDifferent: PropTypes.bool,
    loading: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    defaultValue: '',
    submitText: 'Save',
    mustBeDifferent: false
  }

  constructor (props) {
    super(props);
    this.state = { value: props.defaultValue };
  }

  onChange = (event) => {
    let val = event.target.value;

    if (this.props.onChange) {
      val = this.props.onChange(val);
    }

    this.props.onInputChange && this.props.onInputChange(val);

    this.setState({ value: val });
  }

  onSubmit = () => {
    if (!this.props.validate ||
      (this.props.validate && this.props.validate(this.state.value))) {
      this.props.onSubmit(this.state.value);
    }
  }

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  get inputClass () {
    if (!this.props.validate ||
      this.state.value === '' ||
      (this.props.mustBeDifferent && this.state.value === this.props.defaultValue)) {
      return '';
    }

    if (this.props.error) {
      return 'b--red-muted focus-outline-red';
    }

    if (this.props.validate(this.state.value)) {
      return 'b--green-muted focus-outline-green';
    }

    return 'b--red-muted focus-outline-red';
  }

  get isDisabled () {
    if (this.state.value === '' ||
      (this.props.mustBeDifferent && this.state.value === this.props.defaultValue)) {
      return true;
    }

    if (!this.props.validate) {
      return false;
    }

    return !this.props.validate(this.state.value);
  }

  render () {
    const { className,
      defaultValue,
      description,
      error,
      icon,
      loading,
      mustBeDifferent,
      onCancel,
      onChange,
      onInputChange,
      onSubmit,
      submitText,
      t,
      title,
      validate,
      ...props } = this.props;

    return (
      <Modal {...props}
        className={className}
        onCancel={onCancel}>
        <ModalBody icon={icon}
          title={title}>
          { description && typeof description === 'object' && description }

          { description && typeof description === 'string' &&
            <p className='gray w-80 center'>{description}</p>
          }

          <input
            className={`input-reset charcoal ba b--black-20 br1 pa2 mb2 db w-75 center focus-outline ${this.inputClass}`}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            required
            type='text'
            value={this.state.value} />
        </ModalBody>

        <ModalActions>
          <Button bg='bg-gray'
            className='ma2 tc'
            onClick={onCancel}>{t('actions.cancel')}</Button>
          <Button bg='bg-teal'
            className='ma2 tc'
            disabled={this.isDisabled}
            onClick={this.onSubmit}>{submitText}</Button>
        </ModalActions>

        { loading && (
          <div className='flex items-center justify-center absolute top-0 left-0 right-0 bottom-0'>
            <div className='absolute top-0 left-0 right-0 bottom-0 bg-light-gray o-80'/>
            <ComponentLoader pastDelay
              style={{ width: '50%', margin: 'auto' }} />
          </div>
        ) }
      </Modal>
    );
  }
}

export default withTranslation('app')(TextInputModal);
