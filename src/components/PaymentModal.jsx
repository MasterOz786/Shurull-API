import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';

export default function PaymentModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setScreenshot(acceptedFiles[0]);
        setError('');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!screenshot) {
      setError('Please upload your payment screenshot');
      return;
    }

    onSubmit({ email, screenshot });
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setScreenshot(null);
    setError('');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => {
                      onClose();
                      resetForm();
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white mb-6">
                      Payment Details
                    </Dialog.Title>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm px-3 py-2"
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Payment Screenshot
                        </label>
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            isDragActive
                              ? 'border-purple-500 bg-purple-500/10'
                              : 'border-gray-600 hover:border-purple-500'
                          }`}
                        >
                          <input {...getInputProps()} />
                          {screenshot ? (
                            <div className="text-sm text-gray-300">
                              File selected: {screenshot.name}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">
                              {isDragActive ? (
                                'Drop your screenshot here'
                              ) : (
                                'Drag and drop your EasyPaisa payment screenshot, or click to select'
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                      )}

                      <div className="mt-6">
                        <button
                          type="submit"
                          className="w-full rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all"
                        >
                          Submit Payment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}