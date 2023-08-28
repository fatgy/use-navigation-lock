import {useRouter} from 'next/router.js';
import * as React from 'react';

/**
 * Ask for confirmation before changing page or leaving site.
 *
 * @see {@link https://git.io/JOskG}
 * @see {@link https://gist.github.com/Tymek/df2021b77fcea20cabaef46bbee8b001}
 */
export function useNavigationLock(
	isEnabled = false,
	warningText = 'Are you sure you want to leave this page? You have unsaved changes. Do you want to leave?',
	onConfirm?: () => void,
) {
	const router = useRouter();

	React.useEffect(() => {
		const handleWindowClose = (event: BeforeUnloadEvent) => {
			if (!isEnabled) {
				return;
			}

			event.preventDefault();
			// eslint-disable-next-line no-return-assign
			return (event.returnValue = warningText);
		};

		const handleBrowseAway = (
			url: string,
			{shallow}: {shallow: boolean},
		) => {
			if (!isEnabled || shallow) {
				return;
			}

			// eslint-disable-next-line no-alert
			if (window.confirm(warningText)) {
				if (onConfirm) {
					onConfirm();
				}

				return;
			}

			router.events.emit('routeChangeError');

			// Throwing an actual error class trips the Next.JS 500 Page, this string literal does not.
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw ' 👍 Abort route change due to unsaved changes in form. Triggered by useNavigationLock. Please ignore this error.';
		};

		window.addEventListener('beforeunload', handleWindowClose);

		router.events.on('routeChangeStart', handleBrowseAway);

		return () => {
			window.removeEventListener('beforeunload', handleWindowClose);
			router.events.off('routeChangeStart', handleBrowseAway);
		};
	}, [isEnabled, router, warningText, onConfirm]);
}
