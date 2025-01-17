import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function Deploy() {
  const [deployMethod, setDeployMethod] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/zip': ['.zip']
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      // Handle file upload
    }
  });

  const handleDeploy = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add deployment logic here
    setTimeout(() => setIsLoading(false), 2000);
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

        {deployMethod === 'github' ? (
          <form onSubmit={handleDeploy} className="space-y-6">
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
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Deploying...' : 'Deploy API'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
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
            <button
              onClick={handleDeploy}
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Deploying...' : 'Deploy API'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}