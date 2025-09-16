import{r as c}from"./vendor-react-BzVlARah.js";var p={exports:{}},a={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var S=c,y=Symbol.for("react.element"),E=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,m=S.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,x={key:!0,ref:!0,__self:!0,__source:!0};function l(t,e,o){var r,n={},u=null,i=null;o!==void 0&&(u=""+o),e.key!==void 0&&(u=""+e.key),e.ref!==void 0&&(i=e.ref);for(r in e)_.call(e,r)&&!x.hasOwnProperty(r)&&(n[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)n[r]===void 0&&(n[r]=e[r]);return{$$typeof:y,type:t,key:u,ref:i,props:n,_owner:m.current}}a.Fragment=E;a.jsx=l;a.jsxs=l;p.exports=a;var g=p.exports,d={exports:{}},v={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var s=c;function h(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var w=typeof Object.is=="function"?Object.is:h,O=s.useState,j=s.useEffect,R=s.useLayoutEffect,b=s.useDebugValue;function k(t,e){var o=e(),r=O({inst:{value:o,getSnapshot:e}}),n=r[0].inst,u=r[1];return R(function(){n.value=o,n.getSnapshot=e,f(n)&&u({inst:n})},[t,o,e]),j(function(){return f(n)&&u({inst:n}),t(function(){f(n)&&u({inst:n})})},[t]),b(o),o}function f(t){var e=t.getSnapshot;t=t.value;try{var o=e();return!w(t,o)}catch{return!0}}function I(t,e){return e()}var L=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?I:k;v.useSyncExternalStore=s.useSyncExternalStore!==void 0?s.useSyncExternalStore:L;d.exports=v;var D=d.exports;export{g as j,D as s};
