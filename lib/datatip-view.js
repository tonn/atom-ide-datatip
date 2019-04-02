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

class MarkedStringsView {
  constructor(properties) {
    this.properties = properties;
    etch.initialize(this);
  }

  // init() {
  //   const markedStrings = properties.markedStrings;
  //
  //   const htmlString = this.makeHtmlFromMarkedStrings(markedStrings, editor.getGrammar().name.toLowerCase());
  //
  //   const html = await this.renderer.render(htmlString);
  //   const dataTipView = new DataTipView({ htmlView: html });
  //   this.dataTipMarkerDisposables = this.mountDataTipWithMarker(editor, datatip.range, position, dataTipView);
  // }

  /**
   * [renderMarkedString description]
   * @param  {AtomIDE.MarkedString} markedStrings   [description]
   */
  renderMarkedString(markedString) {
    if (markedString.type === 'markdown') {
      return <div>{markedString.value}</div>
    } else if (markedString.type === 'snippet') {
      return <code className={markedString.grammar.name}>{markedString.value}</code>
    }
  }

  render() {
    const markedStrings = this.properties.markedStrings;

    return <div>{markedStrings.map(ms => this.renderMarkedString(ms))}</div>
  }

  update() {
    etch.update(this);
  }

  destroy = () => etch.destroy(this);

  /**
   * [makeHtmlFromMarkedStrings description]
   * @param  {[type]} markedStrings   [description]
   * @param  {String} grammarName [description]
   * @return {String}          [description]
   */
  makeHtmlFromMarkedStrings(markedStrings, grammarName) {
    const regExpLSPPrefix = /^\((method|property|parameter|alias)\)\W/;

    return markedStrings
    .map(string => {
      if (string.type === 'markdown') {
        return string.value;
      } else if (string.type === 'snippet') {
        const snippet = string.value.replace(regExpLSPPrefix, '');
        return `<pre><code class="${grammarName}">${snippet}</code></pre>`;
      }
    })
    .join('<br>');
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
    const datatip = this.properties.datatip;

    if (datatip.component) {
      content = <ReactView component={datatip.component} />;
    } else if (datatip.markedStrings && datatip.markedStrings.length > 0) {
      content = <MarkedStringsView markedStrings={datatip.markedStrings} />;
    }

    return <div className='datatip' onWheel={this.onMouseWheel}>{content}</div>
  }

  update = () => etch.update(this);
  destroy = () => etch.destroy(this);
}
