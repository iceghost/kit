/**
 * It's possible to tell SvelteKit how to type objects inside your app by declaring the `App` namespace. By default, a new project will have a file called `src/app.d.ts` containing the following:
 *
 * ```ts
 * /// <reference types="@sveltejs/kit" />
 *
 * declare namespace App {
 * 	interface Locals {}
 *
 * 	interface PageData {}
 *
 * 	interface Platform {}
 * }
 * ```
 *
 * By populating these interfaces, you will gain type safety when using `event.locals`, `event.platform`, and `data` from `load` functions.
 *
 * Note that since it's an ambient declaration file, you have to be careful when using `import` statements. Once you add an `import`
 * at the top level, the declaration file is no longer considered ambient and you lose access to these typings in other files.
 * To avoid this, either use the `import(...)` function:
 *
 * ```ts
 * interface Locals {
 * 	user: import('$lib/types').User;
 * }
 * ```
 * Or wrap the namespace with `declare global`:
 * ```ts
 * import { User } from '$lib/types';
 *
 * declare global {
 * 	namespace App {
 * 		interface Locals {
 * 			user: User;
 * 		}
 * 		// ...
 * 	}
 * }
 * ```
 *
 */
declare namespace App {
	/**
	 * The interface that defines `event.locals`, which can be accessed in [hooks](https://kit.svelte.dev/docs/hooks) (`handle`, and `handleError`), server-only `load` functions, and `+server.js` files.
	 */
	export interface Locals {}

	/**
	 * Defines the common shape of the [$page.data store](https://kit.svelte.dev/docs/modules#$app-stores-page) - that is, the data that is shared between all pages.
	 * The `Load` and `ServerLoad` functions in `./$types` will be narrowed accordingly.
	 * Use optional properties for data that is only present on specific pages. Do not add an index signature (`[key: string]: any`).
	 */
	export interface PageData {}

	/**
	 * If your adapter provides [platform-specific context](https://kit.svelte.dev/docs/adapters#supported-environments-platform-specific-context) via `event.platform`, you can specify it here.
	 */
	export interface Platform {}
}

/**
 * ```ts
 * import { browser, dev, prerendering } from '$app/environment';
 * ```
 */
declare module '$app/environment' {
	/**
	 * `true` if the app is running in the browser.
	 */
	export const browser: boolean;

	/**
	 * Whether the dev server is running. This is not guaranteed to correspond to `NODE_ENV` or `MODE`.
	 */
	export const dev: boolean;

	/**
	 * `true` when prerendering, `false` otherwise.
	 */
	export const prerendering: boolean;
}

/**
 * ```ts
 * import {
 * 	afterNavigate,
 * 	beforeNavigate,
 * 	disableScrollHandling,
 * 	goto,
 * 	invalidate,
 * 	invalidateAll,
 * 	prefetch,
 * 	prefetchRoutes
 * } from '$app/navigation';
 * ```
 */
declare module '$app/navigation' {
	/**
	 * If called when the page is being updated following a navigation (in `onMount` or `afterNavigate` or an action, for example), this disables SvelteKit's built-in scroll handling.
	 * This is generally discouraged, since it breaks user expectations.
	 */
	export function disableScrollHandling(): void;
	/**
	 * Returns a Promise that resolves when SvelteKit navigates (or fails to navigate, in which case the promise rejects) to the specified `url`.
	 *
	 * @param url Where to navigate to
	 * @param opts.replaceState If `true`, will replace the current `history` entry rather than creating a new one with `pushState`
	 * @param opts.noscroll If `true`, the browser will maintain its scroll position rather than scrolling to the top of the page after navigation
	 * @param opts.keepfocus If `true`, the currently focused element will retain focus after navigation. Otherwise, focus will be reset to the body
	 * @param opts.state The state of the new/updated history entry
	 */
	export function goto(
		url: string | URL,
		opts?: { replaceState?: boolean; noscroll?: boolean; keepfocus?: boolean; state?: any }
	): Promise<void>;
	/**
	 * Causes any `load` functions belonging to the currently active page to re-run if they depend on the `url` in question, via `fetch` or `depends`. Returns a `Promise` that resolves when the page is subsequently updated.
	 *
	 * If the argument is given as a `string` or `URL`, it must resolve to the same URL that was passed to `fetch` or `depends` (including query parameters).
	 * To create a custom identifier, use a string beginning with `[a-z]+:` (e.g. `custom:state`) — this is a valid URL.
	 *
	 * The `function` argument can be used define a custom predicate. It receives the full `URL` and causes `load` to rerun if `true` is returned.
	 * This can be useful if you want to invalidate based on a pattern instead of a exact match.
	 *
	 * ```ts
	 * // Example: Match '/path' regardless of the query parameters
	 * invalidate((url) => url.pathname === '/path');
	 * ```
	 * @param url The invalidated URL
	 */
	export function invalidate(url: string | URL | ((url: URL) => boolean)): Promise<void>;
	/**
	 * Causes all `load` functions belonging to the currently active page to re-run. Returns a `Promise` that resolves when the page is subsequently updated.
	 */
	export function invalidateAll(): Promise<void>;
	/**
	 * Programmatically prefetches the given page, which means
	 *  1. ensuring that the code for the page is loaded, and
	 *  2. calling the page's load function with the appropriate options.
	 *
	 * This is the same behaviour that SvelteKit triggers when the user taps or mouses over an `<a>` element with `data-sveltekit-prefetch`.
	 * If the next navigation is to `href`, the values returned from load will be used, making navigation instantaneous.
	 * Returns a Promise that resolves when the prefetch is complete.
	 *
	 * @param href Page to prefetch
	 */
	export function prefetch(href: string): Promise<void>;
	/**
	 * Programmatically prefetches the code for routes that haven't yet been fetched.
	 * Typically, you might call this to speed up subsequent navigation.
	 *
	 * If no argument is given, all routes will be fetched, otherwise you can specify routes by any matching pathname
	 * such as `/about` (to match `src/routes/about.svelte`) or `/blog/*` (to match `src/routes/blog/[slug].svelte`).
	 *
	 * Unlike prefetch, this won't call load for individual pages.
	 * Returns a Promise that resolves when the routes have been prefetched.
	 */
	export function prefetchRoutes(routes?: string[]): Promise<void>;

	/**
	 * A navigation interceptor that triggers before we navigate to a new URL (internal or external) whether by clicking a link, calling `goto`, or using the browser back/forward controls.
	 * This is helpful if we want to conditionally prevent a navigation from completing or lookup the upcoming url.
	 */
	export function beforeNavigate(
		fn: (navigation: { from: URL; to: URL | null; cancel: () => void }) => void
	): void;

	/**
	 * A lifecycle function that runs when the page mounts, and also whenever SvelteKit navigates to a new URL but stays on this component.
	 */
	export function afterNavigate(fn: (navigation: { from: URL | null; to: URL }) => void): void;
}

/**
 * ```ts
 * import { base, assets } from '$app/paths';
 * ```
 */
declare module '$app/paths' {
	/**
	 * A string that matches [`config.kit.paths.base`](https://kit.svelte.dev/docs/configuration#paths). It must start, but not end with `/` (e.g. `/base-path`), unless it is the empty string.
	 */
	export const base: `/${string}`;
	/**
	 * An absolute path that matches [`config.kit.paths.assets`](https://kit.svelte.dev/docs/configuration#paths).
	 *
	 * > If a value for `config.kit.paths.assets` is specified, it will be replaced with `'/_svelte_kit_assets'` during `vite dev` or `vite preview`, since the assets don't yet live at their eventual URL.
	 */
	export const assets: `https://${string}` | `http://${string}`;
}

/**
 * ```ts
 * import { getStores, navigating, page, updated } from '$app/stores';
 * ```
 *
 * Stores on the server are _contextual_ — they are added to the [context](https://svelte.dev/tutorial/context-api) of your root component. This means that `page` is unique to each request, rather than shared between multiple requests handled by the same server simultaneously.
 *
 * Because of that, you must subscribe to the stores during component initialization (which happens automatically if you reference the store value, e.g. as `$page`, in a component) before you can use them.
 *
 * In the browser, we don't need to worry about this, and stores can be accessed from anywhere. Code that will only ever run on the browser can refer to (or subscribe to) any of these stores at any time.
 */
declare module '$app/stores' {
	import { Readable } from 'svelte/store';
	import { Navigation, Page } from '@sveltejs/kit';

	/**
	 * A readable store whose value contains page data.
	 */
	export const page: Readable<Page>;
	/**
	 * A readable store.
	 * When navigating starts, its value is `{ from: URL, to: URL }`,
	 * When navigating finishes, its value reverts to `null`.
	 */
	export const navigating: Readable<Navigation | null>;
	/**
	 *  A readable store whose initial value is `false`. If [`version.pollInterval`](https://kit.svelte.dev/docs/configuration#version) is a non-zero value, SvelteKit will poll for new versions of the app and update the store value to `true` when it detects one. `updated.check()` will force an immediate check, regardless of polling.
	 */
	export const updated: Readable<boolean> & { check: () => boolean };

	/**
	 * A function that returns all of the contextual stores. On the server, this must be called during component initialization.
	 * Only use this if you need to defer store subscription until after the component has mounted, for some reason.
	 */
	export function getStores(): {
		navigating: typeof navigating;
		page: typeof page;
		updated: typeof updated;
	};
}

/**
 * ```ts
 * import { build, files, prerendered, version } from '$service-worker';
 * ```
 *
 * This module is only available to [service workers](https://kit.svelte.dev/docs/service-workers).
 */
declare module '$service-worker' {
	/**
	 * An array of URL strings representing the files generated by Vite, suitable for caching with `cache.addAll(build)`.
	 */
	export const build: string[];
	/**
	 * An array of URL strings representing the files in your static directory, or whatever directory is specified by `config.kit.files.assets`. You can customize which files are included from `static` directory using [`config.kit.serviceWorker.files`](https://kit.svelte.dev/docs/configuration)
	 */
	export const files: string[];
	/**
	 * An array of pathnames corresponding to prerendered pages and endpoints.
	 */
	export const prerendered: string[];
	/**
	 * See [`config.kit.version`](https://kit.svelte.dev/docs/configuration#version). It's useful for generating unique cache names inside your service worker, so that a later deployment of your app can invalidate old caches.
	 */
	export const version: string;
}

declare module '@sveltejs/kit/hooks' {
	import { Handle } from '@sveltejs/kit';

	/**
	 * A helper function for sequencing multiple `handle` calls in a middleware-like manner.
	 *
	 * ```js
	 * /// file: src/hooks.js
	 * import { sequence } from '@sveltejs/kit/hooks';
	 *
	 * /** @type {import('@sveltejs/kit').Handle} *\/
	 * async function first({ event, resolve }) {
	 * 	console.log('first pre-processing');
	 * 	const result = await resolve(event, {
	 * 		transformPageChunk: ({ html }) => {
	 * 			// transforms are applied in reverse order
	 * 			console.log('first transform');
	 * 			return html;
	 * 		}
	 * 	});
	 * 	console.log('first post-processing');
	 * 	return result;
	 * }
	 *
	 * /** @type {import('@sveltejs/kit').Handle} *\/
	 * async function second({ event, resolve }) {
	 * 	console.log('second pre-processing');
	 * 	const result = await resolve(event, {
	 * 		transformPageChunk: ({ html }) => {
	 * 			console.log('second transform');
	 * 			return html;
	 * 		}
	 * 	});
	 * 	console.log('second post-processing');
	 * 	return result;
	 * }
	 *
	 * export const handle = sequence(first, second);
	 * ```
	 *
	 * The example above would print:
	 *
	 * ```
	 * first pre-processing
	 * second pre-processing
	 * second transform
	 * first transform
	 * second post-processing
	 * first post-processing
	 * ```
	 *
	 * @param handlers The chain of `handle` functions
	 */
	export function sequence(...handlers: Handle[]): Handle;
}

/**
 * A polyfill for `fetch` and its related interfaces, used by adapters for environments that don't provide a native implementation.
 */
declare module '@sveltejs/kit/node/polyfills' {
	/**
	 * Make various web APIs available as globals:
	 * - `crypto`
	 * - `fetch`
	 * - `Headers`
	 * - `Request`
	 * - `Response`
	 */
	export function installPolyfills(): void;
}

/**
 * Utilities used by adapters for Node-like environments.
 */
declare module '@sveltejs/kit/node' {
	export function getRequest(
		base: string,
		request: import('http').IncomingMessage
	): Promise<Request>;
	export function setResponse(res: import('http').ServerResponse, response: Response): void;
}

declare module '@sveltejs/kit/vite' {
	import { Plugin } from 'vite';

	/**
	 * Returns the SvelteKit Vite plugins.
	 */
	export function sveltekit(): Plugin[];
}
