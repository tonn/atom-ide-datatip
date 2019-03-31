'use babel';
/** @jsx etch.dom */

const ReactDOMServer = require('react-dom/server');
const etch = require('etch');
const createDOMPurify = require('dompurify');

const domPurify = createDOMPurify();

class HtmlView {
  constructor({ html }) {
    this.rootElement = document.createElement('div');
    this.rootElement.className = 'datatip-htmlview';
    if (html){
      this.rootElement.innerHTML = domPurify.sanitize(html);
    }
  }

  get element() {
    return this.rootElement;
  }
}

class ReactView {
  constructor({ component }) {
    this.rootElement = document.createElement('span')
    if (component) {
      this.rootElement.innerHTML = domPurify.sanitize(ReactDOMServer.renderToStaticMarkup(component()))
    }
  }

  get element() {
    return this.rootElement
  }
}

export default class DataTipView {
  // Required: Define an ordinary constructor to initialize your component.
  constructor(properties) {
    this.properties = properties;
    etch.initialize(this);
  }

  onMouseWheel(evt) {
    evt.stopPropagation();
  }

  render() {
    let content;

    if (this.properties.reactView) {
      content = <ReactView component={this.properties.reactView} />;
    } else if (this.properties.htmlView) {
      content = <HtmlView html={this.properties.htmlView} />;
    } else {
      content = this.children;
    }

    return <div className='datatip' onWheel={this.onMouseWheel}>{content}</div>
  }

  update = () => etch.update(this);
  destroy = () => etch.destroy(this);
}
