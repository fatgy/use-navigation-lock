import {renderHook, act} from '@testing-library/react';
import {useNavigationLock} from '../source/index.js';

describe('useNavigationLock', () => {
	it('should be render correctly', () => {
		const {result} = renderHook(() => {
			useNavigationLock(false);
		});
		expect(result.current).toBeUndefined();
	});

	it('should browser prevent `beforeunload` and return warn message', () => {
		let mock = vi.fn();
		const events = {};
		const spy = vi
			.spyOn(window, 'addEventListener')
			.mockImplementationOnce((event, handle) => {
				mock = vi.fn().mockImplementation(handle as EventListener);
				// @ts-expect-error: mock
				events[event] = mock;
			});

		renderHook(() => {
			useNavigationLock(true);
		});

		act(() => {
			// @ts-expect-error: mock
			events.beforeunload(new window.Event('beforeunload'));
		});

		expect(spy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
		expect(mock).toHaveBeenCalled();
		expect(mock).toHaveReturnedWith(expect.any(String));

		spy.mockRestore();
		mock.mockRestore();
	});

	it('should browser prevent `beforeunload` and return undefined', () => {
		let mock = vi.fn();
		const events = {};
		const spy = vi
			.spyOn(window, 'addEventListener')
			.mockImplementationOnce((event, handle) => {
				mock = vi.fn().mockImplementation(handle as EventListener);
				// @ts-expect-error: mock
				events[event] = mock;
			});

		renderHook(() => {
			useNavigationLock(false);
		});

		act(() => {
			// @ts-expect-error: mock
			events.beforeunload(new window.Event('beforeunload'));
		});

		expect(spy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
		expect(mock).toHaveBeenCalled();
		expect(mock).toHaveReturnedWith(undefined);

		spy.mockRestore();
		mock.mockRestore();
	});

	it('should nextjs router prevent route change', async () => {
		const mockRouter = await vi.importActual('next-router-mock');
		const mockFn = vi.fn();
		// @ts-expect-error: mock
		mockRouter.events.on('routeChangeError', mockFn);
		const spy = vi.spyOn(window, 'confirm').mockImplementationOnce(() => false);

		renderHook(() => {
			useNavigationLock(true);
		});

		act(() => {
			expect(() =>
			// @ts-expect-error: mock
				mockRouter.events.emit('routeChangeStart', '', {shallow: false}),
			).toThrow('Triggered by useNavigationLock. Please ignore this error.');
		},
		);

		expect(mockFn).toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'Are you sure you want to leave this page? You have unsaved changes. Do you want to leave?',
		);

		spy.mockRestore();
	});

	it('should nextjs router prevent route change on confirm', async () => {
		const mockRouter = await vi.importActual('next-router-mock');
		const mockFn = vi.fn();
		// @ts-expect-error: mock
		mockRouter.events.on('routeChangeError', mockFn);
		const spy = vi.spyOn(window, 'confirm').mockImplementationOnce(() => true);

		renderHook(() => {
			useNavigationLock(true);
		});

		act(() =>
			// @ts-expect-error: mock
			mockRouter.events.emit('routeChangeStart', '', {shallow: false}),
		);

		expect(mockFn).not.toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'Are you sure you want to leave this page? You have unsaved changes. Do you want to leave?',
		);

		spy.mockRestore();
	});

	it('should nextjs router prevent route change on confirm and execute onConfirm function', async () => {
		const mockRouter = await vi.importActual('next-router-mock');
		const mockFn = vi.fn();
		const mockOnConfirm = vi.fn();

		// @ts-expect-error: mock
		mockRouter.events.on('routeChangeError', mockFn);
		const spy = vi.spyOn(window, 'confirm').mockImplementationOnce(() => true);

		renderHook(() => {
			useNavigationLock(true, 'Confirm message', mockOnConfirm);
		});

		act(() =>
			// @ts-expect-error: mock
			mockRouter.events.emit('routeChangeStart', '', {shallow: false}),
		);

		expect(mockFn).not.toHaveBeenCalled();
		expect(mockOnConfirm).toHaveBeenCalled();
		expect(spy).toHaveBeenCalledWith(
			'Confirm message',
		);

		spy.mockRestore();
	});

	it('should not nextjs router prevent route change on disable lock', async () => {
		const mockRouter = await vi.importActual('next-router-mock');
		const mockFn = vi.fn();
		// @ts-expect-error: mock
		mockRouter.events.on('routeChangeError', mockFn);
		const spy = vi.spyOn(window, 'confirm').mockImplementationOnce(() => true);

		renderHook(() => {
			useNavigationLock(false);
		});

		act(() =>
			// @ts-expect-error: mock
			mockRouter.events.emit('routeChangeStart', '', {shallow: true}),
		);

		expect(mockFn).not.toHaveBeenCalled();
		expect(spy).not.toHaveBeenCalledWith(
			'Are you sure you want to leave this page? You have unsaved changes. Do you want to leave?',
		);

		spy.mockRestore();
	});
});
