// @vitest-environment jsdom

import fs from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

const stylesheet = fs.readFileSync(
  'css/dragquestion.css',
  'utf8',
);

afterEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
});

describe('image draggable CSS compatibility', () => {
  it.each(['', 'h5p-question-set'])('preserves image geometry inside "%s"', (parentClass) => {
    const style = document.createElement('style');
    style.textContent = `* { box-sizing: border-box; }\nimg { margin: 20px 0; }\n${stylesheet}`;
    document.head.append(style);
    const imageRule = Array.from(style.sheet.cssRules).find((rule) =>
      rule.selectorText === '.h5p-dragquestion .h5p-draggable:has(.h5p-image)',
    );
    expect(imageRule.style.getPropertyPriority('box-sizing')).toBe('');
    const marginRule = Array.from(style.sheet.cssRules).find((rule) =>
      rule.selectorText === '.h5p-dragquestion .h5p-draggable .h5p-image > img',
    );
    expect(marginRule.style.getPropertyPriority('margin')).toBe('');
    document.body.innerHTML = `
      <div class="${parentClass}">
        <div class="h5p-dragquestion">
          <div id="image" class="h5p-draggable h5p-draggable--has-handle">
            <div class="h5p-image"><img alt="" /></div>
          </div>
          <div id="text" class="h5p-draggable"><p>Text</p></div>
          <div class="h5p-image"><img id="static-image" alt="" /></div>
        </div>
      </div>
      <div id="outside" class="h5p-draggable"><div class="h5p-image"><img alt="" /></div></div>
    `;

    expect(getComputedStyle(document.getElementById('image')).boxSizing).toBe('content-box');
    expect(getComputedStyle(document.getElementById('text')).boxSizing).toBe('border-box');
    expect(getComputedStyle(document.getElementById('outside')).boxSizing).toBe('border-box');
    const imageStyle = getComputedStyle(document.querySelector('#image img'));
    expect(imageStyle.marginTop).toBe('0px');
    expect(imageStyle.marginBottom).toBe('0px');
    expect(imageStyle.marginLeft).toBe('0px');
    expect(imageStyle.marginRight).toBe('0px');
    expect(getComputedStyle(document.getElementById('static-image')).marginTop).toBe('20px');
    expect(getComputedStyle(document.querySelector('#outside img')).marginTop).toBe('20px');
  });
});
