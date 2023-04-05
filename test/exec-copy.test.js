/**
 * exec-copy.test.js
 */
/* eslint-disable import/order */

/* api */
import sinon from 'sinon';
import { assert } from 'chai';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { browser, createJsdom } from './mocha/setup.js';

/* test */
import { ICON, MIME_PLAIN } from '../src/mjs/constant.js';
import * as mjs from '../src/mjs/exec-copy.js';

describe('exec-copy', () => {
  const globalKeys = [
    'Blob',
    'ClipboardItem',
    'DOMParser',
    'HTMLUnknownElement',
    'Node',
    'XMLSerializer'
  ];
  let window, document, navigator;
  beforeEach(() => {
    const dom = createJsdom();
    window = dom && dom.window;
    document = window.document;
    if (document.execCommand) {
      sinon.stub(document, 'execCommand');
    } else {
      document.execCommand = sinon.fake();
    }
    navigator = window.navigator;
    if (navigator.clipboard) {
      sinon.stub(navigator.clipboard, 'write');
      sinon.stub(navigator.clipboard, 'writeText');
    } else {
      navigator.clipboard = {
        write: sinon.stub(),
        writeText: sinon.stub()
      };
    }
    browser._sandbox.reset();
    browser.i18n.getMessage.callsFake((...args) => args.toString());
    browser.permissions.contains.resolves(true);
    browser.storage.local.get.resolves({});
    global.browser = browser;
    global.window = window;
    global.document = document;
    global.navigator = navigator;
    for (const key of globalKeys) {
      // Not implemented in jsdom
      if (!window[key]) {
        if (key === 'ClipboardItem') {
          window[key] = class ClipboardItem {
            constructor(obj) {
              this._items = new Map();
              this._mimetypes = [
                'application/json',
                'application/xhtml+xml',
                'application/xml',
                'image/gif',
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/svg+xml',
                'text/css',
                'text/csv',
                'text/html',
                'text/plain',
                'text/uri-list',
                'text/xml'
              ];
              this._setItems(obj);
            }

            get types() {
              return Array.from(this._items.keys());
            }

            _setItems(obj) {
              const items = Object.entries(obj);
              for (const [mime, blob] of items) {
                if (this._mimetypes.includes(mime) && blob instanceof Blob) {
                  this._items.set(mime, blob);
                } else {
                  this._items.remove(mime);
                }
              }
            }

            async getType(mime) {
              const blob = this._items.get(mime);
              if (!blob) {
                throw new Error(`MIME type ${mime} is not found.`);
              }
              return blob;
            }
          };
        }
      }
      global[key] = window[key];
    }
  });
  afterEach(() => {
    window = null;
    document = null;
    navigator = null;
    delete global.browser;
    delete global.window;
    delete global.document;
    delete global.navigator;
    for (const key of globalKeys) {
      delete global[key];
    }
    browser._sandbox.reset();
  });

  it('should get browser object', () => {
    assert.isObject(browser, 'browser');
  });

  describe('execute copy', () => {
    const func = mjs.execCopy;

    it('should not call function', async () => {
      browser.runtime.getURL.withArgs(ICON).returns('foo/bar');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format').returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      const i = navigator.clipboard.writeText.callCount;
      const j = browser.notifications.create.callCount;
      const opt = {
        formatTitle: 'Text & URL',
        mimeType: 'text/foo',
        notify: false,
        text: 'foo https://example.com'
      };
      await func(opt);
      assert.strictEqual(navigator.clipboard.writeText.callCount, i,
        'not called');
      assert.strictEqual(browser.notifications.create.callCount, j,
        'not called');
    });

    it('should call function', async () => {
      browser.runtime.getURL.withArgs(ICON).returns('foo/bar');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format').returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      const i = navigator.clipboard.writeText.callCount;
      const j = browser.notifications.create.callCount;
      const opt = {
        formatTitle: 'Text & URL',
        mimeType: MIME_PLAIN,
        notify: false,
        text: 'foo https://example.com'
      };
      await func(opt);
      assert.strictEqual(navigator.clipboard.writeText.callCount, i + 1,
        'called');
      assert.strictEqual(browser.notifications.create.callCount, j,
        'not called');
    });

    it('should call function', async () => {
      browser.runtime.getURL.withArgs(ICON).returns('foo/bar');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format').returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      const i = navigator.clipboard.writeText.callCount;
      const j = browser.notifications.create.callCount;
      const opt = {
        formatTitle: 'Text & URL',
        mimeType: MIME_PLAIN,
        notify: true,
        text: 'foo https://example.com'
      };
      await func(opt);
      assert.strictEqual(navigator.clipboard.writeText.callCount, i + 1,
        'called');
      assert.strictEqual(browser.notifications.create.callCount, j + 1,
        'called');
    });
  });
});
