const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
const github = require('@actions/github');
const franc = require('franc-min');
const translate = require('google-translate-api');

// **********************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });
const context = github.context;

async function run() {
  try {
    const { owner, repo } = context.repo;
    if (
      (context.eventName === 'issues' || context.eventName === 'pull_request') &&
      context.payload.action == 'opened'
    ) {
      const isPR = context.eventName === 'pull_request';
      let number;
      let title;
      let body;
      if (!isPR) {
        number = context.payload.issue.number;
        title = context.payload.issue.title;
        body = context.payload.issue.body;
      } else {
        number = context.payload.pull_request.number;
        title = context.payload.pull_request.number;
        body = context.payload.pull_request.number;
      }

      if (!checkIsEn(title)) {
        const { text: newTitle } = await translate(title, { to: 'en' });
        core.info(`[translate] [title out: ${newTitle}]`);
        await octokit.issues.update({
          owner,
          repo,
          issue_number: number,
          title: newTitle,
        });
        core.info(`[update title] [number: ${number}]`);
      }

      if (!checkIsEn(body)) {
        const { text: newBody } = await translate(body, { to: 'en' });
        core.info(`[translate] [body out: ${newBody}]`);
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: newBody,
        });
        core.info(`[create comment] [number: ${number}]`);
      }
    } else {
      core.setFailed(
        'This Action now only support "issues" or "pull_request" "opened". If you need other, you can open a issue to https://github.com/actions-cool/translation-helper',
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function checkIsEn(body) {
  const result = franc(body);
  if (result === 'und' || result === undefined || result === null) {
    core.warning(`Some error. [check: ${check}] [${body}]`);
    return false;
  }
  core.info(`[CheckIsEn] [${body} is ${result}]`);
  return result === 'eng';
}

run();
