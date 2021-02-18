// [object Object]
// SPDX-License-Identifier: Apache-2.0

import PropTypes from 'prop-types';
import React from 'react';

import CancelIcon from '../../icons/GlyphSmallCancel';

export const ModalActions = ({ children, className, justify, ...props }) => (
  <div className={`flex justify-${justify} pa2 ${className}`}
    style={{ backgroundColor: '#f4f6f8' }}
    {...props}>
    { children }
  </div>
);

ModalActions.propTypes = {
  justify: PropTypes.string,
  className: PropTypes.string
};

ModalActions.defaultProps = {
  justify: 'between',
  className: ''
};

export const ModalBody = ({ children, className, icon, title, ...props }) => {
  icon = React.createElement(icon, {
    className: 'fill-gray w3'
  });

  return (
    <div className={`ph2 pv3 tc ${className}`}
      {...props}>
      <div className='center bg-snow br-100 flex justify-center items-center'
        style={{ width: '80px', height: '80px' }}>
        {icon}
      </div>

      <p className='charcoal-muted fw5'>{title}</p>

      {children}
    </div>
  );
};

ModalBody.propTypes = {
  icon: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

ModalBody.defaultProps = {
  className: ''
};

export const Modal = ({ children, className, onCancel, ...props }) => {
  return (
    <div className={`${className} bg-white w-80 shadow-4 sans-serif relative`}
      style={{ maxWidth: '30em' }}
      {...props}>
      { onCancel &&
        <CancelIcon className='absolute pointer w2 h2 top-0 right-0 fill-gray'
          onClick={onCancel} />
      }

      {children}
    </div>
  );
};

Modal.propTypes = {
  onCancel: PropTypes.func
};

Modal.defaultProps = {
  onCancel: null,
  className: ''
};

export default Modal;
