// @ts-check
/// <reference path="../typings/atom-ide.d.ts"/>
'use babel';

const { CompositeDisposable } = require('atom');
const DataTipManager =  require('./datatip-manager');

/**
 * the Atom IDE data tip plugin
 * @type {Object}
 */
module.exports = {

  /**
   * [subscriptions description]
   * @type {CompositeDisposable}
   */
  subscriptions: null,
  /**
   * [datatipManager description]
   * @type {DataTipManager}
   */
  datatipManager: null,
  /**
   * a reference to the markdown rendering service
   * @type {AtomIDE.MarkdownService}
   */
  renderer: null,

  /**
   * called by Atom when activating an extension
   * @param  {any} state the current state of atom
   */
  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    if (!this.datatipManager) this.datatipManager = new DataTipManager();
    this.subscriptions.add(this.datatipManager);
    require('atom-package-deps').install('atom-ide-datatip').then(() => {
      this.datatipManager.initialize(this.renderer);
    });
  },

  /**
   * called by Atom when deactivating an extension
   */
  deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
    }
    this.subscriptions = null;
    this.datatipManager = null;
  },

  /**
   * called by IDE extensions to retrieve the Datatip service for registration
   * @return {AtomIDE.DatatipService} the current DataTipManager instance
   */
  provideDatatipService() {
    return this.datatipManager.datatipService;
  },

  /**
   * retrieves a reference to the markdown rendering service that should be used
   * @param  {AtomIDE.MarkdownService} renderer the service for rendering markdown text
   */
  consumeMarkdownRenderer(renderer) {
    this.renderer = renderer;
  }
};
