type BootstrapErrorActions = "show" | "hide";

interface JQuery
{
    bootstrapError(): JQuery;
    bootstrapError(action?: BootstrapErrorActions): JQuery;
    bootstrapError(action?: BootstrapErrorActions, value?: string): JQuery;
    bootstrapError(action?: BootstrapErrorActions, value?: string, critical?: boolean): JQuery;
}
