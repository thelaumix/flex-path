/** @internal */ export type FlexPathLayer = "main" | "hash";
/** @internal */ export type FlexPathMapType = "kwargs" | "search";
/** Middleware to handle external URL navigations */
export type FlexPathExternalUrlMiddleware = (
/** URL to validate navigation to */
url: URL, 
/** Callback function to notify acceptance or rejection */
acceptNavigation: (accepted: boolean, options?: ExternalUrlOptions) => void) => void;
/** @internal */
export type ExternalUrlOptions = {
    /** Whether to open the URL in a new tab */
    newTab?: boolean;
    /** Desired target value */
    target?: string;
};
