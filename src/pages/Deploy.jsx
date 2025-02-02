import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import SuccessAlert from '../components/SuccessAlert';

export default function Deploy() {
  const [deployMethod, setDeployMethod] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [deploymentMessage, setDeploymentMessage] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/zip': ['.zip']
    },
    onDrop: (acceptedFiles) => {
      setUploadedFile(acceptedFiles[0]);
    }
  });

  const handleDeploy = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      const deploymentData = {
        email,
      };

      if (deployMethod === 'github') {
        response = await fetch('http://15.235.184.251:5000/deploy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...deploymentData,
            repository: githubUrl
          }),
        });
      } else {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('email', email);

        response = await fetch('http://15.235.184.251:5000/deploy', {
          method: 'POST',
          body: formData,
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        setDeploymentMessage('Your deployment request has been received. We will review it and contact you via email.');
        setShowSuccessAlert(true);
        // Reset form
        setGithubUrl('');
        setEmail('');
        setUploadedFile(null);
      } else {
        throw new Error(data.error || 'Deployment request failed');
      }
    } catch (error) {
      console.error('Error during deployment request:', error);
      alert(error.message || 'An error occurred during deployment request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Deploy Your API
        </h2>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setDeployMethod('github')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              deployMethod === 'github'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <CodeBracketIcon className="h-5 w-5 mr-2" />
            GitHub Repository
          </button>
          <button
            onClick={() => setDeployMethod('zip')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              deployMethod === 'zip'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload ZIP
          </button>
        </div>

        <form onSubmit={handleDeploy} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          {deployMethod === 'github' ? (
            <div>
              <label htmlFor="github-url" className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Repository URL
              </label>
              <input
                type="text"
                id="github-url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://github.com/username/repository"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project ZIP File
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
              >
                <input {...getInputProps()} />
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-300">
                  {isDragActive
                    ? 'Drop the ZIP file here'
                    : 'Drag and drop your ZIP file here, or click to select'}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (!githubUrl && !uploadedFile) || !email}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </motion.div>

      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        message={deploymentMessage}
      />
    </div>
  );
}