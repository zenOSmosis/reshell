// This code was lifted from here because it is no longer being maintained there
// @see https://github.com/farfromrefug/react-xterm/blob/master/src/react-xterm.tsx

import React, { Component } from "react";
import { Terminal } from "xterm";
// import classNames from "classnames";

import { WebLinksAddon } from "xterm-addon-web-links";
import { FitAddon } from "xterm-addon-fit";
import("xterm/css/xterm.css");

// TODO: Document
// TODO: Add prop-types
export default class Xterm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isFocused: false,
    };

    this._xterm = null;
    this._container = null;
  }

  /*
  applyAddon(addon) {
    Terminal.applyAddon(addon);
  }
  */

  componentDidMount() {
    // Apply addons
    // const defaultAddons = ["fit", /*'winptyCompat',*/ "attach"];
    /*
    const propsAddons = this.props.addons || [];
    const addons = [...defaultAddons, ...propsAddons];
    if (addons) {
      addons.forEach((s) => {
        const addon = require(`xterm/dist/addons/${s}/${s}.js`);
        Terminal.applyAddon(addon);
      });
    }
    */

    this._xterm = new Terminal(this.props.options);
    this._fitAddon = new FitAddon();

    this._xterm.loadAddon(new WebLinksAddon());
    this._xterm.loadAddon(this._fitAddon);

    this._xterm.open(this._container);

    // TODO: Remove
    console.log({
      xterm: this._xterm,
    });

    // this._xterm.on("focus", this.focusChanged.bind(this, true));
    // this._xterm.on("blur", this.focusChanged.bind(this, false));

    /*
    if (this.props.onContextMenu) {
      this._xterm.element.addEventListener(
        "contextmenu",
        this.onContextMenu.bind(this)
      );
    }
    */

    if (this.props.onInput) {
      this._xterm.onData(this.onInput);
    }
    if (this.props.value) {
      this._xterm.write(this.props.value);
    }
  }

  componentWillUnmount() {
    if (this._xterm) {
      this._xterm.dispose();
      this._xterm = null;
    }
  }

  // componentWillReceiveProps(nextProps) {
  //     if (nextProps.hasOwnProperty('value')) {
  //         this.setState({ value: nextProps.value });
  //     }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponentUpdate', nextProps.hasOwnProperty('value'), nextProps.value != this.props.value);
    if (
      nextProps.hasOwnProperty("value") &&
      nextProps.value !== this.props.value
    ) {
      if (this._xterm) {
        this._xterm.clear();

        // TODO: Document
        setTimeout(() => {
          this._xterm.write(nextProps.value);
        }, 0);
      }
    }
    return false;
  }

  getTerminal() {
    return this._xterm;
  }

  // TODO: Document
  write(data) {
    this._xterm && this._xterm.write(data);
  }

  // TODO: Document
  writeUtf8(data) {
    this._xterm && this._xterm.writeUtf8(data);
  }

  // TODO: Document
  writeln(data) {
    this._xterm && this._xterm.writeln(data);
  }

  // TODO: Document
  focus() {
    if (this._xterm) {
      this._xterm.focus();
    }
  }

  // TODO: Document
  focusChanged(focused) {
    this.setState({
      isFocused: focused,
    });
    this.props.onFocusChange && this.props.onFocusChange(focused);
  }

  // TODO: Document
  fit() {
    if (this._fitAddon) {
      this._fitAddon.fit();
    }
  }

  // TODO: Document
  onInput = (data) => {
    this.props.onInput && this.props.onInput(data);
  };

  // TODO: Document
  resize(cols, rows) {
    this._xterm && this._xterm.resize(Math.round(cols), Math.round(rows));
  }

  /**
   * TODO: Document
   *
   * @param {string} key
   * @param {boolean} value
   */
  setOption(key, value) {
    this._xterm && this._xterm.setOption(key, value);
  }

  // TODO: Document
  refresh() {
    this._xterm && this._xterm.refresh(0, this._xterm.rows - 1);
  }

  /*
  // TODO: Document
  onContextMenu(e) {
    this.props.onContextMenu && this.props.onContextMenu(e);
  }
  */

  render() {
    const { ...propsRest } = this.props;

    /*
    const terminalClassName = classNames(
      "ReactXTerm",
      this.state.isFocused ? "ReactXTerm--focused" : null,
      this.props.className
    );
    */

    return (
      <div
        {...propsRest}
        ref={(ref) => (this._container = ref)}
        // className={terminalClassName}
        style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
      />
    );
  }
}
