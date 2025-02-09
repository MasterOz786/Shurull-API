import { useState, useCallback, useMemo, memo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  CloudArrowUpIcon, 
  CodeBracketIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import PaymentModal from '../components/PaymentModal';
import SuccessAlert from '../components/SuccessAlert';

// Memoized components
const DeployButton = memo(({ isLoading, isDisabled, children }) => (
  <button
    type="submit"
    disabled={isLoading || isDisabled}
    className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
        Deploying...
      </>
    ) : children}
  </button>
));

const DeployOption = memo(({ 
  isSelected, 
  onClick, 
  icon: Icon, 
  title, 
  description 
}) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden group rounded-2xl p-6 text-left transition-colors duration-300 ${
      isSelected
        ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-purple-500/50'
        : 'bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative flex items-center">
      <Icon className={`h-8 w-8 ${
        isSelected ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
      } transition-colors duration-300`} />
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {isSelected && (
        <CheckCircleIcon className="absolute right-2 top-2 h-6 w-6 text-purple-400" />
      )}
    </div>
  </button>
));

// Use forwardRef to properly handle refs
const FileUploader = memo(forwardRef(({ uploadedFile, getUploadMessage, isDragActive, ...props }, ref) => (
  <div
    ref={ref}
    {...props}
    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
      isDragActive
        ? 'border-purple-500 bg-purple-500/10'
        : 'border-gray-600 hover:border-purple-500'
    }`}
  >
    <CloudArrowUpIcon className={`mx-auto h-8 w-8 ${
      isDragActive ? 'text-purple-400' : 'text-gray-400'
    } transition-colors duration-300`} />
    <p className="mt-2 text-base text-gray-300">
      {getUploadMessage(uploadedFile)}
    </p>
  </div>
)));

FileUploader.displayName = 'FileUploader';

export default function Deploy() {
  const [deployMethod, setDeployMethod] = useState('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [deploymentMessage, setDeploymentMessage] = useState('');

  const getUploadMessage = useCallback((file) => {
    if (file) {
      return (
        <>
          <span className="font-medium text-purple-400">{file.name}</span>
          <br />
          <span className="text-sm text-gray-400">
            Click or drag another file to replace
          </span>
        </>
      );
    }
    return (
      <>
        Drag and drop your ZIP file here
        <br />
        <span className="text-sm text-gray-400">
          or click to select a file
        </span>
      </>
    );
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/zip': ['.zip']
    },
    onDrop
  });

  const handleDeploy = useCallback(async (e) => {
    e.preventDefault();
    setShowPaymentModal(true);
  }, []);

  const deployFromGithub = useCallback(async (url, deploymentData) => {
    const response = await fetch(`${import.meta.env.VITE_MAZDOORI_BASEURL}:${import.meta.env.VITE_FLASK_PORT}/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repository: url,
        ...deploymentData
      }),
    });
    return response;
  }, []);

  const deployFromZip = useCallback(async (file, deploymentData) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(deploymentData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(`${import.meta.env.VITE_MAZDOORI_BASEURL}:${import.meta.env.VITE_FLASK_PORT}/deploy`, {
      method: 'POST',
      body: formData,
    });
    return response;
  }, []);

  const handlePaymentSubmit = useCallback(async ({ email, screenshot }) => {
    setIsLoading(true);
    setShowPaymentModal(false);

    try {
      const deploymentData = {
        email,
        payment_verified: true,
        payment_screenshot: screenshot.name
      };

      const response = await (deployMethod === 'github' 
        ? deployFromGithub(githubUrl, deploymentData)
        : deployFromZip(uploadedFile, deploymentData));

      const data = await response.json();
      
      if (response.ok) {
        setDeploymentMessage(
          `Deployment successful! Your API is available at: ${data.url}`
        );
        setShowSuccessAlert(true);
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Error during deployment:', error);
      alert(error.message || 'An error occurred during deployment.');
    } finally {
      setIsLoading(false);
    }
  }, [deployMethod, githubUrl, uploadedFile, deployFromGithub, deployFromZip]);

  const deployOptions = useMemo(() => [
    {
      id: 'github',
      icon: CodeBracketIcon,
      title: 'GitHub Repository',
      description: 'Deploy directly from your GitHub repository'
    },
    {
      id: 'zip',
      icon: CloudArrowUpIcon,
      title: 'Upload ZIP',
      description: 'Upload your project as a ZIP file'
    }
  ], []);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Deploy Your API
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose your preferred deployment method and let us handle the infrastructure
          </p>
        </div>

        {/* Deployment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {deployOptions.map(option => (
            <DeployOption
              key={option.id}
              isSelected={deployMethod === option.id}
              onClick={() => setDeployMethod(option.id)}
              icon={option.icon}
              title={option.title}
              description={option.description}
            />
          ))}
        </div>

        {/* Deployment Form */}
        <motion.div
          initial={false}
          animate={{ height: 'auto' }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
        >
          {deployMethod === 'github' ? (
            <form onSubmit={handleDeploy} className="space-y-6">
              <div>
                <label htmlFor="github-url" className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="github-url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 pl-10"
                    placeholder="https://github.com/username/repository"
                    required
                  />
                  <CodeBracketIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Make sure your repository is public or you have the necessary permissions
                </p>
              </div>

              <DeployButton isLoading={isLoading} isDisabled={!githubUrl}>
                Deploy API
              </DeployButton>
            </form>
          ) : (
            <div className="space-y-6">
              <FileUploader
                uploadedFile={uploadedFile}
                getUploadMessage={getUploadMessage}
                isDragActive={isDragActive}
                {...getRootProps()}
              />
              <input {...getInputProps()} />

              <DeployButton isLoading={isLoading} isDisabled={!uploadedFile}>
                Deploy API
              </DeployButton>
            </div>
          )}
        </motion.div>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePaymentSubmit}
      />

      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        message={deploymentMessage}
      />
    </div>
  );
}