# 🌏 Translation Helper

![](https://img.shields.io/github/workflow/status/actions-cool/translation-helper/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-translation--helper-blueviolet?style=flat-square)](https://github.com/marketplace/actions/translation-helper)
[![](https://img.shields.io/github/v/release/actions-cool/translation-helper?style=flat-square&color=orange)](https://github.com/actions-cool/translation-helper/releases)

A GitHub Action keep your issue or PR in line with international standards.

Currently, only translations of newly opened issues or PRs have been produced, and comments have not been translated. If you need it, you can bring it up and I will improve it if you have time.

## 🚀 How to ues?

```yml
name: Translation Helper

on:
  pull_request_target:
    types: [opened]
  issues:
    types: [opened]

jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions-cool/translation-helper@v1.2.0
```

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub token | string | ✖ |
| translate-title | If translate title. Default `true`. | boolean | ✖ |
| translate-body | If translate body. Default `true`. | boolean | ✖ |

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/translation-helper/issues)
- Submit [Pull Request](https://github.com/actions-cool/translation-helper/pulls) to improve the code of `translation-helper`

欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
