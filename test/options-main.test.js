/**
 * options-main.test.js
 */
/* eslint-disable import-x/order */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import { browser, createJsdom } from './mocha/setup.js';

/* test */
import {
  ATTR_HTML_HYPER, ATTR_HTML_PLAIN, ATTR_SAVE_HTML_HYPER, ATTR_SAVE_HTML_PLAIN,
  ICON_BLACK, ICON_COLOR, ICON_DARK, ICON_LIGHT, ICON_RADIO, ICON_WHITE,
  NOTIFY_COPY
} from '../src/mjs/constant.js';
import * as mjs from '../src/mjs/options-main.js';

describe('options-main', () => {
  let window, document;
  beforeEach(() => {
    const dom = createJsdom();
    window = dom && dom.window;
    document = window && window.document;
    browser._sandbox.reset();
    browser.i18n.getMessage.callsFake((...args) => args.toString());
    browser.permissions.contains.resolves(true);
    global.browser = browser;
    global.window = window;
    global.document = document;
  });
  afterEach(() => {
    window = null;
    document = null;
    delete global.browser;
    delete global.window;
    delete global.document;
    browser._sandbox.reset();
  });

  describe('create pref', () => {
    const func = mjs.createPref;

    it('should get null if argument not given', async () => {
      const res = await func();
      assert.strictEqual(res, null, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: 'foo'
      });
      assert.deepEqual(res, {
        foo: {
          id: 'foo',
          checked: false,
          value: '',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: ICON_BLACK,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_BLACK]: {
          id: ICON_BLACK,
          checked: false,
          value: 'icon-black-16.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      window.devicePixelRatio = 2;
      global.window.devicePixelRatio = 2;
      const res = await func({
        id: ICON_BLACK,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_BLACK]: {
          id: ICON_BLACK,
          checked: false,
          value: 'icon-black-32.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: ICON_COLOR,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_COLOR]: {
          id: ICON_COLOR,
          checked: false,
          value: 'icon-color-16.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      window.devicePixelRatio = 2;
      global.window.devicePixelRatio = 2;
      const res = await func({
        id: ICON_COLOR,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_COLOR]: {
          id: ICON_COLOR,
          checked: false,
          value: 'icon-color-32.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: ICON_DARK,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_DARK]: {
          id: ICON_DARK,
          checked: false,
          value: 'icon-dark-16.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      window.devicePixelRatio = 2;
      global.window.devicePixelRatio = 2;
      const res = await func({
        id: ICON_DARK,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_DARK]: {
          id: ICON_DARK,
          checked: false,
          value: 'icon-dark-32.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: ICON_LIGHT,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_LIGHT]: {
          id: ICON_LIGHT,
          checked: false,
          value: 'icon-light-16.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      window.devicePixelRatio = 2;
      global.window.devicePixelRatio = 2;
      const res = await func({
        id: ICON_LIGHT,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_LIGHT]: {
          id: ICON_LIGHT,
          checked: false,
          value: 'icon-light-32.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      const res = await func({
        id: ICON_WHITE,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_WHITE]: {
          id: ICON_WHITE,
          checked: false,
          value: 'icon-white-16.png',
          subItemOf: null
        }
      }, 'result');
    });

    it('should get object', async () => {
      window.devicePixelRatio = 2;
      global.window.devicePixelRatio = 2;
      const res = await func({
        id: ICON_WHITE,
        name: ICON_RADIO
      });
      assert.deepEqual(res, {
        [ICON_WHITE]: {
          id: ICON_WHITE,
          checked: false,
          value: 'icon-white-32.png',
          subItemOf: null
        }
      }, 'result');
    });
  });

  describe('store pref', () => {
    const func = mjs.storePref;

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: 'foo',
          type: 'text'
        }
      };
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.strictEqual(res.length, 1, 'array length');
      assert.deepEqual(res, [undefined], 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const j = browser.permissions.request.callCount;
      const k = browser.permissions.remove.callCount;
      const evt = {
        target: {
          id: 'foo',
          type: 'checkbox',
          checked: true
        }
      };
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.strictEqual(browser.permissions.request.callCount, j,
        'not called');
      assert.strictEqual(browser.permissions.remove.callCount, k,
        'not called');
      assert.strictEqual(res.length, 1, 'array length');
      assert.deepEqual(res, [undefined], 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const j = browser.permissions.request.callCount;
      const k = browser.permissions.remove.callCount;
      const evt = {
        target: {
          id: NOTIFY_COPY,
          type: 'checkbox',
          checked: true
        }
      };
      browser.permissions.request.withArgs({
        permissions: ['notification']
      }).resolves(true);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.strictEqual(browser.permissions.request.callCount, j + 1,
        'called');
      assert.strictEqual(browser.permissions.remove.callCount, k,
        'not called');
      assert.strictEqual(res.length, 1, 'array length');
      assert.deepEqual(res, [undefined], 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const j = browser.permissions.request.callCount;
      const k = browser.permissions.remove.callCount;
      const evt = {
        target: {
          id: NOTIFY_COPY,
          type: 'checkbox',
          checked: false
        }
      };
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.strictEqual(browser.permissions.request.callCount, j,
        'not called');
      assert.strictEqual(browser.permissions.remove.callCount, k + 1,
        'called');
      assert.strictEqual(res.length, 1, 'array length');
      assert.deepEqual(res, [undefined], 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const elm = document.createElement('input');
      const elm2 = document.createElement('input');
      const body = document.querySelector('body');
      const evt = {
        target: {
          id: 'foo',
          name: 'bar',
          type: 'radio'
        }
      };
      elm.id = 'foo';
      elm.name = 'bar';
      elm.type = 'radio';
      elm2.id = 'baz';
      elm2.name = 'bar';
      elm2.type = 'radio';
      body.appendChild(elm);
      body.appendChild(elm2);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 2, 'called');
      assert.strictEqual(res.length, 2, 'array length');
      assert.deepEqual(res, [undefined, undefined], 'result');
    });
  });

  describe('handle input change', () => {
    const func = mjs.handleSave;

    it('should not call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: 'foo',
          type: 'button'
        }
      };
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i, 'not called');
      assert.strictEqual(res, null, 'result');
    });

    it('should not call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: ATTR_SAVE_HTML_HYPER,
          type: 'button'
        }
      };
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      elm.type = 'button';
      elm.id = ATTR_SAVE_HTML_HYPER;
      body.appendChild(elm);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i, 'not called');
      assert.strictEqual(res, null, 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: ATTR_SAVE_HTML_HYPER,
          type: 'button'
        }
      };
      const input = document.createElement('input');
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      input.id = ATTR_HTML_HYPER;
      input.value = 'foo';
      elm.type = 'button';
      elm.id = ATTR_SAVE_HTML_HYPER;
      body.appendChild(input);
      body.appendChild(elm);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.deepEqual(res, [undefined], 'result');
    });

    it('should not call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: ATTR_SAVE_HTML_PLAIN,
          type: 'button'
        }
      };
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      elm.type = 'button';
      elm.id = ATTR_SAVE_HTML_PLAIN;
      body.appendChild(elm);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i, 'not called');
      assert.strictEqual(res, null, 'result');
    });

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: ATTR_SAVE_HTML_PLAIN,
          type: 'button'
        }
      };
      const input = document.createElement('input');
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      input.id = ATTR_HTML_PLAIN;
      input.value = 'foo';
      elm.type = 'button';
      elm.id = ATTR_SAVE_HTML_PLAIN;
      body.appendChild(input);
      body.appendChild(elm);
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.deepEqual(res, [undefined], 'result');
    });
  });

  describe('add event listener to button elements', () => {
    const func = mjs.addButtonClickListener;

    it('should set listener', async () => {
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      const spy = sinon.spy(elm, 'addEventListener');
      elm.type = 'button';
      body.appendChild(elm);
      await func();
      assert.strictEqual(spy.calledOnce, true, 'called');
      elm.addEventListener.restore();
    });

    it('should not set listener', async () => {
      const elm = document.createElement('button');
      const body = document.querySelector('body');
      const spy = sinon.spy(elm, 'addEventListener');
      elm.type = 'submit';
      body.appendChild(elm);
      await func();
      assert.strictEqual(spy.called, false, 'called');
      elm.addEventListener.restore();
    });
  });

  describe('handle input change', () => {
    const func = mjs.handleInputChange;

    it('should call function', async () => {
      const i = browser.storage.local.set.callCount;
      const evt = {
        target: {
          id: 'foo',
          type: 'text'
        }
      };
      const res = await func(evt);
      assert.strictEqual(browser.storage.local.set.callCount, i + 1, 'called');
      assert.strictEqual(res.length, 1, 'array length');
      assert.deepEqual(res, [undefined], 'result');
    });
  });

  describe('add event listener to input elements', () => {
    const func = mjs.addInputChangeListener;

    it('should set listener', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      const spy = sinon.spy(elm, 'addEventListener');
      elm.type = 'checkbox';
      body.appendChild(elm);
      await func();
      assert.strictEqual(spy.calledOnce, true, 'called');
      elm.addEventListener.restore();
    });

    it('should not set listener', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      const spy = sinon.spy(elm, 'addEventListener');
      elm.type = 'text';
      body.appendChild(elm);
      await func();
      assert.strictEqual(spy.called, false, 'not called');
      elm.addEventListener.restore();
    });
  });

  describe('set html input value', () => {
    const func = mjs.setHtmlInputValue;

    it('should not set value if argument not given', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'checkbox';
      body.appendChild(elm);
      await func();
      assert.strictEqual(elm.checked, false, 'checked');
    });

    it('should not set value if element not found', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'checkbox';
      body.appendChild(elm);
      await func({
        id: 'bar',
        checked: true
      });
      assert.strictEqual(elm.checked, false, 'checked');
    });

    it('should not set value if type does not match', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'search';
      elm.checked = false;
      elm.value = 'baz';
      body.appendChild(elm);
      await func({
        id: 'foo',
        checked: true,
        value: 'qux'
      });
      assert.strictEqual(elm.checked, false, 'checked');
      assert.strictEqual(elm.value, 'baz', 'checked');
    });

    it('should set checkbox value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'checkbox';
      body.appendChild(elm);
      await func({
        id: 'foo',
        checked: true
      });
      assert.strictEqual(elm.checked, true, 'checked');
    });

    it('should set checkbox value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'checkbox';
      body.appendChild(elm);
      await func({
        id: 'foo'
      });
      assert.strictEqual(elm.checked, false, 'checked');
    });

    it('should set radio value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'radio';
      body.appendChild(elm);
      await func({
        id: 'foo',
        checked: true
      });
      assert.strictEqual(elm.checked, true, 'checked');
    });

    it('should set text value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'text';
      body.appendChild(elm);
      await func({
        id: 'foo',
        value: 'bar'
      });
      assert.strictEqual(elm.value, 'bar', 'value');
    });

    it('should set text value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'text';
      body.appendChild(elm);
      await func({
        id: 'foo'
      });
      assert.strictEqual(elm.value, '', 'value');
    });

    it('should set url value', async () => {
      const elm = document.createElement('input');
      const body = document.querySelector('body');
      elm.id = 'foo';
      elm.type = 'url';
      body.appendChild(elm);
      await func({
        id: 'foo',
        value: 'bar/baz'
      });
      assert.strictEqual(elm.value, 'bar/baz', 'value');
    });
  });

  describe('set html input values from storage', () => {
    const func = mjs.setValuesFromStorage;

    it('should get empty array', async () => {
      const i = browser.storage.local.get.callCount;
      browser.storage.local.get.resolves({});
      const res = await func();
      assert.strictEqual(browser.storage.local.get.callCount, i + 1, 'called');
      assert.strictEqual(res.length, 0, 'array length');
      assert.deepEqual(res, [], 'result');
    });

    it('should get empty array', async () => {
      const i = browser.storage.local.get.callCount;
      browser.storage.local.get.resolves({
        foo: {},
        bar: {}
      });
      const res = await func();
      assert.strictEqual(browser.storage.local.get.callCount, i + 1, 'called');
      assert.strictEqual(res.length, 0, 'array length');
      assert.deepEqual(res, [], 'result');
    });

    it('should get array', async () => {
      const i = browser.storage.local.get.callCount;
      browser.storage.local.get.resolves({
        foo: {
          bar: {}
        },
        baz: {
          qux: {}
        }
      });
      const res = await func();
      assert.strictEqual(browser.storage.local.get.callCount, i + 1, 'called');
      assert.strictEqual(res.length, 2, 'array length');
      assert.deepEqual(res, [undefined, undefined], 'result');
    });
  });
});
