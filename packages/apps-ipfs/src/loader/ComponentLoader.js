// [object Object]
// SPDX-License-Identifier: Apache-2.0
import './ComponentLoader.css';

import React from 'react';

const ComponentLoader = ({ isLoading, pastDelay, retry, timedOut, ...props }) => {
  if (!pastDelay) return null;

  return (
    <div {...props}
      style={{ width: 300, margin: '10vh auto', ...props.style }}>
      <svg className='ComponentLoader'
        fill='none'
        style={{ width: '100%' }}
        viewBox='0 0 512 512'
        xmlns='http://www.w3.org/2000/svg'>
        <path className='shape'
          d='M256.7 511.99L35 383.99V128L256.7 0L478.4 127.99V383.99L256.7 511.99ZM73.075 123.636L233.815 30.83H233.832C247.387 40.831 265.877 40.831 279.431 30.83L440.171 123.636C439.85 126.49 439.85 129.37 440.172 132.224L279.422 225.031C265.868 215.031 247.379 215.031 233.825 225.031L73.075 132.226C73.3963 129.372 73.3963 126.49 73.075 123.636ZM294.685 251.7L455.605 157.86L455.614 157.864C457.926 159.569 460.421 161.009 463.054 162.158V347.768C447.615 354.506 438.371 370.519 440.255 387.258L279.505 480.063C277.194 478.358 274.699 476.918 272.066 475.769L271.886 291.189C287.324 284.451 296.569 268.439 294.685 251.7ZM50.357 163.187C52.9892 162.038 55.4841 160.597 57.795 158.892L57.796 158.887L218.536 251.697C216.652 268.437 225.897 284.449 241.336 291.187V476.797C238.703 477.946 236.208 479.387 233.896 481.092L73.156 388.286C75.04 371.547 65.795 355.535 50.357 348.797V163.187Z'
          stroke='#838D9D'
          strokeDasharray='4187'
          strokeWidth='3'/>
        <path d='M34.298 384L255.998 512L477.698 384V128L255.998 0.0100098L34.298 128.01V384Z'
          fill='url(#paint1_linear)'/>
        <path d='M233.113 30.84L72.373 123.646C72.6943 126.5 72.6943 129.382 72.373 132.236L233.123 225.041C246.677 215.041 265.166 215.041 278.72 225.041L439.47 132.234C439.148 129.38 439.148 126.5 439.469 123.646L278.729 30.84C265.175 40.841 246.685 40.841 233.13 30.84H233.113ZM454.903 157.87L293.983 251.71C295.867 268.449 286.622 284.461 271.184 291.199L271.364 475.779C273.997 476.928 276.492 478.368 278.803 480.073L439.553 387.268C437.669 370.529 446.913 354.516 462.352 347.778V162.168C459.719 161.019 457.224 159.579 454.912 157.874L454.903 157.87ZM57.093 158.902C54.7821 160.607 52.2872 162.048 49.655 163.197V348.807C65.093 355.545 74.338 371.557 72.454 388.296L233.194 481.102C235.506 479.397 238.001 477.956 240.634 476.807V291.197C225.195 284.459 215.95 268.447 217.834 251.707L57.094 158.897L57.093 158.902Z'
          fill='url(#paint2_linear)'/>
        <path d='M256 512L477.7 384V128L256 256V512Z'
          fill='black'
          fillOpacity='0.251'/>
        <path d='M256 512V256C169.421 206.013 120.879 177.987 34.3 128V384L256 512Z'
          fill='black'
          fillOpacity='0.039'/>
        <path d='M34.298 128L255.998 256L477.698 128L255.998 0L34.298 128Z'
          fill='black'
          fillOpacity='0.13'/>
        <defs>
          <linearGradient gradientUnits='userSpaceOnUse'
            id='paint1_linear'
            x1='34.298'
            x2='477.703'
            y1='256'
            y2='256'>
            <stop stopColor='#838D9D'/>
          </linearGradient>
          <linearGradient gradientUnits='userSpaceOnUse'
            id='paint2_linear'
            x1='49.658'
            x2='462.343'
            y1='255.97'
            y2='255.97'>
            <stop stopColor='#ffc790'/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ComponentLoader;
