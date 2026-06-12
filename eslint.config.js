const nextVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  ...nextVitals,
  {
    rules: {
      "react/jsx-no-comment-textnodes": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
