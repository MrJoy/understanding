module.exports = {
  extends: ["stylelint-config-standard"],
  customSyntax: 'postcss',
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "custom-variant",
          "plugin",
          "theme",
        ],
      },
    ],
    'keyframes-name-pattern': null,
  },
  ignoreFiles: [
    "node_modules/**/*",
  ],
};
