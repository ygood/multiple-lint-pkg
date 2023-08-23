const stylelint = require('stylelint');
const assert = require('assert');
const path = require('path');

describe('test style lint', () => {
  it('test css', async () => {
    const filePaths = [path.join(__dirname, './styledemo/index.css')];
    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.js'),
      files: filePaths,
      fix: false,
    });
    if (result && result.errored) {
      const filesResult = JSON.parse(result.output || '[]') || [];
      filesResult.forEach((fileResult) => {
        console.log(`========= ${filePaths} ==========`);
        console.log(fileResult.warnings);
      });

      assert.ok(filesResult.length !== 0);
    }
  });

  it('test less', async () => {
    const filePaths = [path.join(__dirname, './styledemo/less-test.less')];

    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.js'),
      files: filePaths,
      fix: false,
    });

    if (result && result.errored) {
      const filesResult = JSON.parse(result.output || '[]') || [];
      filesResult.forEach((fileResult) => {
        // console.log(`========= ${filePaths} ==========`);
        // console.log(fileResult.warnings);
      });

      assert.ok(filesResult.length === 0);
    }
  });

  it('test sass', async () => {
    const filePaths = [path.join(__dirname, './styledemo/sass-test.scss')];

    const result = await stylelint.lint({
      configFile: path.join(__dirname, '../index.js'),
      files: filePaths,
      fix: false,
    });
    if (result && result.errored) {
      const filesResult = JSON.parse(result.output || '[]') || [];
      filesResult.forEach((fileResult) => {
        console.log(`========= ${filePaths} ==========`);
        console.log(fileResult.warnings);
      });
      assert.ok(filesResult.length === 0);
    }
  });
});
