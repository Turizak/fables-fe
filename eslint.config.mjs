// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: {
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true, // Allow && and || short-circuiting
            allowTernary: true,      // Allow ternary expressions
          }
        ],
      },
});
