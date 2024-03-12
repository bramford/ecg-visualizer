import numpy as np
from scipy.signal import butter, filtfilt
import pywt

def denoise_ecg(signal, window_size=5, lowcut=0.5, highcut=40, fs=500, order=5, wavelet='db4', level=4):

    """
    Denoise ECG signal using moving_average, butterworth and wavelet_transform

    Parameters:
        signal (ndarray): Input signal array.

    Returns:
        ndarray: Denoised signal array.
    """
    def moving_average(signal):
        window = np.ones(window_size) / window_size
        return np.convolve(signal, window, mode='same')

    def butterworth(signal):
        nyquist = 0.5 * fs
        low = lowcut / nyquist
        high = highcut / nyquist
        b, a = butter(order, [low, high], btype='band')
        return filtfilt(b, a, signal)

    def wavelet_transform(signal):
        coeffs = pywt.wavedec(signal, wavelet, level=level)
        coeffs[1:] = (pywt.threshold(detail, value=0.1 * np.max(detail), mode="soft") for detail in coeffs[1:])
        return pywt.waverec(coeffs, wavelet)

    return wavelet_transform(butterworth(moving_average(signal)))
