const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
require('colors');

console.log('Adding a new post'.cyan);

const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'title',
  },
  {
    type: 'datetime',
    format: [ 'yyyy', '-', 'mm', '-', 'dd' ],
    name: 'postDate',
    message: 'post date'
  },
  {
    type: 'confirm',
    name: 'isDraft',
    message: 'is draft',
    default: true
  }
];

const template = (slug, title, postDate) => (`---
path: "/${slug}"
date: "${postDate.toISOString()}"
title: "${title}"
---

`);

inquirer
  .prompt(questions)
  .then((answers) => {
    const slug = determineSlug(answers);
    const dirPath = path.join(__dirname, '..', determineDirectory(answers.postDate, slug));
    fs.mkdirSync(dirPath);
    fs.writeFileSync(path.join(dirPath, 'index.md'), template(slug, answers.title, answers.postDate));
  });


function determineDirectory(postDate, path) {
  const formattedPostDate = moment(postDate).format('YYYY-MM-DD');
  const dirPath = `src/pages/${formattedPostDate}-${path}`;
  return dirPath;
}

function determineSlug({title}) {
  let slug = title.replace(/\W+/g, '-');
  slug = slug.replace(/^-+(.*)/, '$1');
  slug = slug.replace(/-$/, '');
  slug = slug.toLowerCase();
  return slug;
}