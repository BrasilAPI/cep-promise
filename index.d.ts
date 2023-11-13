declare module "cep-promise" {
  /** Represents the result of a CEP search */
  export interface CEP {
    /** The retrieved CEP number */
    cep: string;
    /** The state associated with the CEP */
    state: string;
    /** The city associated with the CEP */
    city: string;
    /** The street associated with the CEP */
    street: string;
    /** The neighborhood associated with the CEP */
    neighborhood: string;
    /** The provider which returned the result */
    service: string;
  }

  /**
   * Available providers:
   *
   * | Provider     | Browser | Node.js |
   * | ------------ | ------- | ------- |
   * | brasilapi    | ✅      | ✅      |
   * | viacep       | ✅      | ✅      |
   * | widenet      | ✅      | ✅      |
   * | correios     | ❌      | ✅      |
   * | correios-alt | ❌      | ✅      |
   */
  export const AvailableProviders: {
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly brasilapi: "brasilapi";
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly viacep: "viacep";
    /** Supported in both **Node.js** and **Browser** environments. */
    readonly widenet: "widenet";
    /** Supported only in **Node.js** environment. */
    readonly correios: "correios";
    /** Supported only in **Node.js** environment. */
    readonly correiosAlt: "correios-alt";
  };

  /** Configuration options to customize the CEP search, by selecting specific providers and/or setting a timeout */
  export interface Configurations {
    /** Specifies the providers to be used for CEP searches, otherwise all available providers will be used.
     *
     * ---
     *
     * Available providers:
     *
     * | Provider     | Browser | Node.js |
     * | ------------ | ------- | ------- |
     * | brasilapi    | ✅      | ✅      |
     * | viacep       | ✅      | ✅      |
     * | widenet      | ✅      | ✅      |
     * | correios     | ❌      | ✅      |
     * | correios-alt | ❌      | ✅      |
     */
    providers?: (typeof AvailableProviders)[keyof typeof AvailableProviders][];
    /** Timeout (in milliseconds) after which the CEP search will be cancelled. */
    timeout?: number;
  }

  /**
   * Searches for CEP directly integrated with the services of Correios, ViaCEP, and WideNet (Node.js and Browser).
   *
   * ---
   *
   * @param cep The CEP (postal code) to search for.
   * @param configurations Optional configurations to customize the CEP search.
   * @returns A promise that resolves with the CEP details.
   */
  export function cep(
    cep: string | number,
    configurations?: Configurations
  ): Promise<CEP>;

  export default cep;
}
