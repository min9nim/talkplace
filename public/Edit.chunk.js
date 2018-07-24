(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["Edit"],{

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Pages/Edit.scss":
/*!************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./src/Pages/Edit.scss ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ \"./node_modules/css-loader/lib/css-base.js\")(false);\n// imports\n\n\n// module\nexports.push([module.i, \".edit {\\n  margin: 20px; }\\n  .edit div {\\n    margin-bottom: 5px; }\\n  .edit .writer {\\n    display: inline-block;\\n    width: calc(100% - 265px); }\\n  .edit .checkbox {\\n    margin: 0px 0px 0px 10px;\\n    vertical-align: text-bottom;\\n    display: inline-block; }\\n    .edit .checkbox input[type=\\\"checkbox\\\"] {\\n      -webkit-appearance: checkbox; }\\n  .edit .content {\\n    font-size: 20px;\\n    height: 210px; }\\n  .edit input {\\n    font-size: 20px; }\\n  .edit .write-cancel-btn {\\n    margin-left: 3px; }\\n\", \"\"]);\n\n// exports\n\n\n//# sourceURL=webpack:///./src/Pages/Edit.scss?./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js");

/***/ }),

/***/ "./src/Pages/Edit.js":
/*!***************************!*\
  !*** ./src/Pages/Edit.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(/*! react */ \"./node_modules/react/react.js\");\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _tp = __webpack_require__(/*! ../tp */ \"./src/tp.js\");\n\nvar _reactRouterDom = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/es/index.js\");\n\nvar _reactBootstrap = __webpack_require__(/*! react-bootstrap */ \"./node_modules/react-bootstrap/es/index.js\");\n\n__webpack_require__(/*! ./Edit.scss */ \"./src/Pages/Edit.scss\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar Edit = function (_React$Component) {\n  _inherits(Edit, _React$Component);\n\n  function Edit(props, context) {\n    _classCallCheck(this, Edit);\n\n    var _this = _possibleConstructorReturn(this, (Edit.__proto__ || Object.getPrototypeOf(Edit)).call(this, props, context));\n\n    _this.handleChange = _this.handleChange.bind(_this);\n    _this.savePost = _this.savePost.bind(_this);\n\n    if (_this.props.post) {\n      _this.state = _this.props.post;\n      _this.state.uuid = _tp.tp.user.uuid;\n      if (_this.state.origin !== undefined) {\n        alert(\"invalid access!\");\n        history.back();\n      }\n    } else {\n      _tp.tp.api.getPost(_this.props.postKey).then(function (res) {\n        _this.state = res.post;\n        _this.state.uuid = _tp.tp.user.uuid;\n        _tp.tp.store.dispatch(_tp.tp.action.addPost(res.post));\n      });\n    }\n    _this.contextPath = _this.props.context ? \"/\" + _this.props.context : \"\";\n    return _this;\n  }\n\n  _createClass(Edit, [{\n    key: 'shouldComponentUpdate',\n    value: function shouldComponentUpdate(prevProps, prevState) {\n      return true;\n    }\n  }, {\n    key: 'componentDidMount',\n    value: function componentDidMount() {\n      document.title = (this.props.context || \"Anony\") + \" - \" + _tp.tp.thispage;\n    }\n  }, {\n    key: 'getValidationState',\n    value: function getValidationState() {\n      return;\n      var length = this.state.title.length;\n      if (length > 10) return 'success';else if (length > 5) return 'warning';else if (length > 0) return 'error';\n      return null;\n    }\n  }, {\n    key: 'handleChange',\n    value: function handleChange(e) {\n      var state = {};\n      state[e.target.id] = e.target.getAttribute(\"type\") === \"checkbox\" ? e.target.checked : e.target.value;\n      this.setState(state);\n    }\n  }, {\n    key: 'savePost',\n    value: function savePost() {\n      var _this2 = this;\n\n      if (this.state.content === \"\") {\n        alert(\"내용을 입력하세요\");\n        return;\n      }\n\n      var afterPost = {\n        key: this.state.key,\n        title: this.state.title === \"\" ? this.state.content.trim().substr(0, 17) : this.state.title.trim(),\n        writer: this.state.writer.trim(),\n        content: this.state.content.trim(),\n        date: Date.now(),\n        isPrivate: this.state.isPrivate,\n        isMarkdown: this.state.isMarkdown,\n        hasComment: this.state.hasComment,\n        viewCnt: this.state.viewCnt,\n        uuid: _tp.tp.user.uuid,\n        context: this.state.context\n      };\n\n      _tp.tp.api.updatePost(afterPost).then(function (res) {\n        if (res.status === \"Fail\") {\n          alert(JSON.stringify(res, null, 2));\n          return;\n        }\n        console.log(\"# \" + res.message);\n        if (_tp.tp.view.App.state.data.posts.length > 0) {\n          _tp.tp.store.dispatch(_tp.tp.action.updatePost(afterPost));\n        }\n\n        // 사용자 정보 업데이트\n        _tp.tp.setUser({ writer: afterPost.writer });\n\n        // 작성된 글 바로 확인\n        _this2.props.history.push(_this2.contextPath + \"/post/\" + afterPost.key);\n      });\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      console.log(\"Write 렌더링..\");\n\n      if (!this.state) return _react2.default.createElement('div', null);\n\n      var contentStyle = {\n        height: _tp.tp.isDesktop() ? window.innerHeight - 170 + \"px\" : window.innerHeight - 400 + \"px\", // 핸드폰의 키보드 높이만큼 줄임\n        fontSize: this.state.isMarkdown ? \"15px\" : \"20px\"\n      };\n\n      return _react2.default.createElement(\n        'div',\n        { className: 'edit' },\n        _react2.default.createElement(\n          'div',\n          { className: 'context' },\n          this.props.context || \"Anony\"\n        ),\n        _react2.default.createElement(\n          _reactBootstrap.FormGroup,\n          { controlId: 'title', validationState: this.getValidationState() },\n          _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text',\n            autoFocus: true, value: this.state.title,\n            onChange: this.handleChange,\n            placeholder: 'Title..' }),\n          _react2.default.createElement(_reactBootstrap.FormControl.Feedback, null)\n        ),\n        _react2.default.createElement(\n          _reactBootstrap.FormGroup,\n          { controlId: 'writer' },\n          _react2.default.createElement(_reactBootstrap.FormControl, { type: 'text', className: 'writer',\n            value: this.state.writer,\n            onChange: this.handleChange,\n            placeholder: 'Writer..' }),\n          _react2.default.createElement(\n            _reactBootstrap.Checkbox,\n            { onChange: this.handleChange, id: 'isMarkdown', checked: this.state.isMarkdown },\n            'Markdown'\n          ),\n          _react2.default.createElement(\n            _reactBootstrap.Checkbox,\n            { onChange: this.handleChange, id: 'isPrivate', checked: this.state.isPrivate },\n            'Private'\n          ),\n          _react2.default.createElement(\n            _reactBootstrap.Checkbox,\n            { onChange: this.handleChange, id: 'hasComment', checked: this.state.hasComment },\n            'Comment'\n          )\n        ),\n        _react2.default.createElement(\n          _reactBootstrap.FormGroup,\n          { controlId: 'content' },\n          _react2.default.createElement(_reactBootstrap.FormControl, { style: contentStyle,\n            value: this.state.content,\n            onChange: this.handleChange,\n            componentClass: 'textarea',\n            placeholder: 'Content..' })\n        ),\n        _react2.default.createElement(\n          _reactBootstrap.Button,\n          { bsStyle: 'success', onClick: this.savePost },\n          'Save'\n        ),\n        _react2.default.createElement(\n          _reactRouterDom.Link,\n          { to: this.contextPath + \"/post/\" + this.state.key },\n          _react2.default.createElement(\n            _reactBootstrap.Button,\n            { className: 'write-cancel-btn', bsStyle: 'success' },\n            'Cancel'\n          )\n        )\n      );\n    }\n  }]);\n\n  return Edit;\n}(_react2.default.Component);\n\nvar _default = Edit;\nexports.default = _default;\n;\n\nvar _temp = function () {\n  if (typeof __REACT_HOT_LOADER__ === 'undefined') {\n    return;\n  }\n\n  __REACT_HOT_LOADER__.register(Edit, 'Edit', 'C:/Users/myData/project/anony/src/Pages/Edit.js');\n\n  __REACT_HOT_LOADER__.register(_default, 'default', 'C:/Users/myData/project/anony/src/Pages/Edit.js');\n}();\n\n;\n\n//# sourceURL=webpack:///./src/Pages/Edit.js?");

/***/ }),

/***/ "./src/Pages/Edit.scss":
/*!*****************************!*\
  !*** ./src/Pages/Edit.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\nvar content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./Edit.scss */ \"./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Pages/Edit.scss\");\n\nif(typeof content === 'string') content = [[module.i, content, '']];\n\nvar transform;\nvar insertInto;\n\n\n\nvar options = {\"hmr\":true}\n\noptions.transform = transform\noptions.insertInto = undefined;\n\nvar update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ \"./node_modules/style-loader/lib/addStyles.js\")(content, options);\n\nif(content.locals) module.exports = content.locals;\n\nif(true) {\n\tmodule.hot.accept(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./Edit.scss */ \"./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Pages/Edit.scss\", function() {\n\t\tvar newContent = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./Edit.scss */ \"./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/Pages/Edit.scss\");\n\n\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\n\t\tvar locals = (function(a, b) {\n\t\t\tvar key, idx = 0;\n\n\t\t\tfor(key in a) {\n\t\t\t\tif(!b || a[key] !== b[key]) return false;\n\t\t\t\tidx++;\n\t\t\t}\n\n\t\t\tfor(key in b) idx--;\n\n\t\t\treturn idx === 0;\n\t\t}(content.locals, newContent.locals));\n\n\t\tif(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');\n\n\t\tupdate(newContent);\n\t});\n\n\tmodule.hot.dispose(function() { update(); });\n}\n\n//# sourceURL=webpack:///./src/Pages/Edit.scss?");

/***/ })

}]);